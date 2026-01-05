import type { CustomElement, ImageElement, SubmittedCommentData, User } from "@choice-ui/react"
import {
  Avatar,
  Button,
  CommentInput,
  CommentItem,
  Comments,
  comments$,
  Dialog,
  PicturePreview,
  tcx,
} from "@choice-ui/react"
import type { Meta } from "@storybook/react-vite"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Descendant } from "slate"

const meta = {
  title: "Components/Comments",
  component: Comments,
  tags: ["experimental"],
} satisfies Meta<typeof Comments>

export default meta

// Reset all comment data to ensure clean state for each demo
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
]

// Mock API database - stores all comments, returns requested pages only
const API_DATABASE: SubmittedCommentData[] = []

// Mock API call to fetch comments - returns only the requested page
const fetchComments = async (
  page: number,
  pageSize: number,
): Promise<{
  comments: SubmittedCommentData[]
  totalCount: number
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const startIndex = page * pageSize
  const endIndex = Math.min(startIndex + pageSize, API_DATABASE.length)
  const pageComments = API_DATABASE.slice(startIndex, endIndex)

  // Sort comments from oldest to newest
  const sortedComments = [...pageComments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return {
    comments: sortedComments,
    totalCount: API_DATABASE.length,
  }
}

/**
 * Basic Comments Component
 *
 * Demonstrates the full-featured Comments component with:
 * - Lazy loading pagination for large comment lists
 * - Real-time state management using Legend State
 * - Dialog-based comment viewer with draggable support
 * - Debug tools for testing state changes
 *
 * Features:
 * - Efficient polling with hash comparison to prevent unnecessary re-renders
 * - Proper cleanup on unmount to prevent memory leaks
 * - Safe null checks for all state accesses
 */
export const Basic = {
  render: function RenderStory() {
    const [openDialog, setOpenDialog] = useState(false)
    const [initialComments] = useState<SubmittedCommentData[]>([])
    const [totalCount] = useState(0)
    const [loadedComments, setLoadedComments] = useState<SubmittedCommentData[]>([])
    const lastCommentsHashRef = useRef<string>("")
    const isMountedRef = useRef(true)

    useEffect(() => {
      isMountedRef.current = true
      resetCommentState()

      const updateCommentsIfChanged = () => {
        if (!isMountedRef.current) return

        const state = comments$.get()
        if (!state?.order || !state?.byId) return

        const commentsList = state.order
          .map((id) => state.byId[id])
          .filter((c): c is SubmittedCommentData => c != null)
        const commentsHash = JSON.stringify(commentsList.map((c) => c.uuid))

        if (commentsHash !== lastCommentsHashRef.current) {
          lastCommentsHashRef.current = commentsHash
          setLoadedComments(commentsList)
        }
      }

      const intervalId = setInterval(updateCommentsIfChanged, 500)
      updateCommentsIfChanged()

      return () => {
        isMountedRef.current = false
        clearInterval(intervalId)
        resetCommentState()
      }
    }, [])

    const handleResetState = useCallback(() => {
      resetCommentState()
      setLoadedComments([])
    }, [])

    const handleAddComment = useCallback(() => {
      const currentState = comments$.get()
      if (!currentState) return

      const newId = `comment-${Date.now()}`
      const newComment: SubmittedCommentData = {
        uuid: newId,
        author: mockUsers[0],
        created_at: new Date(),
        deleted_at: null,
        is_deleted: false,
        message: "This is a test comment",
        message_meta: [
          {
            type: "paragraph",
            children: [{ text: "This is a test comment" }],
          },
        ],
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
    }, [])

    const paginationState = comments$.pagination.get()
    const isEmpty = comments$.get()?.order?.length === 0

    return (
      <>
        <Dialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          className="overflow-hidden"
          draggable
          outsidePress
        >
          {isEmpty ? null : <Dialog.Header title="Comments - Lazy Loading Example" />}
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

        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-secondary-foreground p-2">
              <h3 className="text-body-medium mb-2">Loaded Comments ({loadedComments.length})</h3>
              {loadedComments.length === 0 ? (
                <p className="text-secondary-foreground">No comments</p>
              ) : (
                <div className="space-y-4">
                  {loadedComments.map((item) => (
                    <div
                      key={item.uuid}
                      className="border-l-2 border-blue-400 pl-2"
                    >
                      <p>
                        <strong>Comment {item.uuid}</strong> - Page: {item.page_id ?? "N/A"} -{" "}
                        {item.author?.name ?? "Unknown"} at {item.created_at?.toLocaleString() ?? "N/A"}
                      </p>
                      <p className="text-secondary-foreground mt-1">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Button onClick={() => setOpenDialog(true)}>Open Dialog</Button>
              <div className="bg-menu-background w-full rounded-xl p-4 text-white">
                <h3 className="text-body-medium">State Monitor</h3>
                <div className="space-y-2">
                  <p className="text-white/50">Loaded: {loadedComments.length}</p>
                  <p className="text-white/50">Total: {totalCount}</p>
                  <p className="text-white/50">
                    Page: {paginationState?.currentPage ?? 1},{" "}
                    {paginationState?.hasMore ? "Has more" : "No more"}
                  </p>
                  <p className="text-white/50">
                    Status: {paginationState?.isLoading ? "Loading" : "Idle"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleResetState}
                >
                  Reset State
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  },
}

/**
 * Comment Input - Default Variant
 *
 * A rich text input component for composing comments with:
 * - @mention support with user autocomplete
 * - Rich text formatting (bold, italic, etc.)
 * - Submit handling with content clearing
 *
 * Best practices:
 * - Uses useCallback for stable event handlers
 * - Controlled input with proper state management
 */
export const CommentInputBasic = {
  render: function RenderStory() {
    const [, setValue] = useState<Descendant[]>([])

    const handleChange = useCallback((newValue: Descendant[]) => {
      setValue(newValue)
    }, [])

    const handleSubmit = useCallback((data: Descendant[]) => {
      console.log("Submitted:", data)
      setValue([])
    }, [])

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
          <div className="flex size-10 items-center justify-center">
            <Avatar
              photo="https://github.com/shadcn.png"
              name="You"
              size="large"
            />
          </div>
          <div className="flex flex-col">
            <CommentInput
              className="w-full"
              placeholder="Add a comment, use @ to mention users..."
              users={mockUsers}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Comment Input - Solid Variant
 *
 * Alternative visual style with solid background for better contrast.
 * Useful in contexts where the input needs more visual prominence.
 *
 * Features same functionality as Basic variant with different styling.
 */
export const CommentInputSolid = {
  render: function RenderStory() {
    const [, setValue] = useState<Descendant[]>([])

    const handleChange = useCallback((newValue: Descendant[]) => {
      setValue(newValue)
    }, [])

    const handleSubmit = useCallback((data: Descendant[]) => {
      console.log("Submitted:", data)
      setValue([])
    }, [])

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
          <div className="flex size-10 items-center justify-center">
            <Avatar
              photo="https://github.com/shadcn.png"
              name="You"
              size="large"
            />
          </div>
          <div className="flex flex-col">
            <CommentInput
              className="w-full"
              variant="solid"
              placeholder="Add a comment, use @ to mention users..."
              users={mockUsers}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Comment Input - No Users
 *
 * Demonstrates the input without @mention functionality.
 * Use when user mentions are not needed or user list is unavailable.
 *
 * Safe handling: Works gracefully without users prop.
 */
export const CommentInputNoUsers = {
  render: function RenderStory() {
    const [, setValue] = useState<Descendant[]>([])

    const handleChange = useCallback((newValue: Descendant[]) => {
      setValue(newValue)
    }, [])

    const handleSubmit = useCallback((data: Descendant[]) => {
      console.log("Submitted:", data)
      setValue([])
    }, [])

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
          <div className="flex size-10 items-center justify-center">
            <Avatar
              photo="https://github.com/shadcn.png"
              name="You"
              size="large"
            />
          </div>
          <div className="flex flex-col">
            <CommentInput
              className="w-full"
              placeholder="This example has no users to @mention"
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  },
}

// Shared mock user for CommentItem stories
const mockUser: User = {
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  photo_url: "https://i.pravatar.cc/150?img=1",
  color: null,
}

/**
 * Comment Item - Basic
 *
 * Displays a single comment with author avatar, name, timestamp, and content.
 * This is the fundamental building block for comment lists.
 *
 * Features:
 * - Relative time formatting (e.g., "2 hours ago")
 * - Author information display
 * - Clean, minimal design
 */
export const CommentItemBasic = {
  render: function RenderStory() {
    const createdAt = useMemo(() => new Date(Date.now() - 2 * 60 * 60 * 1000), [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "This is a basic comment without any formatting." }],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={mockUser}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - With Rich Text Formatting
 *
 * Demonstrates comment content with inline text formatting:
 * - Bold text
 * - Italic text
 * - Underlined text
 * - Strikethrough text
 *
 * Shows how the component renders Slate.js rich text content.
 */
export const CommentItemWithFormatting = {
  render: function RenderStory() {
    const createdAt = useMemo(() => new Date(Date.now() - 86400000), [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [
            { text: "This comment has " },
            { text: "bold", bold: true },
            { text: ", " },
            { text: "italic", italic: true },
            { text: ", and " },
            { text: "underlined", underline: true },
            { text: " text, as well as " },
            { text: "strikethrough", strikethrough: true },
            { text: "." },
          ],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "2",
          name: "John Smith",
          email: "john@example.com",
          photo_url: "https://i.pravatar.cc/150?img=2",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - Recent (Within Today)
 *
 * Shows relative time formatting for recent comments.
 * Displays "X hours ago" format for comments posted today.
 *
 * Demonstrates time-based display logic.
 */
export const CommentItemRecent = {
  render: function RenderStory() {
    const createdAt = useMemo(() => new Date(Date.now() - 2 * 60 * 60 * 1000), [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "This comment was posted recently, showing relative time format." }],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "9",
          name: "Rebecca Moore",
          email: "rebecca@example.com",
          photo_url: "https://i.pravatar.cc/150?img=9",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - This Year
 *
 * Shows date formatting for comments from current year.
 * Displays month and day without year (e.g., "Oct 15").
 *
 * Demonstrates year-aware date formatting.
 */
export const CommentItemThisYear = {
  render: function RenderStory() {
    const createdAt = useMemo(() => {
      const date = new Date()
      date.setMonth(date.getMonth() - 3)
      return date
    }, [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "This comment was posted within this year, showing month and day." }],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "10",
          name: "Thomas Wilson",
          email: "thomas@example.com",
          photo_url: "https://i.pravatar.cc/150?img=10",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - Last Year
 *
 * Shows full date formatting for older comments.
 * Displays complete date with year (e.g., "Oct 15, 2024").
 *
 * Demonstrates full date format for historical comments.
 */
export const CommentItemLastYear = {
  render: function RenderStory() {
    const createdAt = useMemo(() => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      return date
    }, [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "This comment was posted last year, showing the full date format." }],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "11",
          name: "Patricia Clark",
          email: "patricia@example.com",
          photo_url: "https://i.pravatar.cc/150?img=11",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - With @Mentions and Image
 *
 * Advanced comment featuring:
 * - User @mentions with interactive chips
 * - Embedded image attachment
 * - Multiple paragraphs
 *
 * Demonstrates rich content composition in comments.
 */
export const CommentItemWithMentionAndImage = {
  render: function RenderStory() {
    const createdAt = useMemo(() => new Date(Date.now() - 5 * 60 * 60 * 1000), [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [
            { text: "Take a look at this image " },
            {
              type: "mention",
              user: {
                id: "user-1",
                name: "Sarah Parker",
                photo_url: "https://i.pravatar.cc/150?img=5",
                email: "sarah.parker@example.com",
                color: null,
              },
              children: [{ text: "" }],
            } as CustomElement,
            { text: " shared:" },
          ],
        } as CustomElement,
        {
          type: "image",
          attachments: [
            {
              url: "https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop",
              name: "Nature Image",
            },
          ],
          children: [{ text: "" }],
        } as CustomElement,
        {
          type: "paragraph",
          children: [
            { text: "What do you think? " },
            {
              type: "mention",
              user: {
                id: "user-2",
                name: "Robert Davis",
                photo_url: "https://i.pravatar.cc/150?img=8",
                email: "robert.davis@example.com",
                color: null,
              },
              children: [{ text: "" }],
            } as CustomElement,
            { text: " might have some thoughts on this." },
          ],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "3",
          name: "Alex Johnson",
          email: "alex@example.com",
          photo_url: "https://i.pravatar.cc/150?img=3",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - With Lists
 *
 * Demonstrates list formatting in comments:
 * - Bulleted (unordered) lists
 * - Numbered (ordered) lists
 * - Rich text within list items
 *
 * Shows complex content structure support.
 */
export const CommentItemWithLists = {
  render: function RenderStory() {
    const createdAt = useMemo(() => new Date(Date.now() - 24 * 60 * 60 * 1000), [])
    const messageMeta = useMemo<CustomElement[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "Here are some key points:" }],
        } as CustomElement,
        {
          type: "bulleted-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "First bullet point" }],
            } as CustomElement,
            {
              type: "list-item",
              children: [{ text: "Second bullet point with " }, { text: "formatting", bold: true }],
            } as CustomElement,
            {
              type: "list-item",
              children: [{ text: "Third bullet point" }],
            } as CustomElement,
          ],
        } as CustomElement,
        {
          type: "paragraph",
          children: [{ text: "And a numbered list:" }],
        } as CustomElement,
        {
          type: "numbered-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "First numbered item" }],
            } as CustomElement,
            {
              type: "list-item",
              children: [{ text: "Second numbered item" }],
            } as CustomElement,
            {
              type: "list-item",
              children: [{ text: "Third numbered item" }],
            } as CustomElement,
          ],
        } as CustomElement,
      ],
      [],
    )

    return (
      <CommentItem
        author={{
          id: "4",
          name: "Emily Wilson",
          email: "emily@example.com",
          photo_url: "https://i.pravatar.cc/150?img=4",
          color: null,
        }}
        created_at={createdAt}
        message_meta={messageMeta}
        reactions={null}
        locale="en-us"
      />
    )
  },
}

/**
 * Comment Item - Multiple Images with Preview
 *
 * Interactive example with:
 * - Multiple image attachments in a grid
 * - Click-to-preview functionality
 * - Dialog-based image viewer with PicturePreview
 *
 * Performance optimizations:
 * - Memoized data structures
 * - Stable callback references
 * - Conditional dialog rendering
 */
export const CommentItemMultipleImages = {
  render: function RenderStory() {
    const [isOpen, setIsOpen] = useState(false)
    const [imageIndex, setImageIndex] = useState<number | undefined>(undefined)

    const messageMeta = useMemo<Descendant[]>(
      () => [
        {
          type: "paragraph",
          children: [{ text: "Check out these images from our trip:" }],
        } as CustomElement,
        {
          type: "image",
          attachments: [
            {
              url: "https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop",
              name: "Beach",
            },
            {
              url: "https://images.unsplash.com/photo-1739989934289-4cb75f451a56?q=80&w=5070&auto=format&fit=crop",
              name: "Mountains",
            },
            {
              url: "https://images.unsplash.com/photo-1746071062150-b12db59e9c53?q=80&w=2048&auto=format&fit=crop",
              name: "Forest",
            },
            {
              url: "https://images.unsplash.com/photo-1745659601865-1af86dec8bcd?q=80&w=3183&auto=format&fit=crop",
              name: "City",
            },
          ],
          children: [{ text: "" }],
        } as CustomElement,
        {
          type: "paragraph",
          children: [{ text: "It was an amazing experience!" }],
        } as CustomElement,
      ],
      [],
    )

    const currentImage = useMemo(() => {
      if (imageIndex === undefined) return null

      const imageElement = messageMeta.find(
        (item) => (item as CustomElement).type === "image",
      ) as ImageElement | undefined

      if (!imageElement?.attachments) return null
      return imageElement.attachments[imageIndex] ?? null
    }, [messageMeta, imageIndex])

    const author = useMemo<User>(
      () => ({
        id: "1",
        name: "Jane Doe",
        email: "jane@example.com",
        photo_url: "https://i.pravatar.cc/150?img=1",
        color: null,
      }),
      [],
    )

    const createdAt = useMemo(() => new Date(), [])

    const handleImageClick = useCallback((index?: number) => {
      if (index === undefined) return
      setImageIndex(index)
      setIsOpen(true)
    }, [])

    const handleDialogClose = useCallback((open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setImageIndex(undefined)
      }
    }, [])

    return (
      <>
        <CommentItem
          author={author}
          created_at={createdAt}
          message_meta={messageMeta}
          reactions={null}
          handleOnImageClick={handleImageClick}
          locale="en-us"
        />
        {isOpen && currentImage && (
          <Dialog
            open={isOpen}
            onOpenChange={handleDialogClose}
            outsidePress
            className="overflow-hidden"
          >
            <Dialog.Header title={currentImage.name ?? "Image Preview"} />
            <Dialog.Content className="overflow-hidden p-0">
              <PicturePreview
                src={currentImage.url}
                fileName={currentImage.name}
              />
            </Dialog.Content>
          </Dialog>
        )}
      </>
    )
  },
}
