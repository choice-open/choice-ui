import { List } from "@choice-ui/react"
import {
  Check,
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeDate,
  FieldTypeLongText,
  FieldTypeSingleSelect,
  File,
  Folder,
  House,
  Settings,
  ViewCalendar,
} from "@choiceform/icons-react"
import { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"

const meta: Meta<typeof List> = {
  title: "Collections/List",
  component: List,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof List>

/**
 * A basic list with simple text items.
 *
 * Use the `List` component with `List.Content` and `List.Item` for a simple list.
 */
export const Basic: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with icon prefixes for each item.
 *
 * Use the `prefixElement` prop to add icons or other elements at the beginning of list items.
 */
export const WithIcons: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<File />}>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with primary variant.
 *
 * Use the `variant` prop to make the list items primary.
 *
 * ```tsx
 * <List variant="primary">...</List>
 * ```
 */
export const Variant: Story = {
  render: () => (
    <List
      className="w-64"
      variant="primary"
    >
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<File />}>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with sections and dividers.
 *
 * Use `List.Label` to add section titles and `List.Divider` to separate sections.
 *
 * ```tsx
 * <List>
 *   <List.Label>Navigation</List.Label>
 *   <List.Content>...</List.Content>
 *   <List.Divider />
 *   <List.Label>System</List.Label>
 *   <List.Content>...</List.Content>
 * </List>
 * ```
 */
export const WithLabelsAndDividers: Story = {
  render: () => (
    <List className="w-64">
      <List.Label>Navigation</List.Label>
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<File />}>
          <List.Value>Documents</List.Value>
        </List.Item>
      </List.Content>
      <List.Divider />
      <List.Label>System</List.Label>
      <List.Content>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with collapsible nested items.
 *
 * Use `List.SubTrigger` to create a collapsible section and `parentId` on nested content to link them together.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.Item>
 *       <List.Value>Home</List.Value>
 *     </List.Item>
 *     <List.SubTrigger id="docs">
 *       <List.Value>Documents</List.Value>
 *     </List.SubTrigger>
 *     <List.Content parentId="docs">...</List.Content>
 *     <List.Item>
 *       <List.Value>Calendar</List.Value>
 *     </List.Item>
 *   </List.Content>
 * </List>
 * ```
 */
export const NestedList: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.SubTrigger
          id="docs"
          prefixElement={<Folder />}
        >
          <List.Value>Documents</List.Value>
        </List.SubTrigger>
        <List.Content parentId="docs">
          <List.Item parentId="docs">
            <List.Value>Getting Started</List.Value>
          </List.Item>
          <List.Item parentId="docs">
            <List.Value>Components</List.Value>
          </List.Item>
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>API Reference</List.Value>
          </List.Item>
        </List.Content>
        <List.Item prefixElement={<ViewCalendar />}>
          <List.Value>Calendar</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with large size.
 *
 * Use the `size` prop to make the list items large.
 *
 * ```tsx
 * <List size="large">...</List>
 * ```
 */
export const Size: Story = {
  render: () => (
    <List
      className="w-64"
      size="large"
    >
      <List.Label>Navigation</List.Label>
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<File />}>
          <List.Value>Documents</List.Value>
        </List.Item>
      </List.Content>
      <List.Divider />
      <List.Label>System</List.Label>
      <List.Content>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with pre-expanded nested content.
 *
 * Use the `defaultOpen` prop on `List.SubTrigger` to make nested content visible by default.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.Item>
 *       <List.Value>Home</List.Value>
 *     </List.Item>
 *     <List.SubTrigger id="docs" defaultOpen>
 *       <List.Value>Documents</List.Value>
 *     </List.SubTrigger>
 *     <List.Content parentId="docs">...</List.Content>
 *     <List.Item>
 *       <List.Value>Calendar</List.Value>
 *     </List.Item>
 *   </List.Content>
 * </List>
 * ```
 */
export const DefaultOpenNestedList: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.SubTrigger
          id="docs"
          prefixElement={<Folder />}
          defaultOpen
        >
          <List.Value>Documents</List.Value>
        </List.SubTrigger>
        <List.Content parentId="docs">
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>Getting Started</List.Value>
          </List.Item>
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>Components</List.Value>
          </List.Item>
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>API Reference</List.Value>
          </List.Item>
        </List.Content>
        <List.Item prefixElement={<ViewCalendar />}>
          <List.Value>Calendar</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with indentation reference lines for better visualization of the nesting structure.
 *
 * Use the `shouldShowReferenceLine` prop on the List component to display vertical reference lines that help
 * visualize the hierarchical structure.
 */
export const WithReferenceLines: Story = {
  render: () => {
    // Function to create nested items recursively
    const createNestedItems = (level: number, parentId: string = "", maxDepth: number = 5) => {
      // Stop recursion when reaching the maximum depth
      if (level > maxDepth) return null

      const currentId = parentId ? `${parentId}-level${level}` : `level${level}`
      const items: React.ReactNode[] = []

      // Create title for the current level
      items.push(
        <List.SubTrigger
          key={`trigger-${currentId}`}
          id={currentId}
          parentId={parentId || undefined}
          prefixElement={<Folder />}
          defaultOpen={level <= 3} // Default open for the first three levels
        >
          <List.Value>{`Level ${level} Folder`}</List.Value>
        </List.SubTrigger>,
      )

      // Create content container for the current level
      items.push(
        <List.Content
          key={`content-${currentId}`}
          parentId={currentId}
        >
          {/* Add some file items for the current level */}
          {[1, 2].map((fileIndex) => (
            <List.Item
              key={`file-${currentId}-${fileIndex}`}
              parentId={currentId}
              prefixElement={<File />}
            >
              <List.Value>{`File ${fileIndex} (Level ${level})`}</List.Value>
            </List.Item>
          ))}

          {/* Recursively create the next level */}
          {level < maxDepth && createNestedItems(level + 1, currentId, maxDepth)}
        </List.Content>,
      )

      return items
    }

    return (
      <List
        className="w-64"
        shouldShowReferenceLine
      >
        <List.Content>
          <List.Item prefixElement={<House />}>
            <List.Value>Home</List.Value>
          </List.Item>

          {/* Create nested items from level 1 */}
          {createNestedItems(1)}

          <List.Item prefixElement={<ViewCalendar />}>
            <List.Value>Calendar</List.Value>
          </List.Item>
        </List.Content>
      </List>
    )
  },
}

/**
 * A list with keyboard shortcut hints.
 *
 * Use the `shortcut` prop to display keyboard shortcuts next to list items.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.Item shortcut={{ keys: "H" }}>
 *       <List.Value>Home</List.Value>
 *     </List.Item>
 *     <List.Item shortcut={{ keys: "D" }}>
 *       <List.Value>Documents</List.Value>
 *     </List.Item>
 *     <List.Item shortcut={{ modifier: "command", keys: "," }}>
 *       <List.Value>Settings</List.Value>
 *     </List.Item>
 *   </List.Content>
 * </List>
 * ```
 */
export const WithShortcuts: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item
          prefixElement={<House />}
          shortcut={{ keys: "H" }}
        >
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<File />}
          shortcut={{ keys: "D" }}
        >
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<Settings />}
          shortcut={{ modifier: "command", keys: "," }}
        >
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with selection functionality.
 *
 * Use the `selection` prop on the List component to enable selection functionality. This example
 * demonstrates radio-like behavior (single selection) with ability to deselect.
 *
 * NOTE: This example uses a custom implementation to override the component's internal selection state.
 */
export const WithSelectionEnabled: Story = {
  render: function WithSelectionEnabled(args) {
    // Use useState to manage the selected item ID, null means no selection
    const [selectedId, setSelectedId] = useState<string | null>("doc1")

    // Handle click events, implement single selection and deselection logic
    const handleItemClick = (id: string) => {
      // If the clicked item is already selected, deselect it
      if (selectedId === id) {
        setSelectedId(null)
      } else {
        // Otherwise, select the clicked item
        setSelectedId(id)
      }
    }

    // To fully control the selection state, we do not enable the built-in selection functionality of the List component
    // Instead, we manually add a check icon to the selected items
    const getItemPrefixElement = (id: string) => {
      return selectedId === id ? <Check /> : <></>
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="text-secondary-foreground bg-secondary-background rounded-lg p-2">
          Selected item: {selectedId || "None"}
        </div>
        {/* Do not enable the built-in selection functionality, completely controlled by external state */}
        <List className="w-64">
          <List.Label>Radio-like selection with toggle</List.Label>
          <List.Content>
            <List.Item
              id="doc1"
              prefixElement={getItemPrefixElement("doc1")}
              onClick={() => handleItemClick("doc1")}
            >
              <List.Value>document1.txt</List.Value>
            </List.Item>
            <List.Item
              id="doc2"
              prefixElement={getItemPrefixElement("doc2")}
              onClick={() => handleItemClick("doc2")}
            >
              <List.Value>document2.txt</List.Value>
            </List.Item>
            <List.Item
              id="doc3"
              prefixElement={getItemPrefixElement("doc3")}
              onClick={() => handleItemClick("doc3")}
            >
              <List.Value>document3.txt</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>
    )
  },
}

/**
 * A list with disabled items.
 *
 * Use the `disabled` prop to make items non-interactive.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.Item disabled>
 *       <List.Value>Mail (Maintenance)</List.Value>
 *     </List.Item>
 *   </List.Content>
 * </List>
 * ```
 */
export const WithDisabledItems: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<File />}
          disabled
        >
          <List.Value>Mail (Maintenance)</List.Value>
        </List.Item>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A nested list with non-collapsible sub-sections.
 *
 * Use the `disableCollapse` prop on `List.SubTrigger` to prevent toggling of the sub-list.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.SubTrigger id="docs" defaultOpen disableCollapse>
 *       <List.Value>Documents</List.Value>
 *     </List.SubTrigger>
 *     <List.Content parentId="docs">...</List.Content>
 *   </List.Content>
 * </List>
 * ```
 */
export const NonCollapsibleNestedList: Story = {
  render: () => (
    <List className="w-64">
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.SubTrigger
          id="docs"
          prefixElement={<Folder />}
          defaultOpen
          disableCollapse
        >
          <List.Value>Documents</List.Value>
        </List.SubTrigger>
        <List.Content parentId="docs">
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>Getting Started</List.Value>
          </List.Item>
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>Components</List.Value>
          </List.Item>
          <List.Item
            parentId="docs"
            prefixElement={<File />}
          >
            <List.Value>API Reference</List.Value>
          </List.Item>
        </List.Content>
        <List.Item prefixElement={<ViewCalendar />}>
          <List.Value>Calendar</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with multiple levels of nesting.
 *
 * You can create deeply nested structures by using multiple layers of `List.SubTrigger` and `List.Content` with appropriate `parentId` props.
 */
export const MultiLevelNestedList: Story = {
  render: () => {
    // Function to create nested items recursively
    const createNestedItems = (level: number, parentId: string = "", maxDepth: number = 5) => {
      // Stop recursion when reaching the maximum depth
      if (level > maxDepth) return null

      const currentId = parentId ? `${parentId}-level${level}` : `level${level}`
      const items: React.ReactNode[] = []

      // Create title for the current level
      items.push(
        <List.SubTrigger
          key={`trigger-${currentId}`}
          id={currentId}
          parentId={parentId || undefined}
          prefixElement={<Folder />}
          defaultOpen={level <= 2} // Default open for the first two levels
        >
          <List.Value>{`Level ${level} Folder`}</List.Value>
        </List.SubTrigger>,
      )

      // Create content container for the current level
      items.push(
        <List.Content
          key={`content-${currentId}`}
          parentId={currentId}
        >
          {/* Add some file items for the current level */}
          {[1, 2].map((fileIndex) => (
            <List.Item
              key={`file-${currentId}-${fileIndex}`}
              parentId={currentId}
              prefixElement={<File />}
            >
              <List.Value>{`File ${fileIndex} (Level ${level})`}</List.Value>
            </List.Item>
          ))}

          {/* Recursively create the next level */}
          {level < maxDepth && createNestedItems(level + 1, currentId, maxDepth)}
        </List.Content>,
      )

      return items
    }

    return (
      <List
        className="w-64"
        size="large"
        shouldShowReferenceLine
      >
        <List.Content>
          <List.Item prefixElement={<House />}>
            <List.Value>Home</List.Value>
          </List.Item>

          {/* Create nested items from level 1 */}
          {createNestedItems(1)}

          <List.Item prefixElement={<ViewCalendar />}>
            <List.Value>Calendar</List.Value>
          </List.Item>
        </List.Content>
      </List>
    )
  },
}

/**
 * A nested list with selection functionality.
 *
 * Combine the selection mode with nested lists to create hierarchical selectable content.
 */
export const NestedListWithSelection: Story = {
  render: function NestedListWithSelection() {
    // Use useState to manage the selected state
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(["root1", "nested2"]))

    // Handle selection changes
    const handleItemClick = (id: string) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="text-secondary-foreground bg-secondary-background rounded-lg p-2">
          Selected items:{" "}
          {[...selectedItems].map((id) => (
            <span
              key={id}
              className="mx-1"
            >
              {id}
            </span>
          ))}
        </div>
        <List
          className="w-64"
          shouldShowReferenceLine
        >
          <List.Content>
            <List.Item
              id="root1"
              selected={selectedItems.has("root1")}
              onClick={() => handleItemClick("root1")}
              prefixElement={selectedItems.has("root1") ? <Check /> : undefined}
            >
              <List.Value>Root Item 1</List.Value>
            </List.Item>
            <List.SubTrigger
              id="nested"
              defaultOpen
            >
              <List.Value>Nested Section</List.Value>
            </List.SubTrigger>
            <List.Content parentId="nested">
              <List.Item
                id="nested1"
                parentId="nested"
                selected={selectedItems.has("nested1")}
                onClick={() => handleItemClick("nested1")}
                prefixElement={selectedItems.has("nested1") ? <Check /> : <></>}
              >
                <List.Value>Nested Item 1</List.Value>
              </List.Item>
              <List.Item
                id="nested2"
                parentId="nested"
                selected={selectedItems.has("nested2")}
                onClick={() => handleItemClick("nested2")}
                prefixElement={selectedItems.has("nested2") ? <Check /> : <></>}
              >
                <List.Value>Nested Item 2</List.Value>
              </List.Item>
              <List.Item
                id="nested3"
                parentId="nested"
                selected={selectedItems.has("nested3")}
                onClick={() => handleItemClick("nested3")}
                prefixElement={selectedItems.has("nested3") ? <Check /> : <></>}
              >
                <List.Value>Nested Item 3</List.Value>
              </List.Item>
            </List.Content>
            <List.Item
              id="root2"
              selected={selectedItems.has("root2")}
              onClick={() => handleItemClick("root2")}
              prefixElement={selectedItems.has("root2") ? <Check /> : <></>}
            >
              <List.Value>Root Item 2</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>
    )
  },
}

/**
 * A list demonstrating the `as` prop functionality on ListItem.
 *
 * The `as` prop allows you to render ListItem as different HTML elements or React components.
 * This is useful for semantic HTML, accessibility, or integrating with routing libraries.
 * All ListItem features (prefixElement, suffixElement, shortcut, active, selected, disabled)
 * work regardless of the `as` prop value.
 *
 * ```tsx
 * <List>
 *   <List.Content>
 *     <List.Item as="div">
 *       <List.Value>Div Item</List.Value>
 *     </List.Item>
 *   </List.Content>
 * </List>
 * ```
 */
export const WithAsProp: Story = {
  render: () => (
    <List className="w-64">
      <List.Label>As div:</List.Label>
      <List.Content>
        <List.Item as="div">
          <List.Value>Div Item</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * NonInteractive: Demonstrates a non-interactive list for display purposes only.
 * - When `interactive={false}`, list items use `div` as default element instead of `button`.
 * - Hover effects and active states are disabled.
 * - Useful for read-only lists, documentation, or static content display.
 *
 * ```tsx
 * <List interactive={false}>
 *   <List.Content>...</List.Content>
 * </List>
 * ```
 */
export const NonInteractive: Story = {
  render: () => (
    <List
      className="w-64"
      interactive={false}
    >
      <List.Content>
        <List.Item prefixElement={<House />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<File />}>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item prefixElement={<Settings />}>
          <List.Value>Settings</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}
