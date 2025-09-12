# Label

An accessible form label component that provides proper semantic labeling for form inputs with support for descriptions, required indicators, and custom actions.

## Import

```tsx
import { Label } from "@choiceform/design-system"
```

## Features

- Semantic form labeling with proper `htmlFor` association
- Support for both `label` and `legend` elements
- Description text for additional context
- Required field indicator with visual asterisk
- Custom action elements (e.g., help buttons, tooltips)
- Visual variants for different themes (default, light, dark, reset)
- Disabled state support
- Automatic typography and spacing

## Usage

### Basic

```tsx
import { Input } from "@choiceform/design-system"
;<div className="flex flex-col gap-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" />
</div>
```

### With description

```tsx
import { Input } from "@choiceform/design-system"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="email"
    description="Please enter your full email address"
  >
    Email Address
  </Label>
  <Input
    id="email"
    type="email"
  />
</div>
```

### Required field

```tsx
import { Input } from "@choiceform/design-system"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="required"
    required
  >
    Required Field
  </Label>
  <Input id="required" />
</div>
```

### Disabled state

```tsx
import { Input } from "@choiceform/design-system"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="disabled"
    disabled
  >
    Disabled Field
  </Label>
  <Input
    id="disabled"
    disabled
  />
</div>
```

### With action

```tsx
import { Input, IconButton } from "@choiceform/design-system"
import { QuestionCircle } from "@choiceform/icons-react"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="help"
    description="This field needs additional explanation"
    action={
      <IconButton
        variant="ghost"
        className="size-4"
      >
        <QuestionCircle />
      </IconButton>
    }
  >
    Field with Help
  </Label>
  <Input id="help" />
</div>
```

### As legend for fieldset

```tsx
<fieldset>
  <Label as="legend">Personal Information</Label>
  {/* Radio buttons or other grouped form controls */}
</fieldset>
```

### Variants

```tsx
import { Input } from "@choiceform/design-system"

// Default - follows page theme
<Label htmlFor="default" variant="default">
  Default Variant
</Label>

// Light - fixed light appearance
<Label htmlFor="light" variant="light">
  Light Variant
</Label>

// Dark - fixed dark appearance
<div className="bg-gray-800 p-4">
  <Label htmlFor="dark" variant="dark">
    Dark Variant
  </Label>
</div>

// Reset - no variant styling
<Label htmlFor="reset" variant="reset">
  Reset Variant
</Label>
```

## Props

```ts
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement | HTMLLegendElement> {
  /** Custom action element (e.g., help button, tooltip trigger) */
  action?: React.ReactNode

  /** Element type to render - label for inputs, legend for fieldsets */
  as?: "label" | "legend"

  /** Label content */
  children: React.ReactNode

  /** Additional CSS class names */
  className?: string

  /** Additional descriptive text */
  description?: string

  /** Whether the associated field is disabled */
  disabled?: boolean

  /** Whether the associated field is required */
  required?: boolean

  /** Visual variant for different themes */
  variant?: "default" | "light" | "dark" | "reset"
}
```

- Defaults:
  - `as`: "label"
  - `variant`: "default"
  - `disabled`, `required`: `false`

- Accessibility:
  - Uses semantic `label` or `legend` elements
  - Proper association with form controls via `htmlFor` or fieldset grouping
  - Required indicator is announced by screen readers
  - Description provides additional context

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts` to create variants and slots.
- Customize using the `className` prop; classes are merged with the component's internal classes.
- Slots available in `tv.ts`: `root`, `content`, `required`, `description`, `action`.

## Best practices

- Always associate labels with their corresponding form controls
- Use descriptive, action-oriented label text
- Provide descriptions for complex or unfamiliar fields
- Mark required fields consistently across your interface
- Use `as="legend"` when labeling groups of related controls (like radio buttons)
- Consider the visual hierarchy when placing action elements

## Examples

### Complete form field

```tsx
import { Input } from "@choiceform/design-system"
;<div className="space-y-4">
  <div className="flex flex-col gap-2">
    <Label
      htmlFor="username"
      description="Must be 3-20 characters, letters and numbers only"
      required
    >
      Username
    </Label>
    <Input
      id="username"
      placeholder="Enter username"
    />
  </div>
</div>
```

### Fieldset with legend

```tsx
import { RadioGroup } from "@choiceform/design-system"
;<fieldset className="rounded border p-4">
  <Label
    as="legend"
    description="Select your preferred contact method"
  >
    Contact Preference
  </Label>
  <RadioGroup
    options={[
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
      { value: "sms", label: "SMS" },
    ]}
  />
</fieldset>
```

### With help tooltip

```tsx
import { Input, Tooltip, IconButton } from "@choiceform/design-system"
import { QuestionCircle } from "@choiceform/icons-react"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="api-key"
    description="Found in your account settings"
    action={
      <Tooltip content="Your API key is used to authenticate requests">
        <IconButton
          variant="ghost"
          className="size-4"
        >
          <QuestionCircle />
        </IconButton>
      </Tooltip>
    }
  >
    API Key
  </Label>
  <Input
    id="api-key"
    type="password"
    placeholder="Enter your API key"
  />
</div>
```

## Notes

- The component automatically handles typography and spacing for consistent form layouts
- Required indicators use a red asterisk that is announced by screen readers
- Actions are positioned inline with the label for easy access
- The `default` variant adapts to the current theme (light/dark mode)
- The `light` and `dark` variants provide fixed appearances regardless of theme
- The `reset` variant provides minimal styling for custom implementations
- When using `as="legend"`, ensure the component is within a `fieldset` element
