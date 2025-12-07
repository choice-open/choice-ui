# useDisableScroll

A React hook that temporarily disables scrolling on parent containers when an element is focused and hovered, useful for preventing scroll interference in dropdowns, modals, and overlays.

## Import

```typescript
import { useDisableScroll } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Basic usage
function Dropdown() {
  const ref = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref })

  return (
    <div ref={ref} {...disableScrollProps}>
      {/* Dropdown content */}
    </div>
  )
}

// With custom dropdown
function Select({ options }) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref: dropdownRef })

  return (
    <div className="relative">
      <button>Select an option</button>
      <div
        ref={dropdownRef}
        className="absolute dropdown-menu"
        {...disableScrollProps}
      >
        {options.map(option => (
          <div key={option.id}>{option.label}</div>
        ))}
      </div>
    </div>
  )
}
```

## API

### useDisableScroll

```typescript
function useDisableScroll(options: UseDisableScrollOptions): UseDisableScrollReturn

interface UseDisableScrollOptions {
  ref: React.RefObject<HTMLDivElement>
}

interface UseDisableScrollReturn {
  disableScrollProps: {
    onFocus: () => void
    onBlur: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}
```

#### Parameters

- `ref` - A React ref pointing to the element that should trigger scroll disabling

#### Returns

An object containing:

- `disableScrollProps` - Event handlers to spread on the target element

## Features

- **Smart parent detection**: Automatically finds the scrollable parent container
- **Dual trigger requirement**: Requires both focus AND hover to disable scroll
- **Overflow restoration**: Restores original overflow style when disabled
- **Nested container support**: Walks up the DOM tree to find the appropriate container
- **Performance optimized**: Uses refs to avoid re-renders

## How It Works

1. The hook tracks both focus and mouse enter states
2. When BOTH conditions are met, it searches for the nearest scrollable parent
3. It temporarily sets `overflow: hidden` on that parent
4. When either condition is removed, it restores the original overflow value

## Examples

### Dropdown Menu

```typescript
function DropdownMenu({ items }) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref: menuRef })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="dropdown-menu"
          {...disableScrollProps}
        >
          {items.map(item => (
            <button key={item.id} className="dropdown-item">
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Autocomplete Input

```typescript
function Autocomplete({ suggestions }) {
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref: suggestionsRef })
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  return (
    <div className="autocomplete">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="suggestions"
          {...disableScrollProps}
        >
          {suggestions.map(item => (
            <div key={item} className="suggestion-item">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Modal with Scrollable Content

```typescript
function ScrollableModal({ isOpen, onClose, children }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref: contentRef })

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div
          ref={contentRef}
          className="modal-content"
          {...disableScrollProps}
          tabIndex={0}
        >
          {children}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
```

### Nested Scrollable Containers

```typescript
function NestedScrollableSelect() {
  const ref = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref })

  return (
    <div className="outer-scroll-container" style={{ height: '400px', overflow: 'auto' }}>
      <div className="content">
        <div className="inner-scroll-container" style={{ height: '200px', overflow: 'auto' }}>
          <div
            ref={ref}
            className="dropdown-in-scroll"
            {...disableScrollProps}
          >
            {/* The hook will find and disable the appropriate parent */}
            <select size={10}>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Tooltip with Scroll Prevention

```typescript
function TooltipWithScrollLock({ content, children }) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { disableScrollProps } = useDisableScroll({ ref: tooltipRef })
  const [show, setShow] = useState(false)

  return (
    <div className="tooltip-wrapper">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>

      {show && (
        <div
          ref={tooltipRef}
          className="tooltip"
          {...disableScrollProps}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}
```

## Use Cases

1. **Dropdown menus**: Prevent page scroll while navigating options
2. **Autocomplete**: Keep suggestions visible during keyboard navigation
3. **Modals**: Prevent background scroll when modal content is focused
4. **Tooltips**: Ensure tooltips remain visible during interaction
5. **Popovers**: Maintain position while interacting with content

## Technical Details

The hook uses a smart algorithm to find the appropriate scrollable parent:

1. Starts from the ref element
2. Traverses up the DOM tree comparing parent and grandparent sizes
3. Finds the first container where content exceeds container height
4. Temporarily modifies that container's overflow property

## Best Practices

1. **Always provide a ref**: The hook needs a DOM reference to work
2. **Apply to interactive elements**: Best used on focusable containers
3. **Consider accessibility**: Ensure keyboard navigation still works
4. **Test nested scenarios**: Verify behavior in complex layouts
5. **Clean up properly**: The hook automatically restores styles

## Notes

- Requires both focus AND mouse hover to activate (prevents accidental triggers)
- Original overflow values are preserved and restored
- Works with dynamically sized content
- No effect if no scrollable parent is found
- Performance optimized using refs instead of state
