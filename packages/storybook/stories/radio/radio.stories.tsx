import { Radio, RadioGroup } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment, useState } from "react"

const meta: Meta<typeof Radio> = {
  title: "Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Radio>

/**
 * `Radio` is a form control component that allows users to select a single option from a set.
 *
 * Features:
 * - Multiple visual variants (default, accent, outline)
 * - Support for disabled and focused states
 * - Two label approaches: simple string children or explicit `<Radio.Label>` for complex content
 * - Controlled usage for reliable state management
 * - Group functionality via RadioGroup component
 * - Proper keyboard and screen reader accessibility
 *
 * Usage Guidelines:
 * - Use when users need to select exactly one option from a list
 * - Provide clear, concise labels for each option
 * - Use RadioGroup for related options
 * - Always show all available options
 * - Simple labels: `<Radio>Label text</Radio>`
 * - Complex labels: `<Radio><Radio.Label>Complex content</Radio.Label></Radio>`
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
      Disabled = "disabled",
      Focused = "focused",
      Rest = "rest",
    }

    enum Interaction {
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
                        {interaction}
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
        Disabled
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
          Default
        </Radio>
        <Radio
          name="variant"
          value={variant.accent}
          onChange={(value) => setVariant({ ...variant, accent: value })}
          variant="accent"
        >
          Accent
        </Radio>
        <Radio
          name="variant"
          value={variant.outline}
          onChange={(value) => setVariant({ ...variant, outline: value })}
          variant="outline"
        >
          Outline
        </Radio>
      </>
    )
  },
}

/**
 * Label Usage: Demonstrates two ways to use labels with Radio.
 * - Simple string children: automatically wrapped with Radio.Label
 * - Explicit Radio.Label: for more complex label content
 */
export const LabelUsage: Story = {
  render: function LabelUsageStory() {
    const [simple, setSimple] = useState(false)
    const [explicit, setExplicit] = useState(false)

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="font-strong mb-2">Simple string label (auto-wrapped):</h4>
          <Radio
            value={simple}
            onChange={setSimple}
          >
            Simple text label
          </Radio>
        </div>

        <div>
          <h4 className="font-strong mb-2">Explicit Radio.Label (for complex content):</h4>
          <Radio
            value={explicit}
            onChange={setExplicit}
          >
            <Radio.Label>
              <span className="text-accent-foreground">Complex</span> label with{" "}
              <strong>formatting</strong>
            </Radio.Label>
          </Radio>
        </div>
      </div>
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

    const [optionsValue, setOptionsValue] = useState("option1")
    const [itemsValue, setItemsValue] = useState("option1")

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <p className="text-secondary-foreground">Using options prop</p>
          <RadioGroup
            options={groupOptions}
            value={optionsValue}
            onChange={setOptionsValue}
          />
        </div>

        <div className="space-y-2">
          <p className="text-secondary-foreground">Using RadioGroup.Item</p>
          <RadioGroup
            value={itemsValue}
            onChange={setItemsValue}
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
    const [defaultValue, setDefaultValue] = useState("option1")
    const [accentValue, setAccentValue] = useState("option1")
    const [outlineValue, setOutlineValue] = useState("option1")

    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ]

    return (
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="text-secondary-foreground">Default</p>
          <RadioGroup
            variant="default"
            value={defaultValue}
            onChange={setDefaultValue}
          >
            {options.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
              >
                {option.label}
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <p className="text-secondary-foreground">Accent</p>
          <RadioGroup
            variant="accent"
            value={accentValue}
            onChange={setAccentValue}
          >
            {options.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
              >
                {option.label}
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <p className="text-secondary-foreground">Outline</p>
          <RadioGroup
            variant="outline"
            value={outlineValue}
            onChange={setOutlineValue}
          >
            {options.map((option) => (
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
 * GroupWithDisabledOptions: Demonstrates a RadioGroup with some options disabled.
 *
 * Features:
 * - Mix of enabled and disabled options in the same group
 * - Disabled options maintain visual consistency but prevent interaction
 * - Users can only select from available (enabled) options
 * - Proper accessibility support for disabled options
 *
 * Usage Guidelines:
 * - Use when certain options are conditionally unavailable
 * - Maintain visual presence of disabled options for context
 * - Ensure at least one option remains enabled for meaningful selection
 * - Consider providing feedback about why options are disabled
 *
 * This example shows two different approaches:
 * 1. Using the options prop with disabled property
 * 2. Using RadioGroup.Item with disabled prop for individual control
 */
export const GroupWithDisabledOptions: Story = {
  render: function GroupWithDisabledOptionsStory() {
    const optionsWithDisabled = [
      { value: "option1", label: "Available Option", disabled: false },
      { value: "option2", label: "Disabled Option", disabled: true },
      { value: "option3", label: "Another Available", disabled: false },
      { value: "option4", label: "Also Disabled", disabled: true },
    ]

    const [selectedValue1, setSelectedValue1] = useState("option1")
    const [selectedValue2, setSelectedValue2] = useState("custom1")

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h4 className="font-strong">Using options prop with disabled property:</h4>
          <RadioGroup
            options={optionsWithDisabled}
            value={selectedValue1}
            onChange={setSelectedValue1}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-strong">Using RadioGroup.Item with individual disabled control:</h4>
          <RadioGroup
            value={selectedValue2}
            onChange={setSelectedValue2}
          >
            <RadioGroup.Item value="custom1">First Choice (Available)</RadioGroup.Item>
            <RadioGroup.Item
              value="custom2"
              disabled
            >
              Second Choice (Disabled)
            </RadioGroup.Item>
            <RadioGroup.Item value="custom3">Third Choice (Available)</RadioGroup.Item>
            <RadioGroup.Item
              value="custom4"
              disabled
            >
              Fourth Choice (Disabled)
            </RadioGroup.Item>
          </RadioGroup>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] RadioGroup component in readOnly state.
 *
 * In readOnly mode:
 * - Radio buttons do not respond to click or keyboard events
 * - The selected value cannot be changed
 * - Useful for displaying radio selection without allowing changes
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [value, setValue] = useState<string>("option1")
    const [changeCount, setChangeCount] = useState(0)

    const handleChange = (newValue: string) => {
      setValue(newValue)
      setChangeCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Current Value:</div>
          <div className="text-body-small font-mono text-stone-600">{value}</div>
          <div className="text-body-small-strong mt-2 text-stone-700">Change Count:</div>
          <div className="text-body-small font-mono text-stone-600">{changeCount}</div>
        </div>

        <RadioGroup
          readOnly
          value={value}
          onChange={handleChange}
        >
          <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
          <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
          <RadioGroup.Item value="option3">Option 3</RadioGroup.Item>
        </RadioGroup>

        <RadioGroup
          value={value}
          onChange={handleChange}
        >
          <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
          <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
          <RadioGroup.Item value="option3">Option 3</RadioGroup.Item>
        </RadioGroup>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly radio buttons - the value should not change and the change
          count should remain at 0. Only the normal radio group will change the value.
        </div>
      </div>
    )
  },
}
