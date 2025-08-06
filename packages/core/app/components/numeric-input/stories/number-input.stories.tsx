import {
  ChevronDownSmall,
  ColorTypeGradient,
  ColorTypeSolid,
  FixedHeight,
  FixedWidth,
  HugHeight,
  HugWidth,
  MaxHeight,
  MinHeight,
  Relative,
  Variable,
} from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { Dropdown } from "../../dropdown"
import { IconButton } from "../../icon-button"
import { Select } from "../../select"
import { NumericInputMenuTrigger } from "../components"
import { NumericInput } from "../numeric-input"
import { NumberResult, NumericInputValue } from "../types"

const meta: Meta<typeof NumericInput> = {
  title: "Forms/NumericInput",
  component: NumericInput,
  tags: ["upgrade"],
}

export default meta

type Story = StoryObj<typeof NumericInput>
const selectOptions = [
  {
    label: "Fixed height",
    value: "fixed",
    icon: <FixedHeight />,
  },
  {
    label: "Hug contents",
    value: "hug",
    icon: <HugHeight />,
  },
  {
    divider: true,
  },
  {
    label: "Add min height...",
    value: "min",
    icon: <MinHeight />,
  },
  {
    label: "Add max height...",
    value: "max",
    icon: <MaxHeight />,
  },
]

/**
 * # NumericInput Component
 *
 * A sophisticated input component for handling numeric values with rich formatting,
 * expression evaluation, and interactive features.
 *
 * ## Key Features
 *
 * - **Flexible Value Handling**: Supports simple numbers, mathematical expressions, and formatted values (with units)
 * - **Multiple Interaction Modes**: Keyboard navigation, drag adjustments, menu selection
 * - **Variable Binding**: Support for displaying and toggling variable values
 * - **Rich Expression Formats**: Unit formatting (px, %, etc.), multi-value inputs, conditional formatting
 * - **Customizable Appearance**: Prefix, suffix elements, dark theme
 * - **State Management**: Disabled state, selected state, error handling
 *
 * ## Expression Format Examples
 *
 * - Unit format: `"{value}px"` → displays "100px"
 * - Multiple properties: `"{width}px, {height}px"` → displays "10px, 20px"
 * - Conditional hiding: `"{value1}{value2,hidden}"` → shows value2 only when needed
 *
 * ## Advanced Features
 *
 * - **Math Evaluation**: Input mathematical expressions (e.g., "1+2*3")
 * - **Keyboard Controls**:
 *   - ↑/↓: Increase/decrease by step value
 *   - Shift + ↑/↓: Use larger step
 *   - Meta/Alt + ↑/↓: Use smaller step
 * - **Variable Support**: Display variable values with `<NumericInput.Variable />` component
 * - **Custom Menus**: Add dropdown menus with suffix of type "menu" or "action"
 *
 * ## Best Practices
 *
 * - Provide clear prefix or suffix to indicate value type or unit
 * - Use appropriate constraints (min, max, step) for better user experience
 * - Always use expression pattern for complex formatted values
 *
 * ## Style Variants
 *
 * - Default (light theme)
 * - Dark theme: `variant="dark"`
 * - Disabled state: `disabled={true}`
 * - Selected state: `selected={true}`
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState(10)

    return (
      <NumericInput
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      />
    )
  },
}

/**
 * Example showing NumericInput with a prefix element.
 * Prefixes provide visual context for the input value, such as indicating the property type.
 */
export const Prefix: Story = {
  render: function PrefixStory() {
    const [value, setValue] = useState(10)
    return (
      <NumericInput
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      >
        <NumericInput.Prefix>
          <HugWidth />
        </NumericInput.Prefix>
      </NumericInput>
    )
  },
}

/**
 * Example showing NumericInput with a suffix element.
 * Suffixes help indicate units or provide additional context after the value.
 */
export const Suffix: Story = {
  render: function SuffixStory() {
    const [value, setValue] = useState(10)
    return (
      <NumericInput
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      >
        <NumericInput.Suffix>
          <Relative />
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
}

/**
 * Example showing NumericInput with both prefix and suffix elements.
 * This pattern is useful for providing complete context around a value.
 */
export const PrefixAndSuffix: Story = {
  render: function PrefixAndSuffixStory() {
    const [value, setValue] = useState(10)
    return (
      <NumericInput
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      >
        <NumericInput.Prefix>
          <HugWidth />
        </NumericInput.Prefix>
        <NumericInput.Suffix>
          <Relative />
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
}

/**
 * Example demonstrating a NumericInput with a dropdown menu in the suffix.
 * This pattern allows additional actions to be performed on the input value.
 * The menu is triggered by a button in the suffix position.
 */
export const SuffixMenu: Story = {
  render: function SuffixMenuStory() {
    const [value, setValue] = useState(10)
    const [menuOpen, setMenuOpen] = useState(false)
    return (
      <NumericInput
        focused={menuOpen}
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      >
        <NumericInput.Suffix type="menu">
          <Dropdown
            open={menuOpen}
            onOpenChange={setMenuOpen}
            placement="bottom"
          >
            <Dropdown.Trigger asChild>
              <IconButton className="rounded-l-none">
                <ChevronDownSmall />
              </IconButton>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <FixedHeight />
                Fixed height
              </Dropdown.Item>
              <Dropdown.Item>
                <HugHeight />
                Hug contents
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <MinHeight />
                Add min height...
              </Dropdown.Item>
              <Dropdown.Item>
                <MaxHeight />
                Add max height...
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
}

/**
 * Example showing a NumericInput with an action in the suffix.
 * Action suffixes allow changing the behavior or formatting of the input.
 * This example demonstrates a dropdown selector that changes the height behavior.
 */
export const SuffixAction: Story = {
  render: function SuffixActionStory() {
    const [value, setValue] = useState(10)
    const [menuValue, setMenuValue] = useState("fixed")
    const [menuOpen, setMenuOpen] = useState(false)

    return (
      <NumericInput
        focused={menuOpen}
        value={value}
        onChange={(newValue) => setValue(newValue as number)}
      >
        {menuValue !== "fixed" && (
          <NumericInput.ActionPrompt>
            {selectOptions.find((option) => option.value === menuValue)?.label?.split(" ")[0]}
          </NumericInput.ActionPrompt>
        )}

        <NumericInput.Suffix type="action">
          <Select
            open={menuOpen}
            onOpenChange={setMenuOpen}
            value={menuValue}
            onChange={(value) => setMenuValue(value)}
            placement="bottom-end"
          >
            <Select.Trigger asChild>
              <IconButton className="rounded-l-none">
                <ChevronDownSmall />
              </IconButton>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="fixed">
                <FixedHeight />
                Fixed height
              </Select.Item>
              <Select.Item value="hug">
                <HugHeight />
                Hug contents
              </Select.Item>
              <Select.Divider />
              <Select.Item value="min">
                <MinHeight />
                Add min height...
              </Select.Item>
              <Select.Item value="max">
                <MaxHeight />
                Add max height...
              </Select.Item>
            </Select.Content>
          </Select>
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
}

/**
 * Example demonstrating variable value support in NumericInput.
 * Variables allow users to reference dynamic values instead of hardcoded numbers.
 * This example shows how to toggle between a concrete value and a variable reference.
 */
export const AddVariable: Story = {
  render: function AddVariableStory() {
    const [value, setValue] = useState<number | undefined>(undefined)
    const [variableValue, setVariableValue] = useState<number | null>(null)

    const handleChange = useEventCallback((newValue) => {
      setValue(newValue as number)
    })

    return (
      <NumericInput
        value={value}
        onChange={handleChange}
      >
        <NumericInput.Prefix>
          <FixedWidth />
        </NumericInput.Prefix>

        {variableValue && !value && <NumericInput.Variable value={variableValue} />}

        <NumericInput.Suffix type="menu">
          <Dropdown>
            <Dropdown.Trigger asChild>
              <IconButton className="rounded-l-none">
                <Variable />
              </IconButton>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item
                onMouseUp={() => {
                  setVariableValue(10)
                  setValue(undefined)
                }}
              >
                Add variable...
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
}

/**
 * Example showing expression pattern support for formatting compound values.
 * The expression "{width}px, {height}px" formats the value object with two properties.
 * This pattern is ideal for dimension inputs or other multi-value scenarios.
 */
export const Expression: Story = {
  render: function ExpressionStory() {
    const [value, setValue] = useState({
      width: 10,
      height: 20,
    })

    return (
      <NumericInput
        expression="{width}px, {height}px"
        value={value}
        onChange={(newValue) => setValue(newValue as { width: number; height: number })}
      >
        <NumericInput.Prefix>
          <FixedWidth />
        </NumericInput.Prefix>
      </NumericInput>
    )
  },
}

/**
 * Example showing NumericInput in disabled state.
 * Disabled inputs prevent user interaction but maintain visual consistency.
 * This example shows both simple disabled inputs and complex ones with variables and menus.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="grid w-64 grid-cols-2 gap-4">
        <NumericInput
          disabled
          value={10}
          onChange={(newValue) => console.log(newValue)}
        >
          <NumericInput.Prefix>
            <ColorTypeSolid />
          </NumericInput.Prefix>
        </NumericInput>
        <NumericInput
          disabled
          value={10}
          onChange={(newValue) => console.log(newValue)}
        >
          <NumericInput.Prefix>
            <ColorTypeSolid />
          </NumericInput.Prefix>

          <NumericInput.Variable value={10} />

          <NumericInput.Suffix type="action">
            <Select
              disabled
              placement="bottom-end"
            >
              <Select.Trigger asChild>
                <NumericInput.MenuTrigger
                  aria-label="Open menu"
                  type="action"
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="fixed">
                  <FixedHeight />
                  Fixed height
                </Select.Item>
                <Select.Item value="hug">
                  <HugHeight />
                  Hug contents
                </Select.Item>
              </Select.Content>
            </Select>
          </NumericInput.Suffix>
        </NumericInput>
      </div>
    )
  },
}

/**
 * Example showing NumericInput in dark theme variant.
 * The dark theme is designed for use on dark backgrounds with adjusted colors.
 * This example shows various states and configurations in dark mode.
 */
export const Dark: Story = {
  render: function DarkStory() {
    const [value, setValue] = useState(10)
    return (
      <div className="flex aspect-square flex-col items-start justify-center gap-4 bg-gray-800 p-8">
        <NumericInput
          variant="dark"
          value={value}
          onChange={(newValue) => setValue(newValue as number)}
        />
        <NumericInput
          variant="dark"
          value={value}
          onChange={(newValue) => setValue(newValue as number)}
        >
          <NumericInput.Prefix>
            <ColorTypeSolid />
          </NumericInput.Prefix>
          <NumericInput.Variable value={10} />
          <NumericInput.Suffix type="action">
            <Select
              disabled
              placement="bottom-end"
            >
              <Select.Trigger asChild>
                <NumericInput.MenuTrigger
                  aria-label="Open menu"
                  type="menu"
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="fixed">
                  <FixedHeight />
                  Fixed height
                </Select.Item>
              </Select.Content>
            </Select>
          </NumericInput.Suffix>
        </NumericInput>
        <NumericInput
          variant="dark"
          value={value}
          disabled
          onChange={(newValue) => setValue(newValue as number)}
        >
          <NumericInput.Prefix>
            <ColorTypeSolid />
          </NumericInput.Prefix>
          <NumericInput.Variable value={10} />
          <NumericInput.Suffix type="action">
            <Select
              disabled
              placement="bottom-end"
            >
              <Select.Trigger asChild>
                <NumericInput.MenuTrigger
                  aria-label="Open menu"
                  type="menu"
                />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="fixed">
                  <FixedHeight />
                  Fixed height
                </Select.Item>
              </Select.Content>
            </Select>
          </NumericInput.Suffix>
        </NumericInput>
      </div>
    )
  },
}

export const Tooltip: Story = {
  render: function TooltipStory() {
    return (
      <NumericInput
        value={10}
        tooltip={{
          content: "This is a tooltip",
        }}
      />
    )
  },
}

/**
 * Example demonstrating the mathematical expression evaluation feature.
 * This shows how NumericInput can:
 * 1. Accept and evaluate mathematical expressions (e.g., 1+1)
 * 2. Compare calculation results with current value
 * 3. Only trigger onChange when the result differs from current value
 *
 * For example:
 * - When value is 2, entering "2" won't trigger onChange
 * - When value is 2, entering "1+1" won't trigger onChange (same result)
 * - When value is 2, entering "3" or "1+2" will trigger onChange (different result)
 */
export const ExpressionCalculation: Story = {
  render: function ExpressionCalculationStory() {
    const [value, setValue] = useState(2)
    const [changeCount, setChangeCount] = useState(0)
    const [lastInputText, setLastInputText] = useState("")

    const handleChange = (newValue: NumericInputValue, detail: NumberResult) => {
      console.log("onChange triggered with:", newValue, detail)
      setValue(newValue as number)
      setChangeCount((prev) => prev + 1)
      setLastInputText(detail.string)
    }

    return (
      <div className="grid w-96 gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Mathematical Expression Test</h3>
          <p className="text-secondary-foreground">
            Try entering different values and expressions to observe onChange event behavior:
          </p>
          <ul className="text-secondary-foreground list-disc pl-5">
            <li>
              Current value is {value}, entering {value} won&apos;t trigger onChange
            </li>
            <li>
              Current value is {value}, entering expressions that result in {value} (like{" "}
              {value - 1}+1) won&apos;t trigger onChange
            </li>
            <li>Entering other values or expressions will trigger onChange</li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-2">
          <NumericInput
            value={value}
            onChange={handleChange}
          />

          <div className="mt-2 rounded border bg-gray-50 p-3">
            <p className="text-sm">
              <b>Current value:</b> {value}
            </p>
            <p className="text-sm">
              <b>onChange trigger count:</b> {changeCount}
            </p>
            {lastInputText && (
              <p className="text-sm">
                <b>Last input text:</b> {lastInputText}
              </p>
            )}
            <p className="text-secondary-foreground mt-2">
              Tip: Try entering &ldquo;1+1&rdquo;, &ldquo;2*1&rdquo;, &ldquo;4/2&rdquo; or other
              expressions that result in the current value
            </p>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Example demonstrating expression calculations with unit formatting.
 * Shows how:
 * 1. Expressions with units like "{value}px" display values with units
 * 2. Input expressions are evaluated before comparison
 * 3. Similar expressions resulting in the same value won't trigger onChange
 *
 * For example:
 * - When value is "24px", entering "24" or "12+12" won't trigger onChange
 * - When value is "24px", entering "25" or "12+13" will trigger onChange
 */
export const UnitExpressionCalculation: Story = {
  render: function UnitExpressionCalculationStory() {
    const [value, setValue] = useState(24)
    const [changeCount, setChangeCount] = useState(0)
    const [lastInputText, setLastInputText] = useState("")

    const handleChange = (newValue: NumericInputValue, detail: NumberResult) => {
      console.log("onChange triggered with:", newValue, detail)
      setValue(newValue as number)
      setChangeCount((prev) => prev + 1)
      setLastInputText(detail.string)
    }

    return (
      <div className="grid w-96 gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Unit Expression Test</h3>
          <p className="text-secondary-foreground">
            Try entering values and expressions with a pixel unit pattern:
          </p>
          <ul className="text-secondary-foreground list-disc pl-5">
            <li>
              Current value is {value}px, entering {value} won&apos;t trigger onChange
            </li>
            <li>
              Entering expressions like &ldquo;{value / 2}+{value / 2}&rdquo; won&apos;t trigger
              onChange
            </li>
            <li>Entering different values or expressions will trigger onChange</li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-2">
          <NumericInput
            value={value}
            onChange={handleChange}
            expression="{value}px"
          />

          <div className="mt-2 rounded border bg-gray-50 p-3">
            <p className="text-sm">
              <b>Current value:</b> {value}px
            </p>
            <p className="text-sm">
              <b>onChange trigger count:</b> {changeCount}
            </p>
            {lastInputText && (
              <p className="text-sm">
                <b>Last input text:</b> {lastInputText}
              </p>
            )}
            <p className="text-secondary-foreground mt-2">
              Tip: Try entering &ldquo;12+12&rdquo;, &ldquo;24*1&rdquo;, or other expressions that
              result in the current numerical value
            </p>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * 这个示例专门用于测试和展示修复后的多值表达式更新行为。
 * 在之前的版本中，当只修改第二个值（如height）而不修改第一个值（如width）时，
 * 组件无法正确更新。这个修复确保了即使只修改一个属性，整个对象也能正确更新。
 */
export const MultiValueExpressionUpdate: Story = {
  render: function MultiValueExpressionUpdateStory() {
    const [value, setValue] = useState({
      width: 10,
      height: 20,
    })
    const [updateCount, setUpdateCount] = useState(0)
    const [lastUpdatedProperty, setLastUpdatedProperty] = useState("")

    const handleChange = (newValue: NumericInputValue, detail: NumberResult) => {
      setValue(newValue as { width: number; height: number })
      setUpdateCount((prev) => prev + 1)

      // 确定哪个属性被更新了
      const newObj = newValue as { width: number; height: number }
      if (newObj.width !== value.width && newObj.height !== value.height) {
        setLastUpdatedProperty("width & height")
      } else if (newObj.width !== value.width) {
        setLastUpdatedProperty("width")
      } else if (newObj.height !== value.height) {
        setLastUpdatedProperty("height")
      }
    }

    return (
      <div className="grid w-96 gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">多值表达式更新测试</h3>
          <p className="text-secondary-foreground">这个示例测试修复后的多值表达式更新行为：</p>
          <ul className="text-secondary-foreground list-disc pl-5">
            <li>修改首个值（width）</li>
            <li>修改第二个值（height）</li>
            <li>同时修改两个值</li>
          </ul>
          <p className="text-secondary-foreground">修复后，所有三种情况都应该正确触发更新。</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <NumericInput
            expression="{width}, {height}"
            value={value}
            onChange={handleChange}
          />

          <div className="mt-2 rounded border bg-gray-50 p-3">
            <p className="text-sm">
              <b>当前值:</b> {value.width}, {value.height}
            </p>
            <p className="text-sm">
              <b>更新次数:</b> {updateCount}
            </p>
            {lastUpdatedProperty && (
              <p className="text-sm">
                <b>最近更新的属性:</b> {lastUpdatedProperty}
              </p>
            )}
            <p className="text-secondary-foreground mt-2">
              提示: 输入逗号分隔的两个值（例如 "15, 20"）来更新两个属性，
              或者保留逗号前的值不变只修改后面的值（例如 ", 25"）来只更新height。
            </p>
          </div>
        </div>
      </div>
    )
  },
}
