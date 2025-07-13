import { SearchSmall } from "@choiceform/icons-react"
import { Story } from "@storybook/addon-docs/blocks"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment, useState } from "react"
import { Select } from "../select"
import { Button } from "./button"
import React from "react"
import { tcx } from "../../utils"

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Button>

/**
 * `Button` is a versatile, accessible button component supporting multiple visual styles, states, and behaviors.
 *
 * Features:
 * - Multiple visual variants for different semantic actions (primary, secondary, destructive, etc.)
 * - Size options for different UI contexts
 * - Loading state with spinner for async actions
 * - Active, focused, and disabled states
 * - Can render as other elements via `asChild` (e.g., <a>, <div>)
 * - Optional tooltip support for additional context
 * - Supports icons and custom content
 * - Full accessibility support (keyboard, ARIA, focus management)
 *
 * Usage:
 * - Use for primary and secondary actions, destructive actions, or as links styled as buttons
 * - Combine with icons for richer UI
 * - Use tooltips for extra guidance or clarification
 *
 * Best Practices:
 * - Use the appropriate variant for the action's importance and meaning
 * - Keep button labels concise and action-oriented
 * - Avoid using too many button styles on one screen
 * - Ensure sufficient color contrast and accessible focus indicators
 *
 * Accessibility:
 * - All states are accessible to screen readers and keyboard users
 * - Tooltips are accessible and do not interfere with button focus
 * - Use semantic HTML (button, a) for best accessibility
 */

/**
 * Basic: Shows the default button usage.
 * - Demonstrates a simple button with default styling.
 * - Use for primary actions or as a starting point for customization.
 */
export const Basic: Story = {
  render: () => <Button>Button</Button>,
}

/**
 * Sizes: Demonstrates the different size options for the Button component.
 * - Shows default and large button sizes.
 * - Useful for adapting buttons to different UI layouts or prominence.
 */
export const Sizes: Story = {
  render: () => (
    <>
      <Button>Default</Button>
      <Button size="large">Large</Button>
    </>
  ),
}

/**
 * Variants: Demonstrates all visual variants, sizes, and states for the Button component.
 * - Shows how to use the variant, size, and state props.
 * - Includes interactive controls for switching variants and sizes.
 * - Demonstrates active, focused, loading, and disabled states.
 * - Shows usage with and without icons.
 * - Useful for previewing all button styles and states in your design system.
 */
export const Variants: Story = {
  render: function Variants() {
    enum Variant {
      Dark = "dark",
      Destructive = "destructive",
      Ghost = "ghost",
      Inverse = "inverse",
      Link = "link",
      LinkDanger = "link-danger",
      Primary = "primary",
      Secondary = "secondary",
      SecondaryDestruct = "secondary-destruct",
      Solid = "solid",
      Success = "success",
    }

    enum Size {
      Default = "default",
      Large = "large",
    }

    enum State {
      Active = "active",
      Disabled = "disabled",
      Focused = "focused",
      Loading = "loading",
      Rest = "rest",
    }

    const [variant, setVariant] = useState<Variant>(Variant.Primary)
    const [size, setSize] = useState<Size>(Size.Default)

    return (
      <div
        className={tcx(
          "flex flex-col items-start gap-4 rounded-xl p-4",
          variant === Variant.Dark && "bg-gray-800",
        )}
      >
        <div className="flex gap-4">
          <Select
            value={variant}
            onChange={(value) => setVariant(value as Variant)}
          >
            <Select.Trigger>{variant}</Select.Trigger>
            <Select.Content>
              {Object.values(Variant).map((variant) => (
                <Select.Item
                  key={variant}
                  value={variant}
                >
                  {variant}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={size}
            onChange={(value) => setSize(value as Size)}
          >
            <Select.Trigger>{size}</Select.Trigger>
            <Select.Content>
              {Object.values(Size).map((size) => (
                <Select.Item
                  key={size}
                  value={size}
                >
                  {size}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-4">
          {Object.values(State).map((state) => (
            <Fragment key={state}>
              <span className="text-pink-500 capitalize">{state}</span>
              <Button
                variant={variant}
                size={size}
                active={state === State.Active}
                disabled={state === State.Disabled}
                loading={state === State.Loading}
                focused={state === State.Focused}
              >
                Button
              </Button>
              <Button
                variant={variant}
                size={size}
                active={state === State.Active}
                disabled={state === State.Disabled}
                loading={state === State.Loading}
                focused={state === State.Focused}
              >
                <SearchSmall />
                Button
              </Button>
            </Fragment>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * AsChild: Demonstrates rendering the Button as another element using the `asChild` prop.
 * - Useful for rendering a button as a link or other custom element while retaining button styles and behaviors.
 */
export const AsChild: Story = {
  render: () => (
    <>
      <Button asChild>
        <a href="#">Link</a>
      </Button>
    </>
  ),
}

/**
 * Tooltip: Demonstrates the Button with a tooltip.
 * - Shows how to add a tooltip for additional context or guidance.
 * - Tooltips are accessible and appear on hover or focus.
 */
export const Tooltip: Story = {
  render: () => <Button tooltip={{ content: "Tooltip" }}>Button</Button>,
}
