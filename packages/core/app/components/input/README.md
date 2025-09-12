# Input

A versatile, accessible text input component that supports multiple visual variants, sizes, and states. It provides editing state tracking and automatic text selection on focus for enhanced user experience.

## Import

```tsx
import { Input } from "@choiceform/design-system"
```

## Features

- Multiple visual variants for different contexts (default, light, dark, reset)
- Two sizes for different density needs
- Selected state for visual emphasis
- Editing state tracking with callbacks
- Automatic text selection on focus
- Disabled and read-only support
- Password manager protection (`data-1p-ignore`)
- Automatic spellcheck and autocomplete disabling for specialized inputs
- Keyboard and screen-reader friendly

## Usage

### Basic

```tsx
<Input
  value={value}
  onChange={setValue}
/>
```

### Sizes

```tsx
<Input size="default" value={value} onChange={setValue} />
<Input size="large" value={value} onChange={setValue} />
```

### Variants

```tsx
<Input variant="default" value={value} onChange={setValue} />  // Follows page theme
<Input variant="light" value={value} onChange={setValue} />    // Fixed light appearance
<Input variant="dark" value={value} onChange={setValue} />     // Fixed dark appearance
<Input variant="reset" value={value} onChange={setValue} />    // No variant styling
```

### States

```tsx
<Input selected value={value} onChange={setValue} />
<Input disabled value={value} onChange={setValue} />
<Input readOnly value={value} />
```

### With editing state tracking

```tsx
<Input
  value={value}
  onChange={setValue}
  onIsEditingChange={(isEditing) => {
    console.log("Input editing state:", isEditing)
  }}
/>
```

### Different input types

```tsx
<Input type="email" value={email} onChange={setEmail} />
<Input type="password" value={password} onChange={setPassword} />
<Input type="url" value={url} onChange={setUrl} />
```

## Props

```ts
interface InputProps extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange" | "size"> {
  /** Additional CSS class names */
  className?: string

  /** Callback when the input value changes */
  onChange?: (value: string) => void

  /** Callback when editing state changes (focus/blur) */
  onIsEditingChange?: (isEditing: boolean) => void

  /** Whether the input appears selected/highlighted */
  selected?: boolean

  /** Input size variant */
  size?: "default" | "large"

  /** Current input value */
  value?: string

  /** Visual style variant of the input */
  variant?: "default" | "light" | "dark" | "reset"
}
```

- Defaults:
  - `size`: "default"
  - `variant`: "default"
  - `selected`: `false`
  - `type`: "text" (overridable via prop)
  - `spellCheck`: `false`
  - `autoComplete`: "false"

- Behavior:
  - Automatically selects all text on focus
  - Tracks editing state and calls `onIsEditingChange` on focus/blur
  - Cleans up editing state on component unmount
  - Protected from password managers with `data-1p-ignore`

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` to create variants.
- Customize using the `className` prop; classes are merged with the component's internal classes.
- The component applies responsive borders and backgrounds based on state and variant.

## Accessibility

- Supports all standard HTML input attributes
- Proper focus management with visual indicators
- Compatible with screen readers
- Keyboard navigation friendly
- Supports `aria-*` attributes for enhanced accessibility

## Best practices

- Use appropriate input types (`email`, `password`, `url`, etc.) for better user experience
- Provide clear placeholder text when needed
- Use the `selected` state to highlight important or active inputs
- Handle editing state changes to provide user feedback
- Consider using `readOnly` instead of `disabled` when the value should remain visible but not editable

## Examples

### Form field with validation

```tsx
const [email, setEmail] = useState("")
const [isValid, setIsValid] = useState(true)

<Input
  type="email"
  value={email}
  onChange={(value) => {
    setEmail(value)
    setIsValid(value.includes("@"))
  }}
  selected={!isValid}
  placeholder="Enter your email"
/>
```

### Password input with editing feedback

```tsx
const [password, setPassword] = useState("")
const [isEditing, setIsEditing] = useState(false)

<div className="relative">
  <Input
    type="password"
    value={password}
    onChange={setPassword}
    onIsEditingChange={setIsEditing}
    placeholder="Enter password"
  />
  {isEditing && <div className="text-body-small text-secondary">Editing...</div>}
</div>
```

### Large dark variant

```tsx
<Input
  variant="dark"
  size="large"
  value={value}
  onChange={setValue}
  placeholder="Search in dark theme..."
/>
```

## Notes

- The component automatically handles text selection on focus to improve user experience
- Editing state is properly cleaned up when the component unmounts
- The `default` variant adapts to the current theme (light/dark mode)
- The `light` and `dark` variants provide fixed appearances regardless of theme
- The `reset` variant provides minimal styling for custom implementations
- Password managers are disabled by default to prevent interference with specialized inputs
