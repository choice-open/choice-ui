import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Input } from "./input"

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
}

export default meta

type Story = StoryObj<typeof Input>

/**
 * `Input` is a versatile text input component that supports various states and styling options.
 *
 * Features:
 * - Multiple visual variants (default, reset, dark)
 * - Support for all standard input states (disabled, read-only, selected)
 * - Controlled and uncontrolled usage
 * - Placeholder text support
 * - Full keyboard accessibility
 * - Customizable styling
 *
 * Usage Guidelines:
 * - Use for single-line text input in forms
 * - Provide clear labels for accessibility (typically outside the component)
 * - Choose appropriate variants based on your UI background
 * - Use controlled mode when you need to manipulate or validate input values
 *
 * Accessibility:
 * - Supports all standard input ARIA attributes
 * - Maintains consistent focus states
 * - Ensures proper contrast in all variants
 * - Works with form labels and screen readers
 */

/**
 * Basic: Demonstrates the default Input component in its simplest form.
 *
 * This minimal example shows the standard appearance with default styling.
 * Use this as a starting point for customization.
 */
export const Basic: Story = {
  render: () => <Input />,
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
      <Input
        value={value}
        onChange={(value) => setValue(value)}
        disabled
      />
    )
  },
}

/**
 * ReadOnly: Demonstrates the input in a read-only state.
 *
 * Features:
 * - Prevents editing while still allowing focus and selection
 * - Maintains normal visual appearance (unlike disabled)
 * - Value is included in form submission
 *
 * Use read-only inputs when:
 * - You want to display a value that shouldn't be edited
 * - The value is calculated or provided by the system
 * - You need the field to remain focusable (unlike disabled)
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [value, setValue] = useState("Read Only")
    return (
      <Input
        readOnly
        value={value}
        onChange={(value) => setValue(value)}
      />
    )
  },
}

/**
 * Selected: Demonstrates the input in a selected state.
 *
 * Features:
 * - Visual indication that the input is currently selected
 * - Useful for highlighting the active input in a form
 * - Remains editable while showing selection state
 *
 * Use selected inputs when:
 * - You want to highlight which field is currently relevant
 * - The parent container or context is selected
 * - You need to draw attention to a specific field
 */
export const Selected: Story = {
  render: function SelectedStory() {
    const [value, setValue] = useState("Selected")
    return (
      <Input
        value={value}
        onChange={(value) => setValue(value)}
        selected
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
      <Input
        placeholder="Placeholder"
        value={value}
        onChange={(value) => setValue(value)}
      />
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the input component.
 *
 * Features:
 * - Default: Standard styled input with borders and background
 * - Reset: Minimal styling without borders or background
 *
 * Usage:
 * - Default: Use for most standard form contexts
 * - Reset: Use when you need an input with minimal visual styling
 *   or when integrating with custom containers
 */
export const Variants: Story = {
  render: function VariantsStory() {
    return (
      <>
        <Input value="Default" />
        <Input
          value="Reset"
          variant="reset"
        />
      </>
    )
  },
}

/**
 * Dark: Demonstrates the input component with dark styling for dark backgrounds.
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
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <Input
          variant="dark"
          placeholder="Dark"
        />
      </div>
    )
  },
}

/**
 * DarkWithDisabled: Demonstrates the disabled state in dark variant.
 *
 * Features:
 * - Combines dark styling with disabled state
 * - Adjusted visual indicators for disabled state on dark backgrounds
 * - Maintains proper contrast for disabled indication
 *
 * Usage:
 * - Use in dark UI sections when an input needs to be disabled
 * - Ensures consistent disabled state appearance across themes
 */
export const DarkWithDisabled: Story = {
  render: function DarkWithDisabledStory() {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
        <Input
          variant="dark"
          placeholder="Dark"
          disabled
        />
      </div>
    )
  },
}

/**
 * Controlled: Demonstrates using the Input component in controlled mode.
 *
 * Features:
 * - Input value managed by React state
 * - Complete control over value changes
 * - Enables validation, formatting, or transformation during input
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
 * return <Input value={value} onChange={handleChange} />;
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
      <Input
        value={value}
        onChange={(value) => setValue(value)}
      />
    )
  },
}
