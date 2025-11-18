import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useRef, useState } from "react"
import { Dropdown } from "../dropdown"
import { ContextMenu } from "./context-menu"
import { Button } from "../button"
import { Popover } from "../popover"
import { Checkbox } from "../checkbox"

const meta: Meta<typeof ContextMenu> = {
  title: "Collections/ContextMenu",
  component: ContextMenu,
  tags: ["upgrade", "autodocs"],
}

export default meta

type Story = StoryObj<typeof ContextMenu>

/**
 * Basic: The simplest usage of ContextMenu.
 *
 * Features:
 * - Right-click triggered context menu
 * - Virtual positioning at mouse cursor location
 * - Keyboard navigation support
 * - Automatic dismissal on click outside
 *
 * Implementation notes:
 * - Uses @floating-ui/react for positioning and interactions
 * - Fully reuses Dropdown sub-components (Content, Item, etc.)
 * - Supports all standard menu features like dividers and variants
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <div className="flex h-64 items-center justify-center">
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8">
              Right click me to open context menu
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item>
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * WithSelection: Demonstrates selection functionality with visual indicators.
 *
 * Features:
 * - Visual selection indicator (check mark)
 * - Controlled selection state
 * - Selection persists between menu opens
 * - Automatic menu closure on selection
 *
 * Usage:
 * - Set `selection={true}` on the ContextMenu
 * - Use `selected` prop on items to indicate selection state
 * - Handle selection via `onMouseUp` callback
 */
export const WithSelection: Story = {
  render: function WithSelectionStory() {
    const [selected, setSelected] = useState<string | null>("option1")

    const options = [
      { id: "option1", label: "Option 1" },
      { id: "option2", label: "Option 2" },
      { id: "option3", label: "Option 3" },
    ]

    return (
      <div className="flex h-64 items-center justify-center">
        <ContextMenu selection={true}>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8">
              Right click me for selection menu
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Label>Select an option</ContextMenu.Label>
            {options.map((option) => (
              <ContextMenu.Item
                key={option.id}
                selected={selected === option.id}
                onMouseUp={() => setSelected(option.id)}
              >
                <ContextMenu.Value>{option.label}</ContextMenu.Value>
              </ContextMenu.Item>
            ))}
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * SharedMenuContent: Demonstrates how to share menu content between Dropdown and ContextMenu.
 *
 * This is the key business value of ContextMenu - complete component reuse.
 *
 * Features:
 * - Same menu content works in both Dropdown and ContextMenu
 * - Uses Dropdown components (Content, Item, etc.) for compatibility
 * - Reduces code duplication and ensures consistency
 * - Demonstrates the "write once, use everywhere" approach
 *
 * Technical implementation:
 * - ContextMenu internally reuses all Dropdown sub-components
 * - Content is defined as JSX variable (not function component) for better compatibility
 * - Both components share the same interaction patterns
 */
export const SharedMenuContent: Story = {
  render: function SharedMenuContentStory() {
    // Shared menu content - uses Dropdown components for compatibility
    const sharedMenuContent = (
      <Dropdown.Content>
        <Dropdown.Item>
          <Dropdown.Value>New File</Dropdown.Value>
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.Value>New Folder</Dropdown.Value>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <Dropdown.Value>Import</Dropdown.Value>
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.Value>Export</Dropdown.Value>
        </Dropdown.Item>
      </Dropdown.Content>
    )

    return (
      <div className="flex h-64 flex-col gap-8">
        {/* Dropdown using shared menu content */}
        <div>
          <p className="mb-2">Dropdown with shared menu content</p>

          <Dropdown>
            <Dropdown.Trigger>
              <Dropdown.Value>Click for Dropdown Menu</Dropdown.Value>
            </Dropdown.Trigger>
            {sharedMenuContent}
          </Dropdown>
        </div>

        {/* ContextMenu using the same content */}
        <div>
          <p className="mb-2">Context menu with same content</p>
          <ContextMenu>
            <ContextMenu.Trigger>
              <div className="bg-secondary-background rounded-xl border border-dashed p-8">
                Right click me for context menu (same content)
              </div>
            </ContextMenu.Trigger>
            {sharedMenuContent}
          </ContextMenu>
        </div>
      </div>
    )
  },
}

/**
 * WithDividers: Shows complex menu structure with dividers and labels.
 *
 * Features:
 * - Section labels for grouping
 * - Visual dividers for separation
 * - Different item variants (danger, highlight)
 * - Hierarchical menu organization
 *
 * Use cases:
 * - File manager context menus
 * - Complex application menus
 * - Settings and configuration menus
 */
export const WithDividers: Story = {
  render: function WithDividersStory() {
    return (
      <div className="flex h-64 items-center justify-center">
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8 text-center">
              Right click for complex menu
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Label>File Operations</ContextMenu.Label>
            <ContextMenu.Item>
              <ContextMenu.Value>Open</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Open in New Tab</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Label>Edit Operations</ContextMenu.Label>
            <ContextMenu.Item>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item variant="danger">
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * FileManagerExample: Real-world example showing menu sharing in a file manager scenario.
 *
 * Business scenario:
 * - Same file operations available in toolbar dropdown and right-click menu
 * - Ensures consistent user experience across interaction methods
 * - Reduces development and maintenance overhead
 *
 * Features:
 * - Identical functionality in both interaction patterns
 * - Dynamic menu content based on data
 * - Action callbacks with logging
 * - Demonstrates practical component reuse
 */
export const FileManagerExample: Story = {
  render: function FileManagerExampleStory() {
    const fileOperations = [
      { id: "open", label: "Open" },
      { id: "rename", label: "Rename" },
      { id: "copy", label: "Copy" },
      { id: "move", label: "Move" },
      { id: "delete", label: "Delete", variant: "danger" as const },
    ]

    // File operations menu - reusable in both dropdown and context menu
    const fileOperationsMenu = (
      <Dropdown.Content>
        <Dropdown.Label>File Operations</Dropdown.Label>
        {fileOperations.map((operation) => (
          <Dropdown.Item
            key={operation.id}
            variant={operation.variant}
            onClick={() => console.log(`Executing ${operation.label} operation`)}
          >
            <Dropdown.Value>{operation.label}</Dropdown.Value>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    )

    return (
      <div className="space-y-8 p-8">
        <h2 className="text-body-large-strong">File Manager Example</h2>

        <div className="flex gap-4">
          <div>
            <p className="mb-2">Toolbar Button</p>
            <Dropdown>
              <Dropdown.Trigger>
                <Dropdown.Value>File Operations</Dropdown.Value>
              </Dropdown.Trigger>
              {fileOperationsMenu}
            </Dropdown>
          </div>

          <div>
            <p className="mb-2">Right-click Menu</p>
            <ContextMenu>
              <ContextMenu.Trigger>
                <div className="bg-secondary-background rounded-lg border border-dashed p-4">
                  📁 Folder (right-click)
                </div>
              </ContextMenu.Trigger>
              {fileOperationsMenu}
            </ContextMenu>
          </div>
        </div>

        <div className="bg-secondary-background rounded-xl p-4">
          <strong>Business Value:</strong> Same menu logic works in both toolbar dropdown and
          right-click menu, reducing code duplication and ensuring interaction consistency.
        </div>
      </div>
    )
  },
}

/**
 * NestedSubmenus: Demonstrates nested context menus with multiple levels.
 *
 * Features:
 * - Multiple levels of nested submenus
 * - Hover-based submenu activation (hover over submenu triggers)
 * - Keyboard navigation across nested levels (use arrow keys)
 * - Automatic submenu positioning (prevents overflow)
 * - Mixed content (regular items + submenus)
 *
 * Implementation:
 * - Uses nested ContextMenu components for submenus
 * - SubTrigger components indicate expandable items (show arrow icon)
 * - Supports unlimited nesting depth
 * - Maintains consistent interaction patterns
 *
 * Use cases:
 * - File explorer context menus
 * - Complex application menus
 * - Hierarchical command structures
 * - Multi-level category selections
 */
export const NestedSubmenus: Story = {
  render: function NestedSubmenusStory() {
    return (
      <div className="flex h-96 items-center justify-center">
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8 text-center">
              Right click for nested menus
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />

            {/* First level submenu - Share (no Target needed for nested) */}
            <ContextMenu>
              <ContextMenu.SubTrigger>
                <ContextMenu.Value>Share</ContextMenu.Value>
              </ContextMenu.SubTrigger>
              <ContextMenu.Content>
                <ContextMenu.Item>
                  <ContextMenu.Value>Copy Link</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <ContextMenu.Value>Email</ContextMenu.Value>
                </ContextMenu.Item>

                {/* Second level submenu - Social Media (also no Target) */}
                <ContextMenu>
                  <ContextMenu.SubTrigger>
                    <ContextMenu.Value>Social Media</ContextMenu.Value>
                  </ContextMenu.SubTrigger>
                  <ContextMenu.Content>
                    <ContextMenu.Item>
                      <ContextMenu.Value>Twitter</ContextMenu.Value>
                    </ContextMenu.Item>
                    <ContextMenu.Item>
                      <ContextMenu.Value>Facebook</ContextMenu.Value>
                    </ContextMenu.Item>
                    <ContextMenu.Item>
                      <ContextMenu.Value>LinkedIn</ContextMenu.Value>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu>

                <ContextMenu.Divider />
                <ContextMenu.Item>
                  <ContextMenu.Value>Generate QR Code</ContextMenu.Value>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu>

            {/* First level submenu - Export */}
            <ContextMenu>
              <ContextMenu.SubTrigger>
                <ContextMenu.Value>Export</ContextMenu.Value>
              </ContextMenu.SubTrigger>
              <ContextMenu.Content>
                <ContextMenu.Label>File Formats</ContextMenu.Label>
                <ContextMenu.Item>
                  <ContextMenu.Value>PDF</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <ContextMenu.Value>PNG</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <ContextMenu.Value>SVG</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Divider />

                {/* Second level submenu - Advanced Options */}
                <ContextMenu>
                  <ContextMenu.SubTrigger>
                    <ContextMenu.Value>Advanced Options</ContextMenu.Value>
                  </ContextMenu.SubTrigger>
                  <ContextMenu.Content>
                    <ContextMenu.Item>
                      <ContextMenu.Value>High Quality</ContextMenu.Value>
                    </ContextMenu.Item>
                    <ContextMenu.Item>
                      <ContextMenu.Value>Compressed</ContextMenu.Value>
                    </ContextMenu.Item>
                    <ContextMenu.Divider />
                    <ContextMenu.Item>
                      <ContextMenu.Value>Custom Settings</ContextMenu.Value>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu>
              </ContextMenu.Content>
            </ContextMenu>

            <ContextMenu.Divider />
            <ContextMenu.Item>
              <ContextMenu.Value>Properties</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item variant="danger">
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * WithDisabledItems: Demonstrates disabled menu items.
 *
 * Features:
 * - Visual disabled state
 * - Prevents interaction with disabled items
 * - Maintains keyboard navigation flow
 * - Useful for conditional menu states
 */
export const WithDisabledItems: Story = {
  render: function WithDisabledItemsStory() {
    return (
      <div className="flex h-64 items-center justify-center">
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8">
              Right click for menu with disabled items
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <ContextMenu.Value>Available Action</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item disabled>
              <ContextMenu.Value>Disabled Action</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Another Available Action</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item disabled>
              <ContextMenu.Value>Also Disabled</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * ContextMenuNestedDropdown: Fixed implementation using triggerRef to avoid component conflicts.
 *
 * This story demonstrates the solution to the original nesting problem:
 * - ContextMenu.Target was interfering with Dropdown's Slot mechanism
 * - Using triggerRef bypasses the wrapper issue entirely
 * - Both components now work perfectly together
 *
 * Features:
 * - Left-click opens Dropdown menu
 * - Right-click opens ContextMenu
 * - No component wrapping conflicts
 * - Clean, working implementation
 */
export const ContextMenuNestedDropdown: Story = {
  render: function ContextMenuNestedDropdownStory() {
    const triggerRef = useRef<HTMLDivElement>(null)

    const ContextMenuContent = () => (
      <>
        <ContextMenu.Item>
          <ContextMenu.Value>Available Action</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.Value>Another Available Action</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Divider />
        <ContextMenu.Item>
          <ContextMenu.Value>Another Available Action</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Divider />
        <ContextMenu.Item>
          <ContextMenu.Value>Another Available Action</ContextMenu.Value>
        </ContextMenu.Item>
      </>
    )

    return (
      <div className="flex h-64 items-center justify-center">
        <div
          ref={triggerRef}
          className="bg-secondary-background rounded-xl border border-dashed p-8"
        >
          <Dropdown>
            <Dropdown.Trigger>
              <Dropdown.Value>Left/Right click for different menus</Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <ContextMenuContent />
            </Dropdown.Content>
          </Dropdown>
        </div>

        <ContextMenu triggerRef={triggerRef}>
          <ContextMenu.Content>
            <ContextMenuContent />
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * WithTriggerRef: Demonstrates using triggerRef to avoid component wrapping conflicts.
 *
 * This approach solves complex nesting scenarios by:
 * - Using a ref to directly bind the context menu to any DOM element
 * - Avoiding wrapper components that might interfere with other libraries
 * - Providing maximum flexibility for integration
 *
 * Features:
 * - Left-click opens Dropdown normally
 * - Right-click opens ContextMenu via triggerRef
 * - No component wrapping conflicts
 * - Clean separation of concerns
 *
 * Usage:
 * ```tsx
 * const triggerRef = useRef<HTMLDivElement>(null)
 *
 * return (
 *   <>
 *     <div ref={triggerRef}>
 *       <Dropdown>...</Dropdown>
 *     </div>
 *     <ContextMenu triggerRef={triggerRef}>
 *       <ContextMenu.Content>...</ContextMenu.Content>
 *     </ContextMenu>
 *   </>
 * )
 * ```
 */
export const WithTriggerRef: Story = {
  render: function WithTriggerRefStory() {
    const triggerRef = useRef<HTMLDivElement>(null)

    const MenuContent = () => (
      <>
        <ContextMenu.Item>
          <ContextMenu.Value>Copy</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.Value>Cut</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.Value>Paste</ContextMenu.Value>
        </ContextMenu.Item>
        <ContextMenu.Divider />
        <ContextMenu.Item variant="danger">
          <ContextMenu.Value>Delete</ContextMenu.Value>
        </ContextMenu.Item>
      </>
    )

    return (
      <div className="flex h-64 items-center justify-center">
        <div
          ref={triggerRef}
          className="bg-secondary-background rounded-xl border border-dashed p-8"
        >
          <Dropdown>
            <Dropdown.Trigger>
              <Dropdown.Value>Left click for Dropdown, Right click for ContextMenu</Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Label>Dropdown Menu</Dropdown.Label>
              <Dropdown.Item>
                <Dropdown.Value>New File</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>New Folder</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Dropdown.Value>Settings</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <ContextMenu triggerRef={triggerRef}>
          <ContextMenu.Content>
            <ContextMenu.Label>Context Menu</ContextMenu.Label>
            <MenuContent />
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * WithDisabled: Demonstrates disabled ContextMenu functionality.
 *
 * Features:
 * - Shows how to disable the entire context menu
 * - Right-click events are prevented when disabled=true
 * - Visual feedback through data attributes for styling
 * - Useful for conditional menu availability
 *
 * Implementation:
 * - Set disabled={true} to prevent context menu activation
 * - Can use CSS selectors like [data-disabled] for styling
 * - Both Target and triggerRef approaches support disabled state
 *
 * Usage:
 * ```tsx
 * <ContextMenu disabled={isReadOnly}>
 *   <ContextMenu.Trigger>...</ContextMenu.Trigger>
 *   <ContextMenu.Content>...</ContextMenu.Content>
 * </ContextMenu>
 * ```
 */
export const WithDisabled: Story = {
  render: function WithDisabledStory() {
    const [isDisabled, setIsDisabled] = useState(false)

    return (
      <div className="space-y-8 p-8">
        <Checkbox
          value={isDisabled}
          onChange={setIsDisabled}
        >
          Disable context menu
        </Checkbox>

        <div className="flex gap-8">
          {/* Using ContextMenu.Trigger */}
          <div>
            <p className="text-body-small-strong mb-2">Using ContextMenu.Trigger</p>
            <ContextMenu disabled={isDisabled}>
              <ContextMenu.Trigger>
                <div className="bg-secondary-background rounded-xl border border-dashed p-8">
                  {isDisabled ? "Context menu disabled" : "Right click me"}
                </div>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item>
                  <ContextMenu.Value>Copy</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <ContextMenu.Value>Cut</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item>
                  <ContextMenu.Value>Paste</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Divider />
                <ContextMenu.Item variant="danger">
                  <ContextMenu.Value>Delete</ContextMenu.Value>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu>
          </div>

          {/* Using triggerRef */}
          <div>
            <p className="text-body-small-strong mb-2">Using triggerRef</p>
            <DisabledWithTriggerRef disabled={isDisabled} />
          </div>
        </div>

        <div className="bg-secondary-background rounded-xl p-4">
          <strong>Tip:</strong> When disabled=true, the context menu will not open on right-click.
          You can style disabled states using CSS selectors like <code>[data-disabled]</code> or
          <code>[data-context-menu-disabled]</code>.
        </div>
      </div>
    )
  },
}

// Helper component for triggerRef example
function DisabledWithTriggerRef({ disabled }: { disabled: boolean }) {
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        ref={triggerRef}
        className="bg-secondary-background rounded-xl border border-dashed p-8"
      >
        {disabled ? "Context menu disabled" : "Right click me"}
      </div>

      <ContextMenu
        disabled={disabled}
        triggerRef={triggerRef}
      >
        <ContextMenu.Content>
          <ContextMenu.Item>
            <ContextMenu.Value>Copy</ContextMenu.Value>
          </ContextMenu.Item>
          <ContextMenu.Item>
            <ContextMenu.Value>Cut</ContextMenu.Value>
          </ContextMenu.Item>
          <ContextMenu.Item>
            <ContextMenu.Value>Paste</ContextMenu.Value>
          </ContextMenu.Item>
          <ContextMenu.Divider />
          <ContextMenu.Item variant="danger">
            <ContextMenu.Value>Delete</ContextMenu.Value>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </>
  )
}

/**
 * SimpleDropdownNested: A simple example with a div trigger containing a dropdown menu.
 *
 * Features:
 * - Simple div as ContextMenu trigger
 * - Contains a Dropdown Menu inside the trigger area
 * - Left-click opens Dropdown, right-click opens ContextMenu
 * - Clean and minimal implementation
 *
 * Usage:
 * - Left-click on the trigger to open dropdown menu
 * - Right-click on the trigger to open context menu
 * - Both menus work independently without conflicts
 */
export const SimpleDropdownNested: Story = {
  render: function SimpleDropdownNestedStory() {
    const triggerRef = useRef<HTMLDivElement>(null)

    return (
      <div className="flex h-64 items-center justify-center">
        <div
          ref={triggerRef}
          className="bg-secondary-background rounded-xl border border-dashed p-8"
        >
          <Dropdown>
            <Dropdown.Trigger>
              <Dropdown.Value>Click for Dropdown or Right-click for Context Menu</Dropdown.Value>
            </Dropdown.Trigger>
            <Dropdown.Content>
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
              <Dropdown.Item>
                <Dropdown.Value>Settings</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <ContextMenu triggerRef={triggerRef}>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item variant="danger">
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * Nested context menu in popover
 *
 **/

export const NestedContextMenuInPopover: Story = {
  render: function NestedContextMenuInPopoverStory() {
    const triggerRef = useRef<HTMLDivElement>(null)

    const Item = () => {
      return (
        <>
          <div
            ref={triggerRef}
            className="p-8"
          >
            Right click me for selection menu
          </div>
          <ContextMenu
            disabledNested
            triggerRef={triggerRef}
          >
            <ContextMenu.Content>
              <ContextMenu.Item>
                <ContextMenu.Value>Copy</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <ContextMenu.Value>Cut</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <ContextMenu.Value>Paste</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Divider />
              <ContextMenu.Item variant="danger">
                <ContextMenu.Value>Delete</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </>
      )
    }

    return (
      <>
        <Popover>
          <Popover.Trigger>
            <Button>Open Popover</Button>
          </Popover.Trigger>

          <Popover.Content>
            <Item />
          </Popover.Content>
        </Popover>
      </>
    )
  },
}

/**
 * NestedSubmenuWithLongList: Tests scrolling functionality in nested submenus.
 *
 * This story specifically tests the fix for nested menu scrolling:
 * - First level menu with many items
 * - Nested submenu with a long list that exceeds screen height
 * - Verifies scroll arrows appear correctly
 * - Verifies scrolling works properly in nested menus
 * - Tests height constraints are properly applied
 *
 * Expected behavior:
 * - Nested submenu should show scroll arrows when content exceeds available height
 * - Users should be able to scroll through all items in the nested menu
 * - Menu should not overflow beyond screen boundaries
 * - Scroll arrows should appear/disappear based on scroll position
 *
 * This story validates the fix for nested menu scrolling issues.
 */
export const NestedSubmenuWithLongList: Story = {
  render: function NestedSubmenuWithLongListStory() {
    // Generate a long list of items for testing scrolling
    const longListItems = Array.from({ length: 30 }, (_, i) => ({
      id: `item-${i + 1}`,
      label: `Menu Item ${i + 1}`,
    }))

    return (
      <div className="flex h-screen items-center justify-center">
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="bg-secondary-background rounded-xl border border-dashed p-8 text-center">
              Right click for menu with long nested submenu
              <br />
              <span className="text-body-small text-gray-500">
                Hover over "Long List" to see scrolling submenu
              </span>
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />

            {/* Nested submenu with long list - this should scroll */}
            <ContextMenu>
              <ContextMenu.SubTrigger>
                <ContextMenu.Value>Long List</ContextMenu.Value>
              </ContextMenu.SubTrigger>
              <ContextMenu.Content>
                <ContextMenu.Label>Scrollable Items</ContextMenu.Label>
                {longListItems.map((item) => (
                  <ContextMenu.Item key={item.id}>
                    <ContextMenu.Value>{item.label}</ContextMenu.Value>
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu>

            {/* Another nested submenu with long list for comparison */}
            <ContextMenu>
              <ContextMenu.SubTrigger>
                <ContextMenu.Value>Another Long List</ContextMenu.Value>
              </ContextMenu.SubTrigger>
              <ContextMenu.Content>
                <ContextMenu.Label>Another Scrollable List</ContextMenu.Label>
                {longListItems.slice(0, 25).map((item) => (
                  <ContextMenu.Item key={item.id}>
                    <ContextMenu.Value>{item.label}</ContextMenu.Value>
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu>

            <ContextMenu.Divider />
            <ContextMenu.Item>
              <ContextMenu.Value>Properties</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item variant="danger">
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}
