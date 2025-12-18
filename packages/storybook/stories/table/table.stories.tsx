import { Avatar, Badge, Button, Checkbox, Label, Select, Table } from "@choice-ui/react"
import { LoaderCircle } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useCallback, useMemo, useRef, useState } from "react"

const meta: Meta<typeof Table> = {
  title: "DataDisplay/Table",
  component: Table,
  tags: ["autodocs", "beta"],
}

export default meta

type Story = StoryObj<typeof Table>

// ============================================================================
// Sample Data Types
// ============================================================================

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  department: string
  joinDate: string
}

// Generate sample users with offset for infinite scroll
function generateUsers(count: number, startIndex = 0): User[] {
  const roles = ["Admin", "Editor", "Viewer", "Manager", "Developer"]
  const statuses: User["status"][] = ["active", "inactive", "pending"]
  const departments = ["Engineering", "Design", "Marketing", "Sales", "Support"]

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    return {
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: roles[index % roles.length],
      status: statuses[index % statuses.length],
      department: departments[index % departments.length],
      joinDate: new Date(2020 + (index % 5), index % 12, (index % 28) + 1).toISOString(),
    }
  })
}

// Status badge component
function StatusBadge({ status }: { status: User["status"] }) {
  const variants: Record<User["status"], "success" | "error" | "warning"> = {
    active: "success",
    inactive: "error",
    pending: "warning",
  }
  return (
    <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  )
}

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic table with multi-row selection.
 *
 * **Key Features:**
 * - Checkbox column for row selection
 * - Shift+Click for range selection
 * - Consecutive selected rows display rounded corners
 * - Header checkbox toggles select all / deselect all
 *
 * **Usage Tips:**
 * - Use `selectable` prop to enable selection column
 * - Use `selectionMode="multiple"` for multi-select (default) or `"single"` for single-select
 * - Control selection with `selectedKeys` and `onSelectionChange`
 */
export const Basic: Story = {
  render: function BasicStory() {
    const users = useMemo(() => generateUsers(50), [])
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

    return (
      <div className="flex w-full flex-col gap-4">
        <Label>Selected: {selectedKeys.length} rows</Label>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          selectable
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          height={400}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="name"
              width={150}
              flex={1}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={2}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={120}
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="status">
                  <StatusBadge status={user.status} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

/**
 * Table with sortable columns.
 *
 * **Key Features:**
 * - Click header to toggle sort direction (asc → desc → none)
 * - Sort indicator icon shows current direction
 * - Controlled sorting state for server-side sorting support
 *
 * **Usage Tips:**
 * - Set `sortable` on Table and individual Columns
 * - Implement your own sorting logic in `onSortingChange`
 * - Works with both client-side and server-side sorting
 */
export const Sortable: Story = {
  render: function SortableStory() {
    const rawUsers = useMemo(() => generateUsers(20), [])
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([])

    const users = useMemo(() => {
      if (sorting.length === 0) return rawUsers
      const { id, desc } = sorting[0]
      return [...rawUsers].sort((a, b) => {
        const aVal = String(a[id as keyof User] ?? "")
        const bVal = String(b[id as keyof User] ?? "")
        return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      })
    }, [rawUsers, sorting])

    return (
      <div className="flex flex-col gap-4">
        <Label>
          Sort:{" "}
          {sorting.length > 0 ? `${sorting[0].id} (${sorting[0].desc ? "desc" : "asc"})` : "None"}
        </Label>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          sortable
          sorting={sorting}
          onSortingChange={setSorting}
          height={400}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="name"
              width={150}
              flex={1}
              sortable
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={2}
              sortable
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={120}
              sortable
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="department"
              width={150}
              sortable
            >
              <Table.Value>Department</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="department">
                  <Table.Value>{user.department}</Table.Value>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

/**
 * Resizable and reorderable columns.
 *
 * **Key Features:**
 * - Drag column edges to resize (guide line shows during drag)
 * - Hold column header 300ms then drag to reorder
 * - Ghost column follows mouse during reorder
 * - Drop indicator shows target position
 *
 * **Usage Tips:**
 * - Set `resizable` and/or `reorderable` on Table
 * - Use `minWidth` and `maxWidth` to constrain resize
 * - Control state with `columnWidths` and `columnOrder` props
 */
export const ResizableAndReorderable: Story = {
  render: function ResizableAndReorderableStory() {
    const users = useMemo(() => generateUsers(20), [])
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
    const [columnOrder, setColumnOrder] = useState(["name", "email", "role", "department"])

    return (
      <div className="flex flex-col gap-4">
        <div className="text-secondary-foreground text-sm">Order: {columnOrder.join(" → ")}</div>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          resizable
          reorderable
          columnWidths={columnWidths}
          onColumnWidthsChange={setColumnWidths}
          columnOrder={columnOrder}
          onColumnOrderChange={setColumnOrder}
          height={400}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="name"
              width={180}
              minWidth={100}
              maxWidth={300}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              width={220}
              minWidth={150}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={120}
              minWidth={80}
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="department"
              width={150}
              minWidth={100}
            >
              <Table.Value>Department</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="department">
                  <Table.Value>{user.department}</Table.Value>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

/**
 * Virtualized table for large datasets.
 *
 * **Key Features:**
 * - Efficiently renders 10,000+ rows
 * - Only visible rows are rendered in DOM
 * - Smooth scrolling with configurable overscan
 * - Fixed row height for optimal performance
 *
 * **Usage Tips:**
 * - Set `virtualized={true}` (default) for large datasets
 * - Use `rowHeight` prop for fixed row height (default: 32px)
 * - Adjust `overscan` for scroll smoothness (default: 5)
 */
export const Virtualized: Story = {
  render: function VirtualizedStory() {
    const users = useMemo(() => generateUsers(10000), [])
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

    return (
      <div className="flex flex-col gap-4">
        <Label>
          Total: {users.length.toLocaleString()} rows | Selected: {selectedKeys.length}
        </Label>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          selectable
          virtualized
          rowHeight={32}
          overscan={10}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          height={500}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="id"
              width={100}
            >
              <Table.Value>ID</Table.Value>
            </Table.Column>
            <Table.Column
              id="name"
              width={180}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={1}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={120}
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="id">
                  <Table.Value>{user.id}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="status">
                  <StatusBadge status={user.status} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  },
}

/**
 * Infinite scroll with server-side data loading simulation.
 *
 * **Key Features:**
 * - Loads 100 rows at a time when scrolling near bottom
 * - Loading indicator at bottom during fetch
 * - Simulates 500ms server delay
 * - Stops loading when no more data (max 1000 rows)
 *
 * **Usage Tips:**
 * - Use `onScroll` callback to monitor scroll position
 * - Show loading state at bottom while fetching
 * - Implement proper error handling and retry logic
 * - Consider using `useInfiniteQuery` from TanStack Query
 */
export const InfiniteScroll: Story = {
  render: function InfiniteScrollStory() {
    const [users, setUsers] = useState<User[]>(() => generateUsers(100))
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const loadingRef = useRef(false)

    const loadMore = useCallback(async () => {
      if (loadingRef.current || !hasMore) return
      loadingRef.current = true
      setIsLoading(true)

      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers((prev) => {
        const newUsers = generateUsers(100, prev.length)
        const combined = [...prev, ...newUsers]
        // Stop at 1000 rows for demo
        if (combined.length >= 1000) {
          setHasMore(false)
        }
        return combined
      })

      setIsLoading(false)
      loadingRef.current = false
    }, [hasMore])

    // Handle scroll to detect near-bottom for infinite loading
    const handleScroll = useCallback(
      ({
        scrollTop,
        scrollHeight,
        clientHeight,
      }: {
        scrollTop: number
        scrollHeight: number
        clientHeight: number
      }) => {
        // Load more when 200px from bottom
        if (scrollHeight - scrollTop - clientHeight < 200) {
          loadMore()
        }
      },
      [loadMore],
    )

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Label>Loaded: {users.length} rows</Label>
          {hasMore && (
            <span className="text-secondary-foreground text-sm">Scroll down to load more...</span>
          )}
          {!hasMore && <span className="text-success-foreground text-sm">All data loaded!</span>}
        </div>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          selectable
          virtualized
          height={500}
          onScroll={handleScroll}
          className="rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="id"
              width={100}
            >
              <Table.Value>ID</Table.Value>
            </Table.Column>
            <Table.Column
              id="name"
              width={180}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={1}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="department"
              width={150}
            >
              <Table.Value>Department</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="id">
                  <Table.Value>{user.id}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="department">
                  <Table.Value>{user.department}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="status">
                  <StatusBadge status={user.status} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          {isLoading && (
            <Table.Footer className="flex items-center justify-center gap-2">
              <LoaderCircle className="text-secondary-foreground animate-spin" />
              <span className="text-secondary-foreground">Loading more...</span>
            </Table.Footer>
          )}
        </Table>
      </div>
    )
  },
}

/**
 * Rich cell content with custom components.
 *
 * **Key Features:**
 * - Avatar with user info in single cell
 * - Badge components for tags
 * - Custom row height for complex content
 *
 * **Usage Tips:**
 * - Use `rowHeight` prop when cells have taller content
 * - Wrap text content in `Table.Value` for truncation
 * - Complex content doesn't need `Table.Value` wrapper
 */
export const RichContent: Story = {
  render: function RichContentStory() {
    const users = useMemo(() => generateUsers(30), [])

    return (
      <Table
        data={users}
        getRowKey={(user) => user.id}
        selectable
        height={450}
        rowHeight={56}
        className="w-full rounded-lg border"
      >
        <Table.Header>
          <Table.Column
            id="user"
            width={280}
            flex={1}
          >
            <Table.Value>User</Table.Value>
          </Table.Column>
          <Table.Column
            id="role"
            width={120}
          >
            <Table.Value>Role</Table.Value>
          </Table.Column>
          <Table.Column
            id="department"
            width={150}
          >
            <Table.Value>Department</Table.Value>
          </Table.Column>
          <Table.Column
            id="status"
            width={100}
          >
            <Table.Value>Status</Table.Value>
          </Table.Column>
        </Table.Header>
        <Table.Body<User>>
          {(user, index) => (
            <Table.Row
              rowKey={user.id}
              index={index}
            >
              <Table.Cell
                columnId="user"
                className="flex items-center gap-3"
              >
                <Avatar
                  name={user.name}
                  size={32}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-secondary-foreground truncate text-xs">{user.email}</span>
                </div>
              </Table.Cell>
              <Table.Cell columnId="role">
                <Badge variant="default">{user.role}</Badge>
              </Table.Cell>
              <Table.Cell columnId="department">
                <Table.Value>{user.department}</Table.Value>
              </Table.Cell>
              <Table.Cell columnId="status">
                <StatusBadge status={user.status} />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  },
}

/**
 * Empty and loading states using Table.Empty.
 *
 * **Key Features:**
 * - `Table.Empty` component for custom empty/loading content
 * - Replaces `Table.Body` when showing states
 * - Full customization of empty state UI
 *
 * **Usage Tips:**
 * - Use conditional rendering: `{isLoading ? <Table.Empty>...</Table.Empty> : <Table.Body>...</Table.Body>}`
 * - Add call-to-action buttons in empty state
 * - Show spinner or skeleton in loading state
 */
export const EmptyAndLoading: Story = {
  render: function EmptyAndLoadingStory() {
    const users = useMemo(() => generateUsers(10), [])
    const [state, setState] = useState<"loading" | "empty" | "data">("loading")

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            variant={state === "loading" ? "primary" : "secondary"}
            onClick={() => setState("loading")}
          >
            Loading
          </Button>
          <Button
            variant={state === "empty" ? "primary" : "secondary"}
            onClick={() => setState("empty")}
          >
            Empty
          </Button>
          <Button
            variant={state === "data" ? "primary" : "secondary"}
            onClick={() => setState("data")}
          >
            Data
          </Button>
        </div>
        <Table
          data={state === "data" ? users : []}
          getRowKey={(user) => user.id}
          height={350}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="name"
              width={180}
              flex={1}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={2}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          {state === "loading" ? (
            <Table.Empty>
              <div className="flex flex-col items-center gap-3">
                <LoaderCircle className="text-secondary-foreground size-8 animate-spin" />
                <span className="text-secondary-foreground">Loading data...</span>
              </div>
            </Table.Empty>
          ) : state === "empty" ? (
            <Table.Empty>
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-secondary-foreground text-sm">
                    Get started by adding your first user.
                  </p>
                </div>
                <Button variant="primary">Add User</Button>
              </div>
            </Table.Empty>
          ) : (
            <Table.Body<User>>
              {(user, index) => (
                <Table.Row
                  rowKey={user.id}
                  index={index}
                >
                  <Table.Cell columnId="name">
                    <Table.Value>{user.name}</Table.Value>
                  </Table.Cell>
                  <Table.Cell columnId="email">
                    <Table.Value>{user.email}</Table.Value>
                  </Table.Cell>
                  <Table.Cell columnId="status">
                    <StatusBadge status={user.status} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          )}
        </Table>
      </div>
    )
  },
}

/**
 * Window scroll mode for full-page layouts.
 *
 * **Key Features:**
 * - Table scrolls with browser window
 * - No internal scroll container
 * - Header stays visible when sticky positioned
 *
 * **Usage Tips:**
 * - Set `scrollMode="window"` to use window scrolling
 * - Best for full-page table layouts
 * - Open in standalone window for best experience
 */
export const WindowScroll: Story = {
  render: function WindowScrollStory() {
    const openInNewWindow = () => {
      window.open("/story/data-display/table/WindowScrollDemo", "_blank", "width=1200,height=800")
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-secondary-foreground text-center">
          This component uses window scroll. Open in a standalone window for best experience.
        </p>
        <Button onClick={openInNewWindow}>Open in New Window</Button>
      </div>
    )
  },
}

/**
 * [TEST] WindowScrollDemo - Standalone window demo, not shown in docs.
 */
export const WindowScrollDemo: Story = {
  render: function WindowScrollDemoStory() {
    const users = useMemo(() => generateUsers(500), [])
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

    return (
      <Table
        data={users}
        getRowKey={(user) => user.id}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        scrollMode="window"
        virtualized
        className="w-full"
      >
        <Table.Header>
          <Table.Column
            id="name"
            width={180}
          >
            <Table.Value>Name</Table.Value>
          </Table.Column>
          <Table.Column
            id="email"
            flex={1}
          >
            <Table.Value>Email</Table.Value>
          </Table.Column>
          <Table.Column
            id="department"
            width={150}
          >
            <Table.Value>Department</Table.Value>
          </Table.Column>
          <Table.Column
            id="status"
            width={100}
          >
            <Table.Value>Status</Table.Value>
          </Table.Column>
        </Table.Header>
        <Table.Body<User>>
          {(user, index) => (
            <Table.Row
              rowKey={user.id}
              index={index}
            >
              <Table.Cell columnId="name">
                <Table.Value>{user.name}</Table.Value>
              </Table.Cell>
              <Table.Cell columnId="email">
                <Table.Value>{user.email}</Table.Value>
              </Table.Cell>
              <Table.Cell columnId="department">
                <Table.Value>{user.department}</Table.Value>
              </Table.Cell>
              <Table.Cell columnId="status">
                <StatusBadge status={user.status} />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    )
  },
}

/**
 * Selected vs Active row states.
 *
 * **Key Features:**
 * - **Selected** (solid bg): Rows chosen via checkbox, persists
 * - **Active** (lighter bg): Current focus row, single row only
 * - Keyboard navigation with arrow keys
 *
 * **Usage Tips:**
 * - Use `activeRowKey` for keyboard navigation focus
 * - Use `selectedKeys` for user's selection choices
 * - Press Enter/Space to toggle selection on active row
 */
export const SelectedVsActive: Story = {
  render: function SelectedVsActiveStory() {
    const users = useMemo(() => generateUsers(10), [])
    const [selectedKeys, setSelectedKeys] = useState<string[]>(["user-2", "user-3"])
    const [activeRowKey, setActiveRowKey] = useState<string | null>("user-5")

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const currentIndex = users.findIndex((u) => u.id === activeRowKey)

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveRowKey(users[Math.min(currentIndex + 1, users.length - 1)].id)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveRowKey(users[Math.max(currentIndex - 1, 0)].id)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (activeRowKey) {
          setSelectedKeys((prev) =>
            prev.includes(activeRowKey)
              ? prev.filter((k) => k !== activeRowKey)
              : [...prev, activeRowKey],
          )
        }
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-selected-background size-4 rounded" />
            <span>Selected (checkbox checked)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-selected-background/70 size-4 rounded" />
            <span>Active (keyboard focus)</span>
          </div>
        </div>
        <div className="text-secondary-foreground text-sm">
          <p>Selected: {selectedKeys.join(", ") || "None"}</p>
          <p>Active: {activeRowKey || "None"}</p>
          <p className="mt-1 text-xs">↑↓ to move focus, Enter/Space to toggle selection</p>
        </div>
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="focus:ring-accent-background rounded-lg outline-none focus:ring-2"
        >
          <Table<User>
            data={users}
            getRowKey={(user) => user.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(keys as string[])}
            activeRowKey={activeRowKey}
            onRowClick={(user) => setActiveRowKey(user.id)}
            className="rounded-lg border"
          >
            <Table.Header>
              <Table.Column
                id="id"
                width={100}
              >
                <Table.Value>ID</Table.Value>
              </Table.Column>
              <Table.Column
                id="name"
                width={180}
              >
                <Table.Value>Name</Table.Value>
              </Table.Column>
              <Table.Column
                id="email"
                flex={1}
              >
                <Table.Value>Email</Table.Value>
              </Table.Column>
              <Table.Column
                id="status"
                width={100}
              >
                <Table.Value>Status</Table.Value>
              </Table.Column>
            </Table.Header>
            <Table.Body<User>>
              {(user, index) => (
                <Table.Row
                  rowKey={user.id}
                  index={index}
                >
                  <Table.Cell columnId="id">
                    <Table.Value>{user.id}</Table.Value>
                  </Table.Cell>
                  <Table.Cell columnId="name">
                    <Table.Value>{user.name}</Table.Value>
                  </Table.Cell>
                  <Table.Cell columnId="email">
                    <Table.Value>{user.email}</Table.Value>
                  </Table.Cell>
                  <Table.Cell columnId="status">
                    <StatusBadge status={user.status} />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  },
}

/**
 * Interactive playground for testing configurations.
 *
 * **Key Features:**
 * - Toggle row count, selection mode, virtualization
 * - Live configuration changes
 * - Performance testing with large datasets
 *
 * **Usage Tips:**
 * - Test different configurations to find optimal settings
 * - Compare performance with/without virtualization
 * - Try different selection modes
 */
export const Playground: Story = {
  render: function PlaygroundStory() {
    const [rowCount, setRowCount] = useState("100")
    const [selectionMode, setSelectionMode] = useState<"none" | "single" | "multiple">("multiple")
    const [virtualized, setVirtualized] = useState(true)
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])

    const users = useMemo(() => generateUsers(Number(rowCount)), [rowCount])

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Rows:</Label>
            <Select
              value={rowCount}
              onChange={setRowCount}
            >
              <Select.Trigger className="w-28">
                <Select.Value>{rowCount}</Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="10">10</Select.Item>
                <Select.Item value="100">100</Select.Item>
                <Select.Item value="1000">1,000</Select.Item>
                <Select.Item value="10000">10,000</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Selection:</Label>
            <Select
              value={selectionMode}
              onChange={(v) => setSelectionMode(v as typeof selectionMode)}
            >
              <Select.Trigger className="w-28">
                <Select.Value>{selectionMode}</Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">None</Select.Item>
                <Select.Item value="single">Single</Select.Item>
                <Select.Item value="multiple">Multiple</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Checkbox
            value={virtualized}
            onChange={setVirtualized}
          >
            Virtualized
          </Checkbox>
          {selectionMode !== "none" && (
            <span className="text-secondary-foreground text-sm">
              Selected: {selectedKeys.length}
            </span>
          )}
        </div>
        <Table
          data={users}
          getRowKey={(user) => user.id}
          selectable={selectionMode !== "none"}
          selectionMode={selectionMode === "none" ? "multiple" : selectionMode}
          virtualized={virtualized}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          height={400}
          className="w-full rounded-lg border"
        >
          <Table.Header>
            <Table.Column
              id="id"
              width={100}
            >
              <Table.Value>ID</Table.Value>
            </Table.Column>
            <Table.Column
              id="name"
              width={180}
            >
              <Table.Value>Name</Table.Value>
            </Table.Column>
            <Table.Column
              id="email"
              flex={1}
            >
              <Table.Value>Email</Table.Value>
            </Table.Column>
            <Table.Column
              id="role"
              width={120}
            >
              <Table.Value>Role</Table.Value>
            </Table.Column>
            <Table.Column
              id="status"
              width={100}
            >
              <Table.Value>Status</Table.Value>
            </Table.Column>
          </Table.Header>
          <Table.Body<User>>
            {(user, index) => (
              <Table.Row
                rowKey={user.id}
                index={index}
              >
                <Table.Cell columnId="id">
                  <Table.Value>{user.id}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="name">
                  <Table.Value>{user.name}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="email">
                  <Table.Value>{user.email}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="role">
                  <Table.Value>{user.role}</Table.Value>
                </Table.Cell>
                <Table.Cell columnId="status">
                  <StatusBadge status={user.status} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  },
}
