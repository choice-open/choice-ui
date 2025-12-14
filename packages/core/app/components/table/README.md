# Table

A high-performance table component with virtualization, row selection, column sorting, column resizing, and column reordering capabilities. Perfect for displaying large datasets.

## Import

```tsx
import { Table } from "@choice-ui/react"
```

## Features

- **Virtualized Rendering**: High-performance rendering using @tanstack/react-virtual, supports large datasets
- **Row Selection**: Supports single and multiple selection modes with checkboxes
- **Column Sorting**: Supports single and multi-column sorting
- **Column Resizing**: Drag to resize column widths
- **Column Reordering**: Drag to reorder columns
- **Scroll Modes**: Supports both container scroll and window scroll modes
- **Consecutive Selection Styles**: Automatically handles rounded corners for consecutively selected rows
- **Flexible Layout**: Supports fixed width, min/max width, and flex layout

## Usage

### Basic Usage

```tsx
interface User {
  id: string
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
]

function BasicTable() {
  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      height={400}
    >
      <Table.Header>
        <Table.Column
          id="name"
          width={200}
        >
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column id="email">
          <Table.Value>Email</Table.Value>
        </Table.Column>
        <Table.Column
          id="role"
          width={150}
        >
          <Table.Value>Role</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### With Selection

```tsx
function SelectableTable() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      selectable
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      height={400}
    >
      <Table.Header>
        <Table.Column
          id="name"
          width={200}
        >
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column id="email">
          <Table.Value>Email</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### With Sorting

```tsx
function SortableTable() {
  const [sorting, setSorting] = useState<SortingState[]>([])

  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      sortable
      sorting={sorting}
      onSortingChange={setSorting}
      height={400}
    >
      <Table.Header>
        <Table.Column
          id="name"
          width={200}
          sortable
        >
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column
          id="email"
          sortable
        >
          <Table.Value>Email</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### With Column Resizing

```tsx
function ResizableTable() {
  const [columnWidths, setColumnWidths] = useState<ColumnWidthState>({
    name: 200,
    email: 300,
  })

  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      resizable
      columnWidths={columnWidths}
      onColumnWidthsChange={setColumnWidths}
      height={400}
    >
      <Table.Header>
        <Table.Column
          id="name"
          width={200}
          resizable
        >
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column
          id="email"
          width={300}
          resizable
        >
          <Table.Value>Email</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### Window Scroll Mode

```tsx
function WindowScrollTable() {
  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      scrollMode="window"
      virtualized
    >
      <Table.Header>
        <Table.Column id="name">
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column id="email">
          <Table.Value>Email</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### Custom Scroll Container

```tsx
function CustomScrollTable() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollArea className="h-96">
      <ScrollArea.Viewport ref={scrollRef}>
        <ScrollArea.Content ref={containerRef}>
          <Table
            data={users}
            getRowKey={(user) => user.id}
            scrollRef={scrollRef}
            containerRef={containerRef}
          >
            <Table.Header>
              <Table.Column id="name">
                <Table.Value>Name</Table.Value>
              </Table.Column>
              <Table.Column id="email">
                <Table.Value>Email</Table.Value>
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
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  )
}
```

### Empty State

```tsx
function TableWithEmpty() {
  const users: User[] = []

  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      height={400}
    >
      <Table.Header>
        <Table.Column id="name">
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column id="email">
          <Table.Value>Email</Table.Value>
        </Table.Column>
      </Table.Header>
      {users.length === 0 ? (
        <Table.Empty>
          <div className="py-8 text-center text-gray-500">No data available</div>
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
            </Table.Row>
          )}
        </Table.Body>
      )}
    </Table>
  )
}
```

### With Footer

```tsx
function TableWithFooter() {
  const [loading, setLoading] = useState(false)

  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      height={400}
      onScroll={(event) => {
        // Load more when near bottom
        if (event.scrollHeight - event.scrollTop - event.clientHeight < 100) {
          setLoading(true)
          // Load more data...
        }
      }}
    >
      <Table.Header>
        <Table.Column id="name">
          <Table.Value>Name</Table.Value>
        </Table.Column>
        <Table.Column id="email">
          <Table.Value>Email</Table.Value>
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
          </Table.Row>
        )}
      </Table.Body>
      {loading && (
        <Table.Footer>
          <div className="py-4 text-center">Loading more...</div>
        </Table.Footer>
      )}
    </Table>
  )
}
```

### Rich Content

Complex content like badges, avatars, or custom components can be placed directly in `Table.Cell` without `Table.Value`:

```tsx
import { Avatar, Badge } from "@choice-ui/react"

function RichContentTable() {
  return (
    <Table
      data={users}
      getRowKey={(user) => user.id}
      height={400}
      rowHeight={56}
    >
      <Table.Header>
        <Table.Column
          id="user"
          width={280}
        >
          <Table.Value>User</Table.Value>
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
            <Table.Cell columnId="status">
              <Badge variant="success">{user.status}</Badge>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
```

### Table Instance API

```tsx
function TableWithInstance() {
  const tableRef = useRef<TableInstance<User> | null>(null)

  const handleSelectAll = () => {
    tableRef.current?.selectAll()
  }

  const handleGetSelected = () => {
    const selectedRows = tableRef.current?.getSelectedRows()
    console.log("Selected rows:", selectedRows)
  }

  return (
    <>
      <div>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleGetSelected}>Get Selected</button>
      </div>
      <Table
        data={users}
        getRowKey={(user) => user.id}
        selectable
        tableRef={tableRef}
        height={400}
      >
        <Table.Header>
          <Table.Column id="name">
            <Table.Value>Name</Table.Value>
          </Table.Column>
          <Table.Column id="email">
            <Table.Value>Email</Table.Value>
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
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  )
}
```

## Props

### Table Props

```ts
interface TableProps<T> {
  /** Table data */
  data: T[]
  /** Function to get unique key for each row */
  getRowKey: (row: T, index: number) => RowKey
  /** Whether to show selection column */
  selectable?: boolean
  /** Selection mode */
  selectionMode?: "single" | "multiple" | "none"
  /** Controlled selected keys */
  selectedKeys?: RowKey[]
  /** Default selected keys (uncontrolled) */
  defaultSelectedKeys?: RowKey[]
  /** Selection change callback */
  onSelectionChange?: (selectedKeys: RowKey[]) => void
  /** Whether to enable virtualization */
  virtualized?: boolean
  /** Fixed row height in pixels for virtualization */
  rowHeight?: number
  /** Number of rows to render outside viewport */
  overscan?: number
  /** Scroll mode */
  scrollMode?: "container" | "window"
  /** Custom scroll element ref (for custom container scroll) */
  scrollRef?: RefObject<HTMLElement>
  /** Custom container ref (for custom container scroll) */
  containerRef?: RefObject<HTMLElement>
  /** Whether table is sortable */
  sortable?: boolean
  /** Controlled sorting state */
  sorting?: SortingState[]
  /** Default sorting state */
  defaultSorting?: SortingState[]
  /** Sorting change callback */
  onSortingChange?: (sorting: SortingState[]) => void
  /** Whether columns are resizable */
  resizable?: boolean
  /** Controlled column widths */
  columnWidths?: ColumnWidthState
  /** Default column widths */
  defaultColumnWidths?: ColumnWidthState
  /** Column width change callback */
  onColumnWidthsChange?: (widths: ColumnWidthState) => void
  /** Whether columns are reorderable */
  reorderable?: boolean
  /** Controlled column order */
  columnOrder?: ColumnOrderState
  /** Default column order */
  defaultColumnOrder?: ColumnOrderState
  /** Column order change callback */
  onColumnOrderChange?: (order: ColumnOrderState) => void
  /** Active row key (for highlighting) */
  activeRowKey?: RowKey | null
  /** Row click handler */
  onRowClick?: (row: T, event: React.MouseEvent) => void
  /** Custom class name */
  className?: string
  /** Container height (for container scroll mode) */
  height?: number | string
  /** Scroll event callback */
  onScroll?: (event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void
  /** Ref to table instance */
  tableRef?: RefObject<TableInstance<T> | null>
  /** Children (Table.Header, Table.Body) */
  children: ReactNode
}
```

### Table.Header Props

```ts
interface TableHeaderProps {
  children: ReactNode
  className?: string
}
```

### Table.Column Props

```ts
interface TableColumnProps {
  /** Unique column identifier */
  id: string
  /** Column header content */
  children?: ReactNode
  /** Column width */
  width?: number | string
  /** Minimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Flex grow value for flexible column width */
  flex?: number
  /** Whether sortable */
  sortable?: boolean
  /** Whether resizable (overrides table-level setting) */
  resizable?: boolean
  /** Header className */
  className?: string
}
```

### Table.Body Props

```ts
interface TableBodyProps<T> {
  /** Render function for each row */
  children: (row: T, index: number) => ReactNode
  /** Body className */
  className?: string
  /** Body class names */
  classNames?: {
    viewport?: string
  }
}
```

### Table.Row Props

```ts
interface TableRowProps {
  /** Row key (must match getRowKey result) */
  rowKey: RowKey
  /** Row index */
  index: number
  /** Children (Table.Cell elements) */
  children: ReactNode
  /** Row className */
  className?: string
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void
}
```

### Table.Cell Props

```ts
interface TableCellProps {
  /** Cell content */
  children: ReactNode
  /** Column id this cell belongs to */
  columnId?: string
  /** Cell className */
  className?: string
}
```

### Table.Value Props

```ts
interface TableValueProps {
  /** Value content */
  children?: ReactNode
  /** Value className */
  className?: string
}
```

### Table.Empty Props

```ts
interface TableEmptyProps {
  /** Empty state content */
  children: ReactNode
  /** Empty state className */
  className?: string
}
```

### Table.Footer Props

```ts
interface TableFooterProps {
  /** Footer content */
  children: ReactNode
  /** Footer className */
  className?: string
}
```

## Table Instance API

```ts
interface TableInstance<T> {
  /** Get all rows data */
  getData: () => T[]
  /** Get selected row keys */
  getSelectedKeys: () => RowKey[]
  /** Get selected rows data */
  getSelectedRows: () => T[]
  /** Check if row is selected */
  isRowSelected: (key: RowKey) => boolean
  /** Select row */
  selectRow: (key: RowKey) => void
  /** Deselect row */
  deselectRow: (key: RowKey) => void
  /** Toggle row selection */
  toggleRowSelection: (key: RowKey) => void
  /** Select all rows */
  selectAll: () => void
  /** Deselect all rows */
  deselectAll: () => void
  /** Check if all rows are selected */
  isAllSelected: () => boolean
  /** Check if some (but not all) rows are selected */
  isSomeSelected: () => boolean
}
```

## Component Structure

The Table component uses a compound component pattern, consisting of the following sub-components:

- `Table`: Root component that manages table state
- `Table.Header`: Header container
- `Table.Column`: Column definition used in header
- `Table.Body`: Body container with virtualization support
- `Table.Row`: Table row
- `Table.Cell`: Table cell
- `Table.Value`: Value wrapper for text content (provides truncation and styling)
- `Table.Empty`: Empty state
- `Table.Footer`: Footer (for loading indicators, etc.)

## Performance Considerations

### Virtualization

- Virtualization is enabled by default, only rendering visible rows and overscan buffer
- Use fixed row height (`rowHeight`) for optimal performance
- Adjust `overscan` value to balance scroll smoothness and memory usage

### Large Datasets

- For very large datasets (10,000+ rows), virtualization is recommended
- Use a stable `getRowKey` function
- Avoid expensive calculations in render functions

### Column Operations

- Column resizing and reordering use direct DOM manipulation to avoid unnecessary re-renders
- Header scroll synchronization uses transform for performance optimization

## Best Practices

- Always provide a stable `getRowKey` function
- Enable virtualization for large datasets
- Use controlled state to manage selection, sorting, etc.
- Set appropriate column widths to avoid content overflow
- Use `Table.Empty` to provide a friendly empty state
- For infinite scrolling, use `onScroll` callback to load more data
- Wrap text content in `Table.Value` for proper truncation and styling
- Use `Table.Body<User>` with type parameter for better TypeScript support
- Complex content (Badge, Avatar, etc.) can be placed directly in `Table.Cell` without `Table.Value`

## Accessibility

- Keyboard navigation support
- Proper ARIA attributes
- Screen reader compatible
- Focus management

## Browser Support

- Modern browsers (with Intersection Observer support)
- Mobile touch scrolling optimization
- High DPI display support
