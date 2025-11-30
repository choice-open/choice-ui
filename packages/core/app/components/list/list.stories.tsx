import { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { List } from "./list"
import {
  FieldTypeAttachment,
  FieldTypeCheckbox,
  FieldTypeLongText,
  FieldTypeSingleSelect,
  Folder,
  File,
  FieldTypeDate,
  Check,
} from "@choiceform/icons-react"

const meta: Meta<typeof List> = {
  title: "Collections/List",
  component: List,
  parameters: {
    layout: "centered",
  },
  tags: ["new"],
}

export default meta
type Story = StoryObj<typeof List>

/**
 * A basic list with simple text items.
 *
 * Use the `List` component with `List.Content` and `List.Item` for a simple list.
 */
export const Basic: Story = {
  render: (args) => (
    <List {...args}>
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
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item prefixElement={<FieldTypeCheckbox />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeSingleSelect />}>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeAttachment />}>
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
 */
export const Variant: Story = {
  render: (args) => (
    <List
      {...args}
      variant="primary"
    >
      <List.Content>
        <List.Item prefixElement={<FieldTypeCheckbox />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeSingleSelect />}>
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeAttachment />}>
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
 */
export const WithLabelsAndDividers: Story = {
  render: (args) => (
    <List {...args}>
      <List.Label>Navigation</List.Label>
      <List.Content>
        <List.Item prefixElement={<FieldTypeCheckbox />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeSingleSelect />}>
          <List.Value>Documents</List.Value>
        </List.Item>
      </List.Content>
      <List.Divider />
      <List.Label>System</List.Label>
      <List.Content>
        <List.Item prefixElement={<FieldTypeAttachment />}>
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
 */
export const NestedList: Story = {
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item prefixElement={<FieldTypeLongText />}>Home</List.Item>
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
        <List.Item prefixElement={<FieldTypeDate />}>
          <List.Value>Calendar</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

export const Size: Story = {
  render: (args) => (
    <List
      {...args}
      size="large"
    >
      <List.Content>
        <List.Item prefixElement={<FieldTypeLongText />}>Home</List.Item>
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
        <List.Item prefixElement={<FieldTypeDate />}>
          <List.Value>Calendar</List.Value>
        </List.Item>
      </List.Content>
    </List>
  ),
}

/**
 * A list with pre-expanded nested content.
 *
 * Use the `defaultOpen` prop on `List.SubTrigger` to make nested content visible by default.
 */
export const DefaultOpenNestedList: Story = {
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item prefixElement={<FieldTypeLongText />}>Home</List.Item>
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
        <List.Item prefixElement={<FieldTypeDate />}>
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
  render: (args) => {
    // 递归创建嵌套项目结构的函数
    const createNestedItems = (level: number, parentId: string = "", maxDepth: number = 5) => {
      // 在达到最大深度时停止递归
      if (level > maxDepth) return null

      const currentId = parentId ? `${parentId}-level${level}` : `level${level}`
      const items: React.ReactNode[] = []

      // 创建当前级别的标题
      items.push(
        <List.SubTrigger
          key={`trigger-${currentId}`}
          id={currentId}
          parentId={parentId || undefined}
          prefixElement={<Folder />}
          defaultOpen={level <= 3} // 默认展开前三级
        >
          <List.Value>{`Level ${level} Folder`}</List.Value>
        </List.SubTrigger>,
      )

      // 创建该级别的内容容器
      items.push(
        <List.Content
          key={`content-${currentId}`}
          parentId={currentId}
        >
          {/* 为当前级别添加一些文件项目 */}
          {[1, 2].map((fileIndex) => (
            <List.Item
              key={`file-${currentId}-${fileIndex}`}
              parentId={currentId}
              prefixElement={<File />}
            >
              <List.Value>{`File ${fileIndex} (Level ${level})`}</List.Value>
            </List.Item>
          ))}

          {/* 递归创建下一级 */}
          {level < maxDepth && createNestedItems(level + 1, currentId, maxDepth)}
        </List.Content>,
      )

      return items
    }

    return (
      <List
        {...args}
        shouldShowReferenceLine
      >
        <List.Content>
          <List.Item prefixElement={<FieldTypeLongText />}>
            <List.Value>Home</List.Value>
          </List.Item>

          {/* 从第一级开始递归创建嵌套结构 */}
          {createNestedItems(1)}

          <List.Item prefixElement={<FieldTypeDate />}>
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
 */
export const WithShortcuts: Story = {
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item
          prefixElement={<FieldTypeLongText />}
          shortcut={{ keys: "H" }}
        >
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<FieldTypeLongText />}
          shortcut={{ keys: "D" }}
        >
          <List.Value>Documents</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<FieldTypeAttachment />}
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
  render: (args) => {
    // 使用useState管理选中项ID，null表示没有选中项
    const [selectedId, setSelectedId] = React.useState<string | null>("doc1")

    // 处理点击事件，实现单选和取消选择逻辑
    const handleItemClick = (id: string) => {
      // 如果点击已选中项，则取消选择
      if (selectedId === id) {
        setSelectedId(null)
      } else {
        // 否则，选择当前点击项
        setSelectedId(id)
      }
    }

    // 要完全控制选择状态，我们不启用List组件的内置selection功能
    // 而是手动为选中的项目添加check图标
    const getItemPrefixElement = (id: string) => {
      return selectedId === id ? <Check /> : <></>
    }

    return (
      <div className="flex flex-col gap-2">
        <div>
          <strong>Selected item:</strong> {selectedId || "None"}
        </div>
        {/* 不启用内置selection功能，完全由外部状态控制 */}
        <List {...args}>
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
 */
export const WithDisabledItems: Story = {
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item prefixElement={<FieldTypeLongText />}>
          <List.Value>Home</List.Value>
        </List.Item>
        <List.Item
          prefixElement={<FieldTypeLongText />}
          disabled
        >
          <List.Value>Mail (Maintenance)</List.Value>
        </List.Item>
        <List.Item prefixElement={<FieldTypeAttachment />}>
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
 */
export const NonCollapsibleNestedList: Story = {
  render: (args) => (
    <List {...args}>
      <List.Content>
        <List.Item prefixElement={<FieldTypeLongText />}>Home</List.Item>
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
        <List.Item prefixElement={<FieldTypeDate />}>
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
  render: (args) => {
    // 递归创建嵌套项目结构的函数
    const createNestedItems = (level: number, parentId: string = "", maxDepth: number = 5) => {
      // 在达到最大深度时停止递归
      if (level > maxDepth) return null

      const currentId = parentId ? `${parentId}-level${level}` : `level${level}`
      const items: React.ReactNode[] = []

      // 创建当前级别的标题
      items.push(
        <List.SubTrigger
          key={`trigger-${currentId}`}
          id={currentId}
          parentId={parentId || undefined}
          prefixElement={<Folder />}
          defaultOpen={level <= 2} // 默认展开前两级
        >
          <List.Value>{`Level ${level} Folder`}</List.Value>
        </List.SubTrigger>,
      )

      // 创建该级别的内容容器
      items.push(
        <List.Content
          key={`content-${currentId}`}
          parentId={currentId}
        >
          {/* 为当前级别添加一些文件项目 */}
          {[1, 2].map((fileIndex) => (
            <List.Item
              key={`file-${currentId}-${fileIndex}`}
              parentId={currentId}
              prefixElement={<File />}
            >
              <List.Value>{`File ${fileIndex} (Level ${level})`}</List.Value>
            </List.Item>
          ))}

          {/* 递归创建下一级 */}
          {level < maxDepth && createNestedItems(level + 1, currentId, maxDepth)}
        </List.Content>,
      )

      return items
    }

    return (
      <List
        {...args}
        size="large"
        shouldShowReferenceLine
      >
        <List.Content>
          <List.Item prefixElement={<FieldTypeLongText />}>
            <List.Value>Home</List.Value>
          </List.Item>

          {/* 从第一级开始递归创建嵌套结构 */}
          {createNestedItems(1)}

          <List.Item prefixElement={<FieldTypeDate />}>
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
  render: (args) => {
    // 使用useState来管理选中状态
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
      new Set(["root1", "nested2"]),
    )

    // 处理选择变化
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
        <div>
          <strong>Selected items:</strong>{" "}
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
          {...args}
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
 */
export const WithAsProp: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-body-small text-gray-600">As button (default):</p>
        <List {...args}>
          <List.Content>
            <List.Item>
              <List.Value>Button Item</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>

      <div className="space-y-2">
        <p className="text-body-small text-gray-600">As div:</p>
        <List {...args}>
          <List.Content>
            <List.Item as="div">
              <List.Value>Div Item</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>

      <div className="space-y-2">
        <p className="text-body-small text-gray-600">As anchor:</p>
        <List {...args}>
          <List.Content>
            <List.Item
              as="a"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                console.log("Link clicked")
              }}
            >
              <List.Value>Link Item</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>

      <div className="space-y-2">
        <p className="text-body-small text-gray-600">As anchor with all features:</p>
        <List {...args}>
          <List.Content>
            <List.Item
              as="a"
              href="#"
              active
              prefixElement={<FieldTypeLongText />}
              suffixElement={<FieldTypeSingleSelect />}
              shortcut={{ keys: "L" }}
              onClick={(e) => {
                e.preventDefault()
                console.log("Link with features clicked")
              }}
            >
              <List.Value>Link with features</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>

      <div className="space-y-2">
        <p className="text-body-small text-gray-600">Mixed element types in one list:</p>
        <List {...args}>
          <List.Content>
            <List.Item>
              <List.Value>Default Button Item</List.Value>
            </List.Item>
            <List.Item
              as="a"
              href="#home"
              prefixElement={<FieldTypeCheckbox />}
            >
              <List.Value>Link Item</List.Value>
            </List.Item>
            <List.Item as="div">
              <List.Value>Div Item</List.Value>
            </List.Item>
            <List.Item
              as="a"
              href="#settings"
              prefixElement={<FieldTypeAttachment />}
              shortcut={{ modifier: "command", keys: "S" }}
            >
              <List.Value>Link with Icon and Shortcut</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>
    </div>
  ),
}

/**
 * NonInteractive: Demonstrates a non-interactive list for display purposes only.
 * - When `interactive={false}`, list items use `div` as default element instead of `button`.
 * - Hover effects and active states are disabled.
 * - Useful for read-only lists, documentation, or static content display.
 */
export const NonInteractive: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-body-large-strong">Interactive List (Default)</h3>
        <p className="text-body-small text-secondary-foreground">
          Hover over items to see active state. Items use button elements by default.
        </p>
        <List {...args}>
          <List.Content>
            <List.Item prefixElement={<FieldTypeCheckbox />}>
              <List.Value>Home</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeSingleSelect />}>
              <List.Value>Documents</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeAttachment />}>
              <List.Value>Settings</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>

      <div className="space-y-2">
        <h3 className="text-body-large-strong">Non-Interactive List</h3>
        <p className="text-body-small text-secondary-foreground">
          Hover effects disabled. Items use div elements by default. No active state on hover.
        </p>
        <List
          {...args}
          interactive={false}
        >
          <List.Content>
            <List.Item prefixElement={<FieldTypeCheckbox />}>
              <List.Value>Home</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeSingleSelect />}>
              <List.Value>Documents</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeAttachment />}>
              <List.Value>Settings</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeLongText />}>
              <List.Value>Read-only Item</List.Value>
            </List.Item>
            <List.Item prefixElement={<FieldTypeDate />}>
              <List.Value>Static Content</List.Value>
            </List.Item>
          </List.Content>
        </List>
      </div>
    </div>
  ),
}
