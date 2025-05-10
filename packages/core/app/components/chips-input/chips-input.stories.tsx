import { RemoveSmall } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { ChipsInput, RenderChipProps, type ChipsInputProps } from "."

const meta = {
  title: "Forms/ChipsInput",
  component: ChipsInput,
  tags: ["beta"],
} satisfies Meta<typeof ChipsInput>

export default meta
type Story = StoryObj<typeof meta>

/**
 * `ChipsInput` is a multi-value input component for entering, displaying, and managing a list of chips (tags).
 *
 * Features:
 * - Supports controlled and uncontrolled usage
 * - Allows adding, removing, and selecting chips
 * - Can be disabled or allow duplicate values
 * - Customizable chip rendering via `renderChip` prop
 * - Keyboard navigation and accessibility support
 *
 * Usage:
 * - Use for tag inputs, multi-select fields, or any scenario where users need to enter multiple discrete values
 * - Combine with custom chip rendering for advanced use cases (e.g., icons, avatars, custom actions)
 *
 * Best Practices:
 * - Keep chip content concise and meaningful
 * - Provide clear placeholder text to guide users
 * - Use controlled mode for integration with forms or complex state
 * - Ensure sufficient contrast and accessible focus indicators
 *
 * Accessibility:
 * - Fully accessible to screen readers and keyboard users
 * - Remove buttons and chip actions are keyboard accessible
 * - Custom chip renderers should maintain accessibility for all interactive elements
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <ChipsInput
        placeholder="Add tags..."
        className="w-32"
      />
    )
  },
}

/**
 * Disabled: Demonstrates a disabled ChipsInput.
 * - Input and chip actions are not interactive.
 * - Useful for read-only or unavailable states.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <ChipsInput
        placeholder="Add tags..."
        className="w-32"
        disabled
      />
    )
  },
}

/**
 * Controlled: Demonstrates controlled usage of ChipsInput.
 * - Value and onChange are managed by the parent component.
 * - Useful for form integration and advanced state management.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const ControlledComponent = () => {
      const [tags, setTags] = useState(["Initial", "Controlled"])
      return (
        <div className="flex flex-col gap-2">
          <ChipsInput
            className="w-32"
            value={tags}
            onChange={(newTags: string[]) => {
              setTags(newTags)
            }}
            placeholder="Controlled tags input..."
          />
          <div className="text-secondary-foreground">Current Tags: {JSON.stringify(tags)}</div>
        </div>
      )
    }
    return <ControlledComponent />
  },
}

/**
 * Empty: Shows ChipsInput with no initial chips.
 * - Useful for scenarios where the user starts with an empty list.
 */
export const Empty: Story = {
  render: function EmptyStory() {
    return (
      <ChipsInput
        placeholder="Add tags..."
        className="w-32"
      />
    )
  },
}

/**
 * AllowDuplicates: Demonstrates ChipsInput with duplicate values allowed.
 * - Useful for cases where repeated tags are meaningful.
 */
export const AllowDuplicates: Story = {
  render: function AllowDuplicatesStory() {
    return (
      <ChipsInput
        placeholder="Add tags (duplicates allowed)..."
        allowDuplicates
      />
    )
  },
}

// Example custom render function
const customRenderChip = ({
  chip,
  index,
  isSelected,
  disabled,
  handleChipClick,
  handleChipRemoveClick,
}: RenderChipProps) => {
  return (
    <div
      style={{
        padding: "2px 8px",
        margin: "2px",
        border: isSelected ? "2px solid #007bff" : "1px solid #ced4da",
        borderRadius: "12px",
        display: "inline-flex",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: isSelected ? "#cfe2ff" : "#f8f9fa",
        fontSize: "0.875rem",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={disabled ? undefined : () => handleChipClick(index)}
    >
      <span style={{ marginRight: "4px" }}>
        {isSelected ? "🌟" : "🏷️"} {chip}
      </span>
      {!disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation() // Important!
            handleChipRemoveClick(index)
          }}
          style={{
            marginLeft: "4px",
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
          aria-label={`Remove ${chip}`}
          disabled={disabled}
        >
          <RemoveSmall />
        </button>
      )}
    </div>
  )
}

/**
 * CustomRenderChip: Demonstrates custom chip rendering using the renderChip prop.
 * - Chips can display custom icons, styles, and remove buttons.
 * - Useful for advanced UI requirements or branding.
 */
export const CustomRenderChip: Story = {
  render: function CustomRenderChipStory() {
    return (
      <ChipsInput
        placeholder="Add custom chips..."
        renderChip={customRenderChip}
      />
    )
  },
}
