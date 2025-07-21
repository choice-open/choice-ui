import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { MultiLineTextInput } from "./multi-line-text-input"
import { Button } from "../button"
import { Popover } from "../popover"

const meta: Meta<typeof MultiLineTextInput> = {
  title: "Forms/MultiLineTextInput",
  component: MultiLineTextInput,
  tags: ["deprecated", "autodocs"],
}

export default meta

type Story = StoryObj<typeof MultiLineTextInput>

/**
 * @deprecated Use Textarea instead.
 *
 * `MultiLineTextInput` is a versatile textarea component for multi-line text entry with automatic height adjustment.
 *
 * Features:
 * - Automatic height adjustment based on content
 * - Multiple visual variants (default, dark)
 * - Support for all standard input states (disabled, placeholder)
 * - Controlled and uncontrolled usage
 * - Minimum and maximum row limits
 * - Full keyboard and screen reader accessibility
 * - Consistent styling with the design system
 *
 * Usage Guidelines:
 * - Use for longer text input or when line breaks are needed
 * - Set appropriate min/max rows for your use case
 * - Provide clear labels for accessibility (typically outside the component)
 * - Use controlled mode when you need to validate or process input
 * - Choose appropriate variants based on your UI background
 *
 * Accessibility:
 * - Supports all standard textarea ARIA attributes
 * - Maintains consistent focus states
 * - Ensures proper contrast in all variants
 * - Works with form labels and screen readers
 */

/**
 * Basic: Demonstrates the default MultiLineTextInput component in its simplest form.
 *
 * This minimal example shows the standard appearance with default styling.
 * Use this as a starting point for customization.
 */
export const Basic: Story = {
  render: () => <MultiLineTextInput className="w-64" />,
}

/**
 * Disabled: Demonstrates the input in a disabled state.
 *
 * Features:
 * - Visually indicates the input cannot be interacted with
 * - Prevents user input and focus
 * - Maintains form value during submission
 *
 * Use disabled inputs when:
 * - The field is not applicable in the current context
 * - Permissions don't allow editing this field
 * - You want to prevent changes while preserving the value
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState("Disabled")
    return (
      <MultiLineTextInput
        className="w-64"
        value={value}
        onChange={(value) => setValue(value)}
        disabled
      />
    )
  },
}

/**
 * Placeholder: Demonstrates using placeholder text in the input.
 *
 * Features:
 * - Provides hint text when the input is empty
 * - Disappears when the user enters text
 * - Helps users understand the expected content
 *
 * Best Practices:
 * - Use concise, descriptive placeholder text
 * - Don't rely on placeholders for critical information
 * - Consider placeholder text as supplementary to labels
 * - Ensure sufficient contrast for readability
 */
export const Placeholder: Story = {
  render: function PlaceholderStory() {
    const [value, setValue] = useState("")
    return (
      <MultiLineTextInput
        className="w-64"
        placeholder="Placeholder"
        value={value}
        onChange={(value) => setValue(value)}
      />
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the component.
 *
 * Features:
 * - Default: Standard styled input with borders and background
 * - Dark: Adjusted styling for dark backgrounds
 *
 * Usage:
 * - Default: Use for most standard form contexts
 * - Dark: Use when your form appears on a dark background
 */
export const Variants: Story = {
  render: function VariantsStory() {
    return (
      <div className="flex flex-col gap-4">
        <MultiLineTextInput
          value="Default"
          className="w-64"
        />
        <MultiLineTextInput
          value="Dark Variant"
          variant="dark"
          className="w-64"
        />
      </div>
    )
  },
}

/**
 * Dark: Demonstrates the input with dark styling on a dark background.
 *
 * Features:
 * - Adjusted color scheme for dark backgrounds
 * - Maintained readability and contrast
 * - Same functionality as standard inputs
 *
 * Usage:
 * - Use in dark UI sections or on colored backgrounds
 * - Ensures proper contrast and visibility in dark environments
 * - Maintains consistent user experience across light and dark modes
 */
export const Dark: Story = {
  render: function DarkStory() {
    const [value, setValue] = useState("Dark")
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <MultiLineTextInput
          className="w-64"
          value={value}
          onChange={(value) => setValue(value)}
          variant="dark"
          placeholder="Dark"
        />
      </div>
    )
  },
}

/**
 * Sizes: Demonstrates configuring the input with minimum and maximum rows.
 *
 * Features:
 * - Auto-expanding behavior within defined limits
 * - Minimum height to provide adequate space for entry
 * - Maximum height to prevent excessive vertical growth
 * - Scrolling when content exceeds maximum height
 *
 * Usage:
 * - Set minRows for the initial display size
 * - Set maxRows to limit the maximum height
 * - Balance between providing adequate space and managing layout
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const [value, setValue] = useState("Large")
    return (
      <MultiLineTextInput
        value={value}
        onChange={(value) => setValue(value)}
        minRows={12}
        className="w-64"
      />
    )
  },
}

/**
 * Controlled: Demonstrates using the component in controlled mode.
 *
 * Features:
 * - Input value managed by React state
 * - Complete control over value changes
 * - Enables validation, formatting, or transformation during input
 * - Visual feedback of current value for demonstration
 *
 * Usage:
 * ```tsx
 * const [value, setValue] = useState("");
 *
 * // With validation
 * const handleChange = (newValue) => {
 *   // Apply validation or formatting logic
 *   setValue(newValue);
 * };
 *
 * return <MultiLineTextInput value={value} onChange={handleChange} />;
 * ```
 *
 * Best Practices:
 * - Use controlled inputs when you need to:
 *   - Validate input on change
 *   - Format values as they're entered
 *   - Synchronize with other components
 *   - Implement complex form logic
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("Controlled")
    return (
      <div className="flex flex-col gap-2">
        <MultiLineTextInput
          className="w-64"
          value={value}
          onChange={(value) => setValue(value)}
        />
        <div className="text-secondary-foreground text-sm">Value: {value}</div>
      </div>
    )
  },
}

/**
 * InPopover: Demonstrates the MultiLineTextInput component inside a Popover.
 *
 * This story tests the fix for the issue where props.value wouldn't display correctly
 * in Slate.js when the component is mounted inside a popover. The component should
 * now properly show the initial value when the popover opens.
 *
 * Features:
 * - Tests value synchronization when mounted in popover
 * - Demonstrates controlled input behavior in overlay contexts
 * - Shows proper Slate.js editor content management
 */
export const InPopover: Story = {
  render: function InPopoverStory() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(
      "This is a test text\nIn popover should be able to display initial value",
    )

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 self-start">
          <Button
            onClick={() => setValue("This is a test text\nModified content\nTest dynamic update")}
          >
            Update text
          </Button>
          <Button onClick={() => setValue("")}>Clear text</Button>
        </div>

        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <Popover.Trigger>
            <Button
              active={open}
              className="self-start"
            >
              {open ? "Close" : "Open"} Popover
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-80 p-4">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium">Multi-line text input</div>
              <MultiLineTextInput
                value={value}
                onChange={setValue}
                placeholder="Please enter text..."
                minRows={3}
                maxRows={6}
                className="w-full"
              />
              <div className="text-secondary-foreground">
                Current value: {value ? `"${value}"` : "Empty"}
              </div>
            </div>
          </Popover.Content>
        </Popover>

        <div className="text-secondary-foreground">
          <div>Test scenarios:</div>
          <ul className="list-disc pl-4 text-xs">
            <li>Initial value should be displayed correctly when popover is opened</li>
            <li>
              New value should be displayed when the value is modified outside the popover and the
              popover is reopened
            </li>
            <li>Editing text in the popover should work normally</li>
          </ul>
        </div>
      </div>
    )
  },
}
