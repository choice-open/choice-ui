# NumericInput

A sophisticated numeric input component that supports mathematical expression evaluation, unit formatting, and rich interaction patterns. Built for precision and flexibility in professional design tools.

## Import

```tsx
import { NumericInput } from "@choiceform/design-system"
```

## Features

- **Mathematical Expressions** - Evaluate math expressions like `1+2*3` or `50/2`
- **Unit Formatting** - Display values with units using expression patterns like `{value}px`
- **Multi-Value Support** - Handle complex objects and arrays with formatted display
- **Variable Binding** - Support for dynamic variable values with visual indication
- **Interactive Controls** - Keyboard navigation and drag-to-adjust functionality
- **Rich Composition** - Prefix and suffix elements with dropdown menus and actions
- **Step Controls** - Configurable step increments with modifier key support
- **Validation** - Built-in min/max constraints and decimal precision
- **Theme Support** - Multiple variants (default, light, dark, reset) for different contexts

## Usage

### Basic

```tsx
import { useState } from "react"

function MyComponent() {
  const [value, setValue] = useState(10)

  return (
    <NumericInput
      value={value}
      onChange={(newValue) => setValue(newValue as number)}
    />
  )
}
```

### With Prefix Icon

```tsx
import { HugWidth } from "@choiceform/icons-react"
;<NumericInput
  value={value}
  onChange={setValue}
>
  <NumericInput.Prefix>
    <HugWidth />
  </NumericInput.Prefix>
</NumericInput>
```

### With Suffix Icon

```tsx
import { Relative } from "@choiceform/icons-react"
;<NumericInput
  value={value}
  onChange={setValue}
>
  <NumericInput.Suffix>
    <Relative />
  </NumericInput.Suffix>
</NumericInput>
```

### Unit Formatting

```tsx
const [value, setValue] = useState(100)

<NumericInput
  value={value}
  expression="{value}px"
  onChange={(newValue) => setValue(newValue as number)}
>
  <NumericInput.Prefix>
    <FixedWidth />
  </NumericInput.Prefix>
</NumericInput>
```

### Multi-Value Expression

```tsx
const [dimensions, setDimensions] = useState({
  width: 100,
  height: 200
})

<NumericInput
  value={dimensions}
  expression="{width}px, {height}px"
  onChange={(newValue) => setDimensions(newValue as typeof dimensions)}
>
  <NumericInput.Prefix>
    <FixedWidth />
  </NumericInput.Prefix>
</NumericInput>
```

### With Dropdown Menu

```tsx
import { Dropdown, IconButton } from "@choiceform/design-system"
import { ChevronDownSmall, FixedHeight, HugHeight } from "@choiceform/icons-react"

const [value, setValue] = useState(10)
const [menuOpen, setMenuOpen] = useState(false)

<NumericInput
  focused={menuOpen}
  value={value}
  onChange={setValue}
>
  <NumericInput.Suffix type="menu">
    <Dropdown
      open={menuOpen}
      onOpenChange={setMenuOpen}
      placement="bottom"
    >
      <Dropdown.Trigger asChild>
        <IconButton className="rounded-l-none">
          <ChevronDownSmall />
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>
          <FixedHeight />
          Fixed height
        </Dropdown.Item>
        <Dropdown.Item>
          <HugHeight />
          Hug contents
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  </NumericInput.Suffix>
</NumericInput>
```

### With Action Menu

```tsx
import { Select } from "@choiceform/design-system"
import { ChevronDownSmall } from "@choiceform/icons-react"

const [value, setValue] = useState(10)
const [actionType, setActionType] = useState("fixed")
const [menuOpen, setMenuOpen] = useState(false)

<NumericInput
  focused={menuOpen}
  value={value}
  onChange={setValue}
>
  {actionType !== "fixed" && (
    <NumericInput.ActionPrompt>
      {actionType}
    </NumericInput.ActionPrompt>
  )}

  <NumericInput.Suffix type="action">
    <Select
      open={menuOpen}
      onOpenChange={setMenuOpen}
      value={actionType}
      onChange={setActionType}
      placement="bottom-end"
    >
      <Select.Trigger asChild>
        <IconButton className="rounded-l-none">
          <ChevronDownSmall />
        </IconButton>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="fixed">Fixed height</Select.Item>
        <Select.Item value="hug">Hug contents</Select.Item>
      </Select.Content>
    </Select>
  </NumericInput.Suffix>
</NumericInput>
```

### Variable Values

```tsx
import { Variable } from "@choiceform/icons-react"

const [value, setValue] = useState<number | undefined>(undefined)
const [variableValue, setVariableValue] = useState(10)

<NumericInput
  value={value}
  onChange={setValue}
>
  <NumericInput.Prefix>
    <FixedWidth />
  </NumericInput.Prefix>

  {!value && <NumericInput.Variable value={variableValue} />}

  <NumericInput.Suffix type="menu">
    <Dropdown>
      <Dropdown.Trigger asChild>
        <IconButton className="rounded-l-none">
          <Variable />
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item
          onClick={() => {
            setVariableValue(10)
            setValue(undefined)
          }}
        >
          Add variable...
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  </NumericInput.Suffix>
</NumericInput>
```

### Variants

```tsx
// Default - follows page theme
<NumericInput
  variant="default"
  value={value}
  onChange={setValue}
/>

// Light - fixed light appearance
<NumericInput
  variant="light"
  value={value}
  onChange={setValue}
/>

// Dark - fixed dark appearance
<NumericInput
  variant="dark"
  value={value}
  onChange={setValue}
/>

// Reset - no variant styling
<NumericInput
  variant="reset"
  value={value}
  onChange={setValue}
/>
```

## Props

```ts
interface NumericInputProps {
  /** Current numeric value */
  value?: NumericInputValue

  /** Default value for uncontrolled usage */
  defaultValue?: NumericInputValue

  /** Callback when value changes */
  onChange?: (value: NumericInputValue, detail: NumberResult) => void

  /** Callback when input is cleared */
  onEmpty?: () => void

  /** Expression pattern for formatted display (e.g., "{value}px") */
  expression?: string

  /** Minimum allowed value */
  min?: number

  /** Maximum allowed value */
  max?: number

  /** Step increment for arrow keys and drag */
  step?: number

  /** Step increment when Shift key is pressed */
  shiftStep?: number

  /** Number of decimal places to display */
  decimal?: number

  /** Whether the input is disabled */
  disabled?: boolean

  /** Whether the input is read-only */
  readOnly?: boolean

  /** Whether the input appears selected */
  selected?: boolean

  /** Whether the input appears focused */
  focused?: boolean

  /** Visual theme variant */
  variant?: "default" | "light" | "dark" | "reset"

  /** Tooltip configuration */
  tooltip?: {
    content: string
  }

  /** Child elements (Prefix, Suffix, Variable, etc.) */
  children?: React.ReactNode
}

type NumericInputValue = string | number | (string | number | undefined)[] | Record<string, number>

interface NumberResult {
  array: number[]
  string: string
  object: Record<string, number>
}
```

- Defaults: `step`: 1, `shiftStep`: 10, `variant`: "default"

## Sub-components

### NumericInput.Prefix

Container for prefix content like icons or labels.

### NumericInput.Suffix

Container for suffix content with different types for various use cases.

```ts
interface SuffixProps {
  type?: "default" | "menu" | "action"
  children?: React.ReactNode
}
```

### NumericInput.Variable

Displays a variable value when the main input is undefined.

```ts
interface VariableProps {
  value: number | string
}
```

### NumericInput.ActionPrompt

Displays action-related text or labels.

### NumericInput.MenuTrigger

A specialized button for triggering dropdown menus.

```ts
interface MenuTriggerProps {
  type?: "menu" | "action"
  "aria-label"?: string
}
```

## Styling

- Uses Tailwind CSS with `tailwind-variants` for consistent theming
- Customize using the `className` prop on individual sub-components
- Variants support:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme
  - `reset`: Removes variant styling, no variant settings applied
- Disabled state provides appropriate visual feedback

## Keyboard Navigation

| Key                             | Action                                 |
| ------------------------------- | -------------------------------------- |
| `↑` / `↓`                       | Increase/decrease by `step` value      |
| `Shift + ↑` / `Shift + ↓`       | Increase/decrease by `shiftStep` value |
| `Meta/Alt + ↑` / `Meta/Alt + ↓` | Increase/decrease by 1 (fine control)  |
| `Enter`                         | Confirm the current value              |
| `Escape`                        | Reset to previous value when editing   |

## Expression Patterns

| Pattern                     | Example Value               | Display                             |
| --------------------------- | --------------------------- | ----------------------------------- |
| `"{value}px"`               | `100`                       | "100px"                             |
| `"{width}x{height}"`        | `{width: 100, height: 200}` | "100x200"                           |
| `"{value1}, {value2}"`      | `[10, 20]`                  | "10, 20"                            |
| `"{value1}{value2,hidden}"` | `[10, 10]`                  | "10" (second hidden when identical) |

## Best Practices

- Use appropriate constraints (`min`, `max`, `step`) for better user experience
- Provide clear prefix/suffix elements to indicate value type or units
- For complex formatted values, always use the expression pattern
- Handle undefined values appropriately when using variables
- Use the `focused` prop when integrating with dropdown menus
- Test mathematical expressions with your expected value ranges

## Examples

### Mathematical Expression Evaluation

```tsx
// User can input "1+2*3" and get result of 7
// Component compares calculated result with current value
const [value, setValue] = useState(2)
const [changeCount, setChangeCount] = useState(0)

const handleChange = (newValue, detail) => {
  setValue(newValue as number)
  setChangeCount((prev) => prev + 1)
  console.log("Input text:", detail.string)
}

;<NumericInput
  value={value}
  onChange={handleChange}
/>
```

### Color RGB Input

```tsx
const [color, setColor] = useState({ r: 255, g: 128, b: 64 })

<NumericInput
  value={color}
  expression="rgb({r}, {g}, {b})"
  min={0}
  max={255}
  step={1}
  onChange={(newValue) => setColor(newValue as typeof color)}
/>
```

### Dimension Input with Units

```tsx
const [size, setSize] = useState({ width: 100, height: 50 })

<NumericInput
  value={size}
  expression="{width}px × {height}px"
  min={1}
  step={1}
  onChange={(newValue) => setSize(newValue as typeof size)}
>
  <NumericInput.Prefix>
    <FixedWidth />
  </NumericInput.Prefix>
</NumericInput>
```

## Accessibility

- Full keyboard navigation support
- Screen reader announcements for value changes
- Proper ARIA labels and descriptions
- Focus management for complex interactions
- High contrast support in both light and dark themes

## Notes

- Mathematical expressions are evaluated safely using a custom parser
- Variable values provide visual indication when active
- Component automatically formats display based on expression patterns
- Drag interactions work on both the input field and handler elements
- Expression parsing supports basic arithmetic operations: +, -, \*, /, ()
