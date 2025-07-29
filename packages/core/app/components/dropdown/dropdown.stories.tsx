import { Add, FieldTypeAttachment, Search, Settings } from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createEditor, Descendant, Node, Transforms } from "slate"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import { Popover } from "../popover"
import { Dropdown } from "./dropdown"
import { Checkbox } from "../checkbox"

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
      <div className="w-80 space-y-4">
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">🔄 Multiple Dropdown Switching Test</h3>
          <p className="text-secondary-foreground">
            Test scenario: When one dropdown is open, clicking another should close the first and
            open the second in one click.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium">Dropdown 1</h4>
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
            <h4 className="font-medium">Dropdown 2</h4>
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
            <h4 className="font-medium">Dropdown 3</h4>
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
          <h4 className="mb-2 font-medium">Test Instructions:</h4>
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

/**
 * Match trigger width
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
 * Coordinate mode - Dropdown without trigger, positioned at specific coordinates
 * This mode replaces the deprecated CoordinateMenu component
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
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">📍 Coordinate Positioning Mode</h3>
          <p className="text-secondary-foreground">
            This demonstrates the Dropdown component in coordinate mode - no trigger element,
            positioned at specific x/y coordinates. Perfect for context menus, mentions, etc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            value={autoSelectFirstItem}
            onChange={setAutoSelectFirstItem}
          >
            Auto Select First Item
          </Checkbox>
        </div>

        <div
          className="bg-secondary-background relative h-64 rounded-lg border border-dashed p-4"
          onMouseDown={handleClick}
        >
          <p className="text-secondary-foreground text-center">
            Click anywhere in this area to show dropdown at mouse position
          </p>

          {position && (
            <div
              className="text-secondary-foreground fixed z-10 size-4"
              style={{ left: position.x - 8, top: position.y - 8 }}
            >
              <Add />
            </div>
          )}
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
 * Mentions example using coordinate mode with Slate.js editor
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
            const end = { path: [0, 0], offset: lastAtIndex + 1 + afterAtText.length }
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
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">@ Mentions with Slate.js</h3>
          <p className="text-secondary-foreground">
            Type @ to trigger the mentions menu. This uses a simple Slate.js editor with Dropdown in
            coordinate mode.
          </p>
        </div>

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
