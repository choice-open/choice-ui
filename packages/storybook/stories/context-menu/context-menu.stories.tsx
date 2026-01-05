import { Button, Checkbox, ContextMenu, Dropdown, Label, Popover } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useRef, useState } from "react"

const meta: Meta<typeof ContextMenu> = {
  title: "Collections/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
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
 * - Uses floating-ui/react for positioning and interactions
 * - Fully reuses Dropdown sub-components (Content, Item, etc.)
 * - Supports all standard menu features like dividers and variants
 *
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="bg-secondary-background select-none rounded-xl border border-dashed p-8">
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
 * - Supports both ContextMenu.Trigger and triggerRef approaches
 *
 * Implementation:
 * - Set disabled={true} to prevent context menu activation
 * - Can use CSS selectors like [data-disabled] for styling
 * - Both Trigger and triggerRef approaches support disabled state
 */
export const WithDisabled: Story = {
  render: function WithDisabledStory() {
    const [isDisabled, setIsDisabled] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)

    return (
      <div className="space-y-4">
        <Checkbox
          value={isDisabled}
          onChange={setIsDisabled}
        >
          Disable context menu
        </Checkbox>

        <div className="flex gap-8">
          {/* Using ContextMenu.Trigger */}
          <div className="flex flex-col gap-2">
            <Label>Using ContextMenu.Trigger</Label>
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
          <div className="flex flex-col gap-2">
            <Label>Using triggerRef</Label>
            <div
              ref={triggerRef}
              className="bg-secondary-background rounded-xl border border-dashed p-8"
            >
              {isDisabled ? "Context menu disabled" : "Right click me"}
            </div>

            <ContextMenu
              disabled={isDisabled}
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
          </div>
        </div>
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
    )
  },
}

/**
 * LightVariant: Demonstrates ContextMenu with light variant styling.
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
      <ContextMenu variant="light">
        <ContextMenu.Trigger>
          <div className="bg-secondary-background rounded-xl border border-dashed p-8">
            Right click for light variant context menu
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>
            <ContextMenu.Value>Copy</ContextMenu.Value>
          </ContextMenu.Item>
          <ContextMenu.Item>
            <ContextMenu.Value>Cut</ContextMenu.Value>
          </ContextMenu.Item>
          <ContextMenu.Divider />
          <ContextMenu.Item variant="danger">
            <ContextMenu.Value>Delete</ContextMenu.Value>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    )
  },
}

/**
 * Shows complex menu structure with labels and dividers.
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
export const WithLabelsAndDividers: Story = {
  render: function WithLabelsAndDividersStory() {
    return (
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
 * Use cases:
 * - Radio button-like selection in menus
 * - Theme or preference selection
 * - Single-choice menu scenarios
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
      <ContextMenu selection={true}>
        <ContextMenu.Trigger>
          <div className="bg-secondary-background select-none rounded-xl border border-dashed p-8">
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
    )
  },
}

/**
 * ContextMenuNestedDropdown: Demonstrates ContextMenu and Dropdown working together using triggerRef.
 *
 * Features:
 * - Left-click opens Dropdown menu
 * - Right-click opens ContextMenu
 * - Both menus share the same trigger element
 * - No component wrapping conflicts
 * - Uses triggerRef to avoid nesting issues
 *
 * Use cases:
 * - Elements that need both click and right-click menus
 * - Complex UI interactions requiring multiple menu types
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
      <div className="flex items-center justify-center">
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
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="bg-secondary-background rounded-xl border border-dashed p-8 text-center">
            Right click for menu with long nested submenu
            <br />
            <span className="text-body-small text-gray-500">
              Hover over &quot;Long List&quot; to see scrolling submenu
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
    )
  },
}

/**
 * NestedContextMenuInPopover: Demonstrates ContextMenu nested inside a Popover component.
 *
 * Features:
 * - ContextMenu works within Popover content
 * - Uses triggerRef to bind context menu to element
 * - disabledNested prop prevents nested menu conflicts
 * - Right-click opens context menu inside popover
 *
 * Use cases:
 * - Rich popover content with context menu support
 * - Complex UI interactions within modal/popover contexts
 */
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
      <div className="flex items-center justify-center">
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
 * WithTriggerSelector: Demonstrates using triggerSelector (CSS selector) instead of triggerRef.
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
    return (
      <div className="flex gap-8">
        {/* Using id selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using #id selector</p>
          <div
            id="context-menu-trigger-by-id"
            className="bg-secondary-background rounded-lg border border-dashed p-8"
          >
            Right click me (id selector)
          </div>
          <ContextMenu triggerSelector="#context-menu-trigger-by-id">
            <ContextMenu.Content>
              <ContextMenu.Label>ID Selector Menu</ContextMenu.Label>
              <ContextMenu.Item>
                <ContextMenu.Value>Action 1</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <ContextMenu.Value>Action 2</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>

        {/* Using class selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using .class selector</p>
          <div className="context-menu-trigger-by-class bg-secondary-background rounded-lg border border-dashed p-8">
            Right click me (class selector)
          </div>
          <ContextMenu triggerSelector=".context-menu-trigger-by-class">
            <ContextMenu.Content>
              <ContextMenu.Label>Class Selector Menu</ContextMenu.Label>
              <ContextMenu.Item>
                <ContextMenu.Value>Option A</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <ContextMenu.Value>Option B</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>

        {/* Using data attribute selector */}
        <div>
          <p className="text-body-small-strong mb-2">Using [data-*] selector</p>
          <div
            data-context-trigger="custom"
            className="bg-secondary-background rounded-lg border border-dashed p-8"
          >
            Right click me (data-* selector)
          </div>
          <ContextMenu triggerSelector="[data-context-trigger='custom']">
            <ContextMenu.Content>
              <ContextMenu.Label>Data Attribute Menu</ContextMenu.Label>
              <ContextMenu.Item>
                <ContextMenu.Value>Item X</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <ContextMenu.Value>Item Y</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>
      </div>
    )
  },
}

/**
 * SharedMenuContent: Demonstrates how to share menu content between Dropdown and ContextMenu.
 *
 * Features:
 * - Same menu content works in both Dropdown and ContextMenu
 * - Uses Dropdown components (Content, Item, etc.) for compatibility
 * - Reduces code duplication and ensures consistency
 * - Demonstrates the "write once, use everywhere" approach
 *
 * Business value:
 * - Complete component reuse between Dropdown and ContextMenu
 * - ContextMenu internally reuses all Dropdown sub-components
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
      <div className="flex flex-col gap-8">
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
 * [TEST] SimpleDropdownNested: Demonstrates ContextMenu and Dropdown nested together with a shared trigger.
 *
 * Features:
 * - Simple div as shared trigger element
 * - Contains a Dropdown Menu inside the trigger area
 * - Left-click opens Dropdown, right-click opens ContextMenu
 * - Both menus work independently without conflicts
 * - Clean and minimal implementation using triggerRef
 *
 * Use cases:
 * - Elements that need both click and right-click menus
 * - Simple nested menu scenarios
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
 * [TEST] FileManagerExample: Real-world example showing menu sharing in a file manager scenario.
 *
 * Features:
 * - Same file operations available in toolbar dropdown and right-click menu
 * - Identical functionality in both interaction patterns
 * - Dynamic menu content based on data
 * - Action callbacks with logging
 * - Demonstrates practical component reuse
 *
 * Business value:
 * - Ensures consistent user experience across interaction methods
 * - Reduces development and maintenance overhead
 * - Write once, use everywhere approach
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
 * [TEST] Readonly: Demonstrates ContextMenu in readOnly state.
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

    const handleClick = () => {
      setClickCount((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-stone-50 p-4">
          <div className="text-body-small-strong mb-2 text-stone-700">Click Count:</div>
          <div className="text-body-small font-mono text-stone-600">{clickCount}</div>
        </div>

        <ContextMenu readOnly>
          <ContextMenu.Trigger className="rounded-lg border p-8">
            Right-click here (readOnly mode)
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item onClick={handleClick}>
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item onClick={handleClick}>
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Item onClick={handleClick}>
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item onClick={handleClick}>
              <ContextMenu.Value>Delete</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>

        <div className="text-body-small text-stone-600">
          💡 Right-click and try clicking on menu items - the click count should not change. The
          menu can still be opened and closed normally.
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
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="bg-secondary-background select-none rounded-xl border border-dashed p-8">
            Right click me to open context menu
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          {items.length > 0 ? (
            items.map((item) => (
              <ContextMenu.Item key={item.id}>
                <ContextMenu.Value>{item.label}</ContextMenu.Value>
              </ContextMenu.Item>
            ))
          ) : (
            <ContextMenu.Empty>No actions available</ContextMenu.Empty>
          )}
        </ContextMenu.Content>
      </ContextMenu>
    )
  },
}
