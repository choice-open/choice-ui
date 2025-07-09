import { faker } from "@faker-js/faker"
import type { Placement as FloatingPlacement } from "@floating-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { Dropdown } from "../dropdown"
import { Input } from "../input"
import { NumericInputMenuTrigger } from "../numeric-input/components"
import { NumericInput } from "../numeric-input/numeric-input"
import { ScrollArea } from "../scroll-area"
import { Select } from "../select"
import { Tabs } from "../tabs"
import { Popover } from "./popover"

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
}

export default meta

type Story = StoryObj<typeof Popover>

/**
 * `Popover` is a versatile floating overlay component for displaying contextual content.
 *
 * Features:
 * - Multiple positioning options with automatic adjustment
 * - Various interaction modes (click, hover, focus)
 * - Optional draggable behavior
 * - Controlled and uncontrolled usage
 * - Header component for titles or complex UI
 * - Support for nested interactive elements
 * - Outside press handling with customizable ignore zones
 *
 * Usage Guidelines:
 * - Use for contextual information, forms, or interactive controls
 * - Choose appropriate interaction mode based on content importance
 * - Consider placement based on available screen space
 * - Add headers for context when content is complex
 * - Use controlled mode when you need to manage open state externally
 *
 * Accessibility:
 * - Proper focus management
 * - Keyboard navigation support
 * - Appropriate ARIA attributes
 * - Screen reader announcements for state changes
 * - Escape key dismissal
 */

/**
 * Basic: Demonstrates the simplest Popover implementation.
 *
 * Features:
 * - Click interaction (default behavior)
 * - Automatic positioning
 * - Clean, consistent styling
 *
 * This example shows the minimal configuration required to implement a
 * functional popover with a button trigger and text content.
 */
export const Basic: Story = {
  render: function BasicStory() {
    return (
      <Popover>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * DefaultOpen: Demonstrates a popover that starts in the open state.
 *
 * Features:
 * - Pre-opened state on initial render
 * - Maintains all other popover behaviors
 *
 * This pattern is useful for:
 * - Drawing immediate attention to important content
 * - Guiding users to available actions
 * - Feature tours or onboarding
 */
export const DefaultOpen: Story = {
  render: function DefaultOpenStory() {
    return (
      <Popover defaultOpen>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * Offset: Demonstrates customizing the distance between trigger and popover.
 *
 * Features:
 * - Configurable spacing between trigger and content
 * - Maintains proper positioning and alignment
 *
 * This pattern is useful for:
 * - Creating more space between the trigger and content
 * - Avoiding overlap with nearby elements
 * - Achieving specific design requirements
 */
export const Offset: Story = {
  render: function OffsetStory() {
    return (
      <Popover offset={16}>
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * Interactions: Demonstrates different ways to trigger the popover.
 *
 * Features:
 * - Click interaction (default)
 * - Hover interaction with optimized configuration
 * - Focus interaction for accessibility
 * - Manual control with none interaction
 *
 * Note: Hover interaction has been optimized to prevent flickering:
 * - move: false - prevents accidental triggers during movement
 * - mouseOnly: true - avoids touch event interference
 * - optimized delays and safePolygon settings
 */
export const Interactions: Story = {
  render: function InteractionsStory() {
    const [manualOpen, setManualOpen] = useState(false)

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Click (Default)</h3>
          <Popover>
            <Popover.Trigger>
              <Button>Click to open</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
          </Popover>

          <h3 className="text-lg font-semibold">Hover ✅ (Fixed)</h3>
          <div className="rounded border border-green-200 bg-green-50 p-2">
            <p className="mb-2 text-xs text-green-700">
              ✅ 修复了开启关闭循环问题：
              <br />• move: false - 禁用移动触发
              <br />• mouseOnly: true - 只响应鼠标事件
              <br />• 优化了延迟和 safePolygon 配置
            </p>
            <Popover interactions="hover">
              <Popover.Trigger>
                <Button>Hover to open</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Focus</h3>
          <Popover interactions="focus">
            <Popover.Trigger>
              <Button>Focus to open</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
          </Popover>

          <h3 className="text-lg font-semibold">Manual Control</h3>
          <div className="space-y-2">
            <Button
              onClick={() => setManualOpen(!manualOpen)}
              variant={manualOpen ? "secondary" : "primary"}
            >
              {manualOpen ? "Close" : "Open"} Manually
            </Button>
            <Popover
              interactions="none"
              open={manualOpen}
              onOpenChange={setManualOpen}
            >
              <Popover.Trigger>
                <Button disabled>Manual trigger</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
            </Popover>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Controlled: Demonstrates managing the popover's open state externally.
 *
 * Features:
 * - External state management
 * - Programmatic open/close control
 * - Visual feedback on the trigger button
 *
 * This pattern is useful for:
 * - Complex interactions with other components
 * - Form validation or data-dependent display
 * - Wizard or stepped interfaces
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger>
          <Button active={open}>Click: {open ? "Close" : "Open"}</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * ControlledFixed: 验证受控模式修复效果
 *
 * Features:
 * - ✅ 修复后的受控模式
 * - 多次开启关闭测试
 * - 基于 Floating UI 官方模式
 * - 状态同步验证
 */
export const ControlledFixed: Story = {
  render: function ControlledFixedStory() {
    const [open, setOpen] = useState(false)
    const [toggleCount, setToggleCount] = useState(0)

    const handleToggle = () => {
      setOpen(!open)
      setToggleCount((prev) => prev + 1)
    }

    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen)
      if (isOpen) {
        setToggleCount((prev) => prev + 1)
      }
    }

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-green-900">✅ 受控模式修复验证</h3>
          <p className="text-sm text-green-800">
            基于 Floating UI 官方文档的正确实现，解决了开启一次关闭后无法再次显示的问题
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 space-y-2">
            <div className="text-sm font-medium text-gray-700">
              当前状态：
              <span className={`font-mono ${open ? "text-green-600" : "text-red-600"}`}>
                {open ? "OPEN" : "CLOSED"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              切换次数：<span className="font-mono">{toggleCount}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggle}
              className={`rounded px-4 py-2 font-medium transition-colors ${
                open
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {open ? "关闭" : "开启"} Popover
            </button>

            <button
              onClick={() => setOpen(true)}
              disabled={open}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              强制开启
            </button>

            <button
              onClick={() => setOpen(false)}
              disabled={!open}
              className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              强制关闭
            </button>
          </div>
        </div>

        <Popover
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Popover.Trigger>
            <Button>Popover 触发器</Button>
          </Popover.Trigger>
          <Popover.Content className="w-80 p-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">✅ 修复验证成功</h4>
              <p className="text-sm text-gray-600">
                这个 Popover 使用受控模式，基于 Floating UI 官方文档的正确实现。
              </p>
              <div className="rounded border border-green-200 bg-green-50 p-3">
                <h5 className="font-medium text-green-800">修复内容：</h5>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-700">
                  <li>使用官方的 isPositioned 替代自定义 positionReady</li>
                  <li>简化状态管理逻辑，移除复杂的 RAF 处理</li>
                  <li>修复 useMergedValue 与 useFloating 的状态同步</li>
                  <li>遵循 Floating UI 官方推荐的实现模式</li>
                </ul>
              </div>
              <div className="font-mono text-xs text-gray-500">切换次数：{toggleCount}</div>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}

/**
 * TriggerRef: Demonstrates using an external trigger element.
 *
 * Features:
 * - Reference to external trigger element
 * - Complete separation of trigger and popover
 * - Controlled open state
 *
 * This pattern is useful for:
 * - Complex layouts where the trigger needs to be in a different component
 * - Dynamically generated UI where the popover needs to be positioned relative to existing elements
 * - Advanced application architectures with separated components
 */
export const TriggerRef: Story = {
  render: function TriggerRefStory() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <>
        <Button
          ref={triggerRef}
          active={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Open"}
        </Button>

        <Popover
          triggerRef={triggerRef}
          open={open}
          onOpenChange={setOpen}
        >
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
      </>
    )
  },
}

/**
 * Placement: Demonstrates different positioning options for the popover.
 *
 * Features:
 * - 12 different placement options
 * - Automatically adjusts to available space
 * - Dynamic positioning based on trigger location
 *
 * Usage Guidelines:
 * - Choose appropriate placement based on UI layout
 * - Consider screen edges and available space
 * - Default to logical positions (e.g., dropdown menus below triggers)
 */
export const Placement: Story = {
  render: function PlacementStory() {
    const PLACEMENTS = [
      { label: "Top", value: "top" },
      { label: "Top Start", value: "top-start" },
      { label: "Top End", value: "top-end" },
      { label: "Bottom", value: "bottom" },
      { label: "Bottom Start", value: "bottom-start" },
      { label: "Bottom End", value: "bottom-end" },
      { label: "Left", value: "left" },
      { label: "Left Start", value: "left-start" },
      { label: "Left End", value: "left-end" },
      { label: "Right", value: "right" },
      { label: "Right Start", value: "right-start" },
      { label: "Right End", value: "right-end" },
    ]
    const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
    const [placement, setPlacement] = useState<FloatingPlacement>("bottom-start")
    const [open, setOpen] = useState(false)

    const handleButtonClick = (newPlacement: FloatingPlacement) => {
      React.startTransition(() => {
        setPlacement(newPlacement)
        setOpen(true)
      })
    }

    return (
      <>
        <div className="grid grid-cols-3 gap-2">
          {PLACEMENTS.map((option) => {
            return (
              <Button
                active={placement === option.value && open}
                variant="secondary"
                ref={(node) => {
                  if (node) {
                    triggerRefs.current.set(option.value, node)
                  }
                }}
                key={option.value}
                onMouseDown={() => handleButtonClick(option.value as FloatingPlacement)}
              >
                {option.label}
              </Button>
            )
          })}
        </div>

        <Popover
          triggerRef={{ current: triggerRefs.current.get(placement) ?? null }}
          placement={placement}
          open={open}
          onOpenChange={setOpen}
        >
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
      </>
    )
  },
}

/**
 * Draggable: Demonstrates a draggable popover with header.
 *
 * Features:
 * - User can move the popover by dragging the header
 * - Maintains state and content during dragging
 * - Provides header as drag handle
 *
 * This pattern is useful for:
 * - Complex UI where users may need to see content behind the popover
 * - Workspaces or dashboard interfaces
 * - Multi-step forms where comparing information is needed
 */
export const Draggable: Story = {
  render: function DraggableStory() {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        draggable
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger>
          <Button active={open}>Drag: {open ? "Close" : "Open"}</Button>
        </Popover.Trigger>

        <Popover.Header title="Drag" />
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * RememberPosition: Demonstrates a popover that remembers its position when closed.
 *
 * Features:
 * - Maintains its position when closed
 * - Reappears in the same position when opened
 *
 * This pattern is useful for:
 * - Popovers that need to remember their position when closed
 * - Dashboard interfaces where popovers need to be in a specific location
 */
export const RememberPosition: Story = {
  render: function RememberPositionStory() {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        draggable
        rememberPosition
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger>
          <Button>Remember Position</Button>
        </Popover.Trigger>
        <Popover.Header title="Remember Position" />
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * OutsidePressIgnore: Demonstrates excluding elements from outside click dismissal.
 *
 * Features:
 * - Define areas where clicks won't dismiss the popover
 * - Maintains typical behavior for non-ignored areas
 * - Uses CSS class-based targeting
 *
 * This pattern is useful for:
 * - Complex interfaces with related but separate UI elements
 * - Preventing accidental dismissal for important popovers
 * - Creating modal-like experiences without full modals
 */
export const OutsidePressIgnore: Story = {
  render: function OutsidePressIgnoreStory() {
    const [open, setOpen] = useState(false)
    return (
      <div className="outside-press-ignore rounded-xl border p-16">
        <Popover
          open={open}
          onOpenChange={setOpen}
          outsidePressIgnore="outside-press-ignore"
        >
          <Popover.Trigger>
            <Button>{open ? "Close" : "Open"}</Button>
          </Popover.Trigger>
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
      </div>
    )
  },
}

/**
 * Header: Demonstrates adding complex UI to the popover header.
 *
 * Features:
 * - Custom header content (tabs in this example)
 * - Interactive elements within the header
 * - State management for header components
 *
 * This pattern is useful for:
 * - Categorized or tabbed content within a popover
 * - Complex toolbars or controls
 * - Multi-step or wizard interfaces
 */
export const Header: Story = {
  render: function HeaderStory() {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState("tab-1")

    const header = useMemo(
      () => (
        <div className="flex h-10 items-center justify-between px-3">
          <Tabs
            value={tab}
            onChange={setTab}
          >
            <Tabs.Item value="tab-1">Tab 1</Tabs.Item>
            <Tabs.Item value="tab-2">Tab 2</Tabs.Item>
            <Tabs.Item value="tab-3">Tab 3</Tabs.Item>
          </Tabs>
        </div>
      ),
      [tab, setTab],
    )

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger>
          <Button>{open ? "Close" : "Open"}</Button>
        </Popover.Trigger>
        <Popover.Header>{header}</Popover.Header>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * Nested: Demonstrates popovers containing other interactive components.
 *
 * Features:
 * - Proper nesting of interactive components
 * - Focus and event handling across nested elements
 * - Multiple overlay layers with correct stacking
 *
 * This pattern is useful for:
 * - Complex application interfaces
 * - Rich editing tools or property panels
 * - Form interfaces requiring nested selection controls
 */
export const Nested: Story = {
  render: function NestedStory() {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger>
          <Button>{open ? "Close" : "Open"}</Button>
        </Popover.Trigger>
        <Popover.Content className="flex gap-4 p-4">
          <Select
            value="option-1"
            onChange={() => {}}
          >
            <Select.Trigger>Select</Select.Trigger>
            <Select.Content>
              <Select.Item value="option-1">Option 1</Select.Item>
              <Select.Item value="option-2">Option 2</Select.Item>
            </Select.Content>
          </Select>

          <Popover>
            <Popover.Trigger>
              <Button>Popover</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
          </Popover>

          <Dropdown disabledNested>
            <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>Option 1</Dropdown.Item>
              <Dropdown.Item>Option 2</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </Popover.Content>
      </Popover>
    )
  },
}

/**
 * AlwaysOpen: Demonstrates a popover that is always open.
 *
 * Features:
 * - Pre-opened state on initial render
 * - Maintains all other popover behaviors
 */
export const AlwaysOpen: Story = {
  render: function AlwaysOpenStory() {
    return (
      <Popover
        open
        draggable
        rememberPosition
      >
        <Popover.Trigger>
          <Button>Open</Button>
        </Popover.Trigger>
        <Popover.Header title="Always Open" />
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
    )
  },
}

/**
 * AutoHeight: Demonstrates a popover with auto height.
 *
 * Features:
 * - Automatically adjusts the height of the popover content
 * - Maintains typical behavior for non-ignored areas
 */
export const AutoHeight: Story = {
  render: function AutoHeightStory() {
    const [open, setOpen] = useState(false)
    const [autoSize, setAutoSize] = useState(true)
    return (
      <div className="flex gap-4">
        <Popover
          open={open}
          onOpenChange={setOpen}
          autoUpdate
          draggable
          autoSize={autoSize}
        >
          <Popover.Trigger>
            <Button>Open</Button>
          </Popover.Trigger>
          <Popover.Header title="Auto Height" />
          <Popover.Content className="flex w-64 flex-col overflow-hidden">
            <ScrollArea className="flex flex-col">
              <ScrollArea.Viewport className="p-3">
                <ScrollArea.Content>{faker.lorem.sentences(50)}</ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </Popover.Content>
        </Popover>

        <Button
          variant="secondary"
          onClick={() => setAutoSize(!autoSize)}
        >
          {autoSize ? "Disable Auto Size" : "Enable Auto Size"}
        </Button>
      </div>
    )
  },
}

export const MultiTrigger: Story = {
  render: function MultiTriggerStory() {
    const [leftValue, setLeftValue] = useState(0)
    const [rightValue, setRightValue] = useState(0)

    const leftTriggerRef = useRef<HTMLButtonElement>(null)
    const rightTriggerRef = useRef<HTMLButtonElement>(null)

    const [currentTrigger, setCurrentTrigger] = useState<"left" | "right" | null>(null)

    const [open, setOpen] = useState(false)

    const handleTriggerClick = (trigger: "left" | "right") => {
      React.startTransition(() => {
        setCurrentTrigger(trigger)
        setOpen(true)
      })
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <NumericInput
          value={leftValue}
          onChange={(value) => setLeftValue(value as number)}
        >
          <NumericInput.Suffix type="action">
            <Dropdown>
              <Dropdown.Trigger
                asChild
                ref={leftTriggerRef}
              >
                <NumericInputMenuTrigger type="action" />
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Option 1</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onMouseUp={() => handleTriggerClick("left")}>
                  Open Popover
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </NumericInput.Suffix>
        </NumericInput>

        <NumericInput
          value={rightValue}
          onChange={(value) => setRightValue(value as number)}
        >
          <NumericInput.Suffix type="action">
            <Dropdown>
              <Dropdown.Trigger
                asChild
                ref={rightTriggerRef}
              >
                <NumericInputMenuTrigger type="action" />
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Option 1</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onMouseUp={() => handleTriggerClick("right")}>
                  Open Popover
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </NumericInput.Suffix>
        </NumericInput>

        <Popover
          triggerRef={currentTrigger === "left" ? leftTriggerRef : rightTriggerRef}
          placement="bottom-end"
          open={open}
          onOpenChange={setOpen}
          draggable
        >
          <Popover.Header title="Action" />
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
      </div>
    )
  },
}

export const Test: Story = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen w-screen items-end justify-center p-8">
        <Story />
      </div>
    ),
  ],
  render: function TestStory() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div>
        <Popover
          draggable
          triggerRef={triggerRef}
          open={open}
          onOpenChange={setOpen}
        >
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
        <Button
          ref={triggerRef}
          onClick={() => setOpen(!open)}
        >
          Open
        </Button>
      </div>
    )
  },
}

/**
 * MultiplePopovers: 测试多个 Popover 同时存在的情况
 *
 * Features:
 * - 多个 Popover 同时存在
 * - 测试开启关闭逻辑
 * - 验证 FloatingTree 的作用
 *
 * 问题重现：
 * 1. 点击第一个 Popover 打开
 * 2. 点击第二个 Popover 时，第一个会先关闭
 * 3. 需要再次点击第二个按钮才能打开第二个 Popover
 */
export const MultiplePopovers: Story = {
  render: function MultiplePopoversStory() {
    const [popover1Open, setPopover1Open] = useState(false)
    const [popover2Open, setPopover2Open] = useState(false)
    const [popover3Open, setPopover3Open] = useState(false)

    return (
      <div className="space-y-8">
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-orange-900">🔍 问题重现测试</h3>
          <p className="text-sm text-orange-800">
            测试场景：在一个画布上有多个 Popover，当第一个 Popover 打开时，点击第二个 Popover 按钮
          </p>
          <div className="mt-2 text-xs text-orange-700">
            <strong>预期行为：</strong>第一个关闭，第二个立即打开
            <br />
            <strong>实际行为：</strong>第一个关闭，需要再次点击第二个按钮才能打开
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-4">
            <h4 className="font-medium">Popover 1</h4>
            <div className="text-sm text-gray-600">状态: {popover1Open ? "开启" : "关闭"}</div>
            <Popover
              open={popover1Open}
              onOpenChange={setPopover1Open}
            >
              <Popover.Trigger>
                <Button variant={popover1Open ? "secondary" : "primary"}>Popover 1</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Popover 1 内容</h5>
                  <p className="text-sm text-gray-600">
                    这是第一个 Popover 的内容。现在保持打开状态，然后点击 Popover 2 按钮测试。
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover1Open(false)}
                  >
                    关闭
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Popover 2</h4>
            <div className="text-sm text-gray-600">状态: {popover2Open ? "开启" : "关闭"}</div>
            <Popover
              open={popover2Open}
              onOpenChange={setPopover2Open}
            >
              <Popover.Trigger>
                <Button variant={popover2Open ? "secondary" : "primary"}>Popover 2</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Popover 2 内容</h5>
                  <p className="text-sm text-gray-600">
                    这是第二个 Popover 的内容。如果点击一次就能打开说明问题已修复。
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover2Open(false)}
                  >
                    关闭
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Popover 3</h4>
            <div className="text-sm text-gray-600">状态: {popover3Open ? "开启" : "关闭"}</div>
            <Popover
              open={popover3Open}
              onOpenChange={setPopover3Open}
            >
              <Popover.Trigger>
                <Button variant={popover3Open ? "secondary" : "primary"}>Popover 3</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-medium">Popover 3 内容</h5>
                  <p className="text-sm text-gray-600">这是第三个 Popover 的内容。</p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover3Open(false)}
                  >
                    关闭
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-2 font-medium">测试步骤：</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
            <li>点击 &quot;Popover 1&quot; 按钮打开第一个 Popover</li>
            <li>保持 Popover 1 打开状态，点击 &quot;Popover 2&quot; 按钮</li>
            <li>观察是否需要点击两次才能打开 Popover 2</li>
            <li>测试 Popover 2 → Popover 3 的切换</li>
            <li>测试 Popover 3 → Popover 1 的切换</li>
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setPopover1Open(false)
              setPopover2Open(false)
              setPopover3Open(false)
            }}
          >
            关闭所有 Popover
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPopover1Open(true)
              setPopover2Open(true)
              setPopover3Open(true)
            }}
          >
            打开所有 Popover（测试重叠）
          </Button>
        </div>
      </div>
    )
  },
}

export const MaxWidth: Story = {
  render: function MaxWidthStory() {
    const [value, setValue] = useState(1)
    return (
      <div>
        <Popover maxWidth={640}>
          <Popover.Trigger>
            <Button>Open</Button>
          </Popover.Trigger>
          <Popover.Content className="p-3">
            {faker.lorem.paragraph(value)}
            <div className="flex gap-2">
              <Button onClick={() => setValue(value + 1)}>Add</Button>
              <Button onClick={() => setValue(value - 1)}>Sub</Button>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}
