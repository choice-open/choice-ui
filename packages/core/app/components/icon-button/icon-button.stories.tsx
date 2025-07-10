import type { Meta, StoryObj } from "@storybook/react-vite"
import { IconButton } from "./icon-button"
import { IconButtonGroup } from "./icon-button-group"
import { Fragment, useState } from "react"
import { Select } from "../select"
import {
  FieldTypeAttachment,
  FieldTypeButton,
  FieldTypeCheckbox,
  FieldTypeCount,
  FieldTypeDate,
  FieldTypeRating,
} from "@choiceform/icons-react"
import React from "react"
import { tcx } from "../../utils"

const meta: Meta<typeof IconButton> = {
  title: "Buttons/IconButton",
  component: IconButton,
}

export default meta

type Story = StoryObj<typeof IconButton>

/**
 * `IconButton` is a button component specifically designed for displaying icons with proper
 * accessibility and interaction states.
 *
 * Features:
 * - Multiple visual variants for different contexts
 * - Support for all button states (active, focused, loading, disabled)
 * - Size options for different UI densities
 * - Built-in tooltip support
 * - Can be rendered as other elements via `asChild`
 * - Group capability via IconButtonGroup for related actions
 *
 * Usage Guidelines:
 * - Use for actions where an icon clearly communicates the purpose
 * - Provide tooltip text for clarity (especially for less common icons)
 * - Group related actions using IconButtonGroup
 * - Choose variants that fit your visual hierarchy
 *
 * Accessibility:
 * - Maintains focus states for keyboard navigation
 * - Supports ARIA attributes for screen readers
 * - Tooltip provides additional context for icon meaning
 */

/**
 * Basic: Demonstrates the default IconButton component with an icon.
 *
 * This minimal example shows how to create a simple icon button with the default styling.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <IconButton>
        <FieldTypeButton />
      </IconButton>
    )
  },
}

/**
 * Variants: Demonstrates all visual variants, sizes, and states of the IconButton component.
 *
 * Features:
 * - Interactive controls to switch between variants and sizes
 * - Displays all possible states (rest, active, focused, loading, disabled)
 * - Shows consistent styling across all combinations
 *
 * Variants:
 * - `default`: Standard styling with hover and active states
 * - `secondary`: Subdued styling for less prominent actions
 * - `solid`: Filled background for primary or important actions
 * - `highlight`: Visually distinctive for drawing attention
 *
 * Sizes:
 * - `default`: Standard size for most interfaces
 * - `large`: Larger size for touch targets or emphasis
 */
export const Variants: Story = {
  render: function Variants() {
    enum Variant {
      Dark = "dark",
      Default = "default",
      Ghost = "ghost",
      Highlight = "highlight",
      Secondary = "secondary",
      Solid = "solid",
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

    const [variant, setVariant] = useState<Variant>(Variant.Default)
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

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          {Object.values(State).map((state) => (
            <Fragment key={state}>
              <span className="text-pink-500 capitalize">{state}</span>
              <IconButton
                variant={variant}
                size={size}
                active={state === State.Active}
                disabled={state === State.Disabled}
                loading={state === State.Loading}
                focused={state === State.Focused}
              >
                <FieldTypeRating />
              </IconButton>
            </Fragment>
          ))}
        </div>
      </div>
    )
  },
}

/**
 * Tooltip: Demonstrates adding descriptive tooltips to IconButtons.
 *
 * Features:
 * - Helpful text appears on hover/focus
 * - Improves accessibility and usability
 * - Clarifies the button's purpose when icons alone may be ambiguous
 *
 * Best Practices:
 * - Use concise, clear tooltip text
 * - Describe the action, not the icon
 * - Consider tooltip placement based on button position
 */
export const Tooltip: Story = {
  render: () => (
    <IconButton tooltip={{ content: "Tooltip" }}>
      <FieldTypeDate />
    </IconButton>
  ),
}

/**
 * Group: Demonstrates grouping related IconButtons together.
 *
 * Features:
 * - Visual grouping of related actions
 * - Consistent styling across grouped buttons
 * - Proper spacing and borders between buttons
 * - Ability to set a common variant for all buttons in the group
 *
 * Best Practices:
 * - Group functionally related actions
 * - Maintain a logical order (e.g., create, edit, delete)
 * - Use consistent icons within a UI
 * - Consider adding tooltips to each button in the group
 */
export const Group: Story = {
  render: () => (
    <IconButtonGroup variant="solid">
      <IconButton>
        <FieldTypeButton />
      </IconButton>
      <IconButton>
        <FieldTypeCount />
      </IconButton>
      <IconButton>
        <FieldTypeCheckbox />
      </IconButton>
    </IconButtonGroup>
  ),
}

/**
 * AsChild: Demonstrates rendering the IconButton as another element.
 *
 * Features:
 * - Maintains IconButton styling while using different underlying elements
 * - Useful for links, form elements, or custom components
 * - Preserves accessibility features
 *
 * Usage:
 * ```tsx
 * <IconButton asChild>
 *   <a href="/some-path">
 *     <Icon />
 *   </a>
 * </IconButton>
 * ```
 */
export const AsChild: Story = {
  render: () => (
    <IconButton asChild>
      <a href="#">
        <FieldTypeAttachment />
      </a>
    </IconButton>
  ),
}
