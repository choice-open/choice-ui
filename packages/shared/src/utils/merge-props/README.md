# mergeProps

A utility function for intelligently merging multiple props objects with special handling for event handlers, classNames, and IDs.

## Import

```typescript
import { mergeProps } from "@choiceform/design-system/utils"
```

## Usage

```typescript
// Basic usage
const props = mergeProps(
  { className: "base", onClick: handleClick1 },
  { className: "variant", onClick: handleClick2 }
)
// Result: { className: "base variant", onClick: [handleClick1, handleClick2] }

// Merging with user props
function Button({ className, ...userProps }) {
  const props = mergeProps(
    { className: "btn", onClick: handleInternalClick },
    { className },
    userProps
  )
  return <button {...props} />
}

// Handling null/undefined
const props = mergeProps(
  { className: "default" },
  null,
  undefined,
  { id: "my-button" }
)
// Result: { className: "default", id: "my-button" }
```

## API

### mergeProps

```typescript
function mergeProps<T extends PropsArg[]>(...args: T): UnionToIntersection<TupleTypes<T>>
```

#### Parameters

- `...args` - Multiple props objects to merge. Can include `null` or `undefined` values which are safely ignored.

#### Returns

A merged props object with proper TypeScript type inference.

## Features

- **Event handler chaining**: Automatically chains multiple event handlers (onClick, onChange, etc.)
- **ClassName merging**: Concatenates multiple className strings with space separation
- **ID deduplication**: Intelligently merges multiple IDs
- **Type safety**: Full TypeScript support with proper type inference
- **Null safety**: Handles null and undefined props gracefully
- **Override behavior**: Later props override earlier ones (except for special cases)

## Special Handling

### Event Handlers

Event handlers (props starting with "on" followed by an uppercase letter) are automatically chained:

```typescript
const props = mergeProps(
  { onClick: () => console.log("First") },
  { onClick: () => console.log("Second") },
  { onClick: () => console.log("Third") }
)
// All three handlers will be called in order

// Usage
<button {...props} /> // Logs: "First", "Second", "Third" on click
```

### Class Names

Both `className` and `class` props are merged:

```typescript
const props = mergeProps({ className: "btn" }, { className: "btn-primary" }, { className: "large" })
// Result: { className: "btn btn-primary large" }

// Also works with 'class' prop
const props2 = mergeProps({ class: "base" }, { class: "modifier" })
// Result: { class: "base modifier" }
```

### IDs

Multiple IDs are combined with space separation:

```typescript
const props = mergeProps({ id: "user-button" }, { id: "submit-button" })
// Result: { id: "user-button submit-button" }

// Duplicate IDs are not repeated
const props2 = mergeProps({ id: "btn" }, { id: "btn" })
// Result: { id: "btn" }
```

## Examples

### Component Composition

```typescript
function BaseButton(props) {
  const baseProps = {
    className: "btn",
    onClick: () => console.log("Base click"),
    type: "button"
  }

  return <button {...mergeProps(baseProps, props)} />
}

function PrimaryButton(props) {
  const primaryProps = {
    className: "btn-primary",
    onClick: () => console.log("Primary click")
  }

  return <BaseButton {...mergeProps(primaryProps, props)} />
}

// Usage
<PrimaryButton
  className="large"
  onClick={() => console.log("User click")}
/>
// Results in: className="btn btn-primary large"
// All three onClick handlers are called
```

### Forwarding Props with Defaults

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

function Button({ variant = "primary", ...props }: ButtonProps) {
  const defaultProps = {
    className: `btn btn-${variant}`,
    type: "button" as const,
    role: "button"
  }

  return <button {...mergeProps(defaultProps, props)} />
}
```

### Conditional Props Merging

```typescript
function InteractiveElement({ disabled, ...props }) {
  const interactiveProps = !disabled ? {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: 0
  } : {}

  return <div {...mergeProps(
    { className: "interactive-element" },
    interactiveProps,
    props
  )} />
}
```

### HOC Pattern

```typescript
function withTooltip(Component) {
  return function WithTooltip(props) {
    const tooltipProps = {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      "aria-describedby": "tooltip"
    }

    return <Component {...mergeProps(tooltipProps, props)} />
  }
}
```

## Best Practices

1. **Order matters**: Place default props first, then overrides
2. **Type safety**: Let TypeScript infer types when possible
3. **Event chaining**: Be aware that all event handlers will be called
4. **Performance**: mergeProps is optimized but avoid calling it in render loops

## Notes

- The function performs a shallow merge of props
- Event handler detection is based on the "on" prefix convention
- Special handling only applies to specific props (events, className, id)
- All other props follow standard override behavior (last wins)
- The function is designed for React props but can be used for any object merging
