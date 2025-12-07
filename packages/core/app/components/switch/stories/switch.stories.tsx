import { Tooltip } from "@choiceform/tooltip"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { Fragment, useState } from "react"
import { Switch } from "../src/switch"

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
}

export default meta
type Story = StoryObj<typeof Switch>

/**
 * The `Switch` component is a toggle control for binary states like on/off or enabled/disabled.
 * It is a controlled component that requires a `value` prop and an `onChange` prop.
 *
 * Features:
 * - Multiple visual variants (default, accent, outline)
 * - Two sizes (small, medium)
 * - Support for disabled and focused states
 * - Two label approaches: simple string children or explicit `<Switch.Label>` for complex content
 * - Full keyboard and screen reader accessibility
 *
 * Usage Guidelines:
 * - Use for immediate toggle actions (unlike checkboxes in forms)
 * - Provide clear labels that describe the state being toggled
 * - Simple labels: `<Switch>Label text</Switch>`
 * - Complex labels: `<Switch><Switch.Label>Complex content</Switch.Label></Switch>`
 * - Consider using tooltips for additional context when needed
 *
 * Best Practices:
 * - Always provide a visible label (string or `<Switch.Label>`)
 * - Use simple string children for basic labels
 * - Use `<Switch.Label>` for labels with formatting or complex content
 * - Make the toggle action and its effect immediately apparent
 * - Choose appropriate size and variant based on context
 */
export const Basic: Story = {
  render: function BasicStory() {
    enum Variant {
      Accent = "accent",
      Default = "default",
      Outline = "outline",
    }

    enum Size {
      Medium = "medium",
      Small = "small",
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
                          key={`${variant}-${state}-${value}`}
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
      <div className="flex flex-col gap-4">
        <Switch
          value={small}
          onChange={setSmall}
          size="small"
        >
          Small size
        </Switch>
        <Switch
          value={medium}
          onChange={setMedium}
        >
          Medium size
        </Switch>
      </div>
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
      <div className="flex flex-col gap-4">
        <Switch
          value={defaultVariant}
          onChange={setDefaultVariant}
          variant="default"
        >
          Default variant
        </Switch>
        <Switch
          value={accentVariant}
          onChange={setAccentVariant}
          variant="accent"
        >
          Accent variant
        </Switch>
        <Switch
          value={outlineVariant}
          onChange={setOutlineVariant}
          variant="outline"
        >
          Outline variant
        </Switch>
      </div>
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
      <div className="flex flex-col gap-4">
        <Switch
          value={disabled}
          onChange={setDisabled}
          disabled
        >
          Disabled unchecked
        </Switch>
        <Switch
          value={disabledChecked}
          onChange={setDisabledChecked}
          disabled
        >
          Disabled checked
        </Switch>
      </div>
    )
  },
}

/**
 * Label Usage: Demonstrates two ways to use labels with Switch.
 * - Simple string children: automatically wrapped with Switch.Label
 * - Explicit Switch.Label: for more complex label content
 */
export const LabelUsage: Story = {
  render: function LabelUsageStory() {
    const [simple, setSimple] = useState(false)
    const [explicit, setExplicit] = useState(false)

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="font-strong mb-2">Simple string label (auto-wrapped):</h4>
          <Switch
            value={simple}
            onChange={setSimple}
          >
            Simple text label
          </Switch>
        </div>

        <div>
          <h4 className="font-strong mb-2">Explicit Switch.Label (for complex content):</h4>
          <Switch
            value={explicit}
            onChange={setExplicit}
          >
            <Switch.Label>
              <span className="text-accent-foreground">Complex</span> label with{" "}
              <strong>formatting</strong>
            </Switch.Label>
          </Switch>
        </div>
      </div>
    )
  },
}

/**
 * Legacy Label Prop: Shows backward compatibility with the label prop.
 * Note: The label prop is still supported for backward compatibility,
 * but using children is now the preferred approach.
 */
export const LegacyLabelProp: Story = {
  render: function LegacyLabelPropStory() {
    const [value, setValue] = useState(false)

    return (
      <Switch
        value={value}
        onChange={setValue}
        label="Switch with legacy label prop"
      />
    )
  },
}

/**
 * The Switch component does not have a built-in tooltip interface and requires the use of the `Tooltip` component to implement it.
 */
export const WithTooltip: Story = {
  render: function WithTooltipStory() {
    const [tooltip, setTooltip] = useState(false)
    return (
      <Tooltip content="This is a tooltip">
        <Switch
          value={tooltip}
          onChange={setTooltip}
        >
          Switch with tooltip
        </Switch>
      </Tooltip>
    )
  },
}

/**
 * Switch component in readOnly state.
 *
 * In readOnly mode:
 * - The switch does not respond to click or change events
 * - The value cannot be changed
 * - Useful for displaying switch state without allowing changes
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
          <Switch
            readOnly
            value={value}
            onChange={handleChange}
          >
            Readonly Switch
          </Switch>
          <Switch
            readOnly
            value={!value}
            onChange={handleChange}
          >
            Readonly Switch (on)
          </Switch>
          <Switch
            value={value}
            onChange={handleChange}
          >
            Normal Switch (for comparison)
          </Switch>
        </div>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly switches - the value should not change and the change
          count should remain at 0. Only the normal switch will change the value.
        </div>
      </div>
    )
  },
}
