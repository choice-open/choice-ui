import { faker } from "@faker-js/faker"
import type { Placement as FloatingPlacement } from "@floating-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { Dropdown } from "../dropdown"
import { Input } from "../input"
import { Select } from "../select"
import { Tabs } from "../tabs"
import { Popover } from "./popover"
import { Scroll } from "../scroll"

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
 * - Hover interaction (shows on mouseover)
 * - Click interaction (shows on click)
 * - Focus interaction (shows on focus)
 *
 * Usage Guidelines:
 * - Hover: Use for supplementary information that doesn't require action
 * - Click: Use for interactive content or required user actions
 * - Focus: Use for form-related hints or contextual help
 */
export const Interactions: Story = {
  render: function InteractionsStory() {
    return (
      <>
        <Popover interactions="hover">
          <Popover.Trigger>
            <Button>Hover</Button>
          </Popover.Trigger>
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>

        <Popover interactions="click">
          <Popover.Trigger>
            <Button>Click</Button>
          </Popover.Trigger>
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>

        <Popover interactions="focus">
          <Popover.Trigger>
            <Input placeholder="Use tab to focus" />
          </Popover.Trigger>
          <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
        </Popover>
      </>
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

    return (
      <>
        <div className="grid grid-cols-3 gap-2">
          {PLACEMENTS.map((option) => {
            return (
              <Button
                ref={(node) => {
                  if (node) {
                    triggerRefs.current.set(option.value, node)
                  }
                }}
                key={option.value}
                onMouseDown={() => {
                  setPlacement(option.value as FloatingPlacement)
                  setOpen(true)
                }}
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
      <div className="outside-press-ignore rounded-lg border p-16">
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
            <Scroll className="flex flex-col">
              <Scroll.Viewport className="p-3">{faker.lorem.sentences(50)}</Scroll.Viewport>
            </Scroll>
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
