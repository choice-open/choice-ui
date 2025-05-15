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
 *   <Select.Trigger>Display Text</Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="option-1">Option 1</Select.Item>
 *     <Select.Divider />
 *     <Select.Item value="option-2">Option 2</Select.Item>
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          {Array.from({ length: 10 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              Option {i + 1}
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
              Option {i + 1}
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          <Select.Item
            value="option-1"
            disabled
          >
            Option 1 (Disabled)
          </Select.Item>
          <Select.Item value="option-2">Option 2</Select.Item>
          <Select.Item value="option-3">Option 3</Select.Item>
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">Option 1</Select.Item>
          <Select.Divider />
          <Select.Item value="option-2">Option 2</Select.Item>
          <Select.Divider />
          <Select.Item value="option-3">Option 3</Select.Item>
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          <Select.Label>Select an option</Select.Label>
          <Select.Item value="option-1">Option 1</Select.Item>
          <Select.Item value="option-2">Option 2</Select.Item>
          <Select.Item value="option-3">Option 3</Select.Item>
          <Select.Divider />
          <Select.Label>Select an option</Select.Label>
          <Select.Item value="option-4">Option 1</Select.Item>
          <Select.Item value="option-5">Option 2</Select.Item>
          <Select.Item value="option-6">Option 3</Select.Item>
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">
            <FieldTypeAttachment />
            Option 1
          </Select.Item>
          <Select.Item value="option-2">
            <FieldTypeCheckbox />
            Option 2
          </Select.Item>
          <Select.Divider />
          <Select.Item value="option-3">
            <FieldTypeCount />
            Option 3
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
        <Select.Trigger>{value || "Select"}</Select.Trigger>
        <Select.Content>
          {Array.from({ length: 100 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              Option {i + 1}
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
        <Select.Trigger className="w-64">{value || "Select an option"}</Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
            >
              <span className="truncate">{option.label}</span>
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
        <Select.Trigger>{value || "Select an option"}</Select.Trigger>
        <Select.Content>
          {Array.from({ length: 10 }, (_, i) => (
            <Select.Item
              key={i}
              value={`option-${i + 1}`}
            >
              Option {i + 1}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  },
}

/**
 * 演示 Select 组件的组合模式。
 * 该模式允许更直接地组合组件，提供更直观的JSX结构。
 *
 * ### 核心特性
 * - 符合 React 组件设计模式
 * - 直观的组件结构
 * - 易于扩展和定制
 *
 * ```tsx
 * <Select value={value} onChange={setValue}>
 *   <Select.Trigger>选择一个选项</Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="option-1">选项 1</Select.Item>
 *     <Select.Divider />
 *     <Select.Item value="option-2">选项 2</Select.Item>
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
          <Select.Trigger>{value ? `选中: ${value}` : "请选择"}</Select.Trigger>
          <Select.Content>
            <Select.Item value="option-1">选项 1</Select.Item>
            <Select.Item value="option-2">选项 2</Select.Item>
            <Select.Divider />
            <Select.Item value="option-3">选项 3</Select.Item>
            <Select.Item
              value="option-4"
              disabled
            >
              禁用选项
            </Select.Item>
          </Select.Content>
        </Select>

        <p className="text-sm text-stone-400">当前值: {value || "无"}</p>
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
          <Select.Trigger>Select</Select.Trigger>
          <Select.Content>
            {Array.from({ length: 10 }, (_, i) => (
              <Select.Item
                key={i}
                value={`option-${i + 1}`}
              >
                Option {i + 1}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    )
  },
}
