import { IconButton, Input, Label } from "@choiceform/design-system";
import { QuestionCircle } from "@choiceform/icons-react";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Label> = {
  title: "Forms/Label",
  component: Label,
  tags: ["new", "autodocs"],
};

export default meta;

type Story = StoryObj<typeof Label>;

/**
 * Basic label usage.
 *
 * Use the `Label` component to annotate form fields.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
  ),
};

/**
 * Label with description.
 *
 * Use the `description` prop to provide additional context.
 */
export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description" description="Please enter your full name">
        Name
      </Label>

      <Input id="description" />
    </div>
  ),
};

/**
 * Disabled label.
 *
 * Use the `disabled` prop to indicate the field is not editable.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="disabled" disabled>
        Name
      </Label>
      <Input id="disabled" disabled />
    </div>
  ),
};

/**
 * Required label.
 *
 * Use the `required` prop to show a required indicator.
 */
export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="required" required>
        Name
      </Label>
      <Input id="required" />
    </div>
  ),
};

/**
 * Label with action.
 *
 * Use the `action` prop to add an action to the label.
 */
export const WithAction: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor="action"
        description="This is a description"
        action={
          <IconButton variant="ghost" className="size-4">
            <QuestionCircle />
          </IconButton>
        }
      >
        Name
      </Label>
      <Input id="action" />
    </div>
  ),
};
