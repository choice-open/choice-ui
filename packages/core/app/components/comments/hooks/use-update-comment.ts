import { useState } from "react"
import { Descendant } from "slate"
import type { SubmittedCommentData } from "../types"
import { serializeToText } from "../comment-input/components"

interface UseUpdateCommentOptions {
  comments: SubmittedCommentData[]
  setComments: (comments: SubmittedCommentData[]) => void
}

interface UseUpdateCommentReturn {
  /**
   * Current content being edited
   */
  currentValue: Descendant[]
  /**
   * ID of the comment currently being edited
   */
  editingCommentId: string | null
  /**
   * Handler to cancel editing
   */
  handleCancel: () => void
  /**
   * Handler to delete a comment (soft delete)
   */
  handleDelete: (comment: SubmittedCommentData) => void
  /**
   * Handler to start editing a comment
   */
  handleEdit: (comment: SubmittedCommentData) => void
  /**
   * Handler to save edited comment
   */
  handleSave: (newContent: Descendant[]) => void
  /**
   * Set current value being edited
   */
  setCurrentValue: (value: Descendant[]) => void
}

/**
 * Hook to manage comment operations: editing, deleting, and updating
 * 注意：高度测量功能已移除，因为在新的实现中不再需要
 */
export function useUpdateComment({
  comments,
  setComments,
}: UseUpdateCommentOptions): UseUpdateCommentReturn {
  // Editing state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [currentValue, setCurrentValue] = useState<Descendant[]>([])

  // Edit a comment
  const handleEdit = (comment: SubmittedCommentData) => {
    setEditingCommentId(comment.uuid)
    setCurrentValue(comment.message_meta)
  }

  // Delete a comment (soft delete)
  const handleDelete = (comment: SubmittedCommentData) => {
    setComments(
      comments.map((c) =>
        c.uuid === comment.uuid
          ? {
              ...c,
              deleted_at: new Date(),
              is_deleted: true,
            }
          : c,
      ),
    )
  }

  // Save edited comment
  const handleSave = (newContent: Descendant[]) => {
    if (editingCommentId) {
      updateCommentContent(editingCommentId, newContent)
      setEditingCommentId(null)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setEditingCommentId(null)
  }

  // Helper function to update a comment's content
  const updateCommentContent = (id: string, newContent: Descendant[]) => {
    setComments(
      comments.map((comment) =>
        comment.uuid === id
          ? {
              ...comment,
              message: serializeToText(newContent),
              message_meta: newContent,
              updated_at: new Date(),
            }
          : comment,
      ),
    )
  }

  return {
    editingCommentId,
    currentValue,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    setCurrentValue,
  }
}
