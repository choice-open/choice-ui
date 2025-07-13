import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { Fragment, useState } from "react"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Checkbox>

/**
 * `Checkbox` is a flexible, accessible component for binary and mixed (indeterminate) selection states.
 *
 * Features:
 * - Controlled component: requires `value` and `onChange` for state management
 * - Supports three states: checked, unchecked, and mixed (indeterminate)
 * - Multiple visual variants: default, accent, outline
 * - Disabled and focused states for accessibility and usability
 * - Composable label via `<Checkbox.Label>` for proper association and accessibility
 * - Can be grouped for multi-select scenarios
 *
 * Usage:
 * - Use for toggling settings, selecting items, or multi-select lists
 * - Use the mixed state for parent checkboxes representing a partially selected group
 * - Combine with labels for clarity and accessibility
 *
 * Best Practices:
 * - Always provide a visible label using `<Checkbox.Label>`
 * - Use the controlled pattern for predictable state management
 * - Clearly indicate disabled and mixed states
 * - Group related checkboxes for multi-select scenarios
 *
 * Accessibility:
 * - Fully accessible to screen readers and keyboard users
 * - Properly associates label and input for assistive technology
 * - Mixed state is announced to screen readers
 */

/**
 * Basic: Demonstrates all variants, states, and interaction states of the Checkbox component.
 * - Shows default, accent, and outline variants.
 * - Demonstrates rest, focused, and disabled states.
 * - Shows checked, unchecked, and mixed (indeterminate) states.
 * - Use as a reference for all visual and interaction possibilities.
 */
export const Basic: Story = {
  render: function BasicStory() {
    enum State {
      Disabled = "disabled",
      Focused = "focused",
      Rest = "rest",
    }

    enum Interaction {
      Mixed = "mixed",
      Off = "off",
      On = "on",
    }

    enum Variant {
      Accent = "accent",
      Default = "default",
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
 * Disabled: Demonstrates a disabled Checkbox.
 * - Shows how to render a Checkbox that cannot be interacted with.
 * - Useful for indicating unavailable options.
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
 * Variant: Demonstrates the different visual variants of the Checkbox component.
 * - Shows default, accent, and outline variants side by side.
 * - Useful for previewing and choosing the right style for your UI.
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
 * Group: Demonstrates a group of Checkboxes for multi-select scenarios.
 * - Shows how to manage a group of checkboxes with independent state.
 * - Useful for forms, filters, and option lists.
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
