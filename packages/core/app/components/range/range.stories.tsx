import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Button } from "../button"
import { Popover } from "../popover"
import { Range } from "./range"
import { NumericInput } from "../numeric-input"

const meta: Meta<typeof Range> = {
  title: "Forms/Range",
  component: Range,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Range>

/**
 * `Range` is a slider component that allows users to select a numeric value within a specified range.
 *
 * Features:
 * - Customizable minimum and maximum values
 * - Optional step intervals with visual tick marks
 * - Default value indicator with snap effect
 * - Configurable track and thumb sizes
 * - Disabled state support
 * - Controlled and uncontrolled usage
 * - Smooth drag interaction
 *
 * Usage Guidelines:
 * - Use for selecting a value from a continuous range
 * - Provide appropriate min, max, and step values for your use case
 * - Consider using step marks for discrete values
 * - Display the current value for better usability
 * - Use defaultValue to indicate recommended or factory settings
 * - Specify explicit width for consistent appearance
 *
 * Accessibility:
 * - Keyboard support (arrow keys, home/end)
 * - Proper ARIA attributes
 * - Focus management
 * - Screen reader compatibility
 * - Appropriate contrast ratios
 */

/**
 * Basic: Demonstrates the simplest Range implementation.
 *
 * Features:
 * - Controlled component with value and onChange props
 * - Default sizing and appearance
 * - Smooth sliding interaction
 *
 * This example shows a minimal Range implementation with default props.
 * The slider uses its default min (0), max (100), and step values.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState(0)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
        />
      </>
    )
  },
}

export const Negative: Story = {
  render: function NegativeStory() {
    const [value, setValue] = useState(0)

    return (
      <Range
        value={value}
        onChange={setValue}
        min={-100}
        max={100}
        defaultValue={0}
      />
    )
  },
}

/**
 * Step: Demonstrates Range with discrete steps and tick marks.
 *
 * Features:
 * - Visual tick marks for each step
 * - Snapping to step values during dragging
 * - Value display to show current selection
 *
 * Use stepped ranges when:
 * - Only specific values are valid (like percentages in increments of 10)
 * - Users benefit from visual indicators of available options
 * - Precise selection between specific intervals is needed
 */
export const Step: Story = {
  render: function StepStory() {
    const [value, setValue] = useState(0)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          step={10}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * DefaultValue: Demonstrates the defaultValue feature for indicating recommended settings.
 *
 * Features:
 * - Visual indicator for the default/recommended value
 * - Snap effect when dragging near the default value
 * - No step marks, allowing continuous selection
 *
 * Note: This defaultValue is not the initial value of the slider, but rather
 * a reference point on the scale. The initial value is set via state.
 *
 * Use defaultValue when:
 * - There's a recommended or factory setting to highlight
 * - Users should be aware of a standard value while still having freedom to adjust
 */
export const DefaultValue: Story = {
  render: function DefaultValueStory() {
    const [value, setValue] = useState(10)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          defaultValue={50}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * DefaultValueAndStep: Demonstrates combining defaultValue with step marks.
 *
 * Features:
 * - Both step marks and default value indicator
 * - Snap effect to both steps and default value
 * - Visual hierarchy showing both step intervals and recommended value
 *
 * This pattern is useful for:
 * - Settings with both recommended values and required increments
 * - Advanced controls where precision and guidance are both important
 * - Helping users choose appropriate values within constraints
 */
export const DefaultValueAndStep: Story = {
  render: function DefaultValueAndStepStory() {
    const [value, setValue] = useState(10)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          defaultValue={50}
          step={10}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * Disabled: Demonstrates the Range component in a disabled state.
 *
 * Features:
 * - Visual indication that the control cannot be interacted with
 * - Prevents user interaction while maintaining current value
 * - Appropriate styling to show unavailable state
 *
 * Use disabled Range when:
 * - The setting is not applicable in the current context
 * - Permissions don't allow adjusting this setting
 * - The control should show a value but not allow changes
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState(50)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          disabled
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * CustomSize: Demonstrates configuring the Range component dimensions.
 *
 * Features:
 * - Custom track width and height
 * - Custom thumb size
 * - Proportional adjustments to all visual elements
 *
 * Use custom sizing when:
 * - Fitting into space-constrained layouts
 * - Creating more compact or larger controls based on context
 * - Matching specific design requirements
 *
 * Note: The Range component needs explicit width specification for proper
 * calculation of step positions and thumb movement.
 */
export const CustomSize: Story = {
  render: function CustomSizeStory() {
    const [value, setValue] = useState(50)

    return (
      <>
        <Range
          value={value}
          onChange={setValue}
          min={0}
          max={100}
          trackSize={{
            width: 200,
            height: 10,
          }}
          thumbSize={10}
        />
        <div className="w-10 text-right">{value}%</div>
      </>
    )
  },
}

/**
 * DraggableRangePopover: Demonstrates Range inside a draggable Popover component.
 *
 * Features:
 * - Integration with Popover for contextual settings
 * - Properly sized for compact display
 * - Value display alongside the slider
 * - Draggable container with proper interaction handling
 *
 * This pattern is useful for:
 * - Quick adjustment panels that don't require dedicated forms
 * - Property inspectors or editing tools
 * - Settings that should be adjustable without navigating to a new screen
 */
export const DraggableRangePopover: Story = {
  render: function DraggableRangePopoverStory() {
    const [value, setValue] = useState(0)

    return (
      <Popover draggable>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Header title="Range" />
        <Popover.Content className="grid w-64 grid-cols-[180px_auto] gap-2 p-3">
          <Range
            className="flex-1"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            defaultValue={50}
            trackSize={{
              width: 180,
              height: 16,
            }}
          />
          <div className="w-10 flex-1 text-right">{value}%</div>
        </Popover.Content>
      </Popover>
    )
  },
}

/**
 * Auto width: Demonstrates the Range component with automatic width calculation.
 *
 * Features:
 * - Automatic width calculation based on the parent container
 * - Smooth sliding interaction
 * - Proper value display
 *
 * ```tsx
 * <Range
 *   value={value}
 *   onChange={setValue}
 *   min={0}
 *   max={100}
 *   trackSize={{
 *     width: "auto",
 *     height: 6,
 *   }}
 *   thumbSize={12}
 * />
 * ```
 */
export const AutoWidth: Story = {
  render: function AutoWidthStory() {
    const [value, setValue] = useState(0)

    return (
      <div className="grid w-40 grid-cols-[1fr_2.5rem] gap-px">
        <div className="bg-secondary-background flex items-center rounded-l-md px-2">
          <Range
            className="bg-default-boundary flex-1"
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            trackSize={{
              width: "auto",
              height: 6,
            }}
            thumbSize={10}
          />
        </div>
        <NumericInput
          className="before:rounded-l-none"
          expression="{value}%"
          value={value}
          onChange={(value) => setValue(value as number)}
          min={0}
          max={100}
        >
          <NumericInput.Prefix className="w-2 rounded-l-none" />
        </NumericInput>
      </div>
    )
  },
}
