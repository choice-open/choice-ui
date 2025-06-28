import { observer } from "@legendapp/state/react"
import { createRef, forwardRef, HTMLProps, useMemo, useRef, useState } from "react"
import { Descendant } from "slate"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { Avatar } from "~/components/avatar"
import { Button } from "~/components/button"
import { Scroll } from "~/components/scroll"
import { CommentInput } from "./comment-input"
import { CommentInputEmojiPopover } from "./comment-input/components"
import { CommentItem } from "./comment-item"
import { ImagePreviewPopover } from "./components"
import { useScrollToBottom } from "./hooks"
import { useCommentsState } from "./state/comments-state"
import { CommentsTv } from "./tv"
import type { DefaultText, SubmittedCommentData, User } from "./types"

interface CommentsProps extends HTMLProps<HTMLDivElement> {
  author: User
  className?: string
  defaultText?: DefaultText
  // 可选的获取更多评论的函数
  fetchMoreComments?: (
    page: number,
    pageSize: number,
  ) => Promise<{
    comments: SubmittedCommentData[]
    totalCount: number
  }>
  // 初始评论数据
  initialComments?: SubmittedCommentData[]
  // 评论总数（可选，如果不提供则使用initialComments.length）
  totalCount?: number
  users?: User[]
}

const CommentsComponent = forwardRef<HTMLDivElement, CommentsProps>((props, ref) => {
  const {
    className,
    users,
    author,
    fetchMoreComments,
    initialComments = [],
    totalCount,
    defaultText = {
      LOAD_MORE: "Load more comments",
      LOADING: "Loading...",
    },
    ...rest
  } = props

  // 滚动引用
  const scrollToBottomRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const [openImagePreviewDialog, setOpenImagePreviewDialog] = useState(false)

  // 使用 Legend State 的评论状态
  const {
    comments: filteredComments,
    editingId,
    editingContent,
    pagination,
    newComment,
    startEditing,
    cancelEditing,
    saveEditedComment,
    createComment,
    deleteComment,
    setEditingContent,
    toggleReaction,
    loadMoreComments,
    initComments,
  } = useCommentsState()

  // 使用滚动到底部的hook
  const { smoothScrollToBottom, setShouldScrollToBottom, setTyping, handleScroll } =
    useScrollToBottom(scrollToBottomRef, inputContainerRef, [filteredComments.length])

  const isEmpty = useMemo(() => {
    return filteredComments.length === 0
  }, [filteredComments])

  // 加载更多评论
  const handleLoadMore = async () => {
    // 加载更多时，不应该自动滚动到底部
    setShouldScrollToBottom(false)
    await loadMoreComments(fetchMoreComments)
  }

  // 创建表情按钮引用
  const emojiButtonRefs = useMemo(() => {
    return filteredComments.map(() => createRef<HTMLButtonElement>())
  }, [filteredComments])

  // 默认引用
  const fallbackRef = useRef<HTMLButtonElement>(null)

  // 跟踪活动的表情按钮
  const [activeEmojiButtonIndex, setActiveEmojiButtonIndex] = useState<number | null>(null)
  const [openEmojiPopover, setOpenEmojiPopover] = useState<number | null>(null)

  const [onOpenImage, setOnOpenImage] = useState<number | undefined>(undefined)
  // 添加当前点击的评论ID状态
  const [currentCommentId, setCurrentCommentId] = useState<string | null>(null)

  // 获取当前活动的按钮引用
  const getActiveButtonRef = useMemo(() => {
    if (activeEmojiButtonIndex !== null && emojiButtonRefs[activeEmojiButtonIndex]) {
      return emojiButtonRefs[activeEmojiButtonIndex]
    }
    return fallbackRef
  }, [activeEmojiButtonIndex, emojiButtonRefs])

  const styles = CommentsTv({ isEmpty })

  // 处理typing状态变化 - 使用hook中的setTyping
  const handleTypingChange = useEventCallback((typing: boolean) => {
    setTyping(typing)
  })

  // 处理评论提交
  const handleSubmit = useEventCallback((content: Descendant[]) => {
    // 先滚动到底部，保证视觉上更连贯
    setShouldScrollToBottom(true)

    // 创建评论
    createComment(content, author)

    // 延迟一点，让创建动作先执行，然后再次滚动到底部
    setTimeout(() => {
      requestAnimationFrame(smoothScrollToBottom)
    }, 100)
  })

  return (
    <>
      <Scroll
        className={tcx("flex h-full flex-col", className)}
        scrollbarMode="large-b"
        ref={ref}
      >
        <Scroll.Viewport
          ref={scrollToBottomRef}
          onScroll={handleScroll}
        >
          <Scroll.Content>
            {/* 加载更早评论的按钮 - 放在顶部 */}
            {pagination.hasMore && (
              <div className="flex justify-center py-2">
                <Button
                  onClick={handleLoadMore}
                  variant="ghost"
                  size="default"
                  disabled={pagination.isLoading}
                >
                  {pagination.isLoading ? defaultText.LOADING : defaultText.LOAD_MORE}
                </Button>
              </div>
            )}

            {filteredComments.map((comment, index) => (
              <div
                key={comment.uuid}
                className={styles.itemsRoot()}
              >
                {editingId === comment.uuid ? (
                  <div className={styles.inputRoot()}>
                    <div className={styles.inputAvatar()}>
                      <Avatar
                        photo={comment.author.photo_url || undefined}
                        name={comment.author.name}
                      />
                    </div>
                    <CommentInput
                      users={users}
                      initialValue={editingContent}
                      onSubmit={() => saveEditedComment()}
                      onCancel={() => cancelEditing()}
                      onChange={setEditingContent}
                      variant="solid"
                    />
                  </div>
                ) : (
                  <CommentItem
                    author={comment.author}
                    created_at={comment.created_at}
                    message_meta={comment.message_meta}
                    handleOnImageClick={(index?: number) => {
                      setOpenImagePreviewDialog(true)
                      setOnOpenImage(index)
                      setCurrentCommentId(comment.uuid) // 设置当前评论ID
                    }}
                    handleOnEdit={() => startEditing(comment.uuid)}
                    handleOnDelete={() => deleteComment(comment.uuid)}
                    reactionAnchorRef={emojiButtonRefs[index]}
                    reactionsPopoverIsOpen={openEmojiPopover === index}
                    handleOnReactionPopoverClick={() => {
                      setActiveEmojiButtonIndex(index)
                      setOpenEmojiPopover(index)
                    }}
                    handleOnReactionClick={() => {
                      // 在实际场景中，这里应该调用 toggleReaction
                      if (comment.reactions?.[0]) {
                        toggleReaction(comment.uuid, comment.reactions[0].emoji, author)
                      }
                    }}
                    reactions={comment.reactions}
                  />
                )}
              </div>
            ))}

            <div
              ref={inputContainerRef}
              className={styles.inputRoot()}
            >
              {isEmpty ? null : (
                <div className={styles.inputAvatar()}>
                  <Avatar
                    photo={author?.photo_url || undefined}
                    name={author?.name}
                    color={author?.color || undefined}
                  />
                </div>
              )}
              <CommentInput
                users={users}
                onSubmit={handleSubmit}
                variant="solid"
                onTypingChange={handleTypingChange}
              />
            </div>
          </Scroll.Content>
        </Scroll.Viewport>
      </Scroll>

      <CommentInputEmojiPopover
        setSelectedEmoji={(emoji) => {
          if (!emoji || activeEmojiButtonIndex === null) return

          const activeComment = filteredComments[activeEmojiButtonIndex]
          if (activeComment) {
            toggleReaction(activeComment.uuid, emoji, author)
            setOpenEmojiPopover(null)
          }
        }}
        anchorRect={getActiveButtonRef}
        open={openEmojiPopover !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenEmojiPopover(null)
          }
        }}
      />

      <ImagePreviewPopover
        onOpenImage={onOpenImage}
        currentCommentId={currentCommentId}
        filteredComments={filteredComments}
        isOpen={openImagePreviewDialog}
        setIsOpen={setOpenImagePreviewDialog}
      />
    </>
  )
})

CommentsComponent.displayName = "CommentsComponent"

export const Comments = observer(CommentsComponent)
