# useIsomorphicLayoutEffect & useAsRef

SSR-safe layout effect hook and a utility hook for maintaining fresh references in callbacks.

## Import

```typescript
import { useIsomorphicLayoutEffect, useAsRef } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// useIsomorphicLayoutEffect - SSR-safe layout effect
useIsomorphicLayoutEffect(() => {
  // Runs synchronously after DOM updates in browser
  // Falls back to useEffect on server
  const height = element.offsetHeight
  setHeight(height)
}, [])

// useAsRef - Always fresh reference
function Component({ onClick }) {
  const onClickRef = useAsRef(onClick)

  const handler = useCallback(() => {
    onClickRef.current() // Always calls latest onClick
  }, []) // No dependency on onClick needed
}
```

## API

### useIsomorphicLayoutEffect

```typescript
const useIsomorphicLayoutEffect: typeof useLayoutEffect | typeof useEffect
```

A hook that uses `useLayoutEffect` in browser environments and `useEffect` in SSR environments.

#### Parameters

Same as React's `useLayoutEffect`:

- `effect` - Effect function to run
- `deps` - Dependency array

### useAsRef

```typescript
function useAsRef<T>(data: T): React.MutableRefObject<T>
```

Creates a ref that always contains the latest value without causing re-renders.

#### Parameters

- `data` - Any value to keep a fresh reference to

#### Returns

A mutable ref object containing the latest value.

## Features

### useIsomorphicLayoutEffect

- **SSR compatible**: No warnings in server-side rendering
- **Synchronous in browser**: Runs before browser paint
- **Automatic environment detection**: Uses appropriate hook based on environment
- **Drop-in replacement**: Same API as useLayoutEffect

### useAsRef

- **Always fresh**: Ref always contains the latest value
- **No stale closures**: Solves callback dependency issues
- **Stable reference**: Ref object never changes
- **Performance optimized**: Updates without causing re-renders

## Examples

### DOM Measurements (useIsomorphicLayoutEffect)

```typescript
function MeasuredComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  return (
    <div ref={ref}>
      Size: {dimensions.width} x {dimensions.height}
    </div>
  )
}
```

### Scroll Position Restoration

```typescript
function ScrollRestoration({ id }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${id}`)
    if (savedPosition && containerRef.current) {
      containerRef.current.scrollTop = parseInt(savedPosition)
    }

    return () => {
      if (containerRef.current) {
        sessionStorage.setItem(`scroll-${id}`, String(containerRef.current.scrollTop))
      }
    }
  }, [id])

  return <div ref={containerRef} />
}
```

### Animation Setup

```typescript
function AnimatedElement({ children }) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return

    // Set initial state before paint
    ref.current.style.opacity = '0'
    ref.current.style.transform = 'translateY(20px)'

    // Trigger animation
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transition = 'all 0.3s ease'
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'translateY(0)'
      }
    })
  }, [])

  return <div ref={ref}>{children}</div>
}
```

### Event Handler with Fresh Props (useAsRef)

```typescript
function DebouncedInput({ onSearch, delay = 300 }) {
  const onSearchRef = useAsRef(onSearch)
  const [value, setValue] = useState('')

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      onSearchRef.current(query) // Always uses latest onSearch
    }, delay),
    [delay] // Only recreate if delay changes
  )

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedSearch(e.target.value)
      }}
    />
  )
}
```

### Long-Running Effects with Fresh Callbacks

```typescript
function PollingComponent({ onData, interval = 1000 }) {
  const onDataRef = useAsRef(onData)

  useEffect(() => {
    const timer = setInterval(() => {
      fetch("/api/data")
        .then((res) => res.json())
        .then((data) => {
          onDataRef.current(data) // Always calls latest onData
        })
    }, interval)

    return () => clearInterval(timer)
  }, [interval]) // No dependency on onData!
}
```

### WebSocket with Changing Handlers

```typescript
function WebSocketComponent({ onMessage, url }) {
  const onMessageRef = useAsRef(onMessage)
  const ws = useRef<WebSocket>()

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onmessage = (event) => {
      onMessageRef.current(event.data) // Always fresh handler
    }

    return () => {
      ws.current?.close()
    }
  }, [url]) // Only reconnect when URL changes
}
```

### Intersection Observer with Fresh Callback

```typescript
function LazyImage({ src, onVisible }) {
  const onVisibleRef = useAsRef(onVisible)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisibleRef.current() // Always calls latest onVisible
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, []) // No dependencies needed!

  return <img ref={imgRef} src={src} />
}
```

## Use Cases

### useIsomorphicLayoutEffect

1. **DOM measurements**: Reading element dimensions or positions
2. **Scroll synchronization**: Restoring scroll positions
3. **Focus management**: Setting focus before paint
4. **Animation setup**: Initializing styles before browser paint
5. **Third-party library integration**: Libraries that need synchronous DOM access

### useAsRef

1. **Event handlers in effects**: Avoiding effect re-runs when handlers change
2. **Timers and intervals**: Keeping callbacks fresh in setTimeout/setInterval
3. **WebSocket handlers**: Updating message handlers without reconnecting
4. **Debounced callbacks**: Maintaining latest callback in debounced functions
5. **Memoized components**: Accessing fresh props in memoized callbacks

## Best Practices

### useIsomorphicLayoutEffect

1. **Keep it synchronous**: Don't use async functions
2. **Minimize work**: Only do essential DOM operations
3. **Clean up**: Always return cleanup functions when needed
4. **Consider useEffect**: Use regular useEffect if timing isn't critical

### useAsRef

1. **Use for callbacks**: Best for function references
2. **Not for rendering**: Don't use ref.current in render
3. **Combine with useCallback**: Create stable callbacks with fresh data
4. **Document usage**: Make it clear why useAsRef is needed

## Common Patterns

### Combined Usage

```typescript
function TooltipPositioned({ content, targetRef }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const contentRef = useAsRef(content)

  useIsomorphicLayoutEffect(() => {
    if (!targetRef.current) return

    const updatePosition = () => {
      const rect = targetRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.left
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)

    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  return (
    <div style={{ position: 'absolute', ...position }}>
      {contentRef.current}
    </div>
  )
}
```

## Notes

- useIsomorphicLayoutEffect has the same timing as useLayoutEffect in the browser
- useAsRef updates happen synchronously via useIsomorphicLayoutEffect
- Both hooks are designed to work together for complex UI scenarios
- Consider performance implications of synchronous effects
- Test thoroughly in both SSR and client environments
