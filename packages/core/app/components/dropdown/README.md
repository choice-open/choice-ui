# Dropdown

A comprehensive dropdown menu component with advanced features including nested submenus, keyboard navigation, and coordinate positioning. Built with FloatingUI for precise positioning and full accessibility support.

## Import

```tsx
import { Dropdown } from "@choice-ui/react"
```

## Features

- Unlimited nested submenu levels with hover and click interactions
- Keyboard navigation with arrow keys, Enter/Space, and type-ahead search
- Coordinate positioning mode for context menus and precise placement
- Touch-friendly with mobile device support
- Flexible trigger matching width option
- Portal-based rendering with customizable portal ID
- Tree-based menu management for complex hierarchies
- Integration with Menu components for consistent styling and behavior
- Screen reader friendly with proper ARIA attributes

## Usage

### Basic Dropdown

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <button>Open Menu</button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Item>Menu Item 1</Dropdown.Item>
    <Dropdown.Item>Menu Item 2</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item>Menu Item 3</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

### Controlled Dropdown

```tsx
const [isOpen, setIsOpen] = useState(false)

<Dropdown open={isOpen} onOpenChange={setIsOpen}>
  <Dropdown.Trigger>
    <button>Controlled Menu</button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Item onClick={() => setIsOpen(false)}>
      Close Menu
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

### With Search and Labels

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <button>Searchable Menu</button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Search placeholder="Search items..." />

    <Dropdown.Label>Recent Items</Dropdown.Label>
    <Dropdown.Item>Recent Item 1</Dropdown.Item>
    <Dropdown.Item>Recent Item 2</Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Label>All Items</Dropdown.Label>
    <Dropdown.Item>Item A</Dropdown.Item>
    <Dropdown.Item>Item B</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

### Nested Submenus

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <button>Menu with Submenus</button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Item>Regular Item</Dropdown.Item>

    <Dropdown>
      <Dropdown.SubTrigger>Submenu 1</Dropdown.SubTrigger>
      <Dropdown.Content>
        <Dropdown.Item>Submenu Item 1</Dropdown.Item>
        <Dropdown.Item>Submenu Item 2</Dropdown.Item>

        <Dropdown>
          <Dropdown.SubTrigger>Nested Submenu</Dropdown.SubTrigger>
          <Dropdown.Content>
            <Dropdown.Item>Deep Item 1</Dropdown.Item>
            <Dropdown.Item>Deep Item 2</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </Dropdown.Content>
    </Dropdown>
  </Dropdown.Content>
</Dropdown>
```

### Coordinate Mode (Context Menu)

Coordinate mode allows you to position the dropdown at specific x/y coordinates without a trigger element. Perfect for context menus, mentions, and custom positioning scenarios.

```tsx
const [isOpen, setIsOpen] = useState(false)
const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

const handleClick = (event: React.MouseEvent) => {
  setPosition({
    x: event.clientX,
    y: event.clientY,
  })
  setIsOpen(true)
}

;<div
  className="h-64 rounded-lg border border-dashed bg-gray-100 p-4"
  onMouseDown={handleClick}
>
  Click anywhere to show dropdown at mouse position
</div>

{
  /* Dropdown in coordinate mode - no trigger needed */
}
;<Dropdown
  position={position}
  open={isOpen}
  onOpenChange={setIsOpen}
  placement="bottom-start"
  autoSelectFirstItem={true}
>
  <Dropdown.Content>
    <Dropdown.Label>Context Menu</Dropdown.Label>
    <Dropdown.Item>Cut</Dropdown.Item>
    <Dropdown.Item>Copy</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item>Paste</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item variant="danger">Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

### Right-Click Context Menu

```tsx
const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null)

<div
  onContextMenu={(e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }}
  className="p-8 bg-gray-50 rounded-lg"
>
  Right-click me for context menu
</div>

<Dropdown
  position={contextMenu}
  open={contextMenu !== null}
  onOpenChange={(open) => !open && setContextMenu(null)}
>
  <Dropdown.Content>
    <Dropdown.Item>
      <FileIcon />
      Open
    </Dropdown.Item>
    <Dropdown.Item>
      <EditIcon />
      Rename
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item variant="danger">
      <DeleteIcon />
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

### Mentions with Text Editor

```tsx
import { createEditor, Descendant } from "slate"
import { Slate, Editable, withReact } from "slate-react"

const [isOpen, setIsOpen] = useState(false)
const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
const editor = useMemo(() => withReact(createEditor()), [])

const users = [
  { id: "1", name: "John Doe", avatar: "..." },
  { id: "2", name: "Jane Smith", avatar: "..." },
]

const handleChange = (value: Descendant[]) => {
  const text = value.map((n) => Node.string(n)).join("\n")
  const lastAtIndex = text.lastIndexOf("@")

  if (lastAtIndex !== -1) {
    const afterAt = text.substring(lastAtIndex + 1)
    const hasSpace = afterAt.includes(" ")

    if (!hasSpace) {
      // Get caret position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          x: rect.left,
          y: rect.bottom + 4,
        })
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  } else {
    setIsOpen(false)
  }
}

const handleSelectUser = (user) => {
  // Insert mention logic here
  setIsOpen(false)
}

;<>
  <Slate
    editor={editor}
    onChange={handleChange}
  >
    <Editable placeholder="Type @ to mention someone..." />
  </Slate>

  <Dropdown
    position={position}
    open={isOpen}
    onOpenChange={setIsOpen}
  >
    <Dropdown.Content>
      <Dropdown.Label>Mention User</Dropdown.Label>
      {users.map((user) => (
        <Dropdown.Item
          key={user.id}
          onClick={() => handleSelectUser(user)}
        >
          <img
            src={user.avatar}
            className="h-4 w-4 rounded-full"
          />
          <Dropdown.Value>{user.name}</Dropdown.Value>
        </Dropdown.Item>
      ))}
    </Dropdown.Content>
  </Dropdown>
</>
```

### Match Trigger Width

```tsx
<Dropdown matchTriggerWidth>
  <Dropdown.Trigger>
    <button className="w-48">Wide Trigger Button</button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Item>Menu matches button width</Dropdown.Item>
    <Dropdown.Item>Useful for selects</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Props

```ts
interface DropdownProps {
  /** Auto-select first item in coordinate mode */
  autoSelectFirstItem?: boolean

  /** Whether to avoid collisions by flipping or shifting the dropdown position */
  avoidCollisions?: boolean

  /** Dropdown content and components */
  children?: React.ReactNode

  /** Disable nested submenu functionality */
  disabledNested?: boolean

  /** Focus manager configuration */
  focusManagerProps?: Partial<FloatingFocusManagerProps>

  /** Make dropdown width match trigger width */
  matchTriggerWidth?: boolean

  /** Offset distance from trigger */
  offset?: number

  /** Open state change callback */
  onOpenChange?: (open: boolean) => void

  /** Controlled open state */
  open?: boolean

  /** Placement relative to trigger */
  placement?: Placement

  /** Custom portal container ID */
  portalId?: string

  /** Coordinate position for context menu mode */
  position?: { x: number; y: number } | null

  /** Enable selection mode for items */
  selection?: boolean
}
```

- Defaults:
  - `autoSelectFirstItem`: `true`
  - `avoidCollisions`: `true`
  - `disabledNested`: `false`
  - `matchTriggerWidth`: `false`
  - `offset`: `4`
  - `placement`: `"bottom-start"`
  - `portalId`: `"floating-menu-root"`
  - `position`: `null`
  - `selection`: `false`
  - `focusManagerProps`: `{ returnFocus: false, modal: true }` (position mode: `{ disabled: true }`)

- Accessibility:
  - Full keyboard navigation with arrow keys
  - Type-ahead search functionality
  - Proper ARIA roles (`menu`, `menuitem`)
  - Screen reader announcements
  - Focus management and tab trapping
  - ESC key closes menus

## Compound Components

### Dropdown.Trigger

Renders the trigger element that opens the dropdown when clicked or activated.

### Dropdown.Content

Container for all dropdown menu items with scrolling and keyboard navigation.

### Dropdown.Item

Individual menu item that can be clicked or selected via keyboard.

### Dropdown.SubTrigger

Trigger for nested submenus, opens submenu on hover or click.

### Dropdown.Label

Non-interactive label for grouping menu items.

### Dropdown.Divider

Visual separator between menu sections.

### Dropdown.Search

Search input field for filtering menu items.

### Dropdown.Button

Button-style menu item for actions.

### Dropdown.Input

Input field within dropdown content.

### Dropdown.Value

Display component for showing selected values.

## Styling

- Uses shared Menu component styling system
- Supports custom CSS classes via `className` prop
- Portal rendering ensures proper z-index layering
- Touch-friendly sizing and spacing
- Hover and focus states with smooth transitions
- Data attributes for styling states:
  - `data-open`: Present when dropdown is open
  - `data-nested`: Present for nested submenus
  - `data-focus-inside`: Present when menu has focus

## Best Practices

- **Coordinate Mode**: Use for context menus, mentions, autocomplete, and custom positioning
- **Position Calculation**: Get accurate coordinates using `getBoundingClientRect()` for text cursors
- **Auto-Selection**: Enable `autoSelectFirstItem` in coordinate mode for better keyboard navigation
- **Context Menus**: Use `onContextMenu` event with `preventDefault()` for right-click menus
- **Mentions**: Track text changes and detect trigger characters (@ symbol) for mentions
- **Group Content**: Use labels and dividers to organize menu items logically
- **Search Integration**: Provide search functionality for long lists of items
- **Nested Menus**: Use nested submenus sparingly to avoid deep hierarchies
- **Width Matching**: Enable `matchTriggerWidth` for select-like dropdowns
- **Touch Support**: Consider touch targets on mobile devices (minimum 44px)
- **Selection Mode**: Use selection mode for checkable/radio-style items
- **Focus Management**: Let the component handle focus automatically in coordinate mode

## Examples

### File Context Menu

```tsx
const FileContextMenu = ({ x, y, onClose }) => (
  <Dropdown
    open={true}
    position={{ x, y }}
    onOpenChange={onClose}
  >
    <Dropdown.Content>
      <Dropdown.Item>
        <FileIcon />
        Open
      </Dropdown.Item>
      <Dropdown.Item>
        <EditIcon />
        Rename
      </Dropdown.Item>

      <Dropdown.Divider />

      <Dropdown>
        <Dropdown.SubTrigger>
          <ShareIcon />
          Share
        </Dropdown.SubTrigger>
        <Dropdown.Content>
          <Dropdown.Item>Copy Link</Dropdown.Item>
          <Dropdown.Item>Send Email</Dropdown.Item>
          <Dropdown.Item>Export</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      <Dropdown.Divider />

      <Dropdown.Item destructive>
        <DeleteIcon />
        Delete
      </Dropdown.Item>
    </Dropdown.Content>
  </Dropdown>
)
```

### Application Menu

```tsx
<Dropdown placement="bottom-end">
  <Dropdown.Trigger>
    <button>
      <MenuIcon />
      Menu
    </button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.Search placeholder="Search commands..." />

    <Dropdown.Label>File</Dropdown.Label>
    <Dropdown.Item>New File</Dropdown.Item>
    <Dropdown.Item>Open File</Dropdown.Item>
    <Dropdown.Item>Save</Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Label>Edit</Dropdown.Label>
    <Dropdown.Item>Undo</Dropdown.Item>
    <Dropdown.Item>Redo</Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Item>Settings</Dropdown.Item>
    <Dropdown.Item>Help</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Notes

- **Coordinate Mode Detection**: Dropdown automatically enters coordinate mode when `position` prop is provided
- **No Trigger Required**: In coordinate mode, no `Dropdown.Trigger` element is needed
- **Focus Management**: Coordinate mode automatically disables focus manager to prevent conflicts with text editors
- **Position Updates**: Update the `position` prop to reposition the dropdown dynamically
- **Placement Behavior**: `placement` prop still applies in coordinate mode for collision detection
- **Tree Architecture**: Tree-based architecture enables complex nested menu hierarchies
- **FloatingUI Integration**: FloatingUI provides collision detection and smart positioning
- **Touch Support**: Includes proper event handling for mobile devices
- **Search Integration**: Search functionality integrates with keyboard navigation
- **Portal Rendering**: Portal rendering prevents z-index issues with parent containers
- **Screen Readers**: Focus management works seamlessly with screen readers
- **Performance**: Virtual scrolling and efficient event handling for large menus
