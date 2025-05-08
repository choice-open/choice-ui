import { Story } from "@storybook/blocks"
import type { Meta, StoryObj } from "@storybook/react"
import React, { Fragment, useState } from "react"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
}

export default meta

type Story = StoryObj<typeof Checkbox>

/**
 * - This is a controlled component that requires `value` and `onChange` props to control its state.
 * - Use `<Checkbox.Label>` to add a label to the checkbox
 */
export const Basic: Story = {
  render: function BasicStory() {
    enum State {
      Rest = "rest",
      Focused = "focused",
      Disabled = "disabled",
    }

    enum Interaction {
      On = "on",
      Mixed = "mixed",
      Off = "off",
    }

    enum Variant {
      Default = "default",
      Accent = "accent",
      Outline = "outline",
    }

    return (
      <div className="flex flex-col items-start gap-4">
        {Object.values(Variant).map((variant, index) => (
          <Fragment key={variant}>
            <span className="capitalize">{variant}</span>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(State).map((state) => (
                <Fragment key={state}>
                  <span className="text-pink-500 capitalize">{state}</span>

                  {Object.values(Interaction).map((interaction) => (
                    <Fragment key={interaction}>
                      <Checkbox
                        value={interaction === Interaction.On || interaction === Interaction.Mixed}
                        mixed={interaction === Interaction.Mixed}
                        disabled={state === State.Disabled}
                        focused={state === State.Focused}
                        variant={variant}
                      >
                        <Checkbox.Label>{interaction}</Checkbox.Label>
                      </Checkbox>
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </div>
            {index !== Object.values(Variant).length - 1 && <hr className="w-full" />}
          </Fragment>
        ))}
      </div>
    )
  },
}

/**
 * - `disabled`: Whether the checkbox is disabled
 */
export const Disabled: Story = {
  args: {},
  render: function DisabledStory() {
    const [value, setValue] = useState(false)
    return (
      <Checkbox
        value={value}
        onChange={(value) => setValue(value)}
        disabled
      >
        <Checkbox.Label>Disabled</Checkbox.Label>
      </Checkbox>
    )
  },
}

/**
 * `variant`: The variant of the checkbox
 * - `default`: The default variant of the checkbox
 * - `accent`: The accent variant of the checkbox
 * - `outline`: The outline variant of the checkbox
 */
export const Variant: Story = {
  render: function VariantStory() {
    const [variant, setVariant] = useState({
      default: false,
      accent: false,
      outline: false,
    })
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={variant.default}
          onChange={(value) => setVariant({ ...variant, default: value })}
        >
          <Checkbox.Label>Default</Checkbox.Label>
        </Checkbox>
        <Checkbox
          value={variant.accent}
          onChange={(value) => setVariant({ ...variant, accent: value })}
          variant="accent"
        >
          <Checkbox.Label>Accent</Checkbox.Label>
        </Checkbox>
        <Checkbox
          value={variant.outline}
          onChange={(value) => setVariant({ ...variant, outline: value })}
          variant="outline"
        >
          <Checkbox.Label>Outline</Checkbox.Label>
        </Checkbox>
      </div>
    )
  },
}

/**
 * The group of the checkbox
 */
export const Group: Story = {
  render: function GroupStory() {
    const groupOptions = [
      { id: "option1", label: "Option 1" },
      { id: "option2", label: "Option 2" },
      { id: "option3", label: "Option 3" },
    ]

    const [selectedIds, setSelectedIds] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-2">
        {groupOptions.map((option) => (
          <Checkbox
            key={option.id}
            value={selectedIds.includes(option.id)}
            onChange={(checked) => {
              setSelectedIds((prev) =>
                checked ? [...prev, option.id] : prev.filter((id) => id !== option.id),
              )
            }}
          >
            <Checkbox.Label>{option.label}</Checkbox.Label>
          </Checkbox>
        ))}
      </div>
    )
  },
}
