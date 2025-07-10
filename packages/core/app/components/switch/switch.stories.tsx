import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { Fragment, useState } from "react"
import { Tooltip } from "../tooltip"
import { Switch } from "./switch"

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
}

export default meta
type Story = StoryObj<typeof Switch>

/**
 * The `IfSwitch` component is a switch component that is used to toggle a value.
 * It is a controlled component that requires a `value` prop and an `onChange` prop.
 * - There is no `label` prop, you need to use the `aria-label` prop to set the label.
 */
export const Basic: Story = {
  render: function BasicStory() {
    enum Variant {
      Default = "default",
      Accent = "accent",
      Outline = "outline",
    }

    enum Size {
      Small = "small",
      Medium = "medium",
    }

    enum State {
      Disabled = "disabled",
      Enabled = "enabled",
      Focused = "focused",
    }

    return (
      <div className="flex flex-col gap-4">
        {Object.values(Size).map((size, index) => (
          <Fragment key={size}>
            <span>{size}</span>
            <div className="grid grid-cols-7 gap-2">
              <span></span>
              <span className="col-span-2">Disabled</span>
              <span className="col-span-2">Enabled</span>
              <span className="col-span-2">Focused</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Object.values(Variant).map((variant) => (
                <Fragment key={variant}>
                  <span className="text-pink-500">{variant}</span>
                  {Object.values(State).map((state) => (
                    <Fragment key={state}>
                      {[false, true].map((value) => (
                        <Switch
                          value={value}
                          onChange={() => {}}
                          variant={variant}
                          size={size}
                          disabled={state === State.Disabled}
                          focused={state === State.Focused}
                        />
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </div>
            {index < Object.values(Size).length - 1 && <hr />}
          </Fragment>
        ))}
      </div>
    )
  },
}

/**
 * The `size` prop is used to set the size of the switch.
 * - `small`: height: 1rem / 16px
 * - `medium`: height: 1.5rem / 24px (default)
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const [small, setSmall] = useState(false)
    const [medium, setMedium] = useState(false)

    return (
      <>
        <Switch
          value={small}
          onChange={setSmall}
          size="small"
          label="Small size"
        />
        <Switch
          value={medium}
          onChange={setMedium}
          label="Medium size"
        />
      </>
    )
  },
}

/**
 * The `variant` prop is used to set the variant of the switch.
 * - `default`: The default variant of the switch.
 * - `accent`: The accent variant of the switch.
 * - `outline`: The outline variant of the switch.
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [defaultVariant, setDefaultVariant] = useState(false)
    const [accentVariant, setAccentVariant] = useState(false)
    const [outlineVariant, setOutlineVariant] = useState(false)

    return (
      <>
        <Switch
          value={defaultVariant}
          onChange={setDefaultVariant}
          variant="default"
          label="Default variant"
        />
        <Switch
          value={accentVariant}
          onChange={setAccentVariant}
          variant="accent"
          label="Accent variant"
        />
        <Switch
          value={outlineVariant}
          onChange={setOutlineVariant}
          variant="outline"
          label="Outline variant"
        />
      </>
    )
  },
}

/**
 * The `disabled` prop is used to disable the switch.
 * - `true`: The switch is disabled.
 * - `false`: The switch is enabled.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [disabled, setDisabled] = useState(false)
    const [disabledChecked, setDisabledChecked] = useState(true)

    return (
      <>
        <Switch
          value={disabled}
          onChange={setDisabled}
          label="Disabled unchecked"
          disabled
        />
        <Switch
          value={disabledChecked}
          onChange={setDisabledChecked}
          label="Disabled checked"
          disabled
        />
      </>
    )
  },
}

/**
 * The `label` prop is used to set the label of the switch.
 * - `string`: The label of the switch.
 */
export const Label: Story = {
  render: function LabelStory() {
    const [label, setLabel] = useState(false)

    return (
      <Switch
        value={label}
        onChange={setLabel}
        label="Switch with label"
      />
    )
  },
}

/**
 * The IfSwitch component does not have a built-in tooltip interface and requires the use of the `IfTooltip` component to implement it.
 */
export const WithTooltip: Story = {
  render: function WithTooltipStory() {
    const [tooltip, setTooltip] = useState(false)
    return (
      <Tooltip content="This is a tooltip">
        <Switch
          value={tooltip}
          onChange={setTooltip}
        />
      </Tooltip>
    )
  },
}
