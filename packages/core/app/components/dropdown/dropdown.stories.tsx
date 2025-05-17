import { FieldTypeAttachment, Search } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useMemo, useState } from "react"
import { IconButton } from "../icon-button"
import { KbdKey } from "../kbd"
import { Dropdown } from "./dropdown"

const meta: Meta<typeof Dropdown> = {
  title: "Collections/Dropdown",
  component: Dropdown,
  tags: ["upgrade"],
}

export default meta
import { Button } from "../button"

type Story = StoryObj<typeof Dropdown>

/**
 * The `Dropdown` component is a versatile menu component that displays a list of options when triggered.
 *
 * Features:
 * - Flexible trigger element (button, icon, or custom component)
 * - Support for nested submenus
 * - Optional selection indicator
 * - Keyboard navigation support
 * - Customizable placement
 * - Supports dividers and section labels
 * - Searchable dropdown option
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger>Click me</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *     <Dropdown.Item>Option 2</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Interaction</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Attachment</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Checkbox</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Count</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Date</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Filter</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Rating</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithPrefix: Demonstrates adding an icon or element before the trigger text.
 *
 * Features:
 * - Visual element preceding the trigger text
 * - Enhances recognition and provides context
 * - Aligns with design patterns for dropdown options
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger prefixElement={<Icon />}>
 *     With Prefix
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const WithPrefix: Story = {
  render: function WithPrefixStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger prefixElement={<FieldTypeAttachment />}>
          <Dropdown.Value>With Prefix</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Attachment</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Checkbox</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithSuffix: Demonstrates adding an icon or element after the trigger text.
 *
 * Features:
 * - Visual element following the trigger text
 * - Useful for status indicators or additional controls
 * - Maintains consistent spacing and alignment
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger suffixElement={<Icon />}>
 *     With Suffix
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const WithSuffix: Story = {
  render: function WithSuffixStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger suffixElement={<FieldTypeAttachment />}>
          <Dropdown.Value>With Suffix</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Attachment</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Checkbox</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * LongerValue: Demonstrates handling longer text in the trigger with truncation.
 *
 * Features:
 * - Text truncation with ellipsis
 * - Fixed width constraint
 * - Maintains clean UI with overflowing text
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger className="w-48">
 *     <span className="flex-1 truncate">Very long value that would overflow</span>
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const LongerValue: Story = {
  render: function LongerValueStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger className="w-48">
          <Dropdown.Value>Longer Value</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Attachment</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Checkbox</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * TriggerAsChild: Demonstrates using a custom component as the trigger.
 *
 * Features:
 * - Composable trigger with any component
 * - Maintains dropdown behavior with custom UI
 * - Perfect for integrating with existing UI components
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger asChild>
 *     <Button>Custom Button</Button>
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const TriggerAsChild: Story = {
  render: function TriggerAsChildStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <IconButton variant="default">
            <FieldTypeAttachment />
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Attachment</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Checkbox</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Count</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Date</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Filter</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Rating</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * MatchTriggerWidth: Demonstrates making the dropdown content match the trigger width.
 *
 * Features:
 * - Content width synced with trigger width
 * - Ensures visual alignment and consistency
 * - Useful for form-like dropdown selectors
 *
 * Usage:
 * ```tsx
 * <Dropdown matchTriggerWidth={true}>
 *   <Dropdown.Trigger className="w-64">
 *     <span>Match Trigger Width</span>
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const MatchTriggerWidth: Story = {
  render: function MatchTriggerWidthStory() {
    return (
      <Dropdown matchTriggerWidth={true}>
        <Dropdown.Trigger className="w-64">
          <Dropdown.Value>Match Trigger Width</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Option 1</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Option 2</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Demonstrates nested dropdown menus functionality.
 *
 * Features:
 * - Support for multiple levels of nesting
 * - Automatic submenu positioning
 * - Hover-based submenu activation
 * - Keyboard navigation across nested levels
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Parent">
 *   <Dropdown.Trigger>Parent</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *     <Dropdown label="Submenu">
 *       <Dropdown.SubTrigger>Submenu</Dropdown.SubTrigger>
 *       <Dropdown.Content>
 *         <Dropdown.Item>Submenu Item 1</Dropdown.Item>
 *         <Dropdown.Item>Submenu Item 2</Dropdown.Item>
 *       </Dropdown.Content>
 *     </Dropdown>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Nested: Story = {
  render: function NestedStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <span>Nested</span>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 4 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Submenu</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              {Array.from({ length: 5 }).map((_, i) => (
                <Dropdown.Item key={i}>
                  <Dropdown.Value>Submenu Item {i + 1}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Submenu</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              {Array.from({ length: 5 }).map((_, i) => (
                <Dropdown.Item key={i}>
                  <Dropdown.Value>Submenu Item {i + 1}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows how to use dividers to group dropdown items.
 *
 * Features:
 * - Visual separation of related items
 * - Improved menu organization
 * - Maintains keyboard navigation
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Menu">
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Group 1 Item</Dropdown.Item>
 *     <DropdownDivider />
 *     <Dropdown.Item>Group 2 Item</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Divider: Story = {
  render: function DividerStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Divider</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 4 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          {Array.from({ length: 4 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          {Array.from({ length: 2 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Demonstrates selection functionality with visual indicators.
 *
 * Features:
 * - Visual selection indicator
 * - Support for single selection
 * - Controlled selection state
 * - Maintains selection state between opens
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Select" selection={true}>
 *   <Dropdown.Trigger>Select</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item selected={value === 1}>Option 1</Dropdown.Item>
 *     <Dropdown.Item selected={value === 2}>Option 2</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const SelectionIcon: Story = {
  render: function SelectionIconStory() {
    const [selected, setSelected] = useState<string | null>(null)
    const items = Array.from({ length: 6 }, (_, i) => `Option ${i + 1}`)
    return (
      <Dropdown selection={true}>
        <Dropdown.Trigger>
          <Dropdown.Value>Selection Icon</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {items.map((item) => (
            <Dropdown.Item
              key={item}
              onMouseUp={() => setSelected(item)}
              selected={selected === item}
            >
              <Dropdown.Value>{item}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows how to use nested dropdowns with selection functionality.
 *
 * Features:
 * - Support for nested dropdowns
 * - Automatic submenu positioning
 * - Selection state within nested menus
 * - Keyboard navigation across nested levels
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger>Parent</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *     <Dropdown.Item>Option 2</Dropdown.Item>
 *     <Dropdown selection={true}>
 *       <Dropdown.SubTrigger>Submenu</Dropdown.SubTrigger>
 *       <Dropdown.Content>
 *         <Dropdown.Item>Submenu Item 1</Dropdown.Item>
 *         <Dropdown.Item>Submenu Item 2</Dropdown.Item>
 *       </Dropdown.Content>
 *     </Dropdown>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const NestedSelectionIcon: Story = {
  render: function NestedSelectionIconStory() {
    const [selected, setSelected] = useState<string | null>(null)
    const items = Array.from({ length: 6 }, (_, i) => `Option ${i + 1}`)
    const subItems = Array.from({ length: 5 }, (_, i) => `Submenu Item ${i + 1}`)
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Selection Icon</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {items.map((item) => (
            <Dropdown.Item key={item}>{item}</Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown selection={true}>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Submenu</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              {subItems.map((item) => (
                <Dropdown.Item
                  key={item}
                  onMouseUp={() => setSelected(item)}
                  selected={selected === item}
                >
                  <Dropdown.Value>{item}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

const MODIFIERS = [
  "command",
  "shift",
  "ctrl",
  "option",
  "enter",
  "delete",
  "escape",
  "tab",
  "capslock",
  "up",
  "right",
  "down",
  "left",
  "pageup",
  "pagedown",
  "home",
  "end",
  "help",
  "space",
]

const KEYS = [
  "Enter",
  "Space",
  "Tab",
  "Escape",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
]

/**
 * Shows how to add keyboard shortcuts to dropdown items.
 *
 * Features:
 * - Display keyboard shortcuts
 * - Support for modifier keys
 * - Platform-specific shortcut display
 * - Visual alignment of shortcuts
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Menu">
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item
 *       shortcut={{
 *         modifier: "command",
 *         keys: "S"
 *       }}
 *     >
 *       Save
 *     </Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Shortcut: Story = {
  render: function ShortcutStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Shortcut</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 10 }).map((_, i) => (
            <Dropdown.Item
              key={i}
              shortcut={{
                modifier: faker.helpers.arrayElement(MODIFIERS) as KbdKey,
                keys: faker.helpers.arrayElement(KEYS),
              }}
            >
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows how to handle disabled items in the dropdown.
 *
 * Features:
 * - Visual disabled state
 * - Prevents interaction with disabled items
 * - Maintains keyboard navigation
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Menu">
 *   <Dropdown.Trigger disabled>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Unavailable Option</Dropdown.Item>
 *     <Dropdown.Item>Available Option</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger disabled>
          <Dropdown.Value>Disabled</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Disabled</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Enabled</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows how to handle disabled options in the dropdown.
 *
 * Features:
 * - Visual disabled state
 * - Prevents interaction with disabled options
 * - Maintains keyboard navigation
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item disabled>Disabled</Dropdown.Item>
 *     <Dropdown.Item>Enabled</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const DisabledOption: Story = {
  render: function DisabledOptionStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Disabled</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled>
            <Dropdown.Value>Disabled</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Enabled</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Demonstrates handling of long lists with scrolling.
 *
 * Features:
 * - Automatic scrolling behavior
 * - Maintains keyboard navigation
 * - Smooth scroll animations
 * - Virtualized rendering for performance
 *
 * Usage:
 * ```tsx
 * <Dropdown trigger="Menu">
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     {items.map(item => (
 *       <Dropdown.Item key={item.id}>{item.label}</Dropdown.Item>
 *     ))}
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const LongList: Story = {
  render: function LongListStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Long List</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 100 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows different placement options for the dropdown menu.
 *
 * Features:
 * - Multiple placement options
 * - Automatic repositioning
 * - Handles viewport constraints
 * - Smooth transitions
 *
 * Usage:
 * ```tsx
 * <Dropdown
 *   placement="bottom-end"
 * >
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Option</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Placement: Story = {
  render: function PlacementStory() {
    return (
      <Dropdown placement="bottom-end">
        <Dropdown.Trigger>
          <Dropdown.Value>Placement</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 10 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Label: Demonstrates using section labels to organize dropdown items.
 *
 * Features:
 * - Visual grouping of related items
 * - Semantic structure for complex dropdowns
 * - Improves usability for longer lists
 * - Combines with dividers for clear separation
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Label>Group 1</Dropdown.Label>
 *     <Dropdown.Item>Option 1</Dropdown.Item>
 *     <Dropdown.Divider />
 *     <Dropdown.Label>Group 2</Dropdown.Label>
 *     <Dropdown.Item>Option 2</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Label: Story = {
  render: function LabelStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Label</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Label 1</Dropdown.Label>
          {Array.from({ length: 10 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Label>Label 2</Dropdown.Label>
          {Array.from({ length: 10 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * LabelWithSelection: Demonstrates combining section labels with selection functionality.
 *
 * Features:
 * - Organized content with semantic sections
 * - Selection indicators within grouped items
 * - Maintains visual consistency with selection states
 * - Proper interaction within labeled groups
 *
 * Usage:
 * ```tsx
 * <Dropdown selection={true}>
 *   <Dropdown.Trigger>Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Label>Category 1</Dropdown.Label>
 *     <Dropdown.Item selected={value === "item1"}>Item 1</Dropdown.Item>
 *     <Dropdown.Divider />
 *     <Dropdown.Label>Category 2</Dropdown.Label>
 *     <Dropdown.Item selected={value === "item2"}>Item 2</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const LabelWithSelection: Story = {
  render: function LabelWithSelectionStory() {
    const [selected, setSelected] = useState<string | null>(null)
    return (
      <Dropdown selection={true}>
        <Dropdown.Trigger>
          <Dropdown.Value>Label with Selection</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Category Group</Dropdown.Label>
          {Array.from({ length: 3 }).map((_, i) => (
            <Dropdown.Item
              key={i}
              selected={selected === `Option ${i + 1}`}
              onMouseUp={() => setSelected(`Option ${i + 1}`)}
            >
              <Dropdown.Value>Option {i + 1}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Label>Another Group</Dropdown.Label>
          {Array.from({ length: 3 }).map((_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>Option {i + 4}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Shows how to use the compound component pattern with Dropdown.Trigger instead of the trigger prop.
 *
 * Features:
 * - More declarative API
 * - Better composability
 * - Consistent with other component libraries
 * - Full control over the trigger element
 *
 * Usage:
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Item>Item 1</Dropdown.Item>
 *     <Dropdown.Item>Item 2</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const WithTriggerComponent: Story = {
  render: function WithTriggerComponentStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <IconButton>
            <FieldTypeAttachment />
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Array.from({ length: 4 }).map((_, i) => (
            <Dropdown.Item key={i}>Option {i + 1}</Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown>
            <Dropdown.SubTrigger>Nested Menu</Dropdown.SubTrigger>
            <Dropdown.Content>
              {Array.from({ length: 3 }).map((_, i) => (
                <Dropdown.Item key={i}>Nested Item {i + 1}</Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * SearchAndButton: Demonstrates advanced functionality with search, multi-selection, and actions.
 *
 * Features:
 * - Integrated search functionality with filtering
 * - Multi-select with persistent state
 * - Nested submenus within searchable content
 * - Action buttons for bulk operations
 * - Empty state handling with clear option
 *
 * Usage:
 * ```tsx
 * <Dropdown selection={true}>
 *   <Dropdown.Trigger>Search</Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <Dropdown.Search value={search} onChange={setSearch} />
 *     <Dropdown.Divider />
 *     {filteredItems.map(item => (
 *       <Dropdown.Item key={item.id} selected={selected.includes(item.id)}>
 *         {item.label}
 *       </Dropdown.Item>
 *     ))}
 *     <Dropdown.Button onClick={handleClearAll}>Clear All</Dropdown.Button>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const SearchAndButton: Story = {
  render: function SearchAndButtonStory() {
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState<number[]>([])
    const [subMenuIndex, setSubMenuIndex] = useState<number | null>(null)

    const Options = useMemo(
      () =>
        Array.from({ length: 4 }, (_, i) => ({
          label: `${faker.music.genre()} ${i + 1}`,
          id: i,
        })),
      [],
    )

    const filteredOptions = useMemo(
      () => Options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
      [Options, search],
    )

    return (
      <Dropdown selection={true}>
        <Dropdown.Trigger>
          <span>Search</span>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Search
            value={search}
            onChange={(value) => setSearch(value)}
          />
          <Dropdown.Divider />

          {filteredOptions.length > 0 ? (
            <>
              <Dropdown.Label>Label</Dropdown.Label>
              {filteredOptions.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selectedIndex.includes(option.id)}
                  onMouseUp={() =>
                    setSelectedIndex((prev) =>
                      prev.includes(option.id)
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id],
                    )
                  }
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Label>Label</Dropdown.Label>
              <Dropdown selection={true}>
                <Dropdown.SubTrigger>
                  <Dropdown.Value>Selection</Dropdown.Value>
                </Dropdown.SubTrigger>
                <Dropdown.Content>
                  {filteredOptions.map((option) => (
                    <Dropdown.Item
                      key={option.id}
                      selected={subMenuIndex === option.id}
                      onMouseUp={() => setSubMenuIndex(option.id)}
                    >
                      <Dropdown.Value>{option.label}</Dropdown.Value>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/40">
              <Search
                width={24}
                height={24}
              />
              <span>No results found</span>
              <Button
                variant="link"
                onClick={() => setSearch("")}
              >
                Clear
              </Button>
            </div>
          )}
          {filteredOptions.length === Options.length && (
            <>
              <Dropdown.Divider />
              <Dropdown.Button onClick={() => setSelectedIndex([])}>
                <span>Clear All</span>
              </Dropdown.Button>
            </>
          )}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}
