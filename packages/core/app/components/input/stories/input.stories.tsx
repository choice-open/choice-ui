import { Checkbox } from "@choiceform/checkbox"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Input } from "../src/input"

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
 * Features:
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no Variant settings applied
 *
 * Usage:
 * - Use default variant for inputs that adapt to the current theme
 * - Use light/dark variants when you need fixed appearance
 * - Use reset variant to remove all variant-specific styling
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [disabled, setDisabled] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={disabled}
          onChange={(value) => setDisabled(value)}
        >
          Disabled
        </Checkbox>
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border">
          <div className="bg-default-background flex aspect-square items-center justify-center p-8">
            <Input
              placeholder="Default"
              disabled={disabled}
            />
          </div>
          <div className="flex aspect-square items-center justify-center bg-white p-8">
            <Input
              variant="light"
              placeholder="Light"
              disabled={disabled}
            />
          </div>
          <div className="flex aspect-square items-center justify-center bg-gray-800 p-8">
            <Input
              variant="dark"
              placeholder="Dark"
              disabled={disabled}
            />
          </div>
        </div>
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

/**
 * FocusSelectionModes: Demonstrates different focus selection behaviors.
 *
 * Features:
 * - "all": Selects all text on focus (default behavior)
 * - "end": Moves cursor to end of text on focus
 * - "none": No selection change on focus
 *
 * Usage:
 * ```tsx
 * // Select all text on focus (default)
 * <Input focusSelection="all" />
 *
 * // Move cursor to end
 * <Input focusSelection="end" />
 *
 * // No selection change
 * <Input focusSelection="none" />
 * ```
 *
 * Best Practices:
 * - Use "all" for fields where users typically replace the entire value
 * - Use "end" for fields where users often append to existing content
 * - Use "none" for fields where cursor position should be preserved
 */
export const FocusSelectionModes: Story = {
  render: function FocusSelectionModesStory() {
    const [value1, setValue1] = useState("This text will be fully selected on focus")
    const [value2, setValue2] = useState("Cursor will move to the end on focus")
    const [value3, setValue3] = useState("No selection change on focus")

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-body-small text-text-secondary mb-2">Select All (Default)</h3>
          <Input
            value={value1}
            onChange={setValue1}
            focusSelection="all"
            placeholder="Click to select all text..."
            className="w-80"
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;all&quot; - Selects all text when focused
          </p>
        </div>

        <div>
          <h3 className="text-body-small text-text-secondary mb-2">Move to End</h3>
          <Input
            value={value2}
            onChange={setValue2}
            focusSelection="end"
            placeholder="Click to move cursor to end..."
            className="w-80"
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;end&quot; - Moves cursor to end of text
          </p>
        </div>

        <div>
          <h3 className="text-body-small text-text-secondary mb-2">No Selection</h3>
          <Input
            value={value3}
            onChange={setValue3}
            focusSelection="none"
            placeholder="Click anywhere to focus..."
            className="w-80"
          />
          <p className="text-body-small text-text-tertiary mt-1">
            focusSelection=&quot;none&quot; - Maintains cursor position
          </p>
        </div>
      </div>
    )
  },
}
