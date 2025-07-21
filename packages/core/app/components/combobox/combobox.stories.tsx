import type { Meta, StoryObj } from "@storybook/react"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { createEditor, Descendant, Node, Transforms } from "slate"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { Combobox } from "."
import { useEventCallback } from "usehooks-ts"
import { Checkbox } from "../checkbox"

const meta: Meta<typeof Combobox> = {
  title: "Collections/Combobox",
  component: Combobox,
  tags: ["beta", "autodocs"],
}

export default meta
type Story = StoryObj<typeof Combobox>

// Sample data
const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Quince",
  "Raspberry",
  "Strawberry",
  "Tangerine",
  "Watermelon",
]

/**
 * Basic: Simple combobox with searchable fruit options.
 * - Type to filter the list
 * - Use arrow keys to navigate
 * - Press Enter or click to select
 * - Selected value appears in the input
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [value, setValue] = useState("")
    const [triggerType, setTriggerType] = useState<"click" | "focus" | "input">("input")

    const itemsToShow = useMemo(() => {
      if (triggerType === "click") {
        // 点击trigger时显示所有items
        return fruits
      }
      if (!value.trim()) {
        return []
      }
      // 输入或focus时显示过滤后的items
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value, triggerType])

    const handleChange = useEventCallback((newValue: string) => {
      setValue(newValue)
      setTriggerType("input")
    })

    const handleOpenChange = useEventCallback(
      (open: boolean, trigger: "click" | "focus" | "input" = "input") => {
        if (open) {
          setTriggerType(trigger)
        }
      },
    )

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={handleChange}
          onOpenChange={handleOpenChange}
        >
          <Combobox.Trigger placeholder="Search fruits..." />
          {itemsToShow.length > 0 && (
            <Combobox.Content>
              <>
                <Combobox.Label>Fruits</Combobox.Label>
                {itemsToShow.map((fruit) => (
                  <Combobox.Item
                    key={fruit}
                    onClick={() => setValue(fruit)}
                  >
                    <Combobox.Value>{fruit}</Combobox.Value>
                  </Combobox.Item>
                ))}
              </>
            </Combobox.Content>
          )}
        </Combobox>
      </div>
    )
  },
}

/**
 * Clearable: Combobox with clearable input.
 * - Shows clear button when value is not empty
 * - Clear button is hidden when value is empty
 */
export const Clearable: Story = {
  render: function ClearableStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger
            showClear
            placeholder="Search fruits..."
          />
          {filteredFruits.length > 0 && (
            <Combobox.Content>
              <>
                <Combobox.Label>Fruits</Combobox.Label>
                {filteredFruits.map((fruit) => (
                  <Combobox.Item
                    key={fruit}
                    onClick={() => setValue(fruit)}
                  >
                    <Combobox.Value>{fruit}</Combobox.Value>
                  </Combobox.Item>
                ))}
              </>
            </Combobox.Content>
          )}
        </Combobox>
      </div>
    )
  },
}

/**
 * Controlled: Controlled combobox with external state management.
 * - Value is controlled by parent component
 * - Demonstrates integration with forms
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [selectedFruit, setSelectedFruit] = useState("Apple")
    const [searchValue, setSearchValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!searchValue.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(searchValue.toLowerCase()))
    }, [searchValue])

    return (
      <div className="space-y-4">
        <div className="w-64">
          <Combobox
            value={searchValue}
            onChange={setSearchValue}
          >
            <Combobox.Trigger placeholder="Search fruits..." />
            <Combobox.Content>
              {filteredFruits.length > 0 ? (
                <>
                  <Combobox.Label>Available Fruits</Combobox.Label>
                  {filteredFruits.map((fruit) => (
                    <Combobox.Item
                      key={fruit}
                      onClick={() => {
                        setSelectedFruit(fruit)
                        setSearchValue(fruit)
                      }}
                    >
                      <Combobox.Value>{fruit}</Combobox.Value>
                    </Combobox.Item>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-white/50">No matches found</div>
              )}
            </Combobox.Content>
          </Combobox>
        </div>

        <div className="text-secondary-foreground">
          <div>
            Selected fruit: <strong>{selectedFruit}</strong>
          </div>
          <div>
            Search value: <strong>{searchValue || "(empty)"}</strong>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Empty: Combobox with no initial value.
 * - Shows placeholder text
 * - All options visible when opened
 */
export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger placeholder="Choose a fruit..." />
          <Combobox.Content>
            <Combobox.Label>Popular Fruits</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * Large: Large size variant of the combobox.
 * - Increased padding and font size
 * - Better for touch interfaces
 */
export const Large: Story = {
  render: function LargeStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-80">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger
            placeholder="Search fruits..."
            size="large"
          />
          <Combobox.Content>
            <Combobox.Label>Fruits</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                size="large"
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * Disabled: Disabled combobox state.
 * - Input and interactions are disabled
 * - Visual feedback for unavailable state
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    return (
      <div className="w-64">
        <Combobox disabled>
          <Combobox.Trigger
            placeholder="Disabled combobox..."
            value="Apple"
          />
          <Combobox.Content>
            <Combobox.Item>
              <Combobox.Value>Apple</Combobox.Value>
            </Combobox.Item>
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * LongList: Combobox with many options demonstrating scrolling.
 * - Generated list of countries
 * - Efficient filtering
 * - Scroll behavior in dropdown
 */
export const LongList: Story = {
  render: function LongListStory() {
    const [value, setValue] = useState("")

    const countries = useMemo(
      () => Array.from({ length: 100 }, (_, index) => `Option ${index + 1}`),
      [],
    )

    const filteredCountries = useMemo(() => {
      if (!value.trim()) return []
      return countries
        .filter((country) => country.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 50) // Limit results for performance
    }, [value, countries])

    return (
      <div className="w-64">
        <Combobox
          value={value}
          onChange={setValue}
        >
          <Combobox.Trigger placeholder="Search countries..." />
          <Combobox.Content>
            <Combobox.Label>
              Countries ({filteredCountries.length} {!value ? "shown" : "found"})
            </Combobox.Label>
            {filteredCountries.map((country, index) => (
              <Combobox.Item
                key={`${country}-${index}`}
                onClick={() => setValue(country)}
              >
                <Combobox.Value>{country}</Combobox.Value>
              </Combobox.Item>
            ))}
            {filteredCountries.length === 0 && value && (
              <div className="p-4 text-center text-white/50">
                No countries found for &ldquo;{value}&rdquo;
              </div>
            )}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * CustomWidth: Combobox with custom width that doesn't match trigger.
 * - Dropdown width independent of trigger
 * - Useful for compact triggers with wider options
 */
export const CustomWidth: Story = {
  render: function CustomWidthStory() {
    const [value, setValue] = useState("")

    const filteredFruits = useMemo(() => {
      if (!value.trim()) return []
      return fruits.filter((fruit) => fruit.toLowerCase().startsWith(value.toLowerCase()))
    }, [value])

    return (
      <div className="w-48">
        <Combobox
          value={value}
          onChange={setValue}
          matchTriggerWidth={false}
        >
          <Combobox.Trigger placeholder="Fruit..." />
          <Combobox.Content className="w-80">
            <Combobox.Label>Available Fruits (Custom Width)</Combobox.Label>
            {filteredFruits.map((fruit) => (
              <Combobox.Item
                key={fruit}
                onClick={() => setValue(fruit)}
              >
                <Combobox.Value>{fruit}</Combobox.Value>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      </div>
    )
  },
}

/**
 * Coordinate mode - Combobox positioned at specific coordinates for mentions
 */
export const CoordinateMode: Story = {
  render: function CoordinateModeStory() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [query, setQuery] = useState("")

    const users = useMemo(
      () => [
        {
          id: "1",
          name: "John Doe",
          username: "johndoe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        {
          id: "2",
          name: "Jane Smith",
          username: "janesmith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        },
        {
          id: "3",
          name: "Bob Wilson",
          username: "bobwilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        },
      ],
      [],
    )

    const filteredUsers = useMemo(() => {
      if (!query.trim()) return users
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()),
      )
    }, [query, users])

    const handleClick = (event: React.MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })
      setQuery("")
      setIsOpen(true)
    }

    const handleSelectUser = (user: (typeof users)[0]) => {
      setQuery(user.name)
      setIsOpen(false)
    }

    return (
      <div className="w-80 space-y-4">
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">📍 Coordinate Mode Combobox</h3>
          <p className="text-secondary-foreground text-sm">
            Click anywhere in the area below to trigger a Combobox at that position. Perfect for
            mentions, autocomplete, etc.
          </p>
        </div>

        <div
          className="bg-secondary-background relative h-64 cursor-pointer rounded-lg border border-dashed p-4"
          onMouseDown={handleClick}
        >
          <p className="text-secondary-foreground text-center">
            Click anywhere in this area to show Combobox at mouse position
          </p>

          {position && (
            <div
              className="text-secondary-foreground fixed z-10 size-4"
              style={{ left: position.x - 8, top: position.y - 8 }}
            >
              📍
            </div>
          )}
        </div>

        {/* Combobox in coordinate mode */}
        <Combobox
          trigger="coordinate"
          position={position}
          value={query}
          onChange={setQuery}
          open={isOpen}
          onOpenChange={setIsOpen}
          placement="bottom-start"
          autoSelection={true}
        >
          <Combobox.Content>
            <Combobox.Label>
              {query ? `Search results for "${query}"` : "Select User"}
            </Combobox.Label>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Combobox.Item
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="mr-2 size-4 rounded-full"
                  />
                  <Combobox.Value>{user.name}</Combobox.Value>
                </Combobox.Item>
              ))
            ) : (
              <div className="p-4 text-center text-white/50">
                No users found for &ldquo;{query}&rdquo;
              </div>
            )}
          </Combobox.Content>
        </Combobox>

        {/* Debug info */}
        <div className="bg-secondary-background text-secondary-foreground rounded-lg p-3 text-xs">
          <div>
            <strong>Query:</strong> &ldquo;{query}&rdquo;
          </div>
          <div>
            <strong>Position:</strong> {position ? `${position.x}, ${position.y}` : "null"}
          </div>
          <div>
            <strong>Open:</strong> {isOpen ? "Yes" : "No"}
          </div>
          <div>
            <strong>Results:</strong> {filteredUsers.length}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Mentions with Slate.js - Combobox integrated with rich text editor for mentions
 */
export const MentionsWithSlate: Story = {
  render: function MentionsWithSlateStory() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [mentionQuery, setMentionQuery] = useState("")
    const editorRef = useRef<HTMLDivElement>(null)

    const [enterFilter, setEnterFilter] = useState(true)

    // 创建 Slate 编辑器实例
    const editor = useMemo(() => withReact(createEditor()), [])

    // 初始值
    const initialValue: Descendant[] = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      } as Descendant,
    ]
    const [value, setValue] = useState<Descendant[]>(initialValue)

    // 更多用户数据用于测试过滤
    const allUsers = useMemo(
      () => [
        {
          id: "1",
          name: "John Doe",
          username: "johndoe",
          role: "Software Engineer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        {
          id: "2",
          name: "Jane Smith",
          username: "janesmith",
          role: "Product Manager",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        },
        {
          id: "3",
          name: "Bob Wilson",
          username: "bobwilson",
          role: "Designer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        },
        {
          id: "4",
          name: "Alice Johnson",
          username: "alicejohnson",
          role: "DevOps Engineer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        },
        {
          id: "5",
          name: "Charlie Brown",
          username: "charliebrown",
          role: "QA Engineer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
        },
      ],
      [],
    )

    // 过滤用户列表 - 模拟正常 Combobox 的过滤逻辑
    const filteredUsers = useMemo(() => {
      if (enterFilter) {
        // 类似正常模式：如果没有查询内容，不显示任何选项
        if (!mentionQuery.trim()) return []

        return allUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(mentionQuery.toLowerCase()),
        )
      } else {
        return allUsers
      }
    }, [mentionQuery, allUsers, enterFilter])

    // 获取编辑器文本内容
    const getEditorText = useCallback(() => {
      return value.map((n) => Node.string(n)).join("\n")
    }, [value])

    // 处理 Combobox 的查询变化（仅用于坐标模式下的内部状态同步）
    const handleComboboxQueryChange = useCallback((query: string) => {
      // 在坐标模式下，我们不让 Combobox 控制查询，而是由 Slate 编辑器控制
      // 这个回调通常不会被调用，但为了完整性保留
    }, [])

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
          // 提取查询字符串（@ 后面的内容）
          setMentionQuery(afterAt)

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
          setMentionQuery("")
        }
      } else {
        setIsOpen(false)
        setMentionQuery("")
      }
    }, [])

    // 处理键盘事件 - 在菜单打开时拦截导航键
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!isOpen) return

        // 如果菜单打开，拦截上下箭头和回车键
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Enter" ||
          event.key === "Escape"
        ) {
          event.preventDefault()
          event.stopPropagation()

          // 获取菜单的键盘处理函数（通过ref访问）
          const menuElement = document.querySelector('[role="listbox"]') as HTMLElement
          if (menuElement) {
            // 直接在菜单元素上触发键盘事件
            const keyEvent = new KeyboardEvent("keydown", {
              key: event.key,
              code: event.code,
              ctrlKey: event.ctrlKey,
              shiftKey: event.shiftKey,
              altKey: event.altKey,
              metaKey: event.metaKey,
              bubbles: true,
              cancelable: true,
            })
            menuElement.dispatchEvent(keyEvent)
          }
        }
      },
      [isOpen],
    )

    // 处理用户选择
    const handleSelectUser = useCallback(
      (user: (typeof allUsers)[0]) => {
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
        setMentionQuery("")
        // 保持编辑器焦点
        ReactEditor.focus(editor)
      },
      [editor, getEditorText],
    )

    return (
      <div className="w-96 space-y-4">
        <div className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">🔍 Combobox Mentions with Slate.js</h3>
          <p className="text-secondary-foreground text-sm">
            Type @ and continue typing to filter users. Combobox maintains focus on the editor.
          </p>
        </div>

        <Checkbox
          value={enterFilter}
          onChange={setEnterFilter}
        >
          <Checkbox.Label>Enter filter</Checkbox.Label>
        </Checkbox>

        {/* Slate 编辑器 */}
        <div
          ref={editorRef}
          className="focus-within:border-selected-boundary min-h-[100px] w-full rounded-lg border p-3"
        >
          <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={handleChange}
          >
            <Editable
              placeholder="Type @ to mention someone, then continue typing to filter..."
              className="outline-none"
              style={{ minHeight: "76px" }}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </div>

        <Combobox
          trigger="coordinate" // 明确指定坐标模式
          position={position}
          value={mentionQuery}
          onChange={handleComboboxQueryChange}
          open={isOpen}
          onOpenChange={setIsOpen}
          placement="bottom-start"
          autoSelection={true} // 启用自动选择
        >
          {filteredUsers.length > 0 && (
            <Combobox.Content>
              <Combobox.Label>
                {enterFilter ? (mentionQuery ? `Search ${mentionQuery}` : "Users") : "Users"}
                {` (${filteredUsers.length})`}
              </Combobox.Label>

              {filteredUsers.map((user) => (
                <Combobox.Item
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  prefixElement={
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-4 rounded-full"
                    />
                  }
                  suffixElement={<span className="text-sm text-white/60">{user.role}</span>}
                >
                  <Combobox.Value>{user.name}</Combobox.Value>
                </Combobox.Item>
              ))}
            </Combobox.Content>
          )}
        </Combobox>

        {/* 调试信息 */}
        <div className="space-y-2">
          <div className="bg-secondary-background text-secondary-foreground rounded-xl p-4">
            <div>
              <strong>Current text:</strong> &ldquo;{getEditorText()}&rdquo;
            </div>
            <div>
              <strong>Mention query:</strong> &ldquo;{mentionQuery}&rdquo;
            </div>
            <div>
              <strong>Filtered users:</strong> {filteredUsers.length} / {allUsers.length}
            </div>
            <div>
              <strong>Menu open:</strong> {isOpen ? "Yes" : "No"}
            </div>
            <div>
              <strong>Position:</strong> {position ? `x:${position.x}, y:${position.y}` : "null"}
            </div>
            <div>
              <strong>Should show menu:</strong> {isOpen ? "Yes" : "No"}
            </div>
            <div>
              <strong>Filtered users names:</strong> {filteredUsers.map((u) => u.name).join(", ")}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h4 className="mb-2 font-medium">Test Cases:</h4>
            <ul className="text-secondary-foreground space-y-1">
              <li>• Type @ - Shows all 5 users</li>
              <li>• Type @john - Filters to John Doe, Alice Johnson</li>
              <li>• Type @dev - Filters to developers</li>
              <li>• Type @engineer - Filters to engineers</li>
              <li>• Type @xyz - Shows &ldquo;No users found&rdquo;</li>
              <li>• Add space after selection - Closes menu</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
}
