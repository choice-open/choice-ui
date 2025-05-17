import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ContextMenu } from "."
import React from "react"

const meta: Meta<typeof ContextMenu> = {
  title: "Collections/ContextMenu",
  component: ContextMenu,
}

export default meta
type Story = StoryObj<typeof ContextMenu>

/**
 * The ContextMenu component is a right-click menu component based on Radix UI's Context Menu.
 * It provides a styled context menu that can be triggered by right-clicking on an element.
 *
 * Features:
 * - Multiple menu items, labels, and dividers for organization
 * - Support for nested submenus
 * - Selection mode with visual indicators for selected items
 * - Keyboard shortcut display
 * - Disabled state support
 * - Fully keyboard accessible
 *
 * Usage Guidelines:
 * - Always include both Trigger and Content components
 * - Use Content to wrap all menu items
 * - For nested menus, use Submenu.Trigger and Submenu.Content
 * - Group related items with labels and dividers
 *
 * Accessibility:
 * - Fully keyboard navigable
 * - Screen reader announcements for menu states
 * - ARIA attributes for semantic structure
 */

/**
 * Basic: Demonstrates a simple context menu with items, keyboard shortcuts, and a submenu.
 * Shows the foundational usage pattern with trigger and content elements.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [selectedItem, setSelectedItem] = useState("none")

    return (
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <span>Right-click on the area below to show the context menu</span>
          <div className="mt-2">Selected Item: {selectedItem}</div>
        </div>

        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="flex h-64 w-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
              Right-click me
            </div>
          </ContextMenu.Trigger>

          <ContextMenu.Content>
            <ContextMenu.Item
              onClick={() => setSelectedItem("Cut")}
              shortcut={{
                modifier: "command",
                keys: "X",
              }}
            >
              <ContextMenu.Value>Cut</ContextMenu.Value>
            </ContextMenu.Item>

            <ContextMenu.Item
              onClick={() => setSelectedItem("Copy")}
              shortcut={{
                modifier: "command",
                keys: "C",
              }}
            >
              <ContextMenu.Value>Copy</ContextMenu.Value>
            </ContextMenu.Item>

            <ContextMenu.Item
              onClick={() => setSelectedItem("Paste")}
              shortcut={{
                modifier: "command",
                keys: "V",
              }}
            >
              <ContextMenu.Value>Paste</ContextMenu.Value>
            </ContextMenu.Item>

            <ContextMenu.Divider />

            <ContextMenu.Submenu>
              <ContextMenu.Submenu.Trigger>
                <ContextMenu.Value>Sort Options</ContextMenu.Value>
              </ContextMenu.Submenu.Trigger>
              <ContextMenu.Submenu.Content>
                <ContextMenu.Item onClick={() => setSelectedItem("Sort by Name")}>
                  <ContextMenu.Value>Sort by Name</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item onClick={() => setSelectedItem("Sort by Date")}>
                  <ContextMenu.Value>Sort by Date</ContextMenu.Value>
                </ContextMenu.Item>
                <ContextMenu.Item onClick={() => setSelectedItem("Sort by Size")}>
                  <ContextMenu.Value>Sort by Size</ContextMenu.Value>
                </ContextMenu.Item>
              </ContextMenu.Submenu.Content>
            </ContextMenu.Submenu>

            <ContextMenu.Divider />

            <ContextMenu.Item
              disabled
              onClick={() => setSelectedItem("Delete")}
              shortcut={{
                modifier: "command",
                keys: "⌫",
              }}
            >
              <ContextMenu.Value>Delete (Disabled)</ContextMenu.Value>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * WithSelection: Demonstrates the selection mode feature.
 * When selection={true} is set, the selected prop on items will display a checkmark.
 * Useful for multi-select menus or indicating the currently active option.
 */
export const WithSelection: Story = {
  render: function WithSelectionStory() {
    const options = [
      { id: "1", label: "Option 1" },
      { id: "2", label: "Option 2" },
      { id: "3", label: "Option 3" },
    ]

    const [selectedOption, setSelectedOption] = useState(options[0].id)

    return (
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <span>Right-click on the area below to show the context menu with selection</span>
          <div className="mt-2">
            Selected Option: {options.find((o) => o.id === selectedOption)?.label}
          </div>
        </div>

        <ContextMenu selection={true}>
          <ContextMenu.Trigger>
            <div className="flex h-64 w-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
              Right-click to select an option
            </div>
          </ContextMenu.Trigger>

          <ContextMenu.Content>
            <ContextMenu.Label>Options</ContextMenu.Label>
            {options.map((option) => (
              <ContextMenu.Item
                key={option.id}
                selected={option.id === selectedOption}
                onClick={() => setSelectedOption(option.id)}
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
 * SelectionWithSubmenus: Demonstrates selection mode with nested submenus.
 * Shows how to organize complex menu hierarchies while maintaining selection state.
 * Each submenu has its own content wrapper to maintain proper structure.
 */
export const SelectionWithSubmenus: Story = {
  render: function SelectionWithSubmenusStory() {
    const categories = [
      { id: "files", label: "Files" },
      { id: "edit", label: "Edit" },
      { id: "view", label: "View" },
    ]

    const fileOptions = [
      { id: "new", label: "New File" },
      { id: "open", label: "Open File" },
      { id: "save", label: "Save" },
    ]

    const editOptions = [
      { id: "cut", label: "Cut" },
      { id: "copy", label: "Copy" },
      { id: "paste", label: "Paste" },
    ]

    const viewOptions = [
      { id: "explorer", label: "Explorer" },
      { id: "search", label: "Search" },
      { id: "debug", label: "Debug" },
    ]

    const [selectedCategory, setSelectedCategory] = useState("files")
    const [selectedFileOption, setSelectedFileOption] = useState("new")
    const [selectedEditOption, setSelectedEditOption] = useState("copy")
    const [selectedViewOption, setSelectedViewOption] = useState("explorer")

    return (
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <span>Right-click on the area below to show nested menus with selection</span>
          <div className="mt-2">
            <div>Selected Category: {categories.find((c) => c.id === selectedCategory)?.label}</div>
            <div>
              Selected File Option: {fileOptions.find((o) => o.id === selectedFileOption)?.label}
            </div>
            <div>
              Selected Edit Option: {editOptions.find((o) => o.id === selectedEditOption)?.label}
            </div>
            <div>
              Selected View Option: {viewOptions.find((o) => o.id === selectedViewOption)?.label}
            </div>
          </div>
        </div>

        <ContextMenu selection={true}>
          <ContextMenu.Trigger>
            <div className="flex h-64 w-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
              Right-click to see nested menus with selection
            </div>
          </ContextMenu.Trigger>

          <ContextMenu.Content>
            <ContextMenu.Label>Categories</ContextMenu.Label>
            {categories.map((category) => (
              <ContextMenu.Item
                key={category.id}
                selected={category.id === selectedCategory}
                onClick={() => setSelectedCategory(category.id)}
              >
                <ContextMenu.Value>{category.label}</ContextMenu.Value>
              </ContextMenu.Item>
            ))}

            <ContextMenu.Divider />

            <ContextMenu.Label>Submenus</ContextMenu.Label>

            <ContextMenu.Submenu>
              <ContextMenu.Submenu.Trigger>
                <ContextMenu.Value>Files</ContextMenu.Value>
              </ContextMenu.Submenu.Trigger>
              <ContextMenu.Submenu.Content>
                <ContextMenu.Label>File Actions</ContextMenu.Label>
                {fileOptions.map((option) => (
                  <ContextMenu.Item
                    key={option.id}
                    selected={option.id === selectedFileOption}
                    onClick={() => setSelectedFileOption(option.id)}
                  >
                    <ContextMenu.Value>{option.label}</ContextMenu.Value>
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Submenu.Content>
            </ContextMenu.Submenu>

            <ContextMenu.Submenu>
              <ContextMenu.Submenu.Trigger>
                <ContextMenu.Value>Edit</ContextMenu.Value>
              </ContextMenu.Submenu.Trigger>
              <ContextMenu.Submenu.Content>
                <ContextMenu.Label>Edit Actions</ContextMenu.Label>
                {editOptions.map((option) => (
                  <ContextMenu.Item
                    key={option.id}
                    selected={option.id === selectedEditOption}
                    onClick={() => setSelectedEditOption(option.id)}
                  >
                    <ContextMenu.Value>{option.label}</ContextMenu.Value>
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Submenu.Content>
            </ContextMenu.Submenu>

            <ContextMenu.Submenu>
              <ContextMenu.Submenu.Trigger>
                <ContextMenu.Value>View</ContextMenu.Value>
              </ContextMenu.Submenu.Trigger>
              <ContextMenu.Submenu.Content>
                <ContextMenu.Label>View Options</ContextMenu.Label>
                {viewOptions.map((option) => (
                  <ContextMenu.Item
                    key={option.id}
                    selected={option.id === selectedViewOption}
                    onClick={() => setSelectedViewOption(option.id)}
                  >
                    <ContextMenu.Value>{option.label}</ContextMenu.Value>
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Submenu.Content>
            </ContextMenu.Submenu>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    )
  },
}

/**
 * AlignedLabels: Demonstrates proper label alignment in both selection and non-selection modes.
 * Shows how labels and items are properly spaced to accommodate selection indicators.
 */
export const AlignedLabels: Story = {
  render: function AlignedLabelsStory() {
    const [selectedInSection1, setSelectedInSection1] = useState("item1")
    const [selectedInSection2, setSelectedInSection2] = useState("item2")

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">With Selection</h3>
            <p className="text-secondary-foreground text-sm">
              Labels are aligned with menu items, with space for icons
            </p>
          </div>

          <ContextMenu selection={true}>
            <ContextMenu.Trigger>
              <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                Right-click to see aligned labels (with selection)
              </div>
            </ContextMenu.Trigger>

            <ContextMenu.Content>
              <ContextMenu.Label>Section 1</ContextMenu.Label>
              <ContextMenu.Item
                selected={selectedInSection1 === "item1"}
                onClick={() => setSelectedInSection1("item1")}
              >
                <ContextMenu.Value>Item 1</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item
                selected={selectedInSection1 === "item2"}
                onClick={() => setSelectedInSection1("item2")}
              >
                <ContextMenu.Value>Item 2</ContextMenu.Value>
              </ContextMenu.Item>

              <ContextMenu.Divider />

              <ContextMenu.Label>Section 2</ContextMenu.Label>
              <ContextMenu.Item
                selected={selectedInSection2 === "item1"}
                onClick={() => setSelectedInSection2("item1")}
              >
                <ContextMenu.Value>Item 1</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item
                selected={selectedInSection2 === "item2"}
                onClick={() => setSelectedInSection2("item2")}
              >
                <ContextMenu.Value>Item 2</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>

        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Without Selection</h3>
            <p className="text-secondary-foreground text-sm">Labels without additional spacing</p>
          </div>

          <ContextMenu selection={false}>
            <ContextMenu.Trigger>
              <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                Right-click to see aligned labels (without selection)
              </div>
            </ContextMenu.Trigger>

            <ContextMenu.Content>
              <ContextMenu.Label>Section 1</ContextMenu.Label>
              <ContextMenu.Item onClick={() => {}}>
                <ContextMenu.Value>Item 1</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item onClick={() => {}}>
                <ContextMenu.Value>Item 2</ContextMenu.Value>
              </ContextMenu.Item>

              <ContextMenu.Divider />

              <ContextMenu.Label>Section 2</ContextMenu.Label>
              <ContextMenu.Item onClick={() => {}}>
                <ContextMenu.Value>Item 1</ContextMenu.Value>
              </ContextMenu.Item>
              <ContextMenu.Item onClick={() => {}}>
                <ContextMenu.Value>Item 2</ContextMenu.Value>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
        </div>
      </div>
    )
  },
}

/**
 * ComparisonWithAndWithoutSelection: Demonstrates the visual difference between menus with and without selection mode.
 * Useful for understanding how selection affects the appearance and behavior of menu items.
 */
export const ComparisonWithAndWithoutSelection: Story = {
  render: function ComparisonStory() {
    const options = [
      { id: "1", label: "Option 1" },
      { id: "2", label: "Option 2" },
      { id: "3", label: "Option 3" },
    ]

    const [selectedOption1, setSelectedOption1] = useState(options[0].id)
    const [selectedOption2, setSelectedOption2] = useState(options[0].id)

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">With Selection</h3>
            <p className="text-secondary-foreground text-sm">
              selection={"{true}"} - Shows checkmarks on selected items
            </p>
            <div className="mt-2">
              Selected: {options.find((o) => o.id === selectedOption1)?.label}
            </div>
          </div>

          <ContextMenu selection={true}>
            <ContextMenu.Trigger>
              <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                Right-click me (with selection)
              </div>
            </ContextMenu.Trigger>

            <ContextMenu.Content>
              {options.map((option) => (
                <ContextMenu.Item
                  key={option.id}
                  selected={option.id === selectedOption1}
                  onClick={() => setSelectedOption1(option.id)}
                >
                  <ContextMenu.Value>{option.label}</ContextMenu.Value>
                </ContextMenu.Item>
              ))}
            </ContextMenu.Content>
          </ContextMenu>
        </div>

        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Without Selection</h3>
            <p className="text-secondary-foreground text-sm">
              selection={"{false}"} - No checkmarks shown
            </p>
            <div className="mt-2">
              Selected: {options.find((o) => o.id === selectedOption2)?.label}
            </div>
          </div>

          <ContextMenu selection={false}>
            <ContextMenu.Trigger>
              <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                Right-click me (without selection)
              </div>
            </ContextMenu.Trigger>

            <ContextMenu.Content>
              {options.map((option) => (
                <ContextMenu.Item
                  key={option.id}
                  selected={option.id === selectedOption2}
                  onClick={() => setSelectedOption2(option.id)}
                >
                  <ContextMenu.Value>{option.label}</ContextMenu.Value>
                </ContextMenu.Item>
              ))}
            </ContextMenu.Content>
          </ContextMenu>
        </div>
      </div>
    )
  },
}
