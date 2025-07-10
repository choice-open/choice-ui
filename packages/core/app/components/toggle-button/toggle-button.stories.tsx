import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment, useState } from "react"
import { Select } from "../select"
import { ToggleButton } from "./toggle-button"
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
      Secondary = "secondary",
      Highlight = "highlight",
    }

    enum Size {
      Default = "default",
      Large = "large",
    }

    enum State {
      Rest = "rest",
      Active = "active",
      Focused = "focused",
      Disabled = "disabled",
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
