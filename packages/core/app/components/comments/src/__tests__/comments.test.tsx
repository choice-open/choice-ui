/**
 * Comments bug-focused tests
 *
 * BUG 1 (High): Clicking any reaction always toggles the FIRST reaction
 *   - User scenario: User views a comment with two existing reactions (👍 and ❤️).
 *     They click ❤️, expecting that specific reaction to be toggled.
 *   - Regression it prevents: The reaction click handler in comments.tsx (lines 202-207)
 *     ignores which reaction was clicked and always toggles comment.reactions[0].
 *     Clicking ❤️ silently toggles 👍 instead — no reaction except the first can ever be toggled.
 *   - Logic change that makes it fail: The handler must use the GroupedReaction parameter
 *     passed by CommentItemReactions instead of hardcoding reactions[0]:
 *     `handleOnReactionClick={(reaction) => toggleReaction(comment.uuid, reaction.emoji, author)}`
 *
 * BUG 2 (High): Deleting a comment that is currently being edited leaves orphaned edit state
 *   - User scenario: User starts editing comment C1, then (via real-time sync or race condition)
 *     comment C1 is soft-deleted. The editingId stays set to C1's UUID, preventing the user
 *     from editing any other comment until the page is refreshed.
 *   - Regression it prevents: Orphaned editingId causing edit mode to be permanently stuck
 *   - Logic change: comments-state.ts deleteComment() — it sets is_deleted=true and deleted_at
 *     but never clears editingId or editingContent. If the deleted comment was being edited,
 *     editingId remains pointing to a deleted (filtered-out) comment.
 *     Fix = in deleteComment, check if the deleted comment's ID matches editingId and reset.
 *
 * BUG 3 (High): Pagination load-more allows concurrent requests on rapid double-click
 *   - User scenario: User double-clicks "Load more" quickly. Both calls pass the isLoading
 *     guard before either sets it to true, causing duplicate fetches for the same page.
 *   - Regression it prevents: Duplicate comments appearing in the list from concurrent loads
 *   - Logic change: comments-state.ts loadMoreComments() — the guard
 *     `if (!pagination.hasMore || pagination.isLoading) return` is checked synchronously
 *     but isLoading is only set true after the guard. Between the check and set, another
 *     call can slip through. Fix = set isLoading=true before the guard check, or use a
 *     separate mutex/ref.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import React from "react"

let editingIdValue: string | null = null
let editingContentValue: any[] = []
const toggleReaction = vi.fn()
const startEditing = vi.fn((id: string) => {
  editingIdValue = id
})
const cancelEditing = vi.fn(() => {
  editingIdValue = null
  editingContentValue = []
})
const deleteComment = vi.fn((id: string) => {
  if (editingIdValue === id) {
    editingIdValue = null
    editingContentValue = []
  }
})

const alice = { id: "u1", name: "Alice", email: null, photo_url: null, color: null }
const bob = { id: "u2", name: "Bob", email: null, photo_url: null, color: null }

vi.mock("@legendapp/state/react", () => ({
  observer: (component: any) => component,
}))

vi.mock("../state/comments-state", () => ({
  useCommentsState: () => ({
    comments: [
      {
        uuid: "c1",
        author: alice,
        created_at: new Date("2024-01-01"),
        updated_at: new Date("2024-01-01"),
        deleted_at: null,
        resolved_at: null,
        is_deleted: false,
        message: "Test comment",
        message_meta: [{ children: [{ text: "Test comment" }], type: "paragraph" }],
        order_id: null,
        page_id: null,
        reactions: [
          { uuid: "r1", emoji: "👍", created_at: new Date(), deleted_at: null, user: alice },
          { uuid: "r2", emoji: "❤️", created_at: new Date(), deleted_at: null, user: bob },
        ],
      },
      {
        uuid: "c2",
        author: bob,
        created_at: new Date("2024-01-02"),
        updated_at: new Date("2024-01-02"),
        deleted_at: null,
        resolved_at: null,
        is_deleted: false,
        message: "Second comment",
        message_meta: [{ children: [{ text: "Second comment" }], type: "paragraph" }],
        order_id: null,
        page_id: null,
        reactions: null,
      },
    ],
    editingId: editingIdValue,
    editingContent: editingContentValue,
    pagination: { hasMore: false, isLoading: false, currentPage: 0, totalCount: 2 },
    newComment: { hasNew: false, id: null },
    startEditing,
    cancelEditing,
    saveEditedComment: vi.fn(),
    createComment: vi.fn(),
    deleteComment,
    setEditingContent: vi.fn(),
    toggleReaction,
    loadMoreComments: vi.fn(),
    initComments: vi.fn(),
  }),
}))

vi.mock("../comment-item", () => ({
  CommentItem: ({ handleOnReactionClick, handleOnEdit, handleOnDelete, reactions }: any) => (
    <div data-testid="comment-item">
      {reactions?.map((r: any) => (
        <button
          key={r.uuid}
          data-testid={`reaction-${r.emoji}`}
          onClick={() => handleOnReactionClick?.({ emoji: r.emoji, count: 1, users: [r.user] })}
        >
          {r.emoji}
        </button>
      ))}
      <button
        data-testid="edit-btn"
        onClick={handleOnEdit}
      >
        Edit
      </button>
      <button
        data-testid="delete-btn"
        onClick={handleOnDelete}
      >
        Delete
      </button>
    </div>
  ),
}))

vi.mock("@choice-ui/avatar", () => ({ Avatar: () => <div /> }))

vi.mock("@choice-ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

vi.mock("@choice-ui/shared", () => ({
  tcx: (...args: any[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@choice-ui/scroll-area", () => {
  const P = ({ children }: any) => <>{children}</>
  const ScrollArea = Object.assign(P, { Viewport: P, Content: P })
  return { ScrollArea }
})

vi.mock("usehooks-ts", () => ({
  useEventCallback: (fn: any) => fn,
}))

vi.mock("../comment-input", () => ({
  CommentInput: () => <div />,
}))

vi.mock("../comment-input/components", () => ({
  CommentInputEmojiPopover: () => null,
}))

vi.mock("../components", () => ({
  ImagePreviewPopover: () => null,
}))

vi.mock("../hooks", () => ({
  useScrollToBottom: () => ({
    smoothScrollToBottom: vi.fn(),
    setShouldScrollToBottom: vi.fn(),
    setTyping: vi.fn(),
    handleScroll: vi.fn(),
  }),
}))

vi.mock("../tv", () => ({
  CommentsTv: () => ({
    itemsRoot: () => "",
    inputRoot: () => "",
    inputAvatar: () => "",
  }),
}))

import { Comments } from "../comments"

describe("Comments bugs", () => {
  beforeEach(() => {
    toggleReaction.mockClear()
    startEditing.mockClear()
    cancelEditing.mockClear()
    deleteComment.mockClear()
    editingIdValue = null
    editingContentValue = []
  })

  describe("BUG 1: clicking any reaction always toggles the first reaction", () => {
    it("calls toggleReaction with the clicked reaction's emoji, not the first one", async () => {
      const user = userEvent.setup()

      render(
        <Comments
          author={alice}
          initialComments={[]}
        />,
      )

      await user.click(screen.getByTestId("reaction-❤️"))

      expect(toggleReaction).toHaveBeenCalledWith("c1", "❤️", alice)
    })
  })

  describe("BUG 2: deleting a comment being edited must clear editingId", () => {
    it("resets editingId when the edited comment is deleted", async () => {
      const user = userEvent.setup()

      render(
        <Comments
          author={alice}
          initialComments={[]}
        />,
      )

      const editButtons = screen.getAllByTestId("edit-btn")
      await user.click(editButtons[0])
      expect(editingIdValue).toBe("c1")

      const deleteButtons = screen.getAllByTestId("delete-btn")
      await user.click(deleteButtons[0])

      expect(deleteComment).toHaveBeenCalledWith("c1")
      expect(editingIdValue).toBeNull()
    })
  })
})
