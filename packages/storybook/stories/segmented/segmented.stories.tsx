import { Checkbox, Segmented } from "@choice-ui/react"
import { FieldTypeAttachment, FieldTypeCheckbox, FieldTypeCount } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

const meta = {
  title: "Buttons/Segmented",
  component: Segmented,
} satisfies Meta<typeof Segmented>

export default meta
type Story = StoryObj<typeof Segmented>

/**
 * `Segmented` is an accessible radio group component styled as a segmented control.
 *
 * ### Features
 * - Keyboard navigation with arrow keys
 * - Screen reader support with ARIA attributes
 * - Flexible content rendering
 * - Equal-width segments distribution
 * - Tooltip support for each option
 *
 * Uses a compound component pattern with Segmented.Item components to define each option
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState("sun")
    return (
      <Segmented
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Segmented.Item
          value="sun"
          aria-label="Sun"
        >
          <FieldTypeAttachment />
        </Segmented.Item>
        <Segmented.Item
          value="moon"
          aria-label="Moon"
        >
          <FieldTypeCheckbox />
        </Segmented.Item>
        <Segmented.Item
          value="system"
          aria-label="System"
        >
          <FieldTypeCount />
        </Segmented.Item>
      </Segmented>
    )
  },
}

/**
 * ### Disabled Options
 *
 * Use the `disabled` property to disable specific segments in the control:
 * - Disabled options cannot be selected
 * - They display a visual disabled state
 * - They're excluded from keyboard navigation
 * - Screen readers announce them as disabled
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState("right")
    return (
      <Segmented
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Segmented.Item
          value="left"
          disabled
          className="px-2"
        >
          Left
        </Segmented.Item>
        <Segmented.Item
          value="center"
          disabled
          className="px-2"
        >
          Center
        </Segmented.Item>
        <Segmented.Item
          value="right"
          disabled
          className="px-2"
        >
          Right
        </Segmented.Item>
      </Segmented>
    )
  },
}

/**
 * ### Custom Content Styling
 *
 * The component provides flexible styling options:
 *
 * - Use the `className` property to directly style individual options
 * - Use `classNames.container` to style the outer container
 *
 * #### Best Practices
 * - For text content, add horizontal padding using `px-{size}`
 * - For icon + text combinations, use `gap-{size}` to control spacing
 * - Keep padding consistent across all options for visual alignment
 */
export const CustomContentStyle: Story = {
  render: function CustomContentStyleStory() {
    const [value, setValue] = useState("left")
    return (
      <Segmented
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Segmented.Item
          value="left"
          className="px-2"
        >
          Left
        </Segmented.Item>
        <Segmented.Item
          value="center"
          className="px-2"
        >
          Center
        </Segmented.Item>
        <Segmented.Item
          value="right"
          className="px-2"
        >
          Right
        </Segmented.Item>
      </Segmented>
    )
  },
}

/**
 * ### Mixed Content with Icons and Labels
 *
 * The component supports flexible content rendering, allowing you to combine icons and text:
 *
 * #### Features
 * - Supports any valid React node as content
 * - Maintains consistent alignment with mixed content
 * - Automatically handles spacing and layout
 *
 * #### Best Practices
 * - Use consistent icon sizes within the same control
 * - Maintain a logical reading order (icon + label)
 * - Provide `aria-label` for icon-only options
 * - Use `gap-1` or `gap-2` for spacing between icon and text
 */
export const WithIconsAndLabels: Story = {
  render: function WithIconsAndLabelsStory() {
    const [value, setValue] = useState("desktop")
    return (
      <Segmented
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Segmented.Item
          value="desktop"
          aria-label="Desktop"
          className="gap-1 px-2"
        >
          <>
            <FieldTypeCheckbox />
            Desktop
          </>
        </Segmented.Item>
        <Segmented.Item
          value="tablet"
          aria-label="Tablet"
          className="gap-1 px-2"
        >
          <>
            <FieldTypeCheckbox />
            Tablet
          </>
        </Segmented.Item>
        <Segmented.Item
          value="mobile"
          aria-label="Mobile"
          className="gap-1 px-2"
        >
          <>
            <FieldTypeCheckbox />
            Mobile
          </>
        </Segmented.Item>
      </Segmented>
    )
  },
}

/**
 * ### Tooltip Configuration
 *
 * The component supports two levels of tooltip configuration:
 *
 * #### 1. Individual Option Tooltips
 * - Set through the `tooltip` property in each option
 * - Automatically used as `aria-label` if no explicit label is provided
 * - Ideal for icon-only options or additional context
 *
 * #### 2. Global Tooltip Settings
 * - Applied to all options through the component's `tooltip` prop
 * - Controls behavior such as placement, delay, and animations
 * - Can be overridden by individual option settings
 *
 * #### Accessibility Notes
 * The component follows a priority order for accessibility labels:
 * 1. Explicit `aria-label` if provided
 * 2. `tooltip` text if available
 * 3. String content if the option content is a string
 */
export const WithTooltip: Story = {
  render: function WithTooltipStory() {
    const [value, setValue] = useState("sun")
    return (
      <Segmented
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Segmented.Item
          value="sun"
          tooltip={{
            content: "Sun",
          }}
        >
          <FieldTypeAttachment />
        </Segmented.Item>
        <Segmented.Item
          value="moon"
          tooltip={{
            content: "Moon",
          }}
        >
          <FieldTypeCheckbox />
        </Segmented.Item>
        <Segmented.Item
          value="system"
          tooltip={{
            content: "System",
          }}
        >
          <FieldTypeCount />
        </Segmented.Item>
      </Segmented>
    )
  },
}

/**
 * Visual Variants
 *
 * Demonstrates different visual variants of the segmented control:
 *
 * - **default**: Follows the page theme dynamically (light/dark mode)
 * - **light**: Fixed light appearance regardless of theme
 * - **dark**: Fixed dark appearance regardless of theme
 * - **reset**: Removes variant styling, no variant settings applied
 *
 * Each variant maintains full functionality while adapting its visual style
 * to different contexts and themes.
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [value, setValue] = useState("sun")
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
          <div className="bg-default-background rounded-lg border p-4">
            <div className="text-secondary-foreground mb-2">Default</div>
            <Segmented
              value={value}
              onChange={(value) => setValue(value)}
              disabled={disabled}
            >
              <Segmented.Item
                className="px-2"
                value="sun"
              >
                Sun
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="moon"
              >
                Moon
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="system"
              >
                System
              </Segmented.Item>
            </Segmented>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-secondary-foreground mb-2">Light</div>
            <Segmented
              value={value}
              onChange={(value) => setValue(value)}
              variant="light"
              disabled={disabled}
            >
              <Segmented.Item
                className="px-2"
                value="sun"
              >
                Sun
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="moon"
              >
                Moon
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="system"
              >
                System
              </Segmented.Item>
            </Segmented>
          </div>
          <div className="rounded-lg border bg-gray-800 p-4">
            <div className="mb-2 text-gray-400">Dark</div>
            <Segmented
              value={value}
              onChange={(value) => setValue(value)}
              variant="dark"
              disabled={disabled}
            >
              <Segmented.Item
                className="px-2"
                value="sun"
              >
                Sun
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="moon"
              >
                Moon
              </Segmented.Item>
              <Segmented.Item
                className="px-2"
                value="system"
              >
                System
              </Segmented.Item>
            </Segmented>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] Segmented component in readOnly state.
 *
 * In readOnly mode:
 * - The segmented control does not respond to selection changes
 * - The value cannot be changed
 * - Useful for displaying the current selection without allowing changes
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

        <Segmented
          readOnly
          value={value}
          onChange={handleChange}
        >
          <Segmented.Item value="option1">Option 1</Segmented.Item>
          <Segmented.Item value="option2">Option 2</Segmented.Item>
          <Segmented.Item value="option3">Option 3</Segmented.Item>
        </Segmented>

        <Segmented
          value={value}
          onChange={handleChange}
        >
          <Segmented.Item value="option1">Option 1</Segmented.Item>
          <Segmented.Item value="option2">Option 2</Segmented.Item>
          <Segmented.Item value="option3">Option 3</Segmented.Item>
        </Segmented>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on the readonly segmented control - the value should not change and the
          change count should remain at 0. Only the normal control will change the value.
        </div>
      </div>
    )
  },
}
