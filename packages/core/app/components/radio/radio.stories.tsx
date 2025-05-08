import type { Meta, StoryObj } from "@storybook/react"
import React, { Fragment, useState } from "react"
import { Radio } from "./radio"
import { RadioGroup } from "./radio-group"

const meta: Meta<typeof Radio> = {
  title: "Forms/Radio",
  component: Radio,
}

export default meta

type Story = StoryObj<typeof Radio>

/**
 * - This is a controlled component that requires `value` and `onChange` props to control its state.
 * - Use `<Radio.Label>` to add a label to the radio
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
            <div className="grid grid-cols-3 gap-2">
              {Object.values(State).map((state) => (
                <Fragment key={state}>
                  <span className="text-pink-500 capitalize">{state}</span>

                  {Object.values(Interaction).map((interaction) => (
                    <Fragment key={interaction}>
                      <Radio
                        value={interaction === Interaction.On}
                        disabled={state === State.Disabled}
                        focused={state === State.Focused}
                        variant={variant}
                        onChange={(value) => {
                          console.log(value)
                        }}
                      >
                        <Radio.Label>{interaction}</Radio.Label>
                      </Radio>
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
 * The `disabled` prop is used to disable the radio.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState(false)
    return (
      <Radio
        value={value}
        onChange={setValue}
        disabled
      >
        <Radio.Label>Disabled</Radio.Label>
      </Radio>
    )
  },
}

/**
 * The `variant` prop is used to change the variant of the radio.
 * - `default`: The default variant of the radio.
 * - `accent`: The accent variant of the radio.
 * - `outline`: The outline variant of the radio.
 */
export const Variant: Story = {
  render: function VariantStory() {
    const [variant, setVariant] = useState({
      default: false,
      accent: false,
      outline: false,
    })

    return (
      <>
        <Radio
          name="variant"
          value={variant.default}
          onChange={(value) => setVariant({ ...variant, default: value })}
        >
          <Radio.Label>Default</Radio.Label>
        </Radio>
        <Radio
          name="variant"
          value={variant.accent}
          onChange={(value) => setVariant({ ...variant, accent: value })}
          variant="accent"
        >
          <Radio.Label>Accent</Radio.Label>
        </Radio>
        <Radio
          name="variant"
          value={variant.outline}
          onChange={(value) => setVariant({ ...variant, outline: value })}
          variant="outline"
        >
          <Radio.Label>Outline</Radio.Label>
        </Radio>
      </>
    )
  },
}

/**
 * The `RadioGroup` component is used to group the radio. It supports two usage patterns:
 * 1. Providing options as a prop
 * 2. Using RadioGroup.Item as children
 */
export const Group: Story = {
  render: function GroupStory() {
    const groupOptions = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ]

    const [selectedIds, setSelectedIds] = useState<string>(groupOptions[0].value)

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span>Using options prop:</span>
          <RadioGroup
            options={groupOptions}
            value={selectedIds}
            onChange={(value) => setSelectedIds(value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span>Using RadioGroup.Item:</span>
          <RadioGroup
            value={selectedIds}
            onChange={(value) => setSelectedIds(value)}
          >
            {groupOptions.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
              >
                {option.label}
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  },
}

/**
 * The `RadioGroup` component has `variant` prop.
 * - `default`: The default variant of the radio.
 * - `accent`: The accent variant of the radio.
 * - `outline`: The outline variant of the radio.
 */
export const GroupVariant: Story = {
  render: function GroupVariantStory() {
    const groupOptions = [
      { value: "default", label: "Default" },
      { value: "accent", label: "Accent" },
      { value: "outline", label: "Outline" },
    ]

    const [variant, setVariant] = useState("default")

    return (
      <>
        <RadioGroup
          variant={variant as "default" | "accent" | "outline"}
          value={variant}
          onChange={(value) => setVariant(value)}
        >
          {groupOptions.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
            >
              {option.label}
            </RadioGroup.Item>
          ))}
        </RadioGroup>
      </>
    )
  },
}
