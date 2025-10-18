import { faker } from "@faker-js/faker"
import type { Placement as FloatingPlacement } from "@floating-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
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
import { tcx } from "../../utils"

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
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
        <div className="space-y-2">
          <h3>Click (Default)</h3>
          <Popover>
            <Popover.Trigger>
              <Button>Click to open</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
          </Popover>

          <h3>Hover</h3>
          <Popover interactions="hover">
            <Popover.Trigger>
              <Button>Hover to open</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
          </Popover>
        </div>

        <div className="space-y-2">
          <h3>Focus</h3>
          <Popover interactions="focus">
            <Popover.Trigger>
              <Button>Focus to open</Button>
            </Popover.Trigger>
            <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(2)}</Popover.Content>
          </Popover>

          <h3>Manual Control</h3>
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
 * ControlledFixed: Demonstrates a controlled popover with fixed position.
 *
 * Features:
 * - Fixed position
 * - Controlled open state
 * - Toggle count
 * - Force open/close
 *
 * This pattern is useful for:
 * - Popovers that need to be in a specific location
 * - Dashboard interfaces where popovers need to be in a specific location
 * - Popovers that need to be in a specific location
 *
 * Note: This pattern is based on the correct implementation in the Floating UI official
 * documentation.
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
      <div className="w-md space-y-6">
        <div className="rounded-xl border p-4">
          <h3 className="font-strong mb-2">Controlled</h3>
          <p>
            Based on the correct implementation in the Floating UI official documentation, it solves
            the problem of not being able to display again after closing once
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 space-y-2">
            <div className="font-strong">
              Current state:
              <span className={tcx(open ? "text-success-foreground" : "text-danger-foreground")}>
                {open ? " OPEN" : " CLOSED"}
              </span>
            </div>
            <p>
              Toggle count: <span className="font-mono">{toggleCount}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleToggle}
              variant={open ? "destructive" : "success"}
            >
              {open ? "Close" : "Open"} Popover
            </Button>

            <Button
              onClick={() => setOpen(true)}
              disabled={open}
              variant="success"
            >
              Force open
            </Button>

            <Button
              onClick={() => setOpen(false)}
              disabled={!open}
              variant="destructive"
            >
              Force close
            </Button>
          </div>
        </div>

        <Popover
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Popover.Trigger>
            <Button>Popover trigger</Button>
          </Popover.Trigger>
          <Popover.Content className="w-80 p-4">
            <div className="space-y-3">
              <h4 className="font-strong">Controlled</h4>
              <p className="text-secondary-foreground">
                This Popover uses controlled mode, based on the correct implementation in the
                Floating UI official documentation.
              </p>

              <div className="text-secondary-foreground">Toggle count: {toggleCount}</div>
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
 * OutsidePressIgnoreArray: Demonstrates excluding specific elements from outside click dismissal.
 *
 * Features:
 * - Exclude specific elements from outside click dismissal
 * - Maintains typical behavior for non-ignored areas
 * - Uses array value to determine if specific elements should be ignored
 *
 * This pattern is useful for:
 * - Complex interfaces with related but separate UI elements
 * - Preventing accidental dismissal for important popovers
 * - Creating modal-like experiences without full modals
 */
export const OutsidePressIgnoreArray: Story = {
  render: function OutsidePressIgnoreArrayStory() {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex items-center gap-4">
        <div className="outside-press-ignore-1 rounded-xl border p-16">Outside Press Ignore 1</div>

        <Popover
          open={open}
          onOpenChange={setOpen}
          outsidePressIgnore={["outside-press-ignore-1", "outside-press-ignore-2"]}
        >
          <Popover.Trigger>
            <Button>{open ? "Close" : "Open"}</Button>
          </Popover.Trigger>
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>

        <div className="outside-press-ignore-2 rounded-xl border p-16">Outside Press Ignore 2</div>
      </div>
    )
  },
}

/**
 * OutsidePressIgnoreBoolean: Demonstrates excluding all elements from outside click dismissal.
 *
 * Features:
 * - Exclude all elements from outside click dismissal
 * - Maintains typical behavior for non-ignored areas
 * - Uses boolean value to determine if all elements should be ignored
 *
 * This pattern is useful for:
 * - Complex interfaces with related but separate UI elements
 * - Preventing accidental dismissal for important popovers
 * - Creating modal-like experiences without full modals
 */

export const OutsidePressIgnoreBoolean: Story = {
  render: function OutsidePressIgnoreBooleanStory() {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        outsidePressIgnore={true}
      >
        <Popover.Header title="Outside Press Ignore Boolean" />
        <Popover.Trigger>
          <Button>{open ? "Close" : "Open"}</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
      </Popover>
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
      <div className="w-md space-y-6">
        <div className="rounded-xl border p-4">
          <h3 className="font-strong mb-2">Test</h3>
          <p>
            Test scenario: There are multiple Popovers on a canvas, when the first Popover is
            opened, click the second Popover button
          </p>
          <div className="mt-2">
            <strong>Expected behavior:</strong> The first Popover closes, and the second opens
            immediately
            <br />
            <strong>Actual behavior:</strong> The first Popover closes, and the second needs to be
            clicked again to open
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-4">
            <h4 className="font-strong">Popover 1</h4>
            <div className="text-body-small text-gray-600">
              Status: {popover1Open ? "Open" : "Close"}
            </div>
            <Popover
              open={popover1Open}
              onOpenChange={setPopover1Open}
            >
              <Popover.Trigger>
                <Button variant={popover1Open ? "secondary" : "primary"}>Popover 1</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-strong">Popover 1 content</h5>
                  <p className="text-body-small text-gray-600">
                    This is the content of the first Popover. Now keep it open, then click the
                    Popover 2 button to test.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover1Open(false)}
                  >
                    Close
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>

          <div className="space-y-4">
            <h4 className="font-strong">Popover 2</h4>
            <div className="text-body-small text-gray-600">
              Status: {popover2Open ? "Open" : "Close"}
            </div>
            <Popover
              open={popover2Open}
              onOpenChange={setPopover2Open}
            >
              <Popover.Trigger>
                <Button variant={popover2Open ? "secondary" : "primary"}>Popover 2</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-strong">Popover 2 content</h5>
                  <p className="text-body-small text-gray-600">
                    This is the content of the second Popover. If it opens with one click, the
                    problem has been fixed.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover2Open(false)}
                  >
                    Close
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>

          <div className="space-y-4">
            <h4 className="font-strong">Popover 3</h4>
            <div className="text-body-small text-gray-600">
              Status: {popover3Open ? "Open" : "Close"}
            </div>
            <Popover
              open={popover3Open}
              onOpenChange={setPopover3Open}
            >
              <Popover.Trigger>
                <Button variant={popover3Open ? "secondary" : "primary"}>Popover 3</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">
                <div className="space-y-2">
                  <h5 className="font-strong">Popover 3 content</h5>
                  <p className="text-body-small text-gray-600">
                    This is the content of the third Popover.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setPopover3Open(false)}
                  >
                    Close
                  </Button>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="font-strong mb-2">Test steps:</h4>
          <ol className="text-body-small list-inside list-decimal space-y-1 text-gray-700">
            <li>Click the &quot;Popover 1&quot; button to open the first Popover</li>
            <li>Keep the Popover 1 open, click the &quot;Popover 2&quot; button</li>
            <li>Observe if you need to click twice to open Popover 2</li>
            <li>Test the switch from Popover 2 to Popover 3</li>
            <li>Test the switch from Popover 3 to Popover 1</li>
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
            Close all Popovers
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPopover1Open(true)
              setPopover2Open(true)
              setPopover3Open(true)
            }}
          >
            Open all Popovers (test overlapping)
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

/**
 * CloseOnEscape: Demonstrates the closeOnEscape prop functionality.
 * By default, popovers can be closed with the ESC key. This story shows
 * two popovers - one with ESC key enabled (default) and one with it disabled.
 */
export const CloseOnEscape: Story = {
  render: function CloseOnEscapeStory() {
    const [escEnabledOpen, setEscEnabledOpen] = useState(false)
    const [escDisabledOpen, setEscDisabledOpen] = useState(false)

    return (
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <Button onClick={() => setEscEnabledOpen(!escEnabledOpen)}>
            Popover with ESC (Default)
          </Button>
          <p className="text-secondary-foreground text-body-small">Press ESC to close</p>

          <Popover
            open={escEnabledOpen}
            onOpenChange={setEscEnabledOpen}
            closeOnEscape={true}
          >
            <Popover.Trigger>
              <Button style={{ display: "none" }}>Hidden Trigger</Button>
            </Popover.Trigger>
            <Popover.Content className="w-72 p-3">
              <p>This popover can be closed by pressing the ESC key.</p>
              <p className="text-secondary-foreground text-body-small mt-2">
                Try pressing ESC to close this popover.
              </p>
            </Popover.Content>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => setEscDisabledOpen(!escDisabledOpen)}>Popover without ESC</Button>
          <p className="text-secondary-foreground text-body-small">ESC key disabled</p>

          <Popover
            open={escDisabledOpen}
            onOpenChange={setEscDisabledOpen}
            closeOnEscape={false}
          >
            <Popover.Trigger>
              <Button style={{ display: "none" }}>Hidden Trigger</Button>
            </Popover.Trigger>
            <Popover.Content className="w-72 p-3">
              <p>This popover cannot be closed by pressing the ESC key.</p>
              <p className="text-secondary-foreground text-body-small mt-2">
                You must click outside or use the button to close this popover.
              </p>
            </Popover.Content>
          </Popover>
        </div>
      </div>
    )
  },
}

/**
 * EventPropagation: Verifies that ESC key events do not propagate to window.
 * Press ESC outside popover to increment counter, then press ESC inside popover
 * to close it without incrementing the counter.
 */
export const EventPropagation: Story = {
  render: function EventPropagationStory() {
    const [open, setOpen] = useState(false)
    const [escCount, setEscCount] = useState(0)

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setEscCount((prev) => prev + 1)
        }
      }

      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }, [])

    return (
      <div className="flex flex-col gap-4">
        <p>
          Window ESC count: <strong>{escCount}</strong>
        </p>
        <p className="text-secondary-foreground text-body-small">
          Press ESC to increment. Open popover and press ESC - counter should NOT change.
        </p>

        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <Popover.Trigger>
            <Button>Open Popover</Button>
          </Popover.Trigger>
          <Popover.Content className="w-72 p-3">
            Press ESC to close. The window counter should not increment.
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}

/**
 * MatchTriggerWidth: Demonstrates the matchTriggerWidth prop functionality.
 * By default, popovers will not match the width of the trigger. This story shows
 * two popovers - one with matchTriggerWidth enabled and one with it disabled.
 */
export const MatchTriggerWidth: Story = {
  render: function MatchTriggerWidthStory() {
    const [matchTriggerWidthOpen, setMatchTriggerWidthOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <Button
            ref={triggerRef}
            onClick={() => setMatchTriggerWidthOpen(!matchTriggerWidthOpen)}
          >
            Popover with matchTriggerWidth
          </Button>

          <Popover
            triggerRef={triggerRef}
            open={matchTriggerWidthOpen}
            onOpenChange={setMatchTriggerWidthOpen}
            matchTriggerWidth={true}
          >
            <Popover.Content className="p-3">
              <p>This popover will match the width of the trigger.</p>
            </Popover.Content>
          </Popover>
        </div>
      </div>
    )
  },
}

/**
 * Popover footer
 */
export const PopoverFooter: Story = {
  render: function PopoverFooterStory() {
    const [popoverOpen, setPopoverOpen] = useState(false)
    return (
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <Popover.Trigger>
          <Button variant={popoverOpen ? "secondary" : "primary"}>Popover</Button>
        </Popover.Trigger>
        <Popover.Content className="w-64 p-3">
          <div className="space-y-2">
            <h5 className="font-strong">Popover content</h5>
            <p className="text-body-small text-gray-600">This is the content of the Popover.</p>
          </div>
        </Popover.Content>
        <Popover.Footer>
          <Button
            variant="secondary"
            onClick={() => setPopoverOpen(false)}
          >
            Close
          </Button>
        </Popover.Footer>
      </Popover>
    )
  },
}
