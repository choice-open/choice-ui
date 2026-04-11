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
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import React from "react"

const toggleReaction = vi.fn()

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
    ],
    editingId: null,
    editingContent: [],
    pagination: { hasMore: false, isLoading: false, currentPage: 0, totalCount: 1 },
    newComment: { hasNew: false, id: null },
    startEditing: vi.fn(),
    cancelEditing: vi.fn(),
    saveEditedComment: vi.fn(),
    createComment: vi.fn(),
    deleteComment: vi.fn(),
    setEditingContent: vi.fn(),
    toggleReaction,
    loadMoreComments: vi.fn(),
    initComments: vi.fn(),
  }),
}))

vi.mock("../comment-item", () => ({
  CommentItem: ({ handleOnReactionClick, reactions }: any) => (
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
})
