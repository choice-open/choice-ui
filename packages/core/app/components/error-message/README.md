# ErrorMessage

An accessible error message component for displaying validation errors in form fields and UI elements, built with React Aria compatibility.

## Import

```tsx
import { ErrorMessage } from "@choice-ui/react"
```

## Features

- Semantic error text with `slot="errorMessage"` for React Aria
- Built-in `role="alert"` for screen reader announcements
- Danger color styling for clear visual feedback
- Disabled state support that matches form field states

## Usage

### Basic

```tsx
import { Input, Label } from "@choice-ui/react"
;<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    aria-describedby="email-error"
    aria-invalid="true"
  />
  <ErrorMessage id="email-error">Please enter a valid email address.</ErrorMessage>
</div>
```

### With form validation

```tsx
import { Input, Label, Description } from "@choice-ui/react"
import { useState } from "react"

function EmailField() {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  const validate = (email: string) => {
    if (!email) {
      setError("Email is required")
    } else if (!email.includes("@")) {
      setError("Please enter a valid email address")
    } else {
      setError("")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => validate(value)}
        aria-describedby={error ? "email-error" : "email-description"}
        aria-invalid={!!error}
      />
      {error ? (
        <ErrorMessage id="email-error">{error}</ErrorMessage>
      ) : (
        <Description id="email-description">
          We'll never share your email.
        </Description>
      )}
    </div>
  )
}
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
    aria-describedby="disabled-error"
  />
  <ErrorMessage
    id="disabled-error"
    disabled
  >
    This field has an error but is disabled.
  </ErrorMessage>
</div>
```

## Props

```ts
interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Error message content */
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
  - Uses semantic `p` element with `role="alert"` for immediate announcement
  - `slot="errorMessage"` for React Aria integration
  - Associate with form controls using `aria-describedby` and matching `id`
  - Set `aria-invalid="true"` on the associated input when error is shown

## Styling

- This component uses Tailwind CSS via `tailwind-variants` in `tv.ts`.
- Customize using the `className` prop; classes are merged with the component's internal classes.
- Base styling includes danger text color (`text-danger-foreground`).

## Best practices

- Always associate error messages with their corresponding form controls using `aria-describedby`
- Set `aria-invalid="true"` on inputs when displaying error messages
- Keep error messages concise and actionable
- Show errors after user interaction (blur, submit), not immediately
- Consider replacing description with error message when validation fails
- Match the `disabled` state with the associated form field

## Notes

- The `slot="errorMessage"` attribute enables automatic accessibility integration with React Aria components
- The `role="alert"` ensures screen readers announce the error immediately when it appears
- Error text uses danger colors to clearly indicate validation failures
- When disabled, the text color changes to match the disabled input state
