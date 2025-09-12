# TextField

A comprehensive form field component that combines an Input with label, description, and prefix/suffix addon support. It provides a complete field experience with proper accessibility, flexible composition, and consistent styling.

## Import

```tsx
import { TextField } from "@choiceform/design-system"
```

## Features

- Built on the Input component for consistent behavior
- Compound component architecture with Label, Description, Prefix, and Suffix
- Automatic ID generation and label association
- Grid-based layout for perfect alignment of addons
- Multiple visual variants (default, light, dark, reset)
- Two sizes for different density needs
- Selected state for visual emphasis
- Complete accessibility with proper ARIA relationships
- Flexible composition with optional elements
- Integrated hover and focus states across all parts

## Usage

### Basic

```tsx
<TextField
  value={value}
  onChange={setValue}
/>
```

### With label

```tsx
<TextField
  value={value}
  onChange={setValue}
>
  <TextField.Label>Email Address</TextField.Label>
</TextField>
```

### Complete field with description

```tsx
<TextField
  value={value}
  onChange={setValue}
>
  <TextField.Label>Username</TextField.Label>
  <TextField.Description>Choose a unique username between 3-20 characters</TextField.Description>
</TextField>
```

### With prefix and suffix

```tsx
<TextField
  value={price}
  onChange={setPrice}
>
  <TextField.Label>Price</TextField.Label>
  <TextField.Prefix>$</TextField.Prefix>
  <TextField.Suffix>.00</TextField.Suffix>
</TextField>
```

### Icon prefix and action suffix

```tsx
import { Search, Settings } from "@choiceform/icons-react"
;<TextField
  value={query}
  onChange={setQuery}
>
  <TextField.Prefix>
    <Search />
  </TextField.Prefix>
  <TextField.Suffix>
    <IconButton
      variant="ghost"
      size="sm"
    >
      <Settings />
    </IconButton>
  </TextField.Suffix>
</TextField>
```

### Sizes

```tsx
<TextField size="default" value={value} onChange={setValue} />
<TextField size="large" value={value} onChange={setValue} />
```

### Variants

```tsx
// Default - follows page theme
<TextField variant="default" value={value} onChange={setValue} />

// Light - fixed light appearance
<TextField variant="light" value={value} onChange={setValue} />

// Dark - fixed dark appearance
<TextField variant="dark" value={value} onChange={setValue} />

// Reset - no variant styling
<TextField variant="reset" value={value} onChange={setValue} />
```

### States

```tsx
<TextField selected value={value} onChange={setValue} />
<TextField disabled value={value} onChange={setValue} />
```

## Component Architecture

TextField uses a compound component pattern with the following sub-components:

### TextField.Label

- Associates with the input via `htmlFor`
- Inherits variant and disabled state
- Supports all Label component props

### TextField.Description

- Provides additional context or help text
- Positioned below the input field
- Supports text wrapping and formatting

### TextField.Prefix

- Positioned at the start of the input
- Perfectly aligned with input content
- Can contain text, icons, or interactive elements

### TextField.Suffix

- Positioned at the end of the input
- Perfectly aligned with input content
- Can contain text, icons, or interactive elements

## Props

```ts
interface TextFieldProps extends Omit<InputProps, "children"> {
  /** Child components (Label, Description, Prefix, Suffix) */
  children?: ReactNode
}
```

Inherits all props from `InputProps`:

- `value?: string` - Current field value
- `onChange?: (value: string) => void` - Value change callback
- `onIsEditingChange?: (isEditing: boolean) => void` - Editing state callback
- `variant?: "default" | "light" | "dark" | "reset"` - Visual style variant
- `size?: "default" | "large"` - Field size
- `selected?: boolean` - Selected/highlighted state
- `disabled?: boolean` - Disabled state
- `className?: string` - Additional CSS classes
- All other standard HTML input attributes

## Sub-component Props

### TextField.Label

Inherits from Label component with automatic `htmlFor` association.

### TextField.Description

- `className?: string` - Additional CSS classes
- `children: ReactNode` - Description content

### TextField.Prefix / TextField.Suffix

- `className?: string` - Additional CSS classes
- `children: ReactNode` - Addon content

## Styling

- Uses Tailwind CSS via `tailwind-variants` with comprehensive slot system
- Slots available: `container`, `root`, `input`, `prefix`, `suffix`, `description`
- Grid-based layout ensures perfect alignment regardless of content
- Hover and focus states are coordinated across all parts
- Customize using `className` prop on TextField or sub-components

## Layout System

The component uses CSS Grid for precise layout:

```css
.text-field-root {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "prefix input suffix";
}
```

This ensures:

- Perfect vertical alignment of prefix/suffix with input
- Input takes remaining space
- Consistent spacing regardless of content

## Accessibility

- Automatic ID generation for proper label association
- Support for `aria-describedby` when description is present
- All Input accessibility features are preserved
- Proper focus management and keyboard navigation
- Screen reader friendly with semantic markup
- Supports all ARIA attributes

## Best practices

- Always provide a meaningful label for form fields
- Use descriptions to clarify expected input format or constraints
- Choose appropriate prefix/suffix content that enhances understanding
- Use consistent sizing throughout your forms
- Leverage the selected state to highlight validation issues or important fields
- Test with screen readers to ensure proper accessibility

## Examples

### Email field with validation

```tsx
const [email, setEmail] = useState("")
const [isValid, setIsValid] = useState(true)

<TextField
  type="email"
  value={email}
  onChange={(value) => {
    setEmail(value)
    setIsValid(!value || value.includes("@"))
  }}
  selected={!isValid}
>
  <TextField.Label>Email Address</TextField.Label>
  <TextField.Description>
    {isValid ? "We'll use this to send you updates" : "Please enter a valid email address"}
  </TextField.Description>
</TextField>
```

### Currency input

```tsx
const [amount, setAmount] = useState("")

<TextField
  type="number"
  value={amount}
  onChange={setAmount}
  size="large"
>
  <TextField.Label>Amount</TextField.Label>
  <TextField.Prefix>$</TextField.Prefix>
  <TextField.Suffix>USD</TextField.Suffix>
  <TextField.Description>
    Enter the amount in US dollars
  </TextField.Description>
</TextField>
```

### Search field with action

```tsx
import { Search, Filter } from "@choiceform/icons-react"

const [query, setQuery] = useState("")

<TextField value={query} onChange={setQuery}>
  <TextField.Label>Search Products</TextField.Label>
  <TextField.Prefix>
    <Search className="w-4 h-4" />
  </TextField.Prefix>
  <TextField.Suffix>
    <IconButton variant="ghost" tooltip="Filter options">
      <Filter className="w-4 h-4" />
    </IconButton>
  </TextField.Suffix>
</TextField>
```

### Dark theme form field

```tsx
<TextField
  variant="dark"
  size="large"
  value={value}
  onChange={setValue}
>
  <TextField.Label>API Key</TextField.Label>
  <TextField.Description>Enter your API key to connect your account</TextField.Description>
</TextField>
```

### Minimal field without container

```tsx
// For cases where you need just the input with addons
<TextField
  value={value}
  onChange={setValue}
>
  <TextField.Prefix>@</TextField.Prefix>
</TextField>
```

## Advanced Usage

### Custom addon components

```tsx
const CustomPrefix = ({ children, className }) => (
  <TextField.Prefix className={cn("bg-blue-100", className)}>
    {children}
  </TextField.Prefix>
)

<TextField value={value} onChange={setValue}>
  <CustomPrefix>
    <Badge variant="secondary">PRO</Badge>
  </CustomPrefix>
</TextField>
```

### Conditional descriptions

```tsx
<TextField
  value={value}
  onChange={setValue}
>
  <TextField.Label>Password</TextField.Label>
  {showRequirements && (
    <TextField.Description>
      Must be at least 8 characters with numbers and symbols
    </TextField.Description>
  )}
</TextField>
```

## Notes

- The component automatically handles label association via unique IDs
- Only renders the container div when Label or Description is present
- Grid layout ensures consistent alignment regardless of addon content
- All sub-components are properly typed and support ref forwarding
- Variant options:
  - `default`: Follows the page theme dynamically (light/dark mode)
  - `light`: Fixed light appearance regardless of theme
  - `dark`: Fixed dark appearance regardless of theme
  - `reset`: Removes variant styling, no variant settings applied
