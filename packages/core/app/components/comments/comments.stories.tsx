import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Dialog } from "../dialog"
import { Comments } from "./comments"
import type { SubmittedCommentData, User } from "./types"
import { comments$, useCommentsState, sortedComments$ } from "./state/comments-state"
import { faker } from "@faker-js/faker"
import { tcx } from "../../utils"

const meta = {
  title: "Components/Comments",
  component: Comments,
  tags: ["experimental"],
} satisfies Meta<typeof Comments>

export default meta
type Story = StoryObj<typeof meta>

// 清除所有评论数据，确保每次演示都从干净状态开始
const resetCommentState = () => {
  comments$.set({
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
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    photo_url: "https://i.pravatar.cc/150?u=john",
    color: "#000000",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    photo_url: "https://i.pravatar.cc/150?u=jane",
    color: "#000000",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    photo_url: "https://i.pravatar.cc/150?u=bob",
    color: "#000000",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    photo_url: "https://i.pravatar.cc/150?u=alice",
    color: "#000000",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    photo_url: "https://i.pravatar.cc/150?u=charlie",
    color: "#000000",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana@example.com",
    photo_url: "https://i.pravatar.cc/150?u=diana",
    color: "#000000",
  },
  {
    id: "7",
    name: "Eddie Murphy",
    email: "eddie@example.com",
    photo_url: "https://i.pravatar.cc/150?u=eddie",
    color: "#000000",
  },
]

// 模拟API数据库 - 存储所有可能的评论，但只返回请求的页面
// 这在实际项目中会是数据库中的所有评论
const API_DATABASE = (() => {
  const comments: SubmittedCommentData[] = []

  return comments
})()

// 模拟API调用获取评论 - 只返回请求的页面
const fetchComments = async (
  page: number,
  pageSize: number,
): Promise<{
  comments: SubmittedCommentData[]
  totalCount: number
}> => {
  console.log(`🌐 API调用: 获取第${page}页评论，每页${pageSize}条`)

  // 模拟网络延迟 - 减少延迟以提高响应速度
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 计算要返回的数据范围
  const startIndex = page * pageSize
  const endIndex = Math.min(startIndex + pageSize, API_DATABASE.length)

  console.log(`🌐 返回索引范围: ${startIndex}-${endIndex} (共${endIndex - startIndex}条)`)

  // 从"数据库"中只提取请求页的评论
  const pageComments = API_DATABASE.slice(startIndex, endIndex)

  // 确保评论按从旧到新排序
  const sortedComments = [...pageComments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  console.log(`🌐 返回评论: ${sortedComments.length}条`)
  console.log(
    `🌐 第一条ID: ${sortedComments[0]?.uuid}, 最后一条ID: ${sortedComments[sortedComments.length - 1]?.uuid}`,
  )

  return {
    comments: sortedComments,
    totalCount: API_DATABASE.length,
  }
}

export const Basic = {
  render: function BasicStory() {
    const [openDialog, setOpenDialog] = useState(false)

    const [initialComments, setInitialComments] = useState<SubmittedCommentData[]>([])

    const [totalCount, setTotalCount] = useState(0)

    // 当前已加载的评论 (供调试显示用)
    const [loadedComments, setLoadedComments] = useState<SubmittedCommentData[]>([])

    // 使用ref跟踪上一次的评论状态，避免不必要的更新
    const lastCommentsHashRef = useRef<string>("")

    // 重置状态，确保每次都从头开始
    useEffect(() => {
      resetCommentState()

      // 使用正确的方式监听Legend State的变化
      // 直接使用observable的get方法获取状态并计算唯一标识
      const updateCommentsIfChanged = () => {
        const state = comments$.get()
        const commentsList = state.order.map((id) => state.byId[id])
        const commentsHash = JSON.stringify(commentsList.map((c) => c.uuid))

        if (commentsHash !== lastCommentsHashRef.current) {
          lastCommentsHashRef.current = commentsHash
          setLoadedComments(commentsList)
        }
      }

      // 使用setInterval但间隔更长，减少性能问题
      const intervalId = setInterval(updateCommentsIfChanged, 500)

      // 立即执行一次
      updateCommentsIfChanged()

      return () => {
        clearInterval(intervalId)
        resetCommentState()
      }
    }, [])

    // 已加载评论的调试视图
    const loadedCommentsDebug = (
      <div className="text-secondary-foreground p-2">
        <h3 className="mb-2 text-xs font-medium">已加载评论 ({loadedComments.length})</h3>
        {loadedComments.length === 0 ? (
          <p className="text-xs text-gray-500 italic">无评论</p>
        ) : (
          <div className="space-y-4">
            {loadedComments.map((item, i) => (
              <div
                key={item.uuid}
                className="border-l-2 border-blue-400 pl-2 text-xs"
              >
                <p>
                  <strong>评论 {item.uuid}</strong> - 页码: {item.page_id} - {item.author.name} 于{" "}
                  {item.created_at.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-600">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )

    // 实时状态监视器
    const stateMonitor = (
      <div className="bg-gray-900 p-2 text-white">
        <h3 className="mb-2 text-xs font-medium">状态监控</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400">加载的评论数: {loadedComments.length}</p>
            <p className="text-xs text-gray-400">总评论数: {totalCount}</p>
            <p className="text-xs text-gray-400">
              分页信息: 当前页 {comments$.pagination.get().currentPage},
              {comments$.pagination.get().hasMore ? "有更早评论" : "无更早评论"}
            </p>
            <p className="text-xs text-gray-400">
              加载状态: {comments$.pagination.get().isLoading ? "加载中" : "空闲"}
            </p>
          </div>
        </div>
      </div>
    )

    // 调试工具
    const debugTools = (
      <div className="mt-4 flex gap-2">
        <button
          className="rounded bg-red-500 px-2 py-1 text-xs text-white"
          onClick={() => {
            resetCommentState()
            setLoadedComments([])
          }}
        >
          重置状态
        </button>

        <button
          className="rounded bg-blue-500 px-2 py-1 text-xs text-white"
          onClick={() => {
            // 直接使用 comments$ observable 来创建评论
            const currentState = comments$.get()
            const newId = `comment-${Date.now()}`
            const newComment: SubmittedCommentData = {
              uuid: newId,
              author: mockUsers[0],
              created_at: new Date(),
              deleted_at: null,
              is_deleted: false,
              message: faker.lorem.sentence(),
              message_meta: [{ type: "paragraph", children: [{ text: faker.lorem.sentence() }] }],
              order_id: null,
              page_id: null,
              reactions: null,
              resolved_at: null,
              updated_at: new Date(),
            }

            comments$.set({
              ...currentState,
              byId: {
                ...currentState.byId,
                [newId]: newComment,
              },
              order: [...currentState.order, newId],
            })
          }}
        >
          添加新评论
        </button>
      </div>
    )

    const isEmpty = comments$.get().order.length === 0

    return (
      <>
        <Dialog
          open={true}
          onOpenChange={setOpenDialog}
          className="overflow-hidden"
          draggable
        >
          {isEmpty ? null : <Dialog.Header title="评论组件 - 分页懒加载示例" />}
          <Dialog.Content className={tcx(isEmpty ? "w-[296px]" : "w-[360px]")}>
            <Comments
              className="flex max-h-[512px] flex-col overflow-hidden"
              initialComments={initialComments}
              totalCount={totalCount}
              fetchMoreComments={fetchComments}
              users={mockUsers}
              author={mockUsers[0]}
            />
          </Dialog.Content>
        </Dialog>

        <div className="grid h-[80vh] w-[80vw] grid-cols-2 gap-2">
          {loadedCommentsDebug}
          <div className="space-y-4">
            {stateMonitor}
            {debugTools}
          </div>
        </div>
      </>
    )
  },
}
