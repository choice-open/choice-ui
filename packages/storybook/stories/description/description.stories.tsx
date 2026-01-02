import { Description, Input, Label } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta<typeof Description> = {
  title: "Forms/Description",
  component: Description,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Description>

/**
 * Basic description usage.
 *
 * Use the `Description` component to provide supplementary text for form fields.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        aria-describedby="email-description"
      />
      <Description id="email-description">
        We'll never share your email with anyone else.
      </Description>
    </div>
  ),
}

/**
 * Disabled description.
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
        aria-describedby="disabled-email-description"
      />
      <Description
        id="disabled-email-description"
        disabled
      >
        This field is currently disabled.
      </Description>
    </div>
  ),
}

/**
 * Multiple descriptions.
 *
 * You can use multiple descriptions to provide different types of information.
 */
export const MultipleDescriptions: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
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
  ),
}
