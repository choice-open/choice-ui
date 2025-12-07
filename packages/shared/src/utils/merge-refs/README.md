# mergeRefs

A utility for combining multiple React refs into a single ref callback, enabling ref forwarding to multiple destinations.

## Import

```typescript
import { mergeRefs, assignRef } from "@choiceform/design-system/utils"
```

## Usage

```typescript
// Basic usage
const Component = forwardRef((props, ref) => {
  const internalRef = useRef()

  return <div ref={mergeRefs(ref, internalRef)} />
})

// Multiple refs
function MultiRefComponent() {
  const ref1 = useRef()
  const ref2 = useRef()
  const [ref3, setRef3] = useState(null)

  return <input ref={mergeRefs(ref1, ref2, setRef3)} />
}

// With callback refs
const callbackRef = (node) => {
  console.log('Node:', node)
}

<div ref={mergeRefs(myRef, callbackRef)} />
```

## API

### mergeRefs

```typescript
function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]): (node: T | null) => void
```

#### Parameters

- `...refs` - Any number of React refs (can be ref objects, callback refs, or undefined)

#### Returns

A callback ref function that assigns the node to all provided refs.

### assignRef

```typescript
function assignRef<T>(ref: ReactRef<T> | undefined, value: T | null): void
```

#### Parameters

- `ref` - A React ref (object or callback) to assign the value to
- `value` - The value to assign to the ref

## Types

```typescript
type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>
```

## Features

- **Multiple ref support**: Combine any number of refs into one
- **Type safety**: Full TypeScript support with generic types
- **Flexible ref types**: Works with ref objects, callback refs, and forwarded refs
- **Null safety**: Handles undefined refs gracefully
- **Error handling**: Provides clear error messages for invalid refs

## Examples

### Forwarding Refs with Internal State

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => {
  const internalRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    internalRef.current?.focus()
  }

  return (
    <div>
      <label onClick={focusInput}>{label}</label>
      <input
        ref={mergeRefs(ref, internalRef)}
        {...props}
      />
    </div>
  )
})
```

### Hook with Ref Management

```typescript
function useClickOutside(handler: () => void) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handler])

  return ref
}

// Usage with mergeRefs
function Dropdown({ forwardedRef }) {
  const clickOutsideRef = useClickOutside(() => setOpen(false))

  return (
    <div ref={mergeRefs(forwardedRef, clickOutsideRef)}>
      {/* Dropdown content */}
    </div>
  )
}
```

### Multiple Ref Sources

```typescript
function ComplexComponent() {
  // Different types of refs
  const objectRef = useRef<HTMLDivElement>(null)
  const [callbackRef, setCallbackRef] = useState<HTMLDivElement | null>(null)
  const forwardedRef = useRef<HTMLDivElement>(null)

  // Callback ref for measurements
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      console.log('Width:', node.offsetWidth)
      console.log('Height:', node.offsetHeight)
    }
  }, [])

  return (
    <div
      ref={mergeRefs(
        objectRef,
        setCallbackRef,
        forwardedRef,
        measureRef
      )}
    >
      Content
    </div>
  )
}
```

### Conditional Refs

```typescript
function ConditionalRefComponent({ shouldTrack, externalRef }) {
  const trackingRef = useRef()

  // Only merge trackingRef if shouldTrack is true
  const refs = shouldTrack
    ? mergeRefs(externalRef, trackingRef)
    : externalRef

  return <div ref={refs} />
}
```

### HOC Pattern

```typescript
function withDimensions(Component) {
  return forwardRef((props, ref) => {
    const dimensionsRef = useRef()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
      if (dimensionsRef.current) {
        const { offsetWidth, offsetHeight } = dimensionsRef.current
        setDimensions({ width: offsetWidth, height: offsetHeight })
      }
    }, [])

    return (
      <Component
        {...props}
        ref={mergeRefs(ref, dimensionsRef)}
        dimensions={dimensions}
      />
    )
  })
}
```

### Library Component Integration

```typescript
// When using third-party components that need refs
function IntegratedComponent({ onReady }) {
  const thirdPartyRef = useThirdPartyLib()
  const userRef = useRef()

  useEffect(() => {
    if (userRef.current) {
      onReady(userRef.current)
    }
  }, [onReady])

  return (
    <ThirdPartyComponent
      ref={mergeRefs(thirdPartyRef, userRef)}
    />
  )
}
```

## Best Practices

1. **Order doesn't matter**: All refs receive the same value
2. **Handle null**: Refs can become null during cleanup
3. **Avoid ref.current in render**: Use effects or callbacks
4. **Type your refs**: Always specify the element type for TypeScript

## Error Handling

The `assignRef` function will throw an error with a descriptive message if you try to assign to an invalid ref:

```typescript
try {
  assignRef(invalidRef, element)
} catch (error) {
  console.error(error.message)
  // "Cannot assign value '[object HTMLDivElement]' to ref '...'"
}
```

## Notes

- Compatible with all React ref types
- Refs are assigned synchronously when the callback is invoked
- Undefined refs are safely ignored without errors
- The merged ref callback is stable if the input refs don't change
- Designed for React but the pattern can be adapted for other frameworks
