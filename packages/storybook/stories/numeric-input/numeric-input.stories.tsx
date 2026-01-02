import type { NumberResult, NumericInputValue } from "@choice-ui/react"
import {
  Button,
  Checkbox,
  Dropdown,
  IconButton,
  Label,
  NumericInput,
  Select,
  useNumericLongPress,
} from "@choice-ui/react"
import {
  AddSmall,
  AddTiny,
  ChevronDownSmall,
  ColorTypeSolid,
  DeleteSmall,
  DeleteTiny,
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
import { useState } from "react"
import { useCounter, useEventCallback } from "usehooks-ts"

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
        className="w-64"
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
        className="w-64"
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
        className="w-64"
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
 * Demonstrates the `useNumericLongPress` hook for continuous increment/decrement.
 *
 * ### Features
 * - **Single click**: Triggers one increment/decrement
 * - **Long press**: After 400ms delay, continuously triggers at 50ms intervals
 * - **Auto-stop**: Stops when mouse is released or leaves the button
 *
 */
export const LongPress: Story = {
  render: function LongPressStory() {
    const { count, setCount, increment, decrement } = useCounter(0)

    const handleIncrement = useEventCallback(() => {
      if (count >= 100) return
      increment()
    })

    const handleDecrement = useEventCallback(() => {
      if (count <= 0) return
      decrement()
    })

    const incrementLongPress = useNumericLongPress(handleIncrement)
    const decrementLongPress = useNumericLongPress(handleDecrement)

    return (
      <NumericInput
        className="w-64"
        value={count}
        onChange={(newValue) => setCount(newValue as number)}
        min={0}
        max={100}
        classNames={{
          input: "px-2",
        }}
      >
        <NumericInput.Prefix
          type="action"
          className="mr-px"
        >
          <IconButton
            disabled={count <= 0}
            className="rounded-r-none"
            {...decrementLongPress}
          >
            <DeleteTiny />
          </IconButton>
        </NumericInput.Prefix>
        <NumericInput.Suffix
          type="action"
          className="ml-px"
        >
          <IconButton
            disabled={count >= 100}
            className="rounded-l-none"
            {...incrementLongPress}
          >
            <AddTiny />
          </IconButton>
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
        className="w-64"
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
        className="w-64"
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
        className="w-64"
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
        className="w-64"
        expression="{width}px, {height}px"
        value={value}
        onChange={(newValue) => setValue(newValue as { height: number; width: number })}
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
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          disabled
          value={10}
          onChange={(newValue) => console.log(newValue)}
        >
          <NumericInput.Prefix>
            <ColorTypeSolid />
          </NumericInput.Prefix>
        </NumericInput>

        <NumericInput
          className="w-64"
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
 * Sizes: Demonstrates different size variants of the numeric input component.
 * - default: Standard height (24px / h-6)
 * - large: Larger height (32px / h-8)
 *
 * This example shows all combinations of sizes with different features:
 * - Basic input
 * - With prefix
 * - With suffix
 * - With prefix and suffix
 * - With variable
 * - With menu trigger
 * - Disabled state
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const [value, setValue] = useState(10)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuOpenLarge, setMenuOpenLarge] = useState(false)

    return (
      <>
        {/* Default Size */}
        <div className="flex flex-col gap-4">
          <h3 className="text-body-large font-medium">Default Size (h-6 / 24px)</h3>
          <div className="flex flex-wrap gap-4">
            {/* Basic */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Basic</span>
              <NumericInput
                className="w-32"
                size="default"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              />
            </div>

            {/* With Prefix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Prefix</span>
              <NumericInput
                className="w-32"
                size="default"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
              </NumericInput>
            </div>

            {/* With Suffix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Suffix</span>
              <NumericInput
                className="w-32"
                size="default"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Suffix>
                  <Relative />
                </NumericInput.Suffix>
              </NumericInput>
            </div>

            {/* With Prefix and Suffix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Prefix + Suffix</span>
              <NumericInput
                className="w-32"
                size="default"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Suffix>
                  <Relative />
                </NumericInput.Suffix>
              </NumericInput>
            </div>

            {/* With Variable */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Variable</span>
              <NumericInput
                className="w-32"
                size="default"
                value={undefined}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Variable value={10} />
              </NumericInput>
            </div>

            {/* With Menu Trigger */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Menu</span>
              <NumericInput
                className="w-32"
                size="default"
                focused={menuOpen}
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Suffix type="action">
                  <Select
                    open={menuOpen}
                    onOpenChange={setMenuOpen}
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

            {/* Disabled */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Disabled</span>
              <NumericInput
                className="w-32"
                size="default"
                disabled
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
              </NumericInput>
            </div>
          </div>
        </div>

        {/* Large Size */}
        <div className="flex flex-col gap-4">
          <h3 className="text-body-large font-medium">Large Size (h-8 / 32px)</h3>
          <div className="flex flex-wrap gap-4">
            {/* Basic */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Basic</span>
              <NumericInput
                className="w-32"
                size="large"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              />
            </div>

            {/* With Prefix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Prefix</span>
              <NumericInput
                className="w-32"
                size="large"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
              </NumericInput>
            </div>

            {/* With Suffix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Suffix</span>
              <NumericInput
                className="w-32"
                size="large"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Suffix>
                  <Relative />
                </NumericInput.Suffix>
              </NumericInput>
            </div>

            {/* With Prefix and Suffix */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Prefix + Suffix</span>
              <NumericInput
                className="w-32"
                size="large"
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Suffix>
                  <Relative />
                </NumericInput.Suffix>
              </NumericInput>
            </div>

            {/* With Variable */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Variable</span>
              <NumericInput
                className="w-32"
                size="large"
                value={undefined}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Variable value={10} />
              </NumericInput>
            </div>

            {/* With Menu Trigger */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">With Menu</span>
              <NumericInput
                className="w-32"
                size="large"
                focused={menuOpenLarge}
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
                <NumericInput.Suffix type="action">
                  <Select
                    open={menuOpenLarge}
                    onOpenChange={setMenuOpenLarge}
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

            {/* Disabled */}
            <div className="flex flex-col gap-1">
              <span className="text-secondary-foreground text-body-small">Disabled</span>
              <NumericInput
                className="w-32"
                size="large"
                disabled
                value={value}
                onChange={(newValue) => setValue(newValue as number)}
              >
                <NumericInput.Prefix>
                  <FixedWidth />
                </NumericInput.Prefix>
              </NumericInput>
            </div>
          </div>
        </div>
      </>
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the numeric input component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no variant settings applied
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [value, setValue] = useState(10)
    const [disabled, setDisabled] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={disabled}
          onChange={(value) => setDisabled(value)}
        >
          Disabled
        </Checkbox>
        <div className="flex flex-wrap gap-4">
          <div className="bg-default-background flex flex-col gap-4 rounded-lg border p-4">
            <NumericInput
              disabled={disabled}
              value={value}
              onChange={(newValue) => setValue(newValue as number)}
            />
            <NumericInput
              disabled={disabled}
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
          </div>
          <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
            <NumericInput
              disabled={disabled}
              variant="light"
              value={value}
              onChange={(newValue) => setValue(newValue as number)}
            />
            <NumericInput
              disabled={disabled}
              variant="light"
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
          </div>
          <div className="flex flex-col gap-4 rounded-lg border bg-gray-800 p-4">
            <NumericInput
              disabled={disabled}
              variant="dark"
              value={value}
              onChange={(newValue) => setValue(newValue as number)}
            />
            <NumericInput
              disabled={disabled}
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
          </div>
        </div>
      </div>
    )
  },
}

export const Tooltip: Story = {
  render: function TooltipStory() {
    return (
      <NumericInput
        className="w-64"
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
 *
 * Usage:
 * - Try entering different values and expressions to observe onChange event behavior
 * - Current value won't trigger onChange when entered again
 * - Expressions that result in the same value won't trigger onChange
 * - Entering other values or expressions will trigger onChange
 * - Try expressions like "1+1", "2*1", "4/2" that result in the current value
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
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          value={value}
          onChange={handleChange}
        />

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current value:</b> {value}
          </p>
          <p className="text-secondary-foreground">
            <b>onChange trigger count:</b> {changeCount}
          </p>
          {lastInputText && (
            <p className="text-secondary-foreground">
              <b>Last input text:</b> {lastInputText}
            </p>
          )}
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
 *
 * Usage:
 * - Try entering values and expressions with a pixel unit pattern
 * - Current value won't trigger onChange when entered again
 * - Expressions that result in the same numerical value won't trigger onChange
 * - Entering different values or expressions will trigger onChange
 * - Try expressions like "12+12", "24*1" that result in the current numerical value
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
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          value={value}
          onChange={handleChange}
          expression="{value}px"
        />

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current value:</b> {value}px
          </p>
          <p className="text-secondary-foreground">
            <b>onChange trigger count:</b> {changeCount}
          </p>
          {lastInputText && (
            <p className="text-secondary-foreground">
              <b>Last input text:</b> {lastInputText}
            </p>
          )}
        </div>
      </div>
    )
  },
}

/**
 * Example demonstrating multi-value expression update behavior.
 * In previous versions, when only modifying the second value (e.g., height) without modifying the first value (e.g., width),
 * the component could not update correctly. This fix ensures that even when only one property is modified, the entire object updates correctly.
 *
 * Usage:
 * - Modify the first value (width)
 * - Modify the second value (height)
 * - Modify both values simultaneously
 * After the fix, all three scenarios should correctly trigger updates.
 *
 * Tips:
 * - Enter comma-separated values (e.g., "15, 20") to update both properties
 * - Keep the value before the comma unchanged and only modify the value after (e.g., ", 25") to update only height
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
      setValue(newValue as { height: number; width: number })
      setUpdateCount((prev) => prev + 1)

      const newObj = newValue as { height: number; width: number }
      if (newObj.width !== value.width && newObj.height !== value.height) {
        setLastUpdatedProperty("width & height")
      } else if (newObj.width !== value.width) {
        setLastUpdatedProperty("width")
      } else if (newObj.height !== value.height) {
        setLastUpdatedProperty("height")
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          expression="{width}, {height}"
          value={value}
          onChange={handleChange}
        />

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current value:</b> {value.width}, {value.height}
          </p>
          <p className="text-secondary-foreground">
            <b>Update count:</b> {updateCount}
          </p>
          {lastUpdatedProperty && (
            <p className="text-secondary-foreground">
              <b>Last updated property:</b> {lastUpdatedProperty}
            </p>
          )}
        </div>
      </div>
    )
  },
}

/**
 * Step and Shift Step: Demonstrates the step functionality with modifier key support
 *
 * This example shows how NumericInput responds to different step values based on modifier keys:
 * - Default: 1 step
 * - Shift: 10 steps (larger increments)
 * - Meta/Ctrl: 0.1 steps (finer control)
 *
 * Usage:
 * - Focus the input and use arrow keys with modifier keys to see different step values
 * - ↑/↓: Default step (1)
 * - Shift + ↑/↓: Large step (10)
 * - Try holding Shift while using arrow keys to see different step sizes
 */
export const StepAndShiftStep: Story = {
  render: function StepAndShiftStepStory() {
    const [value, setValue] = useState(100)

    return (
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          value={value}
          onChange={(newValue) => setValue(newValue as number)}
          step={1}
          min={0}
          max={1000}
        >
          <NumericInput.Prefix>
            <HugWidth />
          </NumericInput.Prefix>
        </NumericInput>

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current value:</b> {value}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * ArrayValues: Demonstrates support for array values.
 *
 * Features:
 * - Array input/output
 * - Comma-separated value parsing
 * - Multiple value management
 * - Useful for multi-value scenarios like coordinates or dimensions
 *
 * Usage:
 * - NumericInput supports array values for multi-value inputs
 * - Array values require an expression pattern to format display
 * - Expression uses {value1}, {value2}, {value3} etc. (1-based indexing)
 * - Enter comma-separated values like "10, 20, 30"
 */
export const ArrayValues: Story = {
  render: function ArrayValuesStory() {
    const [value, setValue] = useState<number[]>([10, 20, 30])

    return (
      <div className="flex flex-col gap-4">
        <NumericInput
          className="w-64"
          value={value}
          expression="{value1}, {value2}, {value3}"
          onChange={(newValue) => setValue(newValue as number[])}
        >
          <NumericInput.Prefix>
            <HugWidth />
          </NumericInput.Prefix>
        </NumericInput>

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current values:</b> {value.join(", ")}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * EmptyValue: Demonstrates empty value handling.
 *
 * Features:
 * - Support for undefined/null values
 * - Value clearing functionality
 * - Default value management
 * - Useful for optional numeric inputs
 *
 * Usage:
 * - NumericInput supports undefined values for optional inputs
 * - Clear the input to see empty value handling
 */
export const EmptyValue: Story = {
  render: function EmptyValueStory() {
    const [value, setValue] = useState<number | undefined>(100)

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <NumericInput
            value={value}
            onChange={(newValue) => {
              if (typeof newValue === "number" || newValue === undefined) {
                setValue(newValue)
              }
            }}
          >
            <NumericInput.Prefix>
              <HugWidth />
            </NumericInput.Prefix>
          </NumericInput>

          <Button
            variant="secondary"
            onClick={() => setValue(undefined)}
          >
            Clear
          </Button>
        </div>

        <div className="bg-secondary-background flex flex-col gap-2 rounded-lg p-4">
          <p className="text-secondary-foreground">
            <b>Current value:</b> {value === undefined ? "empty" : value}
          </p>
        </div>
      </div>
    )
  },
}

/**
 * LinkedInputs: Demonstrates coordinated multiple inputs with shared state.
 *
 * Features:
 * - Coordinated multiple inputs
 * - Shared state management
 * - Visual result feedback
 * - Practical example: RGB color picker
 *
 * Usage:
 * - Example of coordinated multiple NumericInput components
 * - Each input controls a different color channel (R, G, B)
 * - Changes are reflected in real-time visual preview
 */
export const LinkedInputs: Story = {
  render: function LinkedInputsStory() {
    const [color, setColor] = useState({ r: 255, g: 100, b: 50 })

    const rgbToHex = (r: number, g: number, b: number) => {
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    const hexColor = rgbToHex(color.r, color.g, color.b)

    return (
      <div className="flex flex-col gap-4">
        <div className="grid max-w-md grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-red-600">Red</Label>
            <NumericInput
              value={color.r}
              min={0}
              max={255}
              step={1}
              onChange={(value) => setColor((prev) => ({ ...prev, r: value as number }))}
            >
              <NumericInput.Prefix>
                <ColorTypeSolid />
              </NumericInput.Prefix>
            </NumericInput>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-green-600">Green</Label>
            <NumericInput
              value={color.g}
              min={0}
              max={255}
              step={1}
              onChange={(value) => setColor((prev) => ({ ...prev, g: value as number }))}
            >
              <NumericInput.Prefix>
                <ColorTypeSolid />
              </NumericInput.Prefix>
            </NumericInput>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-blue-600">Blue</Label>
            <NumericInput
              value={color.b}
              min={0}
              max={255}
              step={1}
              onChange={(value) => setColor((prev) => ({ ...prev, b: value as number }))}
            >
              <NumericInput.Prefix>
                <ColorTypeSolid />
              </NumericInput.Prefix>
            </NumericInput>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            style={{
              backgroundColor: hexColor,
              width: "100px",
              height: "50px",
              borderRadius: "6px",
            }}
          />
          <div className="flex flex-col">
            <div className="text-body-large font-mono">{hexColor}</div>
            <div className="text-secondary-foreground">
              rgb({color.r}, {color.g}, {color.b})
            </div>
          </div>
        </div>
      </div>
    )
  },
}
