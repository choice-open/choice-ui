import { FieldTypeAttachment, Search, Settings } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useMemo, useState } from "react"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import { Dropdown } from "./dropdown"
import { Popover } from "../popover"

const meta: Meta<typeof Dropdown> = {
  title: "Collections/Dropdown",
  component: Dropdown,
  tags: ["upgrade", "autodocs"],
}

export default meta
type Story = StoryObj<typeof Dropdown>

/**
 * Basic dropdown with simple menu items using the new MenuContext system.
 *
 * Features:
 * - Enhanced MenuContextItem components
 * - Unified interaction handling
 * - Improved keyboard navigation
 * - Better event handling with useEventCallback
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
 * Dropdown with prefix icons for better visual recognition.
 */
export const WithPrefix: Story = {
  render: function WithPrefixStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger prefixElement={<FieldTypeAttachment />}>
          <Dropdown.Value>File Actions</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>
            <FieldTypeAttachment />
            <Dropdown.Value>Attach File</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Item>
            <Search />
            <Dropdown.Value>Search Files</Dropdown.Value>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Settings />
            <Dropdown.Value>File Settings</Dropdown.Value>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )
  },
}

/**
 * Custom trigger using asChild pattern for complete control.
 */
export const TriggerAsChild: Story = {
  render: function TriggerAsChildStory() {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <IconButton variant="default">
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
 * Nested dropdown menus showcasing the enhanced FloatingTree support.
 *
 * Features:
 * - Multiple levels of nesting
 * - Automatic submenu positioning
 * - Hover-based submenu activation
 * - Tree event management for proper closing
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
 * Nested dropdown in `Popover` or `Dialog`
 *
 * Note: When using Dropdown nested inside a Popover or Dialog, you must pass the
 * `disabledNested={true}` prop to ensure proper rendering.
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
 * Selection dropdown with visual indicators using the MenuContext system.
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
 * Nested dropdown with selection functionality in submenus.
 */
export const NestedSelection: Story = {
  render: function NestedSelectionStory() {
    const [mainSelected, setMainSelected] = useState<string | null>(null)
    const [subSelected, setSubSelected] = useState<string | null>(null)

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <Dropdown.Value>Multi-Level Selection</Dropdown.Value>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Main Options</Dropdown.Label>
          {["Main 1", "Main 2"].map((option) => (
            <Dropdown.Item
              key={option}
              selected={mainSelected === option}
              onClick={() => setMainSelected(option)}
            >
              <Dropdown.Value>{option}</Dropdown.Value>
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown selection={true}>
            <Dropdown.SubTrigger>
              <Dropdown.Value>Sub Options</Dropdown.Value>
            </Dropdown.SubTrigger>
            <Dropdown.Content>
              <Dropdown.Label>Choose Sub Option</Dropdown.Label>
              {["Sub A", "Sub B", "Sub C"].map((option) => (
                <Dropdown.Item
                  key={option}
                  selected={subSelected === option}
                  onClick={() => setSubSelected(option)}
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

const MODIFIERS = [
  "command",
  "shift",
  "ctrl",
  "option",
  "enter",
  "delete",
  "escape",
  "tab",
] as const
const KEYS = ["Enter", "Space", "Tab", "Escape", "A", "B", "C", "D", "E"] as const

/**
 * Dropdown with keyboard shortcuts displayed.
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
              modifier: "shift",
              keys: "Command+Z",
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
 * Dropdown with disabled states for both trigger and items.
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
 * Dropdown with search functionality and empty states.
 */
export const WithSearch: Story = {
  render: function WithSearchStory() {
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<string[]>([])

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

    return (
      <Dropdown selection={true}>
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
 * Dropdown with labels and organized sections.
 */
export const WithLabels: Story = {
  render: function WithLabelsStory() {
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
 * Long list demonstrating scrolling behavior and performance.
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
 * Multiple dropdowns testing proper event handling and switching.
 */
export const MultipleDropdowns: Story = {
  render: function MultipleDropdownsStory() {
    const [dropdown1Open, setDropdown1Open] = useState(false)
    const [dropdown2Open, setDropdown2Open] = useState(false)
    const [dropdown3Open, setDropdown3Open] = useState(false)

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">
            🔄 Multiple Dropdown Switching Test
          </h3>
          <p className="text-sm text-blue-800">
            Test scenario: When one dropdown is open, clicking another should close the first and
            open the second in one click.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium">Dropdown 1</h4>
            <div className="text-sm text-gray-600">Status: {dropdown1Open ? "Open" : "Closed"}</div>
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
            <h4 className="font-medium">Dropdown 2</h4>
            <div className="text-sm text-gray-600">Status: {dropdown2Open ? "Open" : "Closed"}</div>
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
            <h4 className="font-medium">Dropdown 3</h4>
            <div className="text-sm text-gray-600">Status: {dropdown3Open ? "Open" : "Closed"}</div>
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

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-2 font-medium">Test Instructions:</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
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
 * Dropdown with different placement options.
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
 * Advanced example showing complex menu structure with mixed features.
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

export const Large: Story = {
  render: function LargeStory() {
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
