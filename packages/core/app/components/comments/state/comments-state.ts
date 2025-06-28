import { observable, computed } from "@legendapp/state"
import { nanoid } from "nanoid"
import { Descendant } from "slate"
import type { SubmittedCommentData, User, Reaction } from "../types"
import { serializeToText } from "../comment-input/components"

// 分页设置
const PAGE_SIZE = 20

// 评论状态存储
export const comments$ = observable<{
  byId: Record<string, SubmittedCommentData>
  // 当前编辑内容
  editingContent: Descendant[]
  // 当前正在编辑的评论 ID
  editingId: string | null
  // 新评论通知
  newComment: {
    hasNew: boolean
    id: string | null
  }
  // 用于追踪评论的顺序，从新到旧排序
  order: string[]
  // 分页和加载相关状态
  pagination: {
    currentPage: number
    hasMore: boolean
    isLoading: boolean
    totalCount: number
  }
}>({
  byId: {},
  order: [],
  editingId: null,
  editingContent: [],
  pagination: {
    currentPage: 1,
    hasMore: false,
    isLoading: false,
    totalCount: 0,
  },
  newComment: {
    hasNew: false,
    id: null,
  },
})

// 获取排序后的评论数组（从新到旧）
export const sortedComments$ = computed(() => {
  const { byId, order } = comments$.get()
  return order.map((id) => byId[id]).filter((comment) => !comment.is_deleted)
})

// 获取所有评论（包括已删除的，从新到旧）
export const allComments$ = computed(() => {
  const { byId, order } = comments$.get()
  return order.map((id) => byId[id])
})

// 评论操作服务
export const commentsService = {
  // 初始化评论数据
  initComments(comments: SubmittedCommentData[], totalCount?: number) {
    const byId: Record<string, SubmittedCommentData> = {}
    const order: string[] = []

    // 过滤并确保所有必要字段
    const processedComments = comments
      .filter((comment) => comment && comment.uuid) // 确保有效
      .map((comment, index) => ({
        ...comment,
        // 如果没有 page_id，根据位置分配页码
        page_id: comment.page_id || Math.floor(index / PAGE_SIZE).toString(),
        // 确保其他必要字段
        is_deleted: comment.is_deleted || false,
        reactions: comment.reactions || null,
      }))

    // 按创建时间排序（旧->新），确保最新的评论在底部
    processedComments.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    // 添加到 byId 和 order
    processedComments.forEach((comment) => {
      byId[comment.uuid] = comment
      order.push(comment.uuid)
    })

    comments$.byId.set(byId)
    comments$.order.set(order)

    // 设置分页信息
    const actualTotalCount = totalCount !== undefined ? totalCount : processedComments.length
    // 计算最后一页的页码
    const lastPage = Math.floor((actualTotalCount - 1) / PAGE_SIZE)

    comments$.pagination.set({
      currentPage: lastPage, // 从最后一页开始（最新的评论）
      hasMore: lastPage > 0, // 如果不是第0页，就还有更早的评论可加载
      isLoading: false,
      totalCount: actualTotalCount,
    })
  },

  // 添加新评论
  createComment(content: Descendant[], author: User) {
    const newCommentId = nanoid()
    const timestamp = new Date()

    const newComment: SubmittedCommentData = {
      uuid: newCommentId,
      author,
      created_at: timestamp,
      updated_at: timestamp,
      deleted_at: null,
      resolved_at: null,
      is_deleted: false,
      message: serializeToText(content),
      message_meta: content,
      // 新评论总是在第一页
      page_id: "0",
      order_id: "0", // 新评论总是最新的
      reactions: null,
    }

    // 添加到 byId 记录
    comments$.byId[newCommentId].set(newComment)
    // 添加到排序数组的最后面（确保最新的评论显示在底部）
    comments$.order.set([...comments$.order.get(), newCommentId])
    // 更新总数
    comments$.pagination.totalCount.set((prev) => prev + 1)
    // 设置新评论通知
    comments$.newComment.set({
      hasNew: true,
      id: newCommentId,
    })

    // 200ms 后重置新评论通知状态
    setTimeout(() => {
      comments$.newComment.hasNew.set(false)
    }, 200)

    return newCommentId
  },

  // 开始编辑评论
  startEditing(id: string) {
    const comment = comments$.byId[id].get()
    if (comment) {
      comments$.editingId.set(id)
      comments$.editingContent.set(comment.message_meta)
    }
  },

  // 取消编辑
  cancelEditing() {
    comments$.editingId.set(null)
    comments$.editingContent.set([])
  },

  // 设置编辑内容
  setEditingContent(content: Descendant[]) {
    comments$.editingContent.set(content)
  },

  // 保存编辑后的评论
  saveEditedComment() {
    const id = comments$.editingId.get()
    const content = comments$.editingContent.get()

    if (id && comments$.byId[id].get()) {
      // 更新内容和时间戳
      comments$.byId[id].message.set(serializeToText(content))
      comments$.byId[id].message_meta.set(content)
      comments$.byId[id].updated_at.set(new Date())

      // 重置编辑状态
      comments$.editingId.set(null)
      comments$.editingContent.set([])
    }
  },

  // 软删除评论
  deleteComment(id: string) {
    if (comments$.byId[id].get()) {
      comments$.byId[id].is_deleted.set(true)
      comments$.byId[id].deleted_at.set(new Date())
    }
  },

  // 添加或切换表情反应
  toggleReaction(commentId: string, emoji: string, user: User) {
    const comment = comments$.byId[commentId].get()
    if (!comment) return

    const reactions = comment.reactions || []
    // 查找是否已有该用户的此表情
    const existingIndex = reactions.findIndex((r) => r.emoji === emoji && r.user.id === user.id)

    if (existingIndex !== -1) {
      // 已有相同反应，移除它
      const newReactions = [...reactions]
      newReactions.splice(existingIndex, 1)
      comments$.byId[commentId].reactions.set(newReactions.length > 0 ? newReactions : null)
    } else {
      // 添加新反应
      const newReaction: Reaction = {
        uuid: nanoid(),
        emoji,
        created_at: new Date(),
        deleted_at: null,
        user,
      }
      comments$.byId[commentId].reactions.set([...reactions, newReaction])
    }
  },

  // 加载更多评论 - 分页加载
  loadMoreComments: async (
    fetchMoreFn?: (
      page: number,
      pageSize: number,
    ) => Promise<{
      comments: SubmittedCommentData[]
      totalCount: number
    }>,
  ) => {
    const pagination = comments$.pagination.get()

    // 如果没有更多或正在加载，直接返回
    if (!pagination.hasMore || pagination.isLoading) {
      return
    }

    // 设置加载状态
    comments$.pagination.isLoading.set(true)

    try {
      // 要加载更早的评论，我们需要向前移动页码
      // 如果currentPage是4，表示我们当前显示的是第4页的内容
      // 如果我们要加载更早的评论，则应加载第3页
      const prevPage = pagination.currentPage - 1

      // 如果没有更早的页码，无需继续
      if (prevPage < 0) {
        comments$.pagination.hasMore.set(false)
        return
      }

      let newComments: SubmittedCommentData[] = []
      let totalCount = pagination.totalCount

      if (fetchMoreFn) {
        // 使用提供的获取函数
        const result = await fetchMoreFn(prevPage, PAGE_SIZE)
        newComments = result.comments.map((comment) => ({
          ...comment,
          page_id: comment.page_id || prevPage.toString(),
        }))
        totalCount = result.totalCount
      } else {
        // 模拟加载延迟
        await new Promise((resolve) => setTimeout(resolve, 800))
        // 模拟没有更多数据
        newComments = []
      }

      // 更新状态
      if (newComments.length > 0) {
        // 按创建时间排序（旧->新）确保时间顺序一致
        newComments.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )

        // 添加新评论到状态
        const currentById = { ...comments$.byId.get() }
        const currentOrder = [...comments$.order.get()]

        // 创建新的排序数组，确保更早的评论在前面
        const newOrder: string[] = []

        newComments.forEach((comment) => {
          // 如果评论已存在，更新它
          if (currentById[comment.uuid]) {
            currentById[comment.uuid] = {
              ...currentById[comment.uuid],
              ...comment,
            }
          } else {
            // 否则添加新评论到前面（这些是更早的评论）
            currentById[comment.uuid] = comment
            newOrder.push(comment.uuid)
          }
        })

        // 确保较早的评论在前面，然后是现有评论
        comments$.byId.set(currentById)
        comments$.order.set([...newOrder, ...currentOrder])
      }

      // 更新分页信息
      comments$.pagination.currentPage.set(prevPage)
      comments$.pagination.hasMore.set(prevPage > 0) // 如果当前页大于0，还有更早的评论
      comments$.pagination.totalCount.set(totalCount)
    } catch (error) {
      console.error("Failed to load more comments:", error)
    } finally {
      // 重置加载状态
      comments$.pagination.isLoading.set(false)
    }
  },

  // 重置新评论通知
  resetNewCommentNotification() {
    comments$.newComment.set({
      hasNew: false,
      id: null,
    })
  },

  // 获取分页状态
  getPaginationState() {
    return comments$.pagination.get()
  },

  // 获取新评论通知状态
  getNewCommentState() {
    return comments$.newComment.get()
  },
}

// 导出一个自定义 hook 来在组件中使用评论服务
export function useCommentsState() {
  return {
    comments: sortedComments$.get(),
    allComments: allComments$.get(),
    editingId: comments$.editingId.get(),
    editingContent: comments$.editingContent.get(),
    pagination: comments$.pagination.get(),
    newComment: comments$.newComment.get(),
    ...commentsService,
  }
}
