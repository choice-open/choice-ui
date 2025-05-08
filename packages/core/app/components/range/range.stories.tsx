import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Button } from "../button"
import { Popover } from "../popover"
import { Range } from "./range"

const meta: Meta<typeof Range> = {
  title: "Range",
  component: Range,
}

export default meta

type Story = StoryObj<typeof Range>

/**
 * The `IfRange` component is a range input component that allows the user to select a value between a minimum and maximum value.
 * - `value`: The current value of the range input.
 * - `onChange`: The function to call when the value changes.
 * - `min`: The minimum value of the range input.
 * - `max`: The maximum value of the range input.
 * - `step`: The step value of the range input.
 * - `defaultValue`: The default value of the range input.
 * - `disabled`: Whether the range input is disabled.
 *
 *| Note: Since the `IfRange` component needs to calculate the scale and position of the Step dot,
 *  the width of the `IfRange` component is not adaptive and needs to be explicitly specified.
 *  Default value: trackSize: { width: 256, height: 16 }.
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

/**
 * The `step` prop is used to set the step value of the range input.
 * - `step`: The step value of the range input.
 * - Setting the `step` parameter will display tick marks on the Slider.
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
 * The `defaultValue` here is not the default value of the range input, but rather the default value of the setting, indicating to the user the default parameter value on the scale.
 * The default value of the range can be set through the initial state value.
 * - Snap effect when near default value (if no step is set) 5% of the range
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
 * The `defaultValue` here is not the default value of the range input, but rather the default value of the setting, indicating to the user the default parameter value on the scale.
 * The default value of the range can be set through the initial state value.
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
 * The `disabled` prop is used to disable the range input.
 * - `disabled`: Whether the range input is disabled.
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
 * The `trackSize` and `thumbSize` props are used to set the size of the track and thumb.
 * - `trackSize`: The size of the track. Default: `{ width: 256, height: 16 }`
 * - `thumbSize`: The size of the thumb. Default: `14`
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

export const DraggableRangePopover: Story = {
  render: function BasicStory() {
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
