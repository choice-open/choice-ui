import { Descendant } from "slate"
import type { SubmittedCommentData, User } from "../types"
import { serializeToText } from "../comment-input/components"
import { nanoid } from "nanoid"
import { useEventCallback } from "usehooks-ts"

interface UseCreateCommentOptions {
  author: User
  comments: SubmittedCommentData[]
  setComments: (comments: SubmittedCommentData[]) => void
  setMeasureCommentId: (id: string | null) => void
}

interface UseCreateCommentReturn {
  /**
   * Handler to submit a new comment
   */
  handleSubmit: (content: Descendant[]) => void
}

/**
 * Hook to handle creation of new comments
 */
export function useCreateComment({
  comments,
  setComments,
  author,
  setMeasureCommentId,
}: UseCreateCommentOptions): UseCreateCommentReturn {
  // Handler to submit a new comment
  const handleSubmit = useEventCallback((content: Descendant[]) => {
    const newCommentId = nanoid()
    const newComment: SubmittedCommentData = {
      uuid: newCommentId,
      author: author,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      resolved_at: null,
      is_deleted: false,
      message: serializeToText(content),
      message_meta: content,
      order_id: (comments.length + 1).toString(),
      page_id: null,
      reactions: null,
    }
    setComments([...comments, newComment])
    setMeasureCommentId(newCommentId)
  })

  return {
    handleSubmit,
  }
}
