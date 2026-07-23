import { Dropdown, Label, Menubar } from "@choice-ui/react"
import { File, Edit, Menu, EllipsisVerticalSmall } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta<typeof Menubar> = {
  title: "Collections/Menubar",
  component: Menubar,
  tags: ["autodocs", "new"],
}

export default meta

type Story = StoryObj<typeof Menubar>

/**
 * Basic: The simplest usage of Menubar.
 *
 * Features:
 * - Horizontal menu bar layout
 * - Click to open menu, hover to switch after opening
 * - Standard menu items and dividers
 * - Icon-only trigger support
 * - Mutually exclusive menu opening (only one open at a time)
 *
 * Use cases:
 * - Application main menu bar
 * - Navigation menus
 * - Command menus
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Menubar className="rounded-lg border p-1">
        <Menubar.Item>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>New</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Open</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Print</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>Edit</Menubar.Trigger>
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
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Zoom In</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Zoom Out</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Full Screen</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Divider />

        <Menubar.Item>
          <Menubar.Trigger className="w-6 justify-center px-0">
            <EllipsisVerticalSmall />
          </Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Print</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Full Screen</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>
      </Menubar>
    )
  },
}

/**
 * Light: Demonstrates Menubar with light variant.
 *
 * Features:
 * - Light background styling for dropdown content
 * - Suitable for dark backgrounds or specific design contexts
 * - All functionality remains the same as default variant
 *
 * Use cases:
 * - Menus on dark backgrounds
 * - Alternative visual styling
 * - Design system consistency
 */
export const Light: Story = {
  render: function LightStory() {
    return (
      <Menubar
        dropdownProps={{ variant: "light" }}
        className="rounded-lg border p-1"
      >
        <Menubar.Item>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>New</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Open</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Print</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>Edit</Menubar.Trigger>
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
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Zoom In</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Zoom Out</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Full Screen</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>Help</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Documentation</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>About</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>
      </Menubar>
    )
  },
}

/**
 * Offset: Demonstrates Menubar with custom dropdown offset.
 *
 * Features:
 * - Custom spacing between trigger and dropdown
 * - Configurable via dropdownProps.offset
 * - Default offset is 4px
 *
 * Use cases:
 * - Adjusting visual spacing
 * - Accommodating different design requirements
 * - Creating visual hierarchy
 */
export const Offset: Story = {
  render: function OffsetStory() {
    return (
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <Label>offset: 0</Label>
          <Menubar
            dropdownProps={{ offset: 0 }}
            className="rounded-lg border p-1"
          >
            <Menubar.Item>
              <Menubar.Trigger>File</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>New</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Open</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
            <Menubar.Item>
              <Menubar.Trigger>Edit</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>Cut</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Copy</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
          </Menubar>
        </div>

        <div className="flex flex-col gap-2">
          <Label>offset: 8</Label>
          <Menubar
            dropdownProps={{ offset: 8 }}
            className="rounded-lg border p-1"
          >
            <Menubar.Item>
              <Menubar.Trigger>File</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>New</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Open</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
            <Menubar.Item>
              <Menubar.Trigger>Edit</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>Cut</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Copy</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
          </Menubar>
        </div>

        <div className="flex flex-col gap-2">
          <Label>offset: 16</Label>
          <Menubar
            dropdownProps={{ offset: 16 }}
            className="rounded-lg border p-1"
          >
            <Menubar.Item>
              <Menubar.Trigger>File</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>New</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Open</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
            <Menubar.Item>
              <Menubar.Trigger>Edit</Menubar.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>Cut</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Copy</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Menubar.Item>
          </Menubar>
        </div>
      </div>
    )
  },
}

/**
 * WithIcons: Demonstrates Menubar with icons.
 *
 * Features:
 * - Icons in Trigger using prefixElement
 * - Consistent menu item styling
 * - Visual recognition enhancement
 * - Mixed icon and text triggers
 *
 * Use cases:
 * - Application menus with visual indicators
 * - Toolbar-style menus
 * - Enhanced user experience
 */
export const WithIcons: Story = {
  render: function WithIconsStory() {
    return (
      <Menubar className="rounded-lg border p-1">
        <Menubar.Item>
          <Menubar.Trigger prefixElement={<File />}>File</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>New File</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Open File</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger prefixElement={<Edit />}>Edit</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Undo</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Redo</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Find</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Editor Layout</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Appearance</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>Help</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Documentation</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Keyboard Shortcuts</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>
      </Menubar>
    )
  },
}

/**
 * WithSubmenus: Demonstrates Menubar with nested submenus.
 *
 * Features:
 * - Support for nested submenus
 * - Hover to trigger submenus
 * - Multi-level menu structure
 * - Keyboard navigation: → key expands submenu, ← key closes submenu
 * - Automatic positioning and overflow handling
 *
 * Use cases:
 * - Complex application menus
 * - Hierarchical command structures
 * - File explorer menus
 */
export const WithSubmenus: Story = {
  render: function WithSubmenusStory() {
    return (
      <Menubar
        className="rounded-lg border p-1"
        dropdownProps={{ openSubmenuOnArrowNavigation: true }}
      >
        <Menubar.Item>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>New</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Open</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>

            <Dropdown>
              <Dropdown.SubTrigger>
                <Dropdown.Value>Export</Dropdown.Value>
              </Dropdown.SubTrigger>
              <Dropdown.Content>
                <Dropdown.Item>
                  <Dropdown.Value>PDF</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>PNG</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>SVG</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>

            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Print</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>View</Menubar.Trigger>
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
                  <Dropdown.Value>Single Page</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Two Pages</Dropdown.Value>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown.Value>Continuous</Dropdown.Value>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>

            <Dropdown.Divider />
            <Dropdown.Item>
              <Dropdown.Value>Full Screen</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>
      </Menubar>
    )
  },
}

/**
 * WithDivider: Demonstrates Menubar with dividers to separate groups.
 *
 * Features:
 * - Visual separation between menu groups
 * - Vertical divider styling
 * - Semantic separation (role="separator")
 * - Customizable via className
 *
 * Use cases:
 * - Grouping related menu items
 * - Separating primary and secondary actions
 * - Creating visual hierarchy in menu bars
 */
export const WithDivider: Story = {
  render: function WithDividerStory() {
    return (
      <Menubar className="rounded-lg border p-1">
        <Menubar.Item>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>New</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Open</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Save</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Item>
          <Menubar.Trigger>Edit</Menubar.Trigger>
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
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Divider />

        <Menubar.Item>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Zoom In</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>Zoom Out</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>

        <Menubar.Divider />

        <Menubar.Item>
          <Menubar.Trigger>Help</Menubar.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Dropdown.Value>Documentation</Dropdown.Value>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.Value>About</Dropdown.Value>
            </Dropdown.Item>
          </Dropdown.Content>
        </Menubar.Item>
      </Menubar>
    )
  },
}

/**
 * Disabled: Demonstrates disabled Menubar functionality.
 *
 * Features:
 * - Entire menubar can be disabled
 * - Individual menu items can be disabled
 * - Keyboard navigation skips disabled items
 * - Visual feedback for disabled states
 * - Useful for conditional availability
 *
 * Use cases:
 * - Conditional menu availability
 * - Permission-based menus
 * - Read-only interfaces
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="flex flex-col gap-4">
        <Menubar
          disabled
          className="rounded-lg border p-1"
        >
          <Menubar.Item>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>New</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Open</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Cut</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
        </Menubar>

        <Menubar className="rounded-lg border p-1">
          <Menubar.Item>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>New</Dropdown.Value>
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.Value>Open</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item disabled>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Cut</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>Zoom In</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>

          <Menubar.Item>
            <Menubar.Trigger>Help</Menubar.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>
                <Dropdown.Value>About</Dropdown.Value>
              </Dropdown.Item>
            </Dropdown.Content>
          </Menubar.Item>
        </Menubar>
      </div>
    )
  },
}
