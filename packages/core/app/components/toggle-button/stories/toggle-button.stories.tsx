import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment, useState } from "react"
import { Select } from "@choiceform/select"
import { ToggleButton } from "../src/toggle-button"
import { FieldAdd, FieldTypeAttachment, FieldTypeCheckbox } from "@choiceform/icons-react"
import React from "react"

const meta: Meta<typeof ToggleButton> = {
  title: "Buttons/ToggleButton",
  component: ToggleButton,
}

export default meta

type Story = StoryObj<typeof ToggleButton>

/**
 * - The `aria-label` prop is required.
 * - This is a controlled component that requires `value` and `onChange` props to control its state.
 */
export const Basic: Story = {
  render: function ControlledStory() {
    const [controlled, setControlled] = useState(false)
    return (
      <ToggleButton
        aria-label="Toggle button"
        value={controlled}
        onChange={(value) => setControlled(value)}
      >
        {controlled ? <FieldTypeCheckbox /> : <FieldAdd />}
      </ToggleButton>
    )
  },
}

/**
 * The `variant` prop is used to set the variant of the toggle button.
 * - `default`: default variant
 * - `secondary`: secondary variant
 * - `highlight`: highlight variant
 */
export const Variants: Story = {
  render: function VariantsStory() {
    enum Variant {
      Default = "default",
      Highlight = "highlight",
      Secondary = "secondary",
    }

    enum Size {
      Default = "default",
      Large = "large",
    }

    enum State {
      Active = "active",
      Disabled = "disabled",
      Focused = "focused",
      Rest = "rest",
    }

    enum Event {
      Click = "click",
      Mousedown = "mousedown",
    }

    const [variant, setVariant] = useState<Variant>(Variant.Default)
    const [size, setSize] = useState<Size>(Size.Default)
    const [controlled, setControlled] = useState(false)
    const [event, setEvent] = useState<Event>(Event.Click)
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <Select
            value={variant}
            onChange={(value) => setVariant(value as Variant)}
          >
            <Select.Trigger>{variant}</Select.Trigger>
            <Select.Content>
              {Object.values(Variant).map((variant) => (
                <Select.Item
                  key={variant}
                  value={variant}
                >
                  {variant}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={size}
            onChange={(value) => setSize(value as Size)}
          >
            <Select.Trigger>{size}</Select.Trigger>
            <Select.Content>
              {Object.values(Size).map((size) => (
                <Select.Item
                  key={size}
                  value={size}
                >
                  {size}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={event}
            onChange={(value) => setEvent(value as Event)}
          >
            <Select.Trigger>{event}</Select.Trigger>
            <Select.Content>
              {Object.values(Event).map((event) => (
                <Select.Item
                  key={event}
                  value={event}
                >
                  {event}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          {Object.values(State).map((state) => (
            <Fragment key={state}>
              <span className="text-fuchsia-500 capitalize">{state}</span>
              <ToggleButton
                variant={variant}
                value={controlled}
                onChange={(value) => setControlled(value)}
                size={size}
                active={state === State.Active}
                focused={state === State.Focused}
                disabled={state === State.Disabled}
                event={event}
              >
                {controlled ? <FieldTypeCheckbox /> : <FieldTypeAttachment />}
              </ToggleButton>
            </Fragment>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * The `tooltip` prop is used to show a tooltip when the toggle button is hovered.
 * - The `aria-label` will be used as the tooltip's content if the content type is string.
 */
export const Tooltip: Story = {
  render: function TooltipStory() {
    const [controlled, setControlled] = useState(false)
    return (
      <ToggleButton
        tooltip={{
          content: controlled ? "Current state is correct" : "Current state is wrong",
        }}
        value={controlled}
        onChange={(value) => setControlled(value)}
      >
        {controlled ? <FieldTypeCheckbox /> : <FieldAdd />}
      </ToggleButton>
    )
  },
}

/**
 * ToggleButton component in readOnly state.
 *
 * In readOnly mode:
 * - The toggle button does not respond to click or change events
 * - The value cannot be changed
 * - Useful for displaying toggle state without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState(false)
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: boolean) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">{value ? "true" : "false"}</div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <div className="flex flex-wrap gap-4">
          <ToggleButton
            readOnly
            value={value}
            onChange={handleChange}
          >
            {value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
          <ToggleButton
            readOnly
            value={!value}
            onChange={handleChange}
            variant="secondary"
          >
            {!value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
          <ToggleButton
            value={value}
            onChange={handleChange}
          >
            {value ? <FieldTypeCheckbox /> : <FieldAdd />}
          </ToggleButton>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly toggle buttons - the value should not change and the
          change count should remain at 0. Only the normal button will change the value.
        </div>
      </div>
    )
  },
}
