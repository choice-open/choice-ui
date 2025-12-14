# ScrollArea

A high-performance custom scroll area component built with native DOM APIs instead of Radix UI. Provides native-like scrolling behavior with customizable scrollbar appearance and advanced features for optimal performance.

## Import

```tsx
import { ScrollArea } from "@choice-ui/react"
```

## Features

- **Native DOM Implementation**: Built with native APIs for better performance and reduced bundle size
- **Auto-Scrollbars**: Automatically renders scrollbars based on orientation prop - no manual scrollbar setup needed
- **Multiple Visibility Modes**: Four scrollbar visibility types (auto, always, scroll, hover)
- **Dual Scrolling Support**: Supports vertical, horizontal, or both orientations
- **Performance Monitoring**: Built-in performance metrics and monitoring capabilities
- **Virtual List Integration**: Optimized for use with @tanstack/react-virtual for large datasets
- **Render Props Pattern**: Access to real-time scroll position data
- **Dynamic Content Support**: Automatically adjusts scrollbars when content changes
- **Multiple Themes**: Light, dark, and auto theme variants
- **Nested Scrolling**: Supports nested ScrollArea components

## Usage

### Basic Usage

```tsx
<ScrollArea
  className="h-64 w-64 border"
  orientation="vertical"
>
  <ScrollArea.Viewport className="h-full">
    <ScrollArea.Content>{/* Your scrollable content */}</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

### Auto-Scrollbars (New Simplified API)

The new auto-scrollbars feature automatically adds scrollbars based on orientation:

```tsx
{
  /* Vertical scrolling - automatically adds vertical scrollbar */
}
;<ScrollArea
  orientation="vertical"
  className="h-40 w-48 border"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content>{longContent}</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>

{
  /* Both directions - automatically adds both scrollbars + corner */
}
;<ScrollArea
  orientation="both"
  className="h-40 w-48 border"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content>{gridContent}</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

### Manual Scrollbar Configuration

For advanced customization, manually configure scrollbars:

```tsx
<ScrollArea
  className="h-64 w-64 border"
  scrollbarMode="padding-y"
>
  <ScrollArea.Viewport className="h-full">
    <ScrollArea.Content>{content}</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb orientation="vertical" />
  </ScrollArea.Scrollbar>
</ScrollArea>
```

### Render Props Pattern

Access real-time scroll position for scroll-based animations or indicators:

```tsx
<ScrollArea className="h-64 w-64 border">
  {({ top, left }) => (
    <>
      <ScrollArea.Viewport className="h-full">
        <ScrollArea.Content>
          <div className="sticky top-0 bg-white/90 p-2">
            Scroll Progress: {Math.round(top * 100)}%
          </div>
          {content}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb orientation="vertical" />
      </ScrollArea.Scrollbar>
    </>
  )}
</ScrollArea>
```

### Virtual List Integration

Optimized for large datasets using @tanstack/react-virtual:

```tsx
function VirtualScrollArea({ items }) {
  const [scrollElement, setScrollElement] = useState(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 60,
    overscan: 5,
  })

  return (
    <ScrollArea
      className="h-96 w-80 border"
      scrollbarMode="padding-y"
    >
      <ScrollArea.Viewport ref={setScrollElement}>
        <ScrollArea.Content>
          <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                style={{
                  height: virtualItem.size,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {/* Virtual item content */}
              </div>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb orientation="vertical" />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  )
}
```

### Performance Monitoring

Built-in performance monitoring for scroll optimization:

```tsx
import { useScrollPerformanceMonitor } from "@choice-ui/react"

function MonitoredScrollArea() {
  const [viewport, setViewport] = useState(null)

  const metrics = useScrollPerformanceMonitor(viewport, {
    enabled: true,
    logInterval: 3000, // Report every 3 seconds
    frameTimeThreshold: 16.67, // 60fps threshold
  })

  return (
    <ScrollArea className="h-80 w-80 border">
      <ScrollArea.Viewport ref={setViewport}>
        <ScrollArea.Content>
          {/* Performance metrics available in console */}
          {heavyContent}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  )
}
```

## Scrollbar Visibility Types

### auto (Default)

Scrollbars visible when content overflows - standard web behavior.

### always

Scrollbars always visible regardless of content overflow.

### scroll

Scrollbars visible only when user is actively scrolling.

### hover

Scrollbars visible when scrolling or hovering (macOS-like behavior).

```tsx
<ScrollArea
  type="hover"
  className="h-64 w-64 border"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content>{content}</ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

## Scrollbar Modes

Different scrollbar appearance modes for various contexts:

- `default`: Standard scrollbar appearance
- `padding-y`: Prominent vertical scrollbar
- `padding-x`: Prominent horizontal scrollbar
- `padding-b`: Enhanced both directions
- `padding-t`: Top-aligned large scrollbar
- `padding-l`: Left-aligned large scrollbar
- `padding-r`: Right-aligned large scrollbar

```tsx
<ScrollArea scrollbarMode="padding-y">{/* Content */}</ScrollArea>
```

## Theme Variants

```tsx
{
  /* Light theme */
}
;<ScrollArea variant="light">{/* Content */}</ScrollArea>

{
  /* Dark theme */
}
;<ScrollArea variant="dark">{/* Content */}</ScrollArea>

{
  /* Auto theme (follows system) */
}
;<ScrollArea variant="auto">{/* Content */}</ScrollArea>
```

## Props

### ScrollArea Props

```ts
interface ScrollAreaProps {
  /** Accessibility label */
  "aria-label"?: string

  /** ID of element providing label */
  "aria-labelledby"?: string

  /** Content or render prop function */
  children?: React.ReactNode | ((position: ScrollPosition) => React.ReactNode)

  /** Additional CSS classes */
  className?: string

  /** Custom class names for different parts */
  classNames?: {
    root?: string
    viewport?: string
    content?: string
    scrollbar?: string
    thumb?: string
    corner?: string
  }

  /** Scroll orientation */
  orientation?: "vertical" | "horizontal" | "both"

  /** Scrollbar appearance mode */
  scrollbarMode?:
    | "default"
    | "padding-y"
    | "padding-x"
    | "padding-b"
    | "padding-t"
    | "padding-l"
    | "padding-r"

  /** Scrollbar visibility behavior */
  type?: "auto" | "always" | "scroll" | "hover"

  /** Theme variant */
  variant?: "auto" | "light" | "dark"
}
```

### ScrollArea.Scrollbar Props

```ts
interface ScrollbarProps {
  /** Scrollbar orientation */
  orientation?: "vertical" | "horizontal"

  /** Additional CSS classes */
  className?: string
}
```

### ScrollArea.Thumb Props

```ts
interface ThumbProps {
  /** Thumb orientation */
  orientation?: "vertical" | "horizontal"

  /** Additional CSS classes */
  className?: string
}
```

## Component Structure

The ScrollArea component is composed of several sub-components:

- `ScrollArea.Viewport`: The scrollable container
- `ScrollArea.Content`: Wrapper for the actual content
- `ScrollArea.Scrollbar`: The scrollbar track
- `ScrollArea.Thumb`: The draggable scrollbar handle
- `ScrollArea.Corner`: Corner piece for dual-direction scrolling

## Performance Considerations

### For Large Lists

- Use virtual scrolling with @tanstack/react-virtual
- Enable performance monitoring during development
- Consider `overscan` values for smooth scrolling

### Dynamic Content

- ScrollArea automatically handles content size changes
- Uses MutationObserver and ResizeObserver for updates
- Scrollbar length updates dynamically

### Memory Management

- Clean up performance monitors on unmount
- Cache expensive calculations with useMemo
- Avoid unnecessary re-renders of scroll content

## Best Practices

- Always specify explicit height for the container
- Use appropriate scrollbar visibility type for your use case
- Apply padding inside the viewport, not on the ScrollArea itself
- For large datasets, implement virtual scrolling
- Use render props pattern for scroll-dependent UI elements
- Enable performance monitoring during development
- Choose scrollbar modes that match your design system

## Integration Examples

### In Modal Dialogs

```tsx
<Modal>
  <Modal.Content className="h-64 w-64">
    <ScrollArea
      className="h-full"
      scrollbarMode="padding-y"
    >
      <ScrollArea.Viewport className="h-full p-4">
        <ScrollArea.Content>{modalContent}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb orientation="vertical" />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  </Modal.Content>
</Modal>
```

### Nested Scrolling

```tsx
<ScrollArea
  orientation="both"
  className="h-80 w-full border"
>
  <ScrollArea.Viewport>
    <ScrollArea.Content
      className="grid grid-cols-5 gap-4 p-4"
      style={{ minWidth: "800px" }}
    >
      {items.map((item) => (
        <ScrollArea
          key={item.id}
          className="h-40 rounded-lg border"
        >
          <ScrollArea.Viewport>
            <ScrollArea.Content className="space-y-2 p-2">
              {/* Nested scrollable content */}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      ))}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
</ScrollArea>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Focus management for interactive elements
- Scroll position announcements for assistive technology
- Respects user's reduced motion preferences

## Browser Support

- Modern browsers with CSS custom properties support
- Fallback behavior for older browsers
- Touch device optimization
- High DPI display support

## Migration from Radix ScrollArea

The component provides the same API as Radix ScrollArea but with improved performance:

```tsx
// Old Radix approach
<ScrollArea.Root>
  <ScrollArea.Viewport>
    {/* content */}
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>

// New approach (auto-scrollbars)
<ScrollArea orientation="vertical">
  <ScrollArea.Viewport>
    {/* content */}
  </ScrollArea.Viewport>
</ScrollArea>
```
