# Description

An accessible description component that provides supplementary text for form fields and UI elements, built with React Aria compatibility.

## Import

```tsx
import { Description } from "@choice-ui/react"
```

## Features

- Semantic description text with `slot="description"` for React Aria
- Proper accessibility with `aria-describedby` association
- Disabled state support that matches form field states
- Automatic typography and muted text styling

## Usage

### Basic

```tsx
import { Input, Label } from "@choice-ui/react"
;<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    aria-describedby="email-description"
  />
  <Description id="email-description">
    We'll never share your email with anyone else.
  </Description>
</div>
```

### Disabled state

```tsx
import { Input, Label } from "@choice-ui/react"
;<div className="flex flex-col gap-2">
  <Label
    htmlFor="disabled"
    disabled
  >
    Email
  </Label>
  <Input
    id="disabled"
    disabled
    aria-describedby="disabled-description"
  />
  <Description
    id="disabled-description"
    disabled
  >
    This field is currently disabled.
  </Description>
</div>
```

### Multiple descriptions

```tsx
import { Input, Label } from "@choice-ui/react"
;<div className="flex flex-col gap-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    aria-describedby="password-hint password-requirements"
  />
  <Description id="password-hint">Choose a strong password.</Description>
  <Description id="password-requirements">
    Must be at least 8 characters with one uppercase letter.
  </Description>
</div>
```

## Props

```ts
interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Description content */
  children: React.ReactNode

  /** Additional CSS class names */
  className?: string

  /** Whether the associated field is disabled */
  disabled?: boolean
}
```

- Defaults:
  - `disabled`: `false`

- Accessibility:
  - Uses semantic `p` element with `slot="description"` for React Aria
  - Associate with form controls using `aria-describedby` and matching `id`
  - Multiple descriptions can be linked by space-separating IDs

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts`.
- Customize using the `className` prop; classes are merged with the component's internal classes.
- Base styling includes muted text color (`text-secondary-foreground`).

## Best practices

- Always associate descriptions with their corresponding form controls using `aria-describedby`
- Use descriptions to provide helpful context, not critical instructions
- Keep description text concise and actionable
- Match the `disabled` state with the associated form field
- Consider using multiple descriptions for complex fields (hints, requirements, errors)

## Notes

- The `slot="description"` attribute enables automatic accessibility integration with React Aria components
- Description text uses muted colors to establish visual hierarchy with form labels
- When disabled, the text color changes to indicate the inactive state
