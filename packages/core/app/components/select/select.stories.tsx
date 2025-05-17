import { FieldTypeAttachment, FieldTypeCheckbox, FieldTypeCount } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Select } from "./select"

const meta: Meta<typeof Select> = {
  title: "Collections/Select",
  component: Select,
  tags: ["upgrade"],
}

export default meta
type Story = StoryObj<typeof Select>

/**
 * The Select component is a customizable dropdown select component that provides a rich set of features
 * for handling selection interactions in a user interface.
 *
 * Key Features:
 * - Flexible option configuration with icons, labels, and values
 * - Support for disabled states (both component and individual options)
 * - Divider support for grouping options
 * - Customizable trigger and list widths
 * - Keyboard navigation and typeahead support
 * - Custom placement options for the dropdown
 *
 * Component Structure:
 * ```tsx
 * <Select value={value} onChange={setValue}>
 *   <Select.Trigger>
 *     <Select.Value>Display Text</Select.Value>
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="option-1">
 *       <Select.Value>Option 1</Select.Value>
 *     </Select.Item>
 *     <Select.Divider />
 *     <Select.Item value="option-2">
 *       <Select.Value>Option 2</Select.Value>
 *     </Select.Item>
 *   </Select.Content>
 * </Select>
 * ```
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {Array.from({ length: 10 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Demonstrates the disabled state of the entire select component.
 * When disabled, the component:
 * - Prevents user interaction
 * - Shows a visual disabled state
 * - Maintains the current selection
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        disabled
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          {Array.from({ length: 10 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Shows how to disable individual options while keeping others interactive.
 * Useful for:
 * - Contextually unavailable options
 * - Permission-based option restrictions
 * - Dependent selections
 */
export const DisabledOptions: Story = {
  render: function DisabledOptionsStory() {
    const [value, setValue] = useState<string>("option-2")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item
            value="option-1"
            disabled
          >
            <Select.Value>Option 1 (Disabled)</Select.Value>
          </Select.Item>
          <Select.Item value="option-2">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Item value="option-3">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Demonstrates the use of dividers to create logical groupings of options.
 * Dividers help:
 * - Organize related options
 * - Improve visual hierarchy
 * - Separate different option categories
 */
export const WithDivider: Story = {
  render: function WithDividerStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">
            <Select.Value>Option 1</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="option-2">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="option-3">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Label>Select an option</Select.Label>
          <Select.Item value="option-1">
            <Select.Value>Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="option-2">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Item value="option-3">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Label>Select an option</Select.Label>
          <Select.Item value="option-4">
            <Select.Value>Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="option-5">
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Item value="option-6">
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Shows how to enhance options with icons for better visual representation.
 * Icons can:
 * - Improve option recognition
 * - Add visual hierarchy
 * - Provide additional context
 */
export const WithIcon: Story = {
  render: function WithIconStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">
            <FieldTypeAttachment />
            <Select.Value>Option 1</Select.Value>
          </Select.Item>
          <Select.Item value="option-2">
            <FieldTypeCheckbox />
            <Select.Value>Option 2</Select.Value>
          </Select.Item>
          <Select.Divider />
          <Select.Item value="option-3">
            <FieldTypeCount />
            <Select.Value>Option 3</Select.Value>
          </Select.Item>
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Shows how the component handles large datasets efficiently.
 * Features:
 * - Virtualized scrolling
 * - Smooth performance with many items
 * - Scroll position management
 */
export const LongItems: Story = {
  render: function LongItemsStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
      >
        <Select.Trigger>
          <Select.Value>{value || "Select"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {Array.from({ length: 100 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Demonstrates the matchTriggerWidth prop for consistent widths.
 * Use when:
 * - List content width matches trigger
 * - Maintaining visual alignment is important
 * - Preventing layout shifts
 */
export const MatchTriggerWidth: Story = {
  render: function MatchTriggerWidthStory() {
    const [value, setValue] = useState<string>("option-1")
    const options = Array.from({ length: 10 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: faker.music.songName(),
    }))
    return (
      <Select
        value={value}
        onChange={setValue}
        matchTriggerWidth
      >
        <Select.Trigger className="w-64">
          <Select.Value>{value || "Select an option"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              <Select.Value>{option.label}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Shows different dropdown placement options.
 * Supports:
 * - Multiple positioning strategies
 * - Automatic repositioning
 * - Custom offset configuration
 */
export const Placement: Story = {
  render: function PlacementStory() {
    const [value, setValue] = useState<string>("option-1")
    return (
      <Select
        value={value}
        onChange={setValue}
        placement="bottom-end"
      >
        <Select.Trigger>
          <Select.Value>{value || "Select an option"}</Select.Value>
        </Select.Trigger>
        <Select.Content>
          {Array.from({ length: 10 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              <Select.Value>Option {i + 1}</Select.Value>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * Demonstrates the compound component pattern for the Select component.
 * This pattern allows for more direct component composition, providing a more intuitive JSX structure.
 *
 * ```tsx
 * <Select value={value} onChange={setValue}>
 *   <Select.Trigger>
 *     <Select.Value>Select an option</Select.Value>
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="option-1">
 *       <Select.Value>Option 1</Select.Value>
 *     </Select.Item>
 *     <Select.Divider />
 *     <Select.Item value="option-2">
 *       <Select.Value>Option 2</Select.Value>
 *     </Select.Item>
 *   </Select.Content>
 * </Select>
 * ```
 */
export const CompoundComponent: Story = {
  render: function CompoundComponentStory() {
    const [value, setValue] = useState<string | null>("option-1")

    return (
      <div className="flex w-64 flex-col gap-8">
        <Select
          value={value}
          onChange={setValue}
        >
          <Select.Trigger>
            <Select.Value>{value ? `Selected: ${value}` : "Select..."}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="option-1">
              <Select.Value>Option 1</Select.Value>
            </Select.Item>
            <Select.Item value="option-2">
              <Select.Value>Option 2</Select.Value>
            </Select.Item>
            <Select.Divider />
            <Select.Item value="option-3">
              <Select.Value>Option 3</Select.Value>
            </Select.Item>
            <Select.Item
              value="option-4"
              disabled
            >
              <Select.Value>Disabled Option</Select.Value>
            </Select.Item>
          </Select.Content>
        </Select>

        <p className="text-sm text-stone-400">Current value: {value || "None"}</p>
      </div>
    )
  },
}

/**
 * Select in marginal conditions
 */
export const MarginalConditions: Story = {
  render: function MarginalConditionsStory() {
    return (
      <div className="flex h-screen flex-col justify-end p-2">
        <Select>
          <Select.Trigger>
            <Select.Value>Select</Select.Value>
          </Select.Trigger>
          <Select.Content>
            {Array.from({ length: 10 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                <Select.Value>Option {i + 1}</Select.Value>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    )
  },
}
