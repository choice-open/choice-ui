# Textarea

A powerful, accessible textarea component with auto-resizing, manual resize handles, and scroll area integration. It supports multiple visual variants, flexible sizing options, and advanced resize modes for different use cases.

## Import

```tsx
import { Textarea } from "@choiceform/design-system"
```

## Features

- Multiple visual variants for different contexts (default, light, dark, reset)
- Three resize modes: auto-resize, manual handle resize, and fixed size
- Integrated scroll area for content that exceeds height limits
- Row-based size constraints (minRows, maxRows)
- Selected state for visual emphasis
- Editing state tracking with callbacks
- Automatic text selection on focus
- Disabled and read-only support
- Password manager protection (`data-1p-ignore`)
- Automatic spellcheck and autocomplete disabling
- Dragging state with visual feedback
- Performance optimized with memoization

## Usage

### Basic

```tsx
<Textarea
  value={value}
  onChange={setValue}
/>
```

### Auto-resize with row constraints

```tsx
<Textarea
  value={value}
  onChange={setValue}
  resize="auto"
  minRows={3}
  maxRows={10}
/>
```

### Manual resize with handle

```tsx
<Textarea
  value={value}
  onChange={setValue}
  resize="handle"
  minRows={5}
  maxRows={15}
/>
```

### Fixed size

```tsx
<Textarea
  value={value}
  onChange={setValue}
  resize={false}
  rows={8}
/>
```

### Variants

```tsx
// Default - follows page theme
<Textarea variant="default" value={value} onChange={setValue} />

// Light - fixed light appearance
<Textarea variant="light" value={value} onChange={setValue} />

// Dark - fixed dark appearance
<Textarea variant="dark" value={value} onChange={setValue} />

// Reset - no variant styling
<Textarea variant="reset" value={value} onChange={setValue} />
```

### States

```tsx
<Textarea selected value={value} onChange={setValue} />
<Textarea disabled value={value} onChange={setValue} />
<Textarea readOnly value={value} />
```

### With editing state tracking

```tsx
<Textarea
  value={value}
  onChange={setValue}
  onIsEditingChange={(isEditing) => {
    console.log("Textarea editing state:", isEditing)
  }}
/>
```

## Props

```ts
interface TextareaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange" | "size">,
    Pick<TextareaAutosizeProps, "minRows" | "maxRows"> {
  /** Additional CSS class names */
  className?: string

  /** Callback when the textarea value changes */
  onChange?: (value: string) => void

  /** Callback when editing state changes (focus/blur) */
  onIsEditingChange?: (isEditing: boolean) => void

  /** Resize behavior mode */
  resize?: "auto" | "handle" | false

  /** Whether the textarea appears selected/highlighted */
  selected?: boolean

  /** Current textarea value */
  value?: string

  /** Visual style variant of the textarea */
  variant?: "default" | "light" | "dark" | "reset"
}
```

- Defaults:
  - `variant`: "default" (follows page theme)
  - `resize`: "auto"
  - `minRows`: 3
  - `selected`: `false`
  - `spellCheck`: `false`
  - `autoComplete`: "off"

- Variant options:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme
  - `reset`: Removes variant styling, no variant settings applied

- Behavior:
  - Automatically selects all text on focus
  - Tracks editing state and calls `onIsEditingChange` on focus/blur
  - Cleans up editing state on component unmount
  - Protected from password managers with `data-1p-ignore`
  - Shows resize cursor during manual resize operations

## Resize Modes

### Auto (`resize="auto"`)

- Automatically adjusts height based on content
- Respects `minRows` and `maxRows` constraints
- Shows scrollbar when content exceeds `maxRows`

### Handle (`resize="handle"`)

- Shows a resize handle in the bottom-right corner
- Allows manual height adjustment by dragging
- Respects `minRows` and `maxRows` constraints
- Provides visual feedback during resizing

### Fixed (`resize={false}`)

- Fixed height based on `rows` prop
- No automatic resizing
- Shows scrollbar when content exceeds height

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` with slots for different parts.
- Customize using the `className` prop; classes are merged with the component's internal classes.
- Slots available in `tv.ts`: `container`, `textarea`, `viewport`, `resizeHandle`.
- Supports dragging state with visual feedback.

## Accessibility

- Supports all standard HTML textarea attributes
- Proper focus management with visual indicators
- Compatible with screen readers
- Keyboard navigation friendly
- Supports `aria-*` attributes for enhanced accessibility
- Resize handle is keyboard accessible

## Best practices

- Choose the appropriate resize mode for your use case:
  - Use `auto` for dynamic content that grows with user input
  - Use `handle` when users need control over the display area
  - Use `false` for fixed-layout designs
- Set reasonable `minRows` and `maxRows` to prevent extreme sizes
- Use the `selected` state to highlight important or active textareas
- Handle editing state changes to provide user feedback
- Consider using `readOnly` instead of `disabled` when the content should remain visible but not editable

## Examples

### Auto-resizing comment field

```tsx
const [comment, setComment] = useState("")

<Textarea
  value={comment}
  onChange={setComment}
  resize="auto"
  minRows={2}
  maxRows={8}
  placeholder="Write your comment..."
/>
```

### Code editor with manual resize

```tsx
const [code, setCode] = useState("")

<Textarea
  value={code}
  onChange={setCode}
  resize="handle"
  minRows={10}
  maxRows={30}
  placeholder="Enter your code..."
  className="font-mono"
/>
```

### Fixed-size message box

```tsx
const [message, setMessage] = useState("")

<Textarea
  value={message}
  onChange={setMessage}
  resize={false}
  rows={6}
  placeholder="Enter your message..."
/>
```

### Dark theme with editing state

```tsx
const [content, setContent] = useState("")
const [isEditing, setIsEditing] = useState(false)

<div className="space-y-2">
  <Textarea
    variant="dark"
    value={content}
    onChange={setContent}
    onIsEditingChange={setIsEditing}
    resize="auto"
    minRows={4}
    placeholder="Start typing..."
  />
  {isEditing && (
    <div className="text-body-small text-white/60">
      Currently editing...
    </div>
  )}
</div>
```

## Performance Notes

- The component uses `useMemo` and `useEventCallback` for optimal performance
- Height calculations are cached to prevent unnecessary recalculations
- Constants are extracted to avoid redeclaration on re-renders
- Drag event listeners are properly cleaned up to prevent memory leaks

## Notes

- The component integrates with ScrollArea for smooth scrolling behavior
- Manual resize operations show visual feedback with dashed borders
- The cursor changes to `ns-resize` during drag operations for better UX
- All resize modes respect accessibility guidelines and keyboard navigation
