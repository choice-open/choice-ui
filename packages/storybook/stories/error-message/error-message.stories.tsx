import { Description, ErrorMessage, Input, Label } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useCallback, useState } from "react"

const meta: Meta<typeof ErrorMessage> = {
  title: "Forms/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ErrorMessage>

/**
 * Basic error message usage.
 *
 * Use the `ErrorMessage` component to display validation errors for form fields.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        aria-describedby="email-error"
        aria-invalid="true"
      />
      <ErrorMessage id="email-error">Please enter a valid email address.</ErrorMessage>
    </div>
  ),
}

/**
 * Disabled error message.
 *
 * Use the `disabled` prop to match the disabled state of form fields.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label
        htmlFor="disabled-email"
        disabled
      >
        Email
      </Label>
      <Input
        id="disabled-email"
        disabled
        aria-describedby="disabled-email-error"
        aria-invalid="true"
      />
      <ErrorMessage
        id="disabled-email-error"
        disabled
      >
        This field has an error but is disabled.
      </ErrorMessage>
    </div>
  ),
}

/**
 * Interactive validation example.
 *
 * Shows how to conditionally display ErrorMessage or Description based on validation state.
 */
export const WithValidation: Story = {
  render: function WithValidationStory() {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [touched, setTouched] = useState(false)

    const validate = (email: string) => {
      if (!email) {
        return "Email is required"
      }
      if (!email.includes("@")) {
        return "Please enter a valid email address"
      }
      return ""
    }

    const handleBlur = useCallback(() => {
      setTouched(true)
      setError(validate(value))
    }, [validate])

    const handleChange = useCallback(
      (value: string) => {
        setValue(value)
        if (touched) {
          setError(validate(value))
        }
      },
      [touched, validate],
    )

    return (
      <div className="flex w-64 flex-col gap-2">
        <Label htmlFor="validated-email">Email</Label>
        <Input
          id="validated-email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={error ? "validated-email-error" : "validated-email-description"}
          aria-invalid={!!error}
        />
        {error ? (
          <ErrorMessage id="validated-email-error">{error}</ErrorMessage>
        ) : (
          <Description id="validated-email-description">
            We'll never share your email with anyone else.
          </Description>
        )}
      </div>
    )
  },
}
