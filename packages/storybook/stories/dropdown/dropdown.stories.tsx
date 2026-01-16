import { Button, Checkbox, Dropdown, IconButton, Popover } from "@choice-ui/react"
import { Add, Check, File, Search, Settings } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createEditor, Descendant, Node, Transforms } from "slate"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"

const meta: Meta<typeof Dropdown> = {
  title: "Collections/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Dropdown>

/**
 * Basic: The simplest usage of Dropdown.
 *
 * Features:
 * - Click-triggered dropdown menu
 * - Standard menu items
 * - Keyboard navigation support
 * - Automatic dismissal on click outside
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Basic Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Edit</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Copy</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Paste</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item variant="danger">
            <Dropdown.Value>Delete</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithLinks: Demonstrates Dropdown items with link functionality.
 *
 * Features:
 * - Items can be configured as links using `asLink` prop
 * - Link icon automatically appears on the right when `asLink` is true
 * - Visual distinction between link items and regular items
 * - Works in both main menu and nested submenus
 * - Actual navigation should be handled via onClick handler
 *
 * Use cases:
 * - Navigation menus
 * - External resource links
 * - Documentation links
 * - Help menus with links
 */
export const WithLinks: Story = {
  render: function WithLinksStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Links Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Navigation</Dropdown.Label>
          <Dropdown.Item
            asLink
            onClick={() => {
              // Handle navigation
              console.log("Navigate to /dashboard")
            }}
          >
            <Dropdown.Value>Dashboard</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            onClick={() => {
              console.log("Navigate to /settings")
            }}
          >
            <Dropdown.Value>Settings</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            onClick={() => {
              console.log("Navigate to /profile")
            }}
          >
            <Dropdown.Value>Profile</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Label>External Resources</Dropdown.Label>
          <Dropdown.Item
            asLink
            onClick={() => {
              window.open("https://github.com", "_blank")
            }}
          >
            <Dropdown.Value>GitHub</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            onClick={() => {
              window.open("https://docs.example.com", "_blank")
            }}
          >
            <Dropdown.Value>Documentation</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            onClick={() => {
              window.open("https://support.example.com", "_blank")
            }}
          >
            <Dropdown.Value>Support</Dropdown.Value>
          </Dropdown.Item>
          {/* Submenu with links for comparison */}
          <Dropdown>
            <Dropdown.SubTrigger>
              <Dropdown.Value>More Options</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Label>Submenu Comparison</Dropdown.Label>
              <Dropdown.Item
                asLink
                onClick={() => {
                  console.log("Navigate to /submenu-link-1")
                }}
              >
                <Dropdown.Value>Submenu Link 1</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item
                asLink
                onClick={() => {
                  console.log("Navigate to /submenu-link-2")
                }}
              >
                <Dropdown.Value>Submenu Link 2</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Submenu Regular Item (no link)</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                asLink
                onClick={() => {
                  window.open("https://external.com", "_blank")
                }}
              >
                <Dropdown.Value>External Link in Submenu</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>

          <Dropdown.Divider />

          <Dropdown.Item>
            <Dropdown.Value>Regular Action (no link)</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithLinksAndIcons: Demonstrates Dropdown items with links combined with icons and shortcuts.
 *
 * Features:
 * - Links can be combined with prefix icons
 * - Links work with keyboard shortcuts display
 * - Mixed menu items (links and regular actions)
 * - Visual distinction between link and non-link items
 *
 * Use cases:
 * - Application menus with navigation
 * - Help menus with external resources
 * - Settings menus with documentation links
 */
export const WithLinksAndIcons: Story = {
  render: function WithLinksAndIconsStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger prefixElement={<Settings />}>
          <Dropdown.Value>Resources</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Quick Links</Dropdown.Label>
          <Dropdown.Item
            asLink
            prefixElement={<File />}
            onClick={() => {
              window.open("https://github.com", "_blank")
            }}
          >
            <Dropdown.Value>View Source Code</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            prefixElement={<Search />}
            onClick={() => {
              window.open("https://docs.example.com", "_blank")
            }}
          >
            <Dropdown.Value>Documentation</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Label>Actions</Dropdown.Label>
          <Dropdown.Item
            shortcut={{
              modifier: "command",
              keys: "S",
            }}
          >
            <Dropdown.Value>Save</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            asLink
            shortcut={{
              modifier: "command",
              keys: "E",
            }}
            onClick={() => {
              console.log("Export")
            }}
          >
            <Dropdown.Value>Export</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item
            asLink
            variant="highlight"
            onClick={() => {
              window.open("https://support.example.com", "_blank")
            }}
          >
            <Dropdown.Value>Get Help</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Disabled: Demonstrates disabled Dropdown functionality.
 *
 * Features:
 * - Disabled trigger prevents menu opening
 * - Disabled items prevent interaction
 * - Visual feedback for disabled states
 * - Useful for conditional menu availability
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="flex gap-4">
        <Dropdown>
          <Dropdown.Trigger disabled>
            <Dropdown.Value>Disabled Trigger</Dropdown.Value>
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

        <Dropdown>
          <Dropdown.Trigger>
            <Dropdown.Value>Disabled Items</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Available Option</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item disabled>
              <Dropdown.Value>Disabled Option</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Another Available</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>
    )
  },
}

/**
 * LargeSize: Demonstrates Dropdown with large size variant.
 *
 * Features:
 * - Large trigger size
 * - Large menu items
 * - Consistent sizing across components
 */
export const LargeSize: Story = {
  render: function LargeSizeStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger size="large">
          <Dropdown.Value>Large</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item size="large">Option 1</Dropdown.Item>
          <Dropdown.Item size="large">Option 2</Dropdown.Item>
          <Dropdown.Item size="large">Option 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * LightVariant: Demonstrates Dropdown with light variant styling.
 *
 * Features:
 * - Light variant visual style
 * - Standard menu items
 * - Divider separation
 * - Danger variant item support
 */
export const LightVariant: Story = {
  render: function LightVariantStory() {
    return (
      <Dropdown variant="light">
        <Dropdown.Trigger>
          <Dropdown.Value>Click to open menu (light mode)</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Copy</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Cut</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item variant="danger">
            <Dropdown.Value>Delete</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithPrefix: Demonstrates Dropdown with prefix icons.
 *
 * Features:
 * - Prefix icons on trigger
 * - Prefix icons on menu items
 * - Better visual recognition
 * - Enhanced user experience
 */
export const WithPrefix: Story = {
  render: function WithPrefixStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger prefixElement={<File />}>
          <Dropdown.Value>File Actions</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item prefixElement={<File />}>
            <Dropdown.Value>Attach File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item prefixElement={<Search />}>
            <Dropdown.Value>Search Files</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item prefixElement={<Settings />}>
            <Dropdown.Value>File Settings</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithShortcuts: Demonstrates Dropdown with keyboard shortcuts.
 *
 * Features:
 * - Keyboard shortcuts displayed on menu items
 * - Supports modifier keys (Command, Shift, etc.)
 * - Visual shortcut indicators
 * - Common editor shortcuts pattern
 */
export const WithShortcuts: Story = {
  render: function WithShortcutsStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Editor Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item
            shortcut={{
              modifier: "command",
              keys: "N",
            }}
          >
            <Dropdown.Value>New File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            shortcut={{
              modifier: "command",
              keys: "O",
            }}
          >
            <Dropdown.Value>Open File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            shortcut={{
              modifier: "command",
              keys: "S",
            }}
          >
            <Dropdown.Value>Save</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            shortcut={{
              modifier: "command",
              keys: "Z",
            }}
          >
            <Dropdown.Value>Undo</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item
            shortcut={{
              modifier: ["shift", "command"],
              keys: "Z",
            }}
          >
            <Dropdown.Value>Redo</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * WithLabelsAndDividers: Demonstrates Dropdown with labels and dividers for organization.
 *
 * Features:
 * - Section labels for grouping
 * - Visual dividers for separation
 * - Better menu organization
 * - Hierarchical menu structure
 *
 * Use cases:
 * - File manager menus
 * - Complex application menus
 * - Settings and configuration menus
 */
export const WithLabelsAndDividers: Story = {
  render: function WithLabelsAndDividersStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Application Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>File Operations</Dropdown.Label>
          <Dropdown.Item>
            <Dropdown.Value>New Document</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Open File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Save</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Label>Edit Operations</Dropdown.Label>
          <Dropdown.Item>
            <Dropdown.Value>Cut</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Copy</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Paste</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Label>Tools</Dropdown.Label>
          <Dropdown.Item>
            <Dropdown.Value>Settings</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * LongList: Demonstrates Dropdown with a long list of items and scrolling behavior.
 *
 * Features:
 * - Long list of items (100 items)
 * - Automatic scrolling when content exceeds height
 * - Scroll arrows for navigation
 * - Performance optimization for large lists
 *
 * Use cases:
 * - Country/region selectors
 * - Long option lists
 * - Searchable dropdowns with many results
 */
export const LongList: Story = {
  render: function LongListStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Long List (100 items)</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Countries</Dropdown.Label>
          {Array.from({ length: 100 }, (_, i) => (
            <Dropdown.Item key={i}>
              <Dropdown.Value>
                {faker.location.country()} {i + 1}
              </Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Placement: Demonstrates Dropdown with different placement options.
 *
 * Features:
 * - Multiple placement options (bottom-start, bottom-end, right-start, etc.)
 * - Automatic positioning adjustments
 * - Prevents overflow beyond viewport
 * - Flexible menu positioning
 */
export const Placement: Story = {
  render: function PlacementStory() {
    return (
      <div className="flex flex-wrap gap-4">
        <Dropdown placement="bottom-start">
          <Dropdown.Trigger>
            <Dropdown.Value>Bottom Start</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Item>Option 3</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>

        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <Dropdown.Value>Bottom End</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Item>Option 3</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>

        <Dropdown placement="right-start">
          <Dropdown.Trigger>
            <Dropdown.Value>Right Start</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Item>Option 3</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>
    )
  },
}

/**
 * MatchTriggerWidth: Demonstrates Dropdown menu matching trigger width.
 *
 * Features:
 * - Menu width matches trigger width
 * - Consistent visual alignment
 * - Useful for narrow triggers
 * - Better visual consistency
 */
export const MatchTriggerWidth: Story = {
  render: function MatchTriggerWidthStory() {
    return (
      <Dropdown matchTriggerWidth>
        <Dropdown.Trigger className="w-64">
          <Dropdown.Value>Match Trigger Width</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Option 1</Dropdown.Item>
          <Dropdown.Item>Option 2</Dropdown.Item>
          <Dropdown.Item>Option 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * [TEST] Readonly: Demonstrates Dropdown in readOnly state.
 *
 * Features:
 * - The menu can be opened and closed normally
 * - Clicking on menu items will not execute their onClick handlers
 * - Visual feedback remains intact
 * - Useful for displaying menu options without allowing actions
 *
 * Use cases:
 * - Preview mode interfaces
 * - Read-only user permissions
 * - Display-only menu scenarios
 */
export const Readonly: Story = {
  render: function ReadonlyStory() {
    const [clickCount, setClickCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
      setClickCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Click Count:</div>
          <div className="text-body-small font-mono text-stone-600">{clickCount}</div>
        </div>

        <Dropdown
          readOnly
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <Dropdown.Trigger>
            <Dropdown.Value>Click to open menu (readOnly mode)</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={handleClick}>
              <Dropdown.Value>New File</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleClick}>
              <Dropdown.Value>Open File</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleClick}>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleClick}>
              <Dropdown.Value>Exit</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>

        <div className="text-body-small text-stone-600">
          💡 Try clicking on menu items - the click count should not change. The menu can still be
          opened and closed normally.
        </div>
      </div>
    )
  },
}

/**
 * TriggerAsChild: Demonstrates custom trigger using asChild pattern.
 *
 * Features:
 * - Use any element as trigger via asChild prop
 * - Complete control over trigger element
 * - No wrapper elements
 * - Flexible trigger customization
 *
 * Use cases:
 * - Icon buttons as triggers
 * - Custom styled buttons
 * - Third-party component integration
 */
export const TriggerAsChild: Story = {
  render: function TriggerAsChildStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <IconButton>
            <Settings />
          </IconButton>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>Settings</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Preferences</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Dropdown.Value>Help</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Nested: Demonstrates nested dropdown menus with multiple levels.
 *
 * Features:
 * - Multiple levels of nesting
 * - Automatic submenu positioning
 * - Hover-based submenu activation
 * - Tree event management for proper closing
 * - Keyboard navigation across nested levels
 *
 * Use cases:
 * - File explorer menus
 * - Complex application menus
 * - Hierarchical command structures
 */
export const Nested: Story = {
  render: function NestedStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Nested Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <Dropdown.Value>File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Edit</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown>
            <Dropdown.SubTrigger>
              <Dropdown.Value>View</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Zoom In</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Zoom Out</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown>
                <Dropdown.SubTrigger>
                  <Dropdown.Value>Layout</Dropdown.Value>
                </Dropdown.SubTrigger>
                <Dropdown.Content>
                  <Dropdown.Item>
                    <Dropdown.Value>Sidebar</Dropdown.Value>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown.Value>Footer</Dropdown.Value>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown.Value>Fullscreen</Dropdown.Value>
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            </Dropdown.Content>
          </Dropdown>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Dropdown.Value>Help</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * NestedInPopover: Demonstrates Dropdown nested inside a Popover or Dialog.
 *
 * Features:
 * - Dropdown works within Popover content
 * - Requires disabledNested prop for proper rendering
 * - Prevents nested menu conflicts
 * - Proper event handling in nested contexts
 *
 * Important:
 * - When using Dropdown nested inside a Popover or Dialog, you must pass the
 *   `disabledNested={true}` prop to ensure proper rendering.
 */
export const NestedInPopover: Story = {
  render: function NestedInPopoverStory() {
    return (
      <Popover>
        <Popover.Trigger>
          <Button>Open Popover</Button>
        </Popover.Trigger>
        <Popover.Content className="flex w-48 flex-col gap-2 p-4">
          <p>
            Note: When using Dropdown nested inside a Popover or Dialog, you must pass the
            `disabledNested={true}` prop to ensure proper rendering.
          </p>
          <Dropdown disabledNested>
            <Dropdown.Trigger>
              <Dropdown.Value>Nested Menu</Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Option 1</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Option 2</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Option 3</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </Popover.Content>
      </Popover>
    )
  },
}

/**
 * NestedSubmenuWithLongList: Demonstrates scrolling functionality in nested submenus with long lists.
 *
 * Features:
 * - First level menu with standard items
 * - Nested submenu with a long list that exceeds screen height
 * - Scroll arrows appear when content exceeds available height
 * - Scrolling works properly in nested menus
 * - Height constraints are properly applied
 * - Multiple nested submenus with long lists
 *
 * Use cases:
 * - File explorer with many files/folders
 * - Long category lists in nested menus
 * - Any scenario requiring scrollable nested menus
 */
export const NestedSubmenuWithLongList: Story = {
  render: function NestedSubmenuWithLongListStory() {
    // Generate a long list of items for testing scrolling
    const longListItems = Array.from({ length: 30 }, (_, i) => ({
      id: `item-${i + 1}`,
      label: `Menu Item ${i + 1}`,
    }))

    return (
      <div className="flex items-center justify-center">
        <Dropdown>
          <Dropdown.Trigger>
            <Dropdown.Value>Menu with long nested submenu</Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Cut</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Copy</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Paste</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />

            {/* Nested submenu with long list - this should scroll */}
            <Dropdown>
              <Dropdown.SubTrigger>
                <Dropdown.Value>Long List</Dropdown.Value>
              </Dropdown.SubTrigger>
              <Dropdown.Content>
                <Dropdown.Label>Scrollable Items</Dropdown.Label>
                {longListItems.map((item) => (
                  <Dropdown.Item key={item.id}>
                    <Dropdown.Value>{item.label}</Dropdown.Value>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>

            {/* Another nested submenu with long list for comparison */}
            <Dropdown>
              <Dropdown.SubTrigger>
                <Dropdown.Value>Another Long List</Dropdown.Value>
              </Dropdown.SubTrigger>
              <Dropdown.Content>
                <Dropdown.Label>Another Scrollable List</Dropdown.Label>
                {longListItems.slice(0, 25).map((item) => (
                  <Dropdown.Item key={item.id}>
                    <Dropdown.Value>{item.label}</Dropdown.Value>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>

            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Properties</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item variant="danger">
              <Dropdown.Value>Delete</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>
    )
  },
}

/**
 * Selection: Demonstrates selection functionality with visual indicators.
 *
 * Features:
 * - Visual selection indicator (check mark)
 * - Controlled selection state
 * - Selection persists between menu opens
 * - Automatic menu closure on selection
 *
 * Use cases:
 * - Radio button-like selection in menus
 * - Theme or preference selection
 * - Single-choice menu scenarios
 */
export const Selection: Story = {
  render: function SelectionStory() {
    const [selected, setSelected] = useState<string | null>("option-2")
    const options = ["Option 1", "Option 2", "Option 3", "Option 4"]

    return (
      <Dropdown selection={true}>
        <Dropdown.Trigger>
          <Dropdown.Value>Theme: {selected || "None"}</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Select Theme</Dropdown.Label>
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              selected={selected === option}
              onClick={() => setSelected(option)}
            >
              <Dropdown.Value>{option}</Dropdown.Value>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * NestedSelection: Demonstrates nested dropdown with selection functionality in submenus.
 *
 * Features:
 * - Selection works across nested levels
 * - Unified state management for all options
 * - Visual selection indicators in nested menus
 * - Proper selection handling in submenus
 *
 * Use cases:
 * - Multi-level preference selection
 * - Hierarchical option selection
 * - Complex configuration menus
 */
export const NestedSelection: Story = {
  render: function NestedSelectionStory() {
    // 使用统一的状态管理所有选项，确保互斥
    const [selected, setSelected] = useState<string | null>(null)

    return (
      <Dropdown selection={true}>
        <Dropdown.Trigger>
          <Dropdown.Value>Multi-Level Selection</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Main Options</Dropdown.Label>
          {["Main 1", "Main 2"].map((option) => (
            <Dropdown.Item
              key={option}
              selected={selected === option}
              onPointerUp={() => setSelected(option)}
            >
              <Dropdown.Value>{option}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown selection={true}>
            <Dropdown.SubTrigger
              selected={selected === "Sub Options"}
              onPointerUp={() => setSelected("Sub Options")}
            >
              <Dropdown.Value>Sub Options</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Label>Choose Sub Option</Dropdown.Label>
              {["Sub A", "Sub B", "Sub C"].map((option) => (
                <Dropdown.Item
                  key={option}
                  selected={selected === option}
                  onClick={() => setSelected(option)}
                >
                  <Dropdown.Value>{option}</Dropdown.Value>
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
 * WithSearch: Demonstrates Dropdown with search functionality and empty states.
 *
 * Features:
 * - Built-in search input
 * - Real-time filtering of options
 * - Empty state when no results found
 * - Clear search functionality
 * - Multi-selection support
 *
 * Use cases:
 * - Large option lists
 * - Searchable selectors
 * - Tag/multi-select scenarios
 */
export const WithSearch: Story = {
  render: function WithSearchStory() {
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<string[]>([])
    const [isOpen, setIsOpen] = useState(false)

    const allOptions = useMemo(
      () =>
        Array.from({ length: 8 }, (_, i) => ({
          id: `option-${i + 1}`,
          label: faker.music.genre(),
        })),
      [],
    )

    const filteredOptions = useMemo(
      () =>
        allOptions.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
      [allOptions, search],
    )

    useEffect(() => {
      if (!isOpen) {
        setSearch("")
      }
    }, [isOpen])

    return (
      <Dropdown
        selection={true}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Dropdown.Trigger>
          <Dropdown.Value>Search Music ({selected.length} selected)</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Search
            value={search}
            onChange={setSearch}
            placeholder="Search genres..."
          />
          <Dropdown.Divider />

          {filteredOptions.length > 0 ? (
            <>
              <Dropdown.Label>Music Genres</Dropdown.Label>
              {filteredOptions.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selected.includes(option.id)}
                  onClick={() => {
                    setSelected((prev) =>
                      prev.includes(option.id)
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id],
                    )
                  }}
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
              {selected.length > 0 && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Button onClick={() => setSelected([])}>
                    Clear All Selections
                  </Dropdown.Button>
                </>
              )}
            </>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-center text-white/40">
              <Search
                width={24}
                height={24}
              />
              <span>No results found</span>
              <Button
                variant="link"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * ComplexMenu: Advanced example showing complex menu structure with mixed features.
 *
 * Features:
 * - Mixed menu features (labels, dividers, shortcuts)
 * - Nested submenus with selection
 * - Prefix icons
 * - Keyboard shortcuts
 * - Danger variant items
 *
 * Use cases:
 * - Application settings menus
 * - Complex preference panels
 * - Feature-rich application menus
 */
export const ComplexMenu: Story = {
  render: function ComplexMenuStory() {
    const [theme, setTheme] = useState("light")
    const [language, setLanguage] = useState("English")

    return (
      <Dropdown>
        <Dropdown.Trigger prefixElement={<Settings />}>
          <Dropdown.Value>Application Settings</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>User Preferences</Dropdown.Label>
          <Dropdown.Item>
            <Dropdown.Value>Profile Settings</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.Value>Account Security</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown selection={true}>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Theme: {theme}</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Label>Choose Theme</Dropdown.Label>
              {["Light", "Dark", "Auto"].map((option) => (
                <Dropdown.Item
                  key={option}
                  selected={theme === option.toLowerCase()}
                  onClick={() => setTheme(option.toLowerCase())}
                >
                  <Dropdown.Value>{option}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          <Dropdown selection={true}>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Language: {language}</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Label>Choose Language</Dropdown.Label>
              {["English", "Spanish", "French", "German"].map((option) => (
                <Dropdown.Item
                  key={option}
                  selected={language === option}
                  onClick={() => setLanguage(option)}
                >
                  <Dropdown.Value>{option}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>

          <Dropdown.Divider />

          <Dropdown.Item shortcut={{ modifier: "command", keys: "," }}>
            <Dropdown.Value>Open Preferences</Dropdown.Value>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item variant="danger">
            <Dropdown.Value>Sign Out</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * CoordinateMode: Demonstrates Dropdown in coordinate mode without a trigger element.
 *
 * Features:
 * - No trigger element required
 * - Positioned at specific x/y coordinates
 * - Auto-select first item option
 * - Perfect for context menus and mentions
 *
 * Use cases:
 * - Context menus at cursor position
 * - Mention dropdowns in editors
 * - Custom positioned menus
 * - Replaces deprecated CoordinateMenu component
 */
export const CoordinateMode: Story = {
  render: function CoordinateModeStory() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [autoSelectFirstItem, setAutoSelectFirstItem] = useState(true)

    const handleClick = (event: React.MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })
      setIsOpen(true)
    }

    return (
      <div className="w-80 space-y-4">
        <Checkbox
          value={autoSelectFirstItem}
          onChange={setAutoSelectFirstItem}
        >
          Auto Select First Item
        </Checkbox>

        <div
          className="bg-secondary-background relative h-64 rounded-lg border border-dashed p-4"
          onMouseDown={handleClick}
        >
          <p className="text-secondary-foreground text-center">
            Click anywhere in this area to show dropdown at mouse position
          </p>
        </div>

        {/* Dropdown in coordinate mode */}
        <div>
          <Dropdown
            autoSelectFirstItem={autoSelectFirstItem}
            position={position}
            open={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom-start"
          >
            <Dropdown.Content>
              <Dropdown.Label>Context Menu</Dropdown.Label>
              <Dropdown.Item onClick={() => setIsOpen(false)}>
                <Dropdown.Value>Cut</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setIsOpen(false)}>
                <Dropdown.Value>Copy</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setIsOpen(false)}>
                <Dropdown.Value>Paste</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                variant="danger"
                onClick={() => setIsOpen(false)}
              >
                <Dropdown.Value>Delete</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
    )
  },
}

/**
 * MentionsWithCoordinateMode: Demonstrates mentions functionality using coordinate mode with Slate.js editor.
 *
 * Features:
 * - Type @ to trigger mentions menu
 * - Dropdown positioned at cursor location
 * - Integration with Slate.js editor
 * - User selection and insertion
 * - Real-time text updates
 *
 * Use cases:
 * - Rich text editors with mentions
 * - Comment systems
 * - Collaborative editing features
 */
export const MentionsWithCoordinateMode: Story = {
  render: function MentionsStory() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)

    // 创建 Slate 编辑器实例
    const editor = useMemo(() => withReact(createEditor()), [])

    // 初始值 - 使用类型断言来确保类型安全
    const initialValue: Descendant[] = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      } as Descendant,
    ]
    const [value, setValue] = useState<Descendant[]>(initialValue)

    const mentionUsers = [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        role: "Software Engineer",
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        role: "Product Manager",
      },
      {
        id: "3",
        name: "Bob Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        role: "Designer",
      },
    ]

    // 获取编辑器文本内容
    const getEditorText = useCallback(() => {
      return value.map((n) => Node.string(n)).join("\n")
    }, [value])

    // 处理编辑器内容变化
    const handleChange = useCallback((newValue: Descendant[]) => {
      setValue(newValue)

      const text = newValue.map((n) => Node.string(n)).join("\n")
      const lastAtIndex = text.lastIndexOf("@")

      // 检查 @ 是否存在，并且 @ 后面没有空格或者是文本的末尾
      if (lastAtIndex !== -1) {
        const afterAt = text.substring(lastAtIndex + 1)
        const hasSpaceAfterAt = afterAt.includes(" ") || afterAt.includes("\n")

        if (!hasSpaceAfterAt) {
          // 获取编辑器位置
          const domSelection = window.getSelection()
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            setPosition({
              x: rect.left,
              y: rect.bottom + 4,
            })
          } else if (editorRef.current) {
            // 备选方案：使用编辑器容器位置
            const rect = editorRef.current.getBoundingClientRect()
            setPosition({
              x: rect.left,
              y: rect.bottom + 4,
            })
          }
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      } else {
        setIsOpen(false)
      }
    }, [])

    // 处理用户选择
    const handleSelectUser = useCallback(
      (user: (typeof mentionUsers)[0]) => {
        // 使用 Slate 的 API 来正确插入提及内容
        const { selection } = editor

        if (selection) {
          // 获取当前文本和光标位置
          const text = getEditorText()
          const lastAtIndex = text.lastIndexOf("@")

          if (lastAtIndex !== -1) {
            // 计算需要替换的范围
            const afterAtText = text.substring(lastAtIndex + 1)

            // 创建选择范围，从 @ 开始到当前光标位置
            const start = { path: [0, 0], offset: lastAtIndex }
            const end = {
              path: [0, 0],
              offset: lastAtIndex + 1 + afterAtText.length,
            }
            const range = { anchor: start, focus: end }

            // 选择要替换的文本范围
            Transforms.select(editor, range)

            // 插入提及文本
            Transforms.insertText(editor, `@${user.name} `)
          }
        }

        setIsOpen(false)
        // 保持编辑器焦点
        ReactEditor.focus(editor)
      },
      [editor, getEditorText],
    )

    return (
      <div className="w-80 space-y-4">
        {/* 简单的 Slate 编辑器 */}
        <div
          ref={editorRef}
          className="focus-within:border-selected-boundary min-h-[80px] w-full rounded-lg border p-2"
        >
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={handleChange}
          >
            <Editable
              placeholder="Type @ to mention someone..."
              className="outline-none"
              style={{ minHeight: "56px" }}
            />
          </Slate>
        </div>

        {/* Dropdown 菜单 */}
        <div>
          <Dropdown
            position={position}
            open={isOpen}
            onOpenChange={setIsOpen}
            placement="bottom-start"
            focusManagerProps={{
              initialFocus: 0,
            }}
          >
            <Dropdown.Content>
              <Dropdown.Label>Mention User</Dropdown.Label>
              {mentionUsers.map((user) => (
                <Dropdown.Item
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  prefixElement={
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-4 rounded-full"
                    />
                  }
                >
                  <Dropdown.Value>{user.name}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>

        {/* 显示当前值用于调试 */}
        <div className="bg-secondary-background text-secondary-foreground rounded-lg p-2">
          Current text: &ldquo;{getEditorText()}&rdquo;
        </div>
      </div>
    )
  },
}

/**
 * WithTriggerRef: Demonstrates using triggerRef to bind dropdown to an external element.
 *
 * Features:
 * - Attach dropdown to any element via ref
 * - No need for Dropdown.Trigger wrapper
 * - More control over trigger element
 * - Flexible integration with existing components
 *
 * Use cases:
 * - Attaching dropdown to existing elements
 * - Third-party component integration
 * - Custom trigger implementations
 */
export const WithTriggerRef: Story = {
  render: function WithTriggerRefStory() {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="flex items-center justify-center gap-8">
        <div>
          <p className="text-body-small-strong mb-2">Using triggerRef</p>
          <button
            ref={triggerRef}
            className="bg-secondary-background rounded-lg border border-dashed px-4 py-2"
          >
            Click me (via triggerRef)
          </button>
          <Dropdown
            triggerRef={triggerRef}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <Dropdown.Content>
              <Dropdown.Label>TriggerRef Menu</Dropdown.Label>
              <Dropdown.Item>
                <Dropdown.Value>Option 1</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Option 2</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item variant="danger">
                <Dropdown.Value>Delete</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
    )
  },
}

/**
 * WithTriggerSelector: Demonstrates using triggerSelector (CSS selector) to bind dropdown to an element.
 *
 * Features:
 * - Supports any valid CSS selector (#id, .class, [data-*], etc.)
 * - Same functionality as triggerRef
 * - triggerRef takes priority if both are provided
 *
 * Use cases:
 * - When you cannot access the element via ref (e.g., third-party components)
 * - When the trigger element is rendered elsewhere in the DOM
 * - When you prefer a simpler, selector-based approach
 */
export const WithTriggerSelector: Story = {
  render: function WithTriggerSelectorStory() {
    const [isOpen1, setIsOpen1] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [isOpen3, setIsOpen3] = useState(false)

    return (
      <div className="flex gap-8">
        {/* Using id selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using #id selector</p>
          <button
            id="dropdown-trigger-by-id"
            className="bg-secondary-background rounded-lg border border-dashed px-4 py-2"
          >
            Click me (id selector)
          </button>
          <Dropdown
            triggerSelector="#dropdown-trigger-by-id"
            open={isOpen1}
            onOpenChange={setIsOpen1}
          >
            <Dropdown.Content>
              <Dropdown.Label>ID Selector Menu</Dropdown.Label>
              <Dropdown.Item>
                <Dropdown.Value>Action 1</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Action 2</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>

        {/* Using class selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using .class selector</p>
          <button className="dropdown-trigger-by-class bg-secondary-background rounded-lg border border-dashed px-4 py-2">
            Click me (class selector)
          </button>
          <Dropdown
            triggerSelector=".dropdown-trigger-by-class"
            open={isOpen2}
            onOpenChange={setIsOpen2}
          >
            <Dropdown.Content>
              <Dropdown.Label>Class Selector Menu</Dropdown.Label>
              <Dropdown.Item>
                <Dropdown.Value>Option A</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Option B</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>

        {/* Using data attribute selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using [data-*] selector</p>
          <button
            data-dropdown-trigger="custom"
            className="bg-secondary-background rounded-lg border border-dashed px-4 py-2"
          >
            Click me (data-* selector)
          </button>
          <Dropdown
            triggerSelector="[data-dropdown-trigger='custom']"
            open={isOpen3}
            onOpenChange={setIsOpen3}
          >
            <Dropdown.Content>
              <Dropdown.Label>Data Attribute Menu</Dropdown.Label>
              <Dropdown.Item>
                <Dropdown.Value>Item X</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Item Y</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] Multiple dropdowns testing proper event handling and switching.
 */
export const MultipleDropdowns: Story = {
  render: function MultipleDropdownsStory() {
    const [dropdown1Open, setDropdown1Open] = useState(false)
    const [dropdown2Open, setDropdown2Open] = useState(false)
    const [dropdown3Open, setDropdown3Open] = useState(false)

    return (
      <div className="w-80 space-y-4">
        <div className="rounded-xl border p-4">
          <h3 className="font-strong mb-2">🔄 Multiple Dropdown Switching Test</h3>
          <p className="text-secondary-foreground">
            Test scenario: When one dropdown is open, clicking another should close the first and
            open the second in one click.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-strong">Dropdown 1</h4>
            <div className="text-secondary-foreground">
              Status: {dropdown1Open ? "Open" : "Closed"}
            </div>
            <Dropdown
              open={dropdown1Open}
              onOpenChange={setDropdown1Open}
            >
              <Dropdown.Trigger>
                <Dropdown.Value>Menu 1 {dropdown1Open ? "(Open)" : ""}</Dropdown.Value>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Label>Menu 1 Content</Dropdown.Label>
                <Dropdown.Item>Option A</Dropdown.Item>
                <Dropdown.Item>Option B</Dropdown.Item>
                <Dropdown.Item>Option C</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Button onClick={() => setDropdown1Open(false)}>
                  Close Menu
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>

          <div>
            <h4 className="font-strong">Dropdown 2</h4>
            <div className="text-secondary-foreground">
              Status: {dropdown2Open ? "Open" : "Closed"}
            </div>
            <Dropdown
              open={dropdown2Open}
              onOpenChange={setDropdown2Open}
            >
              <Dropdown.Trigger>
                <Dropdown.Value>Menu 2 {dropdown2Open ? "(Open)" : ""}</Dropdown.Value>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Label>Menu 2 Content</Dropdown.Label>
                <Dropdown.Item>Item X</Dropdown.Item>
                <Dropdown.Item>Item Y</Dropdown.Item>
                <Dropdown.Item>Item Z</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Button onClick={() => setDropdown2Open(false)}>
                  Close Menu
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>

          <div>
            <h4 className="font-strong">Dropdown 3</h4>
            <div className="text-secondary-foreground">
              Status: {dropdown3Open ? "Open" : "Closed"}
            </div>
            <Dropdown
              open={dropdown3Open}
              onOpenChange={setDropdown3Open}
            >
              <Dropdown.Trigger>
                <Dropdown.Value>Menu 3 {dropdown3Open ? "(Open)" : ""}</Dropdown.Value>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Label>Menu 3 Content</Dropdown.Label>
                <Dropdown.Item>Choice 1</Dropdown.Item>
                <Dropdown.Item>Choice 2</Dropdown.Item>
                <Dropdown.Item>Choice 3</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Button onClick={() => setDropdown3Open(false)}>
                  Close Menu
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <h4 className="font-strong mb-2">Test Instructions:</h4>
          <ol className="text-secondary-foreground list-inside list-decimal space-y-1">
            <li>Click &quot;Menu 1&quot; to open the first dropdown</li>
            <li>While keeping Menu 1 open, click &quot;Menu 2&quot;</li>
            <li>Verify Menu 1 closes and Menu 2 opens with a single click</li>
            <li>Test switching between Menu 2 → Menu 3 and Menu 3 → Menu 1</li>
          </ol>
        </div>
      </div>
    )
  },
}

/**
 * [TEST] Interactive test for nested menu click behavior
 */
export const NestedMenuClickTest: Story = {
  render: function DropdownNestedTest() {
    const [clickLog, setClickLog] = useState<string[]>([])
    const [mainOpen, setMainOpen] = useState(false)
    const [submenu1Open, setSubmenu1Open] = useState(false)
    const [submenu2Open, setSubmenu2Open] = useState(false)
    const [deepSubmenuOpen, setDeepSubmenuOpen] = useState(false)

    const addLog = (message: string) => {
      setClickLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    }

    const handleMainOpenChange = (open: boolean) => {
      setMainOpen(open)
      addLog(`Main menu ${open ? "opened" : "closed"}`)
    }

    const handleSubmenu1OpenChange = (open: boolean) => {
      setSubmenu1Open(open)
      addLog(`Submenu 1 ${open ? "opened" : "closed"}`)
    }

    const handleSubmenu2OpenChange = (open: boolean) => {
      setSubmenu2Open(open)
      addLog(`Submenu 2 ${open ? "opened" : "closed"}`)
    }

    const handleDeepSubmenuOpenChange = (open: boolean) => {
      setDeepSubmenuOpen(open)
      addLog(`Deep submenu ${open ? "opened" : "closed"}`)
    }

    const handleItemClick = (itemName: string) => {
      addLog(`Clicked: ${itemName}`)
    }

    const clearLog = () => {
      setClickLog([])
    }

    return (
      <div className="space-y-4 p-8">
        <h1 className="text-heading-display">Dropdown Nested Menu Click Test</h1>

        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <h2 className="text-body-large-strong mb-2">Test Instructions:</h2>
          <ol className="text-body-small list-inside list-decimal space-y-1">
            <li>Click the main dropdown trigger to open the menu</li>
            <li>Hover over &quot;File&quot; to open the first submenu</li>
            <li>Hover over &quot;Recent Files&quot; to open the nested submenu</li>
            <li>Click on any item in the nested submenu</li>
            <li>Observe if the entire menu closes or just the clicked submenu</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-body-small-strong mb-2">Menu State:</h3>
            <div className="text-body-small space-y-1">
              <div>
                Main Menu:{" "}
                <span className={mainOpen ? "text-green-600" : "text-red-600"}>
                  {mainOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div>
                Submenu 1:{" "}
                <span className={submenu1Open ? "text-green-600" : "text-red-600"}>
                  {submenu1Open ? "Open" : "Closed"}
                </span>
              </div>
              <div>
                Submenu 2:{" "}
                <span className={submenu2Open ? "text-green-600" : "text-red-600"}>
                  {submenu2Open ? "Open" : "Closed"}
                </span>
              </div>
              <div>
                Deep Submenu:{" "}
                <span className={deepSubmenuOpen ? "text-green-600" : "text-red-600"}>
                  {deepSubmenuOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Dropdown
              open={mainOpen}
              onOpenChange={handleMainOpenChange}
            >
              <Dropdown.Trigger>
                <Dropdown.Value>Nested Menu Test</Dropdown.Value>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item onClick={() => handleItemClick("New")}>
                  <Dropdown.Value>New</Dropdown.Value>
                </Dropdown.Item>

                {/* First level submenu */}
                <Dropdown
                  open={submenu1Open}
                  onOpenChange={handleSubmenu1OpenChange}
                >
                  <Dropdown.SubTrigger>
                    <Dropdown.Value>File</Dropdown.Value>
                  </Dropdown.SubTrigger>
                  <Dropdown.Content>
                    <Dropdown.Item onClick={() => handleItemClick("Open File")}>
                      <Dropdown.Value>Open File</Dropdown.Value>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleItemClick("Save File")}>
                      <Dropdown.Value>Save File</Dropdown.Value>
                    </Dropdown.Item>

                    {/* Second level submenu */}
                    <Dropdown
                      open={submenu2Open}
                      onOpenChange={handleSubmenu2OpenChange}
                    >
                      <Dropdown.SubTrigger>
                        <Dropdown.Value>Recent Files</Dropdown.Value>
                      </Dropdown.SubTrigger>
                      <Dropdown.Content>
                        <Dropdown.Item onClick={() => handleItemClick("file1.txt")}>
                          <Dropdown.Value>file1.txt</Dropdown.Value>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleItemClick("file2.txt")}>
                          <Dropdown.Value>file2.txt</Dropdown.Value>
                        </Dropdown.Item>

                        {/* Third level submenu (deep nesting) */}
                        <Dropdown
                          open={deepSubmenuOpen}
                          onOpenChange={handleDeepSubmenuOpenChange}
                        >
                          <Dropdown.SubTrigger>
                            <Dropdown.Value>More Files</Dropdown.Value>
                          </Dropdown.SubTrigger>
                          <Dropdown.Content>
                            <Dropdown.Item onClick={() => handleItemClick("deepfile1.txt")}>
                              <Dropdown.Value>deepfile1.txt</Dropdown.Value>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemClick("deepfile2.txt")}>
                              <Dropdown.Value>deepfile2.txt</Dropdown.Value>
                            </Dropdown.Item>
                          </Dropdown.Content>
                        </Dropdown>
                      </Dropdown.Content>
                    </Dropdown>
                  </Dropdown.Content>
                </Dropdown>

                <Dropdown.Divider />

                <Dropdown.Item onClick={() => handleItemClick("Exit")}>
                  <Dropdown.Value>Exit</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-body-small-strong">Event Log:</h3>
            <button
              onClick={clearLog}
              className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Clear Log
            </button>
          </div>
          <div className="h-48 overflow-y-auto rounded bg-gray-50 p-3 font-mono text-xs dark:bg-gray-900">
            {clickLog.length === 0 ? (
              <div className="text-gray-500">No events yet...</div>
            ) : (
              clickLog.map((log, index) => (
                <div
                  key={index}
                  className="py-0.5"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="font-strong mb-2 text-yellow-800 dark:text-yellow-200">
            Expected Behavior:
          </h3>
          <p className="text-body-small text-yellow-700 dark:text-yellow-300">
            When clicking on any item in a nested menu, the ENTIRE menu hierarchy should close. This
            is consistent with how the ContextMenu component behaves and provides a better user
            experience.
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="font-strong mb-2 text-blue-800 dark:text-blue-200">Technical Details:</h3>
          <div className="text-body-small space-y-1 text-blue-700 dark:text-blue-300">
            <p>• The Dropdown uses FloatingTree from @floating-ui/react</p>
            <p>
              • Menu items emit a <code>click</code> event via <code>tree.events.emit(click)</code>
            </p>
            <p>• The root Dropdown listens for this event and closes when triggered</p>
            <p>• This ensures all nested menus close together</p>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Empty: Demonstrates empty state display when no items are available.
 *
 * Features:
 * - Show custom empty message when menu has no items
 * - Useful for dynamic menu content scenarios
 */
export const Empty: Story = {
  render: function EmptyStory() {
    const items: { id: string; label: string }[] = []

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Open Menu</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {items.length > 0 ? (
            items.map((item) => (
              <Dropdown.Item key={item.id}>
                <Dropdown.Value>{item.label}</Dropdown.Value>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Empty>No items available</Dropdown.Empty>
          )}
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * SelectionWithPrefixIcons: Demonstrates selection functionality with prefix icons.
 *
 * Features:
 * - When prefix icons exist, the Check icon appears at the suffix position (right side)
 * - When no prefix icon exists, the Check icon appears at the prefix position (left side)
 * - Maintains proper visual hierarchy and clarity
 * - Works seamlessly with existing selection functionality
 *
 * Use cases:
 * - Theme selection with icon indicators
 * - Preference selection with visual cues
 * - Single-choice menus with icons
 */
export const SelectionWithPrefixIcons: Story = {
  render: function SelectionWithPrefixIconsStory() {
    const [selected, setSelected] = useState<string | null>("option-2")

    const options = [
      { id: "option-1", label: "Light Mode", icon: <File /> },
      { id: "option-2", label: "Dark Mode", icon: <Settings /> },
      { id: "option-3", label: "Auto Mode", icon: <Search /> },
    ]

    const optionsWithoutIcons = [
      { id: "option-4", label: "System Default" },
      { id: "option-5", label: "Custom Theme" },
    ]

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-body-large-strong mb-4">With Prefix Icons (Check icon on the right)</h3>
          <Dropdown selection={true}>
            <Dropdown.Trigger>
              <Dropdown.Value>
                Selected: {options.find((opt) => opt.id === selected)?.label || "None"}
              </Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Label>Select Theme</Dropdown.Label>
              {options.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selected === option.id}
                  prefixElement={option.icon}
                  onClick={() => setSelected(option.id)}
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <p className="text-body-small text-secondary-foreground mt-2">
            Notice: When prefix icons exist, the Check icon appears on the right side.
          </p>
        </div>

        <div>
          <h3 className="text-body-large-strong mb-4">Without Prefix Icons (Check icon on the left)</h3>
          <Dropdown selection={true}>
            <Dropdown.Trigger>
              <Dropdown.Value>
                Selected: {optionsWithoutIcons.find((opt) => opt.id === selected)?.label || "None"}
              </Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Label>Select Theme (No Icons)</Dropdown.Label>
              {optionsWithoutIcons.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selected === option.id}
                  onClick={() => setSelected(option.id)}
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <p className="text-body-small text-secondary-foreground mt-2">
            Notice: When no prefix icons exist, the Check icon appears on the left side (standard
            behavior).
          </p>
        </div>

        <div>
          <h3 className="text-body-large-strong mb-4">Mixed: With and Without Icons</h3>
          <Dropdown selection={true}>
            <Dropdown.Trigger>
              <Dropdown.Value>
                Selected:{" "}
                {[...options, ...optionsWithoutIcons].find((opt) => opt.id === selected)?.label ||
                  "None"}
              </Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Label>Select Theme (Mixed)</Dropdown.Label>
              {options.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selected === option.id}
                  prefixElement={option.icon}
                  onClick={() => setSelected(option.id)}
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              {optionsWithoutIcons.map((option) => (
                <Dropdown.Item
                  key={option.id}
                  selected={selected === option.id}
                  onClick={() => setSelected(option.id)}
                >
                  <Dropdown.Value>{option.label}</Dropdown.Value>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <p className="text-body-small text-secondary-foreground mt-2">
            Notice: Items with prefix icons show Check on the right, items without show Check on the
            left.
          </p>
        </div>
      </div>
    )
  },
}
