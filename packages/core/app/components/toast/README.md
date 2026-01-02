# Toast

A modern toast notification system for displaying non-blocking feedback messages. Built with a global store pattern that requires no context providers, supporting multiple instances, rich content, and smooth animations powered by Framer Motion.

## Import

```tsx
import { Toaster, toast } from "@choice-ui/react"
```

## Features

- **No Provider Required**: Works without wrapping your app in a context provider
- **Multiple Instances**: Support multiple Toaster components with unique IDs
- **Semantic Types**: Six types with distinct icons (default, info, success, warning, error, loading)
- **Color Variants**: Customizable background colors independent of type
- **Rich Content**: Titles, descriptions, HTML content, and action buttons
- **Promise API**: Automatic loading/success/error state management
- **Flexible Positioning**: Six position options with customizable offset
- **Stacking**: Elegant stacking with expand-on-hover behavior
- **Progress Bar**: Optional countdown indicator with pause-on-hover
- **Layouts**: Default (full) and compact (minimal) display modes
- **Swipe to Dismiss**: Touch-friendly dismissal with direction-aware animation
- **Compound Components**: Full control over toast rendering via slots
- **Accessible**: ARIA live regions, keyboard navigation, screen reader support

## Usage

### Setup

Place a Toaster component anywhere in your app with a unique ID:

```tsx
import { Toaster } from "@choice-ui/react"

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster id="my-app" />
    </>
  )
}
```

### Basic Toast

```tsx
import { toast } from "@choice-ui/react"

// Default toast
toast.use("my-app")("Hello World")

// With description
toast.use("my-app")("File saved", {
  description: "Your changes have been saved successfully.",
})
```

### Toast Types

Each type displays a distinct icon and has semantic meaning:

```tsx
// Default - no icon
toast.use("my-app")("Notification")

// Info - information icon
toast.use("my-app").info("New message received")

// Success - checkmark icon
toast.use("my-app").success("Changes saved")

// Warning - warning triangle icon
toast.use("my-app").warning("Low storage space")

// Error - error icon
toast.use("my-app").error("Failed to upload file")

// Loading - spinner icon, does not auto-dismiss
toast.use("my-app").loading("Uploading...")
```

### Color Variants

The `variant` option controls background color independently from `type`:

```tsx
// Default - dark neutral (gray)
toast.use("my-app")("Notification", { variant: "default" })

// Accent - blue/brand color
toast.use("my-app")("Notification", { variant: "accent" })

// Success - green
toast.use("my-app")("Notification", { variant: "success" })

// Warning - yellow/amber
toast.use("my-app")("Notification", { variant: "warning" })

// Error - red
toast.use("my-app")("Notification", { variant: "error" })

// Assistive - pink/magenta
toast.use("my-app")("Notification", { variant: "assistive" })
```

### Action Buttons

Add interactive buttons with `action` and `cancel`:

```tsx
// With action button
toast.use("my-app")("Item deleted", {
  description: "The item has been moved to trash.",
  action: {
    label: "Undo",
    onClick: () => restoreItem(),
  },
})

// With action and cancel buttons
toast.use("my-app").error("Connection lost", {
  description: "Unable to reach the server.",
  action: {
    label: "Retry",
    onClick: () => reconnect(),
  },
  cancel: {
    label: "Dismiss",
  },
})
```

### Promise Toast

Automatically manage loading, success, and error states:

```tsx
toast.use("my-app").promise(
  saveData(), // Your promise
  {
    loading: "Saving...",
    success: "Saved successfully!",
    error: (err) => `Failed: ${err.message}`,
  }
)

// With full options
toast.use("my-app").promise(fetchData(), {
  loading: { title: "Loading...", description: "Please wait" },
  success: (data) => ({
    title: "Loaded!",
    description: `Found ${data.length} items`,
  }),
  error: (err) => ({
    title: "Error",
    description: err.message,
  }),
})
```

### Custom Duration

```tsx
// Quick toast (2 seconds)
toast.use("my-app").info("Quick message", { duration: 2000 })

// Long toast (10 seconds)
toast.use("my-app").info("Important message", { duration: 10000 })

// Persistent toast (no auto-dismiss)
toast.use("my-app").warning("Critical notice", {
  duration: 0,
  cancel: { label: "Dismiss" },
})
```

### Programmatic Dismissal

```tsx
// Store the toast ID returned by toast functions
const id = toast.use("my-app").info("Processing...")

// Dismiss specific toast by ID
toast.use("my-app").dismiss(id)

// Dismiss all toasts in a Toaster
toast.use("my-app").dismissAll()
```

### HTML Content

Render rich content with `descriptionHtml`:

```tsx
toast.use("my-app").success("Project duplicated", {
  descriptionHtml:
    'Copied <strong class="text-white">Project A</strong> to <strong class="text-white">Project B</strong>',
})
```

### Multiple Toasters

Use different Toasters for different notification types:

```tsx
function App() {
  return (
    <>
      <Toaster id="system" position="top-left" />
      <Toaster id="user" position="bottom-right" />
    </>
  )
}

// Target specific toasters from anywhere
toast.use("system").warning("System update available")
toast.use("user").success("Profile saved")
```

### Compact Layout

Use minimal single-line toasts with dynamic width:

```tsx
<Toaster
  id="compact-toaster"
  layout="compact"
  position="bottom-center"
  showProgress
/>

toast.use("compact-toaster").success("Saved!")
```

### Progress Bar

Show countdown indicator that pauses on hover:

```tsx
<Toaster id="with-progress" showProgress duration={5000} />
```

### Custom Slot Rendering

Full control over toast appearance using compound components:

```tsx
<Toaster id="custom">
  <Toaster.Item className="bg-default-background">
    <Toaster.Icon>
      {(type, defaultIcon) => (
        <span className="text-xl">
          {type === "success" && "✨"}
          {type === "error" && "💥"}
          {type === "warning" && "⚡"}
          {type === "info" && "💡"}
          {type === "loading" && defaultIcon}
          {type === "default" && "📢"}
        </span>
      )}
    </Toaster.Icon>
    <Toaster.Title className="font-bold uppercase" />
    <Toaster.Description className="text-sm opacity-70" />
    <Toaster.Actions>
      {(action, cancel, close) => (
        <div className="flex gap-2">
          {action && (
            <Button
              onClick={() => {
                action.onClick()
                close()
              }}
            >
              {action.label}
            </Button>
          )}
          {cancel && <Button onClick={close}>{cancel.label}</Button>}
        </div>
      )}
    </Toaster.Actions>
  </Toaster.Item>
</Toaster>
```

## Props

### Toaster

```tsx
interface ToasterProps {
  /**
   * Unique ID for this Toaster instance.
   * Use toast.use(id) to send toasts to this specific Toaster.
   * @default "default"
   */
  id?: string

  /**
   * Screen position for the toast container.
   * @default "bottom-right"
   */
  position?: ToastPosition

  /**
   * Distance from viewport edges in pixels.
   * @default 16
   */
  offset?: number

  /**
   * Default auto-dismiss duration in milliseconds.
   * Individual toasts can override this.
   * @default 5000
   */
  duration?: number

  /**
   * Maximum number of visible toasts.
   * Older toasts are hidden but still in queue.
   * @default 3
   */
  visibleToasts?: number

  /**
   * Show countdown progress bar on each toast.
   * Progress pauses when hovering over toasts.
   * @default false
   */
  showProgress?: boolean

  /**
   * Toast display layout.
   * - "default": Full-size with title, description, actions
   * - "compact": Minimal single-line style with dynamic width
   * @default "default"
   */
  layout?: "default" | "compact"

  /**
   * Whether to render in a portal.
   * @default true
   */
  portal?: boolean

  /**
   * Custom portal container element.
   * If not provided, uses a shared portal container.
   */
  container?: HTMLElement | null

  /**
   * Accessibility label for the toast region.
   * @default "Notifications"
   */
  label?: string

  /** Additional CSS class name */
  className?: string

  /**
   * Slot components for custom rendering.
   * Use Toaster.Item, Toaster.Icon, etc.
   */
  children?: ReactNode
}
```

### ToastOptions

Options passed to toast functions:

```tsx
interface ToastOptions {
  /**
   * Custom toast ID.
   * Use to update an existing toast instead of creating a new one.
   */
  id?: string

  /**
   * Background color variant.
   * Independent from toast type (which controls the icon).
   */
  variant?: ToastVariant

  /** Description text shown below the title */
  description?: React.ReactNode

  /**
   * HTML description content.
   * Rendered with dangerouslySetInnerHTML.
   * Use for rich text formatting (bold, colors, etc.)
   */
  descriptionHtml?: string

  /**
   * Auto-dismiss duration in milliseconds.
   * Set to 0 to disable auto-dismiss.
   * Loading toasts never auto-dismiss regardless of this value.
   */
  duration?: number

  /** Custom icon to override the default type icon */
  icon?: React.ReactNode

  /**
   * Action button configuration.
   * Button automatically closes the toast after onClick.
   */
  action?: {
    label: React.ReactNode
    onClick: () => void
  }

  /**
   * Cancel/dismiss button configuration.
   * Button automatically closes the toast.
   */
  cancel?: {
    label: React.ReactNode
    onClick?: () => void
  }

  /** Callback when toast is dismissed (manually or by action) */
  onClose?: () => void

  /** Callback when toast is auto-dismissed by timer */
  onAutoClose?: () => void

  /**
   * Whether toast can be swiped to dismiss.
   * @default true
   */
  dismissible?: boolean
}
```

### Types

```tsx
type ToastType = "default" | "info" | "success" | "warning" | "error" | "loading"

type ToastVariant =
  | "default" // Dark neutral (gray)
  | "accent" // Blue/brand color
  | "success" // Green
  | "warning" // Yellow/amber
  | "error" // Red
  | "assistive" // Pink/magenta

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
```

## Compound Components

### Toaster.Item

Wrapper for custom toast styling:

```tsx
<Toaster.Item className="bg-custom-color" style={{ borderRadius: 8 }}>
  {/* Slot children */}
</Toaster.Item>
```

### Toaster.Icon

Custom icon renderer with access to toast type and default icon:

```tsx
<Toaster.Icon className="text-2xl">
  {(type: ToastType, defaultIcon: React.ReactNode) => {
    // Return custom icon based on type, or use defaultIcon
    return type === "success" ? "✅" : defaultIcon
  }}
</Toaster.Icon>
```

### Toaster.Title

Custom title styling:

```tsx
<Toaster.Title className="font-bold text-lg" />
```

### Toaster.Description

Custom description styling:

```tsx
<Toaster.Description className="text-sm opacity-80" />
```

### Toaster.Actions

Custom action buttons renderer:

```tsx
<Toaster.Actions className="flex gap-2">
  {(
    action: { label: React.ReactNode; onClick: () => void } | undefined,
    cancel: { label: React.ReactNode; onClick?: () => void } | undefined,
    close: () => void
  ) => (
    <>
      {action && (
        <Button
          onClick={() => {
            action.onClick()
            close()
          }}
        >
          {action.label}
        </Button>
      )}
      {cancel && <Button onClick={close}>{cancel.label}</Button>}
    </>
  )}
</Toaster.Actions>
```

## API Reference

### toast.use(id)

Returns a toast API scoped to a specific Toaster. The API is cached per ID.

```tsx
const api = toast.use("my-toaster")

// Default toast - returns toast ID
const id = api("title", options?)

// Typed toasts - return toast ID
api.info("title", options?)
api.success("title", options?)
api.warning("title", options?)
api.error("title", options?)
api.loading("title", options?)

// Promise toast - returns the original promise
api.promise(promise, { loading, success, error })

// Dismissal
api.dismiss(id)    // Dismiss specific toast
api.dismissAll()   // Dismiss all toasts in this Toaster
```

### Promise API

```tsx
interface PromiseOptions<T> {
  /** Shown while promise is pending */
  loading: string | (ToastOptions & { title: string })

  /** Shown when promise resolves */
  success:
    | string
    | (ToastOptions & { title: string })
    | ((data: T) => string | (ToastOptions & { title: string }))

  /** Shown when promise rejects */
  error:
    | string
    | (ToastOptions & { title: string })
    | ((err: unknown) => string | (ToastOptions & { title: string }))
}
```

## Behavior

### Auto-Dismiss

- Default duration: 5000ms (configurable via Toaster `duration` prop)
- Individual toasts can override with `duration` option
- Set `duration: 0` for persistent toasts
- Loading toasts (`toast.loading()`) never auto-dismiss
- Timer pauses when hovering over the toast stack

### Stacking

- Toasts stack with visual offset and opacity fade
- Hover over stack to expand and view all toasts
- Default limit: 3 visible toasts (configurable via `visibleToasts`)
- Maximum 100 toasts per Toaster (oldest are removed)

### Swipe to Dismiss

- Corner positions (left/right): Swipe horizontally
- Center positions: Swipe vertically (up/down)
- Direction-aware exit animation

### Progress Bar

- Shows remaining time before auto-dismiss
- Pauses when hovering
- Not shown for `loading` type or `duration: 0`
- Different styling for default vs compact layout

### Layout Modes

- **default**: Full-size with description support, fixed width (288px)
- **compact**: Single-line, dynamic width, no description, 40px height

## Accessibility

- ARIA live regions for screen reader announcements
- `role="status"` for info toasts, `role="alertdialog"` for warnings/errors
- `aria-live="polite"` for most toasts, `"assertive"` for errors
- Keyboard navigation: F6 to focus, Escape to dismiss
- Focus management within toast stack

## Component Structure

```
toast/
├── index.ts                    # Public exports
├── toaster.tsx                 # Main Toaster component
├── store.ts                    # Global state management
├── tv.ts                       # Tailwind Variants styles
├── types.ts                    # TypeScript definitions
└── components/
    ├── toaster-item.tsx        # Individual toast renderer
    ├── toaster-slots.tsx       # Compound component slots
    └── toast-progress-bar.tsx  # Progress indicator
```

## Best Practices

### Content

- Keep messages concise and actionable
- Use clear action button labels ("Undo", "Retry", "View")
- Match toast type to semantic meaning
- Provide descriptions for context when needed

### UX

- Don't overwhelm users with notifications
- Use appropriate durations (2-10 seconds)
- Provide dismiss option for persistent toasts
- Use loading toasts for async operations

### Performance

- Toast APIs are cached per toaster ID
- Use custom `id` option to update existing toasts
- Clean up persistent toasts when components unmount
- Maximum 100 toasts per toaster prevents memory issues

## Examples

### File Upload with Progress

```tsx
async function handleUpload(file: File) {
  const toastId = toast.use("app").loading(`Uploading ${file.name}...`)

  try {
    const result = await uploadFile(file)
    toast.use("app").success("Upload complete", {
      id: toastId, // Updates the existing toast
      description: `${file.name} uploaded successfully`,
      action: {
        label: "View",
        onClick: () => openFile(result.url),
      },
    })
  } catch (error) {
    toast.use("app").error("Upload failed", {
      id: toastId,
      description: error.message,
      action: {
        label: "Retry",
        onClick: () => handleUpload(file),
      },
    })
  }
}
```

### Cleanup on Unmount

```tsx
function MonitoringComponent() {
  const toastIdRef = useRef<string | null>(null)

  useEffect(() => {
    toastIdRef.current = toast.use("app").info("Monitoring started", {
      duration: 0,
    })

    return () => {
      if (toastIdRef.current) {
        toast.use("app").dismiss(toastIdRef.current)
      }
    }
  }, [])

  return <div>Monitoring...</div>
}
```

### Form Submission

```tsx
function handleSubmit(data: FormData) {
  toast.use("app").promise(submitForm(data), {
    loading: "Submitting form...",
    success: "Form submitted successfully!",
    error: (err) => `Submission failed: ${err.message}`,
  })
}
```

## Notes

- Uses Framer Motion for enter/exit animations
- Renders in a shared portal by default (cleaned up when all Toasters unmount)
- Global store persists across component re-renders
- HTML content (`descriptionHtml`) should be sanitized if from user input
- SSR compatible (portal created on client only)
- Supports React 18+ with `useSyncExternalStore`
