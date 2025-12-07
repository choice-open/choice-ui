# useLazyRef

A React hook for lazy initialization of expensive objects that persist across renders without triggering re-renders.

## Import

```typescript
import { useLazyRef } from "@choiceform/design-system/hooks"
```

## Usage

```typescript
// Basic usage - create expensive object only once
const mapRef = useLazyRef(() => new Map())
const cacheRef = useLazyRef(() => new WeakMap())

// With complex initialization
const serviceRef = useLazyRef(() => {
  const service = new ExpensiveService()
  service.initialize()
  return service
})

// Access the value
mapRef.current.set("key", "value")
const value = mapRef.current.get("key")
```

## API

### useLazyRef

```typescript
function useLazyRef<T>(fn: () => T): MutableRefObject<T>
```

#### Parameters

- `fn` - Initialization function that returns the value. Called only once on first access.

#### Returns

A mutable ref object containing the initialized value. The value is guaranteed to be non-null.

## Features

- **Lazy initialization**: Function only runs when needed
- **One-time execution**: Initialization happens exactly once
- **No re-renders**: Changes to ref don't trigger component updates
- **Persistent reference**: Same object instance across all renders
- **Type safe**: Full TypeScript support with non-null guarantee

## Examples

### Cache Management

```typescript
function DataComponent() {
  const cacheRef = useLazyRef(() => new Map<string, any>())

  const fetchData = async (id: string) => {
    // Check cache first
    if (cacheRef.current.has(id)) {
      return cacheRef.current.get(id)
    }

    // Fetch and cache
    const data = await api.getData(id)
    cacheRef.current.set(id, data)
    return data
  }

  return (
    <div>
      <button onClick={() => fetchData('123')}>
        Load Data
      </button>
      <p>Cache size: {cacheRef.current.size}</p>
    </div>
  )
}
```

### Event Emitter

```typescript
function EventComponent() {
  const emitterRef = useLazyRef(() => new EventEmitter())

  useEffect(() => {
    const handler = (data) => console.log('Event:', data)
    emitterRef.current.on('update', handler)

    return () => {
      emitterRef.current.off('update', handler)
    }
  }, [])

  const triggerEvent = () => {
    emitterRef.current.emit('update', { timestamp: Date.now() })
  }

  return <button onClick={triggerEvent}>Trigger Event</button>
}
```

### WebSocket Connection

```typescript
function WebSocketComponent({ url }) {
  const wsRef = useLazyRef(() => {
    const ws = new WebSocket(url)
    ws.onopen = () => console.log('Connected')
    ws.onerror = (error) => console.error('WebSocket error:', error)
    return ws
  })

  useEffect(() => {
    return () => {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [])

  const sendMessage = (message: string) => {
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    }
  }

  return (
    <button onClick={() => sendMessage('Hello')}>
      Send Message
    </button>
  )
}
```

### Performance Tracking

```typescript
function PerformanceMonitor() {
  const metricsRef = useLazyRef(() => ({
    renderCount: 0,
    clickCount: 0,
    startTime: Date.now(),
    events: new Map<string, number>()
  }))

  // Track renders
  metricsRef.current.renderCount++

  const trackClick = (eventName: string) => {
    metricsRef.current.clickCount++
    const count = metricsRef.current.events.get(eventName) || 0
    metricsRef.current.events.set(eventName, count + 1)
  }

  const getReport = () => {
    const uptime = Date.now() - metricsRef.current.startTime
    return {
      ...metricsRef.current,
      uptime,
      events: Array.from(metricsRef.current.events.entries())
    }
  }

  return (
    <div>
      <button onClick={() => trackClick('button1')}>Button 1</button>
      <button onClick={() => trackClick('button2')}>Button 2</button>
      <button onClick={() => console.log(getReport())}>
        Show Report
      </button>
    </div>
  )
}
```

### Complex State Management

```typescript
function TodoManager() {
  const storeRef = useLazyRef(() => ({
    todos: new Map<string, Todo>(),
    subscribers: new Set<() => void>(),

    addTodo(todo: Todo) {
      this.todos.set(todo.id, todo)
      this.notify()
    },

    removeTodo(id: string) {
      this.todos.delete(id)
      this.notify()
    },

    subscribe(callback: () => void) {
      this.subscribers.add(callback)
      return () => this.subscribers.delete(callback)
    },

    notify() {
      this.subscribers.forEach(cb => cb())
    }
  }))

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    return storeRef.current.subscribe(forceUpdate)
  }, [])

  return (
    <div>
      <button onClick={() => storeRef.current.addTodo({
        id: Date.now().toString(),
        text: 'New Todo'
      })}>
        Add Todo
      </button>
      <ul>
        {Array.from(storeRef.current.todos.values()).map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Worker Thread Management

```typescript
function WorkerComponent() {
  const workerRef = useLazyRef(() => {
    const worker = new Worker('/worker.js')
    worker.onmessage = (e) => {
      console.log('Worker result:', e.data)
    }
    return worker
  })

  useEffect(() => {
    return () => {
      workerRef.current.terminate()
    }
  }, [])

  const processData = (data: any) => {
    workerRef.current.postMessage({ type: 'process', data })
  }

  return (
    <button onClick={() => processData([1, 2, 3, 4, 5])}>
      Process in Worker
    </button>
  )
}
```

### Canvas Context

```typescript
function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useLazyRef(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Configure context once
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    return ctx
  })

  const draw = (x: number, y: number) => {
    ctxRef.current.beginPath()
    ctxRef.current.arc(x, y, 5, 0, Math.PI * 2)
    ctxRef.current.stroke()
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        draw(e.clientX - rect.left, e.clientY - rect.top)
      }}
    />
  )
}
```

## Use Cases

1. **Data structures**: Maps, Sets, WeakMaps that persist across renders
2. **Service instances**: API clients, WebSocket connections, Workers
3. **Caching**: In-memory caches without external state management
4. **Performance tracking**: Metrics collection without re-renders
5. **Canvas/WebGL contexts**: Expensive graphics contexts
6. **Event emitters**: Custom event systems

## Comparison with Other Approaches

### vs useState with lazy init

```typescript
// useState - triggers re-render on updates
const [map] = useState(() => new Map())

// useLazyRef - no re-renders
const mapRef = useLazyRef(() => new Map())
```

### vs useRef with manual init

```typescript
// Manual check needed
const ref = useRef<Map<string, any> | null>(null)
if (!ref.current) {
  ref.current = new Map()
}

// Automatic with useLazyRef
const ref = useLazyRef(() => new Map())
```

## Best Practices

1. **Use for expensive objects**: Best for objects with high creation cost
2. **Avoid for primitives**: Use useState for simple values
3. **Clean up resources**: Use useEffect to clean up connections, timers, etc.
4. **Don't use in render**: Access ref.current in effects or handlers
5. **Consider memory**: Refs persist for component lifetime

## Notes

- Initialization happens synchronously on first render if accessed
- The ref value is guaranteed to be non-null after initialization
- Changes to ref.current don't trigger re-renders
- Perfect for "instance variables" in functional components
- Works well with third-party libraries that require persistent instances
