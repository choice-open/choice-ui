# tcx

A utility function that combines classnames with Tailwind CSS class merging for optimal class composition.

## Import

```typescript
import { tcx } from "@choiceform/design-system/utils"
```

## Usage

```typescript
// Basic usage
tcx("px-4 py-2", "bg-blue-500")
// Result: "px-4 py-2 bg-blue-500"

// Conditional classes
tcx(
  "btn",
  isPrimary && "btn-primary",
  isLarge && "text-body-large",
  disabled && "cursor-not-allowed opacity-50",
)

// Overriding Tailwind classes
tcx("px-4", "px-8") // Result: "px-8" (tailwind-merge handles conflicts)

// Object syntax
tcx({
  "bg-blue-500": isPrimary,
  "bg-gray-500": !isPrimary,
  "text-white": true,
})

// Array syntax
tcx(["btn", "btn-primary"], ["text-body-large-strong"])

// Mixed syntax
tcx("base-class", ["array", "of", "classes"], { conditional: isActive }, undefined, null, false)
```

## API

### tcx

```typescript
function tcx(...args: cx.ArgumentArray): string
```

#### Parameters

- `...args` - Any number of classname arguments following the `classnames` library syntax:
  - Strings
  - Objects with boolean values
  - Arrays of valid arguments
  - Undefined, null, false, or true values (ignored)

#### Returns

A string of merged class names with Tailwind CSS conflict resolution.

## Features

- **Tailwind conflict resolution**: Automatically resolves conflicting Tailwind utilities
- **classnames compatibility**: Supports all `classnames` library syntax
- **Intelligent merging**: Later classes override earlier ones for Tailwind utilities
- **Flexible syntax**: Accepts strings, objects, arrays, and conditionals
- **Performance optimized**: Efficient class merging and deduplication
- **Type safe**: Full TypeScript support

## How It Works

`tcx` combines two powerful libraries:

1. **classnames**: Handles conditional class logic and multiple syntax styles
2. **tailwind-merge**: Intelligently merges Tailwind CSS classes to avoid conflicts

This combination ensures that:

- Conditional logic is easy to write
- Tailwind utility conflicts are automatically resolved
- The final class string is optimized and clean

## Examples

### Component Variants

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
}

function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={tcx(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-strong",
        "transition-colors focus:outline-none focus:ring-2",

        // Variant styles
        {
          "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300": variant === "secondary",
          "hover:bg-gray-100": variant === "ghost"
        },

        // Size styles
        {
          "px-3 py-1 text-body-small": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-3 text-body-large": size === "lg"
        },

        // User provided classes (can override above)
        className
      )}
      {...props}
    />
  )
}

// Usage
<Button className="px-8" /> // px-8 overrides px-4 from size="md"
```

### Dynamic Styling

```typescript
function StatusBadge({ status, className }) {
  return (
    <span
      className={tcx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-strong",
        {
          "bg-green-100 text-green-800": status === "active",
          "bg-red-100 text-red-800": status === "error",
          "bg-yellow-100 text-yellow-800": status === "warning",
          "bg-gray-100 text-gray-800": status === "inactive"
        },
        className
      )}
    >
      {status}
    </span>
  )
}
```

### Responsive Design

```typescript
function Card({ fullWidthMobile, className, children }) {
  return (
    <div
      className={tcx(
        "bg-white rounded-lg shadow-md p-6",
        fullWidthMobile ? "w-full md:w-auto" : "w-auto",
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Animation States

```typescript
function AnimatedPanel({ isOpen, className, children }) {
  return (
    <div
      className={tcx(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Complex Conditional Logic

```typescript
function DataTable({
  striped,
  hoverable,
  bordered,
  compact,
  className
}) {
  return (
    <table
      className={tcx(
        "w-full text-left",
        striped && "even:bg-gray-50",
        hoverable && "hover:bg-gray-100",
        bordered && "border border-gray-200",
        compact ? "text-body-small" : "text-base",
        className
      )}
    >
      {/* Table content */}
    </table>
  )
}
```

### Utility Props Pattern

```typescript
// Utility props that map to Tailwind classes
interface BoxProps {
  m?: string    // margin
  p?: string    // padding
  bg?: string   // background
  text?: string // text color
  className?: string
}

function Box({ m, p, bg, text, className, ...props }: BoxProps) {
  return (
    <div
      className={tcx(
        m && `m-${m}`,
        p && `p-${p}`,
        bg && `bg-${bg}`,
        text && `text-${text}`,
        className
      )}
      {...props}
    />
  )
}

// Usage
<Box p="4" m="2" bg="blue-500" text="white">
  Content
</Box>
```

## Why Use tcx?

### Without tcx (Problems):

```typescript
// Conflicting Tailwind classes
className="px-4 px-8" // Both are applied, causing issues

// Verbose conditional logic
className={`btn ${isPrimary ? 'btn-primary' : ''} ${isLarge ? 'text-body-large' : ''}`}

// Manual conflict resolution
className={isPrimary ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"}
```

### With tcx (Solutions):

```typescript
// Automatic conflict resolution
tcx("px-4", "px-8") // Only px-8 is applied

// Clean conditional syntax
tcx("btn", isPrimary && "btn-primary", isLarge && "text-body-large")

// Smart merging
tcx("bg-gray-500 hover:bg-gray-600", isPrimary && "bg-blue-500 hover:bg-blue-600")
```

## Best Practices

1. **Order matters**: Place default classes first, overrides last
2. **Use objects for variants**: Cleaner than multiple conditionals
3. **Extract complex logic**: Create variant maps for reusability
4. **Avoid string interpolation**: Use array/object syntax instead

## Notes

- The name "tcx" combines Tailwind CSS (t), classnames (c), and merge (x)
- Performance is optimized for typical React component use cases
- The function is pure and can be used outside React components
- Works with any Tailwind configuration including custom utilities
- Compatible with Tailwind CSS JIT mode
