# Popover

A versatile floating overlay component for displaying contextual content. Provides multiple positioning options, interaction modes, and advanced features like dragging and position memory.

## Import

```tsx
import { Popover } from "@choice-ui/react"
```

## Features

- Multiple positioning options with automatic adjustment
- Various interaction modes (click, hover, focus)
- Optional draggable behavior with position memory
- Controlled and uncontrolled usage
- Header component for titles or complex UI
- Support for nested interactive elements
- Outside press handling with customizable ignore zones
- Match trigger width option
- Configurable offset and escape key behavior

## Usage

### Basic Popover

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">This is a basic popover with some content.</Popover.Content>
</Popover>
```

### Default Open

```tsx
<Popover defaultOpen>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">This popover starts open by default.</Popover.Content>
</Popover>
```

### Custom Offset

```tsx
<Popover offset={16}>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Popover with larger spacing from trigger.</Popover.Content>
</Popover>
```

### Interaction Modes

```tsx
{
  /* Click (default) */
}
;<Popover>
  <Popover.Trigger>
    <Button>Click to open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Click interaction</Popover.Content>
</Popover>

{
  /* Hover */
}
;<Popover interactions="hover">
  <Popover.Trigger>
    <Button>Hover to open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Hover interaction</Popover.Content>
</Popover>

{
  /* Focus */
}
;<Popover interactions="focus">
  <Popover.Trigger>
    <Button>Focus to open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Focus interaction</Popover.Content>
</Popover>

{
  /* Manual control */
}
;<Popover
  interactions="none"
  open={manualOpen}
  onOpenChange={setManualOpen}
>
  <Popover.Trigger>
    <Button disabled>Manual trigger</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Manual control</Popover.Content>
</Popover>
```

### Controlled Usage

```tsx
const [open, setOpen] = useState(false)

return (
  <Popover
    open={open}
    onOpenChange={setOpen}
  >
    <Popover.Trigger>
      <Button active={open}>Click: {open ? "Close" : "Open"}</Button>
    </Popover.Trigger>
    <Popover.Content className="w-64 p-3">Controlled popover content</Popover.Content>
  </Popover>
)
```

### External Trigger Reference

```tsx
const [open, setOpen] = useState(false)
const triggerRef = useRef<HTMLButtonElement>(null)

return (
  <>
    <Button
      ref={triggerRef}
      active={open}
      onClick={() => setOpen(!open)}
    >
      {open ? "Close" : "Open"}
    </Button>

    <Popover
      triggerRef={triggerRef}
      open={open}
      onOpenChange={setOpen}
    >
      <Popover.Content className="w-64 p-3">External trigger content</Popover.Content>
    </Popover>
  </>
)
```

### Placement Options

```tsx
{/* All 12 placement options */}
<Popover placement="top">
  <Popover.Trigger><Button>Top</Button></Popover.Trigger>
  <Popover.Content className="w-64 p-3">Top placement</Popover.Content>
</Popover>

<Popover placement="top-start">
  <Popover.Trigger><Button>Top Start</Button></Popover.Trigger>
  <Popover.Content className="w-64 p-3">Top start placement</Popover.Content>
</Popover>

<Popover placement="top-end">
  <Popover.Trigger><Button>Top End</Button></Popover.Trigger>
  <Popover.Content className="w-64 p-3">Top end placement</Popover.Content>
</Popover>

{/* Similar for bottom, left, right with their start/end variants */}
```

### Draggable Popover

```tsx
<Popover
  draggable
  open={open}
  onOpenChange={setOpen}
>
  <Popover.Trigger>
    <Button active={open}>Draggable Popover</Button>
  </Popover.Trigger>
  <Popover.Header title="Drag Me" />
  <Popover.Content className="w-64 p-3">You can drag this popover by its header.</Popover.Content>
</Popover>
```

### Remember Position

```tsx
<Popover
  draggable
  rememberPosition
  open={open}
  onOpenChange={setOpen}
>
  <Popover.Trigger>
    <Button>Remember Position</Button>
  </Popover.Trigger>
  <Popover.Header title="Remember Position" />
  <Popover.Content className="w-64 p-3">
    This popover remembers its position when closed.
  </Popover.Content>
</Popover>
```

### Persist Position

Use `defaultPosition` and `onPositionChange` to persist the dragged position outside the component (e.g. localStorage). `defaultPosition` only seeds the position when the floating element mounts; afterwards dragging takes over (defaultValue-style, semi-controlled).

```tsx
const STORAGE_KEY = "panel-position"

function PersistentPanel() {
  const [open, setOpen] = useState(false)
  const savedPosition = useMemo(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as { x: number; y: number }) : undefined
  }, [open])

  return (
    <Popover
      draggable
      open={open}
      onOpenChange={setOpen}
      defaultPosition={savedPosition}
      onPositionChange={(position) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position))
      }}
    >
      <Popover.Trigger>
        <Button>Persistent Panel</Button>
      </Popover.Trigger>
      <Popover.Header title="Drag Me" />
      <Popover.Content className="w-64 p-3">
        Reopens where you last dragged it, even across page reloads.
      </Popover.Content>
    </Popover>
  )
}
```

### Outside Press Ignore

```tsx
{
  /* Ignore clicks on specific CSS class */
}
;<div className="outside-press-ignore">
  <Popover outsidePressIgnore="outside-press-ignore">
    <Popover.Trigger>
      <Button>Open</Button>
    </Popover.Trigger>
    <Popover.Content className="w-64 p-3">
      Clicks in the parent div won't close this popover.
    </Popover.Content>
  </Popover>
</div>

{
  /* Ignore clicks on multiple CSS classes */
}
;<Popover outsidePressIgnore={["class1", "class2"]}>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Multiple ignore zones.</Popover.Content>
</Popover>

{
  /* Ignore all outside clicks */
}
;<Popover outsidePressIgnore={true}>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">Can only be closed via trigger or ESC.</Popover.Content>
</Popover>
```

### Complex Header

```tsx
<Popover
  open={open}
  onOpenChange={setOpen}
>
  <Popover.Trigger>
    <Button>Complex Header</Button>
  </Popover.Trigger>
  <Popover.Header>
    <div className="flex h-10 items-center justify-between px-3">
      <Tabs
        value={tab}
        onChange={setTab}
      >
        <Tabs.Item value="tab-1">Tab 1</Tabs.Item>
        <Tabs.Item value="tab-2">Tab 2</Tabs.Item>
        <Tabs.Item value="tab-3">Tab 3</Tabs.Item>
      </Tabs>
    </div>
  </Popover.Header>
  <Popover.Content className="w-64 p-3">Content with tabbed header.</Popover.Content>
</Popover>
```

### Nested Components

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Nested Components</Button>
  </Popover.Trigger>
  <Popover.Content className="flex gap-4 p-4">
    <Select
      value="option-1"
      onChange={() => {}}
    >
      <Select.Trigger>Select</Select.Trigger>
      <Select.Content>
        <Select.Item value="option-1">Option 1</Select.Item>
        <Select.Item value="option-2">Option 2</Select.Item>
      </Select.Content>
    </Select>

    <Popover>
      <Popover.Trigger>
        <Button>Nested Popover</Button>
      </Popover.Trigger>
      <Popover.Content className="w-64 p-3">Nested popover content</Popover.Content>
    </Popover>

    <Dropdown>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Option 1</Dropdown.Item>
        <Dropdown.Item>Option 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  </Popover.Content>
</Popover>
```

### Always Open

```tsx
<Popover
  open
  draggable
  rememberPosition
>
  <Popover.Trigger>
    <Button>Always Open</Button>
  </Popover.Trigger>
  <Popover.Header title="Always Open" />
  <Popover.Content className="w-64 p-3">This popover is always visible.</Popover.Content>
</Popover>
```

### Auto Height with ScrollArea

```tsx
<Popover
  autoUpdate
  draggable
  autoSize={autoSize}
>
  <Popover.Trigger>
    <Button>Auto Height</Button>
  </Popover.Trigger>
  <Popover.Header title="Auto Height" />
  <Popover.Content className="flex w-64 flex-col overflow-hidden">
    <ScrollArea className="flex flex-col">
      <ScrollArea.Viewport className="p-3">
        <ScrollArea.Content>
          {/* Long content that scrolls */}
          Lorem ipsum dolor sit amet...
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  </Popover.Content>
</Popover>
```

### Match Trigger Width

```tsx
<Popover
  matchTriggerWidth={true}
  triggerRef={triggerRef}
>
  <Popover.Content className="p-3">
    This popover will match the width of its trigger.
  </Popover.Content>
</Popover>
```

### Close on Escape Control

```tsx
{
  /* ESC key enabled (default) */
}
;<Popover closeOnEscape={true}>
  <Popover.Trigger>
    <Button>ESC Enabled</Button>
  </Popover.Trigger>
  <Popover.Content className="w-72 p-3">Press ESC to close this popover.</Popover.Content>
</Popover>

{
  /* ESC key disabled */
}
;<Popover closeOnEscape={false}>
  <Popover.Trigger>
    <Button>ESC Disabled</Button>
  </Popover.Trigger>
  <Popover.Content className="w-72 p-3">ESC key won't close this popover.</Popover.Content>
</Popover>
```

### With Footer

```tsx
<Popover>
  <Popover.Trigger>
    <Button>With Footer</Button>
  </Popover.Trigger>
  <Popover.Content className="w-64 p-3">
    <div className="space-y-2">
      <h5 className="font-strong">Popover content</h5>
      <p className="text-body-small text-gray-600">This popover has a footer.</p>
    </div>
  </Popover.Content>
  <Popover.Footer>
    <Button
      variant="secondary"
      onClick={() => setOpen(false)}
    >
      Close
    </Button>
  </Popover.Footer>
</Popover>
```

## Props

### Popover

```tsx
interface PopoverProps {
  /** Enable auto-sizing of the popover */
  autoSize?: boolean

  /** Enable auto-update positioning */
  autoUpdate?: boolean

  /** Child components */
  children?: React.ReactNode

  /** Additional CSS classes */
  className?: string

  /** Enable ESC key to close */
  closeOnEscape?: boolean

  /** Reference to content element */
  contentRef?: React.RefObject<HTMLDivElement>

  /** Initial open state for uncontrolled usage */
  defaultOpen?: boolean

  /**
   * Initial drag position (viewport coordinates) applied when the floating
   * element mounts — defaultValue semantics, dragging takes over afterwards.
   * Off-viewport values are clamped back into view. Requires `draggable`.
   */
  defaultPosition?: { x: number; y: number }

  /** Hover interaction delays */
  delay?: { close?: number; open?: number }

  /** Enable draggable behavior */
  draggable?: boolean

  /** Focus manager configuration */
  focusManagerProps?: Partial<FloatingFocusManagerProps>

  /** @deprecated Use focusManagerProps.initialFocus */
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>

  /** Interaction mode */
  interactions?: "hover" | "click" | "focus" | "none"

  /** Match trigger element width */
  matchTriggerWidth?: boolean

  /** Maximum width constraint */
  maxWidth?: number

  /** Distance from trigger */
  offset?: number

  /** Open state change callback */
  onOpenChange?: (isOpen: boolean) => void

  /**
   * Called once with the viewport-clamped position when a drag ends.
   * Not called during the drag nor when the popover closes and resets
   * back to its anchored position.
   */
  onPositionChange?: (position: { x: number; y: number }) => void

  /** Controlled open state */
  open?: boolean

  /** Elements to ignore for outside press */
  outsidePressIgnore?: string | string[] | boolean

  /** Popover placement */
  placement?: Placement

  /** Portal container ID */
  portalId?: string

  /** Remember position when reopened */
  rememberPosition?: boolean

  /** External trigger element reference */
  triggerRef?: React.RefObject<HTMLElement>
}
```

- Defaults:
  - `autoSize`: `true`
  - `autoUpdate`: `true`
  - `closeOnEscape`: `true`
  - `draggable`: `false`
  - `interactions`: `"click"`
  - `matchTriggerWidth`: `false`
  - `offset`: `8`
  - `placement`: `"bottom"`
  - `rememberPosition`: `false`

## Components

### Popover.Trigger

The trigger element that opens/closes the popover.

### Popover.Content

The main content area of the popover.

### Popover.Header

Optional header with title or custom content. Serves as drag handle when draggable.

### Popover.Footer

Optional footer for actions or additional controls.

## Styling

- Uses Tailwind CSS via `tailwind-variants`
- Customizable with `className` prop
- Automatic positioning adjustments
- Smooth animations and transitions
- Dark mode support

## Best Practices

### Usage Guidelines

- Use for contextual information, forms, or interactive controls
- Choose appropriate interaction mode based on content importance
- Consider placement based on available screen space
- Add headers for context when content is complex
- Use controlled mode when you need to manage open state externally

### Interaction Modes

- **Click**: Default, best for most use cases
- **Hover**: Use for quick previews or non-critical information
- **Focus**: Good for accessibility-first interfaces
- **None**: For manual control in complex scenarios

### Performance

- Hover interaction has been optimized to prevent flickering
- Auto-sizing and positioning reduce layout thrashing
- Virtual scrolling supported via ScrollArea integration

### Accessibility

- Proper focus management with focus trapping
- Keyboard navigation support (Tab, Shift+Tab, ESC)
- Appropriate ARIA attributes and roles
- Screen reader announcements for state changes
- Customizable focus behavior via focusManagerProps

## Examples

### Tooltip-like Popover

```tsx
<Popover
  interactions="hover"
  offset={4}
  placement="top"
>
  <Popover.Trigger>
    <Button variant="ghost">
      <InfoIcon />
    </Button>
  </Popover.Trigger>
  <Popover.Content className="text-body-small max-w-xs p-2">
    Additional context or help information.
  </Popover.Content>
</Popover>
```

### Form Popover

```tsx
<Popover placement="bottom-start">
  <Popover.Trigger>
    <Button>Add Item</Button>
  </Popover.Trigger>
  <Popover.Header title="Add New Item" />
  <Popover.Content className="w-80 p-4">
    <form className="space-y-3">
      <Input placeholder="Item name" />
      <Textarea placeholder="Description" />
    </form>
  </Popover.Content>
  <Popover.Footer>
    <div className="flex gap-2">
      <Button variant="secondary">Cancel</Button>
      <Button>Add Item</Button>
    </div>
  </Popover.Footer>
</Popover>
```

## Notes

- Hover interaction is optimized with `move: false` and `mouseOnly: true` to prevent accidental triggers
- Draggable popovers use the header as a drag handle
- Position memory persists across browser sessions when enabled
- Multiple popovers can coexist with proper z-index management
- External triggers enable flexible layouts and dynamic positioning
- Auto-sizing prevents content overflow while maintaining performance
