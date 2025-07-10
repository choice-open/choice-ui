import type { Meta, StoryObj } from "@storybook/react-vite"
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
 * `Radio` is a form control component that allows users to select a single option from a set.
 *
 * Features:
 * - Multiple visual variants (default, accent, outline)
 * - Support for disabled and focused states
 * - Composable label via Radio.Label
 * - Controlled usage for reliable state management
 * - Group functionality via RadioGroup component
 * - Proper keyboard and screen reader accessibility
 *
 * Usage Guidelines:
 * - Use when users need to select exactly one option from a list
 * - Provide clear, concise labels for each option
 * - Use RadioGroup for related options
 * - Always show all available options
 * - Consider appropriate variant based on your UI
 *
 * Accessibility:
 * - Proper role and ARIA attributes
 * - Keyboard navigation with arrow keys in groups
 * - Focus management and visible focus states
 * - Label association for screen readers
 * - Proper group semantics with fieldset/legend pattern
 */

/**
 * Basic: Demonstrates all variants, states, and interactions of the Radio component.
 *
 * Features:
 * - Three visual variants: default, accent, and outline
 * - Different states: rest, focused, and disabled
 * - On/off interactions for each variant and state
 *
 * This comprehensive example shows all possible combinations of
 * variants, states, and interactions for the Radio component.
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
 * Disabled: Demonstrates a radio button in the disabled state.
 *
 * Features:
 * - Visual indication that the control cannot be interacted with
 * - Prevents user interaction while maintaining form value
 * - Proper styling that shows the control is unavailable
 *
 * Use disabled radio buttons when:
 * - The option is not applicable in the current context
 * - Permissions don't allow selection of this option
 * - The option will become available based on other selections
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
 * Variant: Demonstrates the different visual variants of the Radio component.
 *
 * Features:
 * - Default: Standard styling with filled selection indicator
 * - Accent: Themed styling with brand color accent
 * - Outline: Minimal styling with outline appearance
 *
 * Usage Guidelines:
 * - Default: Use for most standard forms and interfaces
 * - Accent: Use to highlight important option groups
 * - Outline: Use for secondary options or on colored backgrounds
 *
 * This example shows how the same functionality can be presented
 * with different visual styles to match your design requirements.
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
 * Group: Demonstrates the RadioGroup component for managing related radio options.
 *
 * Features:
 * - Two different usage patterns:
 *   1. Providing options array via the options prop
 *   2. Using RadioGroup.Item as children for more customization
 * - Automatic state management across the group
 * - Proper name attribution for form submission
 * - Simplified onChange handling with single value
 *
 * Usage Guidelines:
 * - Always use RadioGroup for related options
 * - Use options prop for simple cases with consistent styling
 * - Use RadioGroup.Item children for more complex layouts or custom styling
 * - Provide a default selected value when appropriate
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
 * GroupVariant: Demonstrates applying visual variants to a RadioGroup.
 *
 * Features:
 * - All RadioGroup.Items inherit the variant from the parent group
 * - Consistent styling across all options in the group
 * - Different variants affect the visual presentation of all radios
 *
 * Usage Guidelines:
 * - Use the same variant across a logical group of options
 * - Select variant based on the importance of the option group
 * - Consider the visual hierarchy when choosing variants
 *
 * This example shows how selecting different variants affects
 * the entire RadioGroup, and how the selected option itself
 * controls which variant is applied.
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
