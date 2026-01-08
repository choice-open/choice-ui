import { Button, Tooltip, TooltipProvider } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `Tooltip` is a floating label that appears on hover or focus to provide additional context.
 *
 * ### Features
 * - **Simple API**: Use `content` prop for quick tooltip creation
 * - **Compound API**: Use `TooltipTrigger` + `TooltipContent` for full control
 * - **12 Placements**: Support all positions around the trigger element
 * - **2 Variants**: `default` (dark) and `light` styles
 * - **Keyboard Shortcut**: Display shortcuts with `shortcut` prop
 * - **Delay Group**: Smooth transitions via `TooltipProvider`
 *
 * ### Simple API
 * ```tsx
 * <Tooltip content="Helpful tip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 *
 * ### Compound API
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>
 *     <Button>Hover me</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Helpful tip</TooltipContent>
 * </Tooltip>
 * ```
 *
 * ### TooltipProvider
 * Enables delay grouping - after first tooltip appears, subsequent tooltips show instantly.
 * ```tsx
 * <TooltipProvider delay={{ open: 400, close: 200 }}>
 *   <Tooltip content="Bold"><Button>B</Button></Tooltip>
 *   <Tooltip content="Italic"><Button>I</Button></Tooltip>
 * </TooltipProvider>
 * ```
 */

/**
 * Basic: Simple API with `content` prop vs Compound API with separate components.
 */
export const Basic: Story = {
  render: () => (
    <div className="flex gap-8">
      <Tooltip content="Simple API tooltip">
        <Button>Simple API</Button>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger>
          <Button variant="secondary">Compound API</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Compound API tooltip</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

/**
 * Placements: 12 positions - top/right/bottom/left with start/end variants.
 */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-2">
      {/* Row 1 */}
      <div />
      <Tooltip
        content="Tooltip at top-start position"
        placement="top-start"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          top-start
        </Button>
      </Tooltip>
      <Tooltip
        content="Tooltip at top position"
        placement="top"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          top
        </Button>
      </Tooltip>
      <Tooltip
        content="Tooltip at top-end position"
        placement="top-end"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          top-end
        </Button>
      </Tooltip>
      <div />

      {/* Row 2 */}
      <Tooltip
        content="Tooltip at left-start position"
        placement="left-start"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          left-start
        </Button>
      </Tooltip>
      <div />
      <div />
      <div />
      <Tooltip
        content="Tooltip at right-start position"
        placement="right-start"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          right-start
        </Button>
      </Tooltip>

      {/* Row 3 */}
      <Tooltip
        content="Tooltip at left position"
        placement="left"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          left
        </Button>
      </Tooltip>
      <div />
      <div />
      <div />
      <Tooltip
        content="Tooltip at right position"
        placement="right"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          right
        </Button>
      </Tooltip>

      {/* Row 4 */}
      <Tooltip
        content="Tooltip at left-end position"
        placement="left-end"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          left-end
        </Button>
      </Tooltip>
      <div />
      <div />
      <div />
      <Tooltip
        content="Tooltip at right-end position"
        placement="right-end"
      >
        <Button
          variant="secondary"
          className="h-12 w-full"
        >
          right-end
        </Button>
      </Tooltip>

      {/* Row 5 */}
      <div />
      <Tooltip
        content="Tooltip at bottom-start position"
        placement="bottom-start"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          bottom-start
        </Button>
      </Tooltip>
      <Tooltip
        content="Tooltip at bottom position"
        placement="bottom"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          bottom
        </Button>
      </Tooltip>
      <Tooltip
        content="Tooltip at bottom-end position"
        placement="bottom-end"
      >
        <Button
          variant="secondary"
          className="w-full"
        >
          bottom-end
        </Button>
      </Tooltip>
      <div />
    </div>
  ),
}

/**
 * Variants: `default` (dark) and `light` visual styles.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex gap-8">
      <Tooltip
        content="Dark background"
        variant="default"
      >
        <Button variant="secondary">Default</Button>
      </Tooltip>
      <Tooltip
        content="Light with border"
        variant="light"
      >
        <Button variant="secondary">Light</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * Options: Arrow visibility (`withArrow`) and distance (`offset`).
 */
export const Options: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Tooltip
          content="With arrow (default)"
          withArrow
        >
          <Button variant="secondary">Arrow</Button>
        </Tooltip>
        <Tooltip
          content="No arrow"
          withArrow={false}
        >
          <Button variant="secondary">No Arrow</Button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip
          content="offset: 4"
          offset={4}
        >
          <Button variant="secondary">Offset 4</Button>
        </Tooltip>
        <Tooltip
          content="offset: 8 (default)"
          offset={8}
        >
          <Button variant="secondary">Offset 8</Button>
        </Tooltip>
        <Tooltip
          content="offset: 16"
          offset={16}
        >
          <Button variant="secondary">Offset 16</Button>
        </Tooltip>
      </div>
    </div>
  ),
}

/**
 * Disabled: Prevent tooltip from appearing with `disabled` prop.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip
        content="Visible"
        disabled={false}
      >
        <Button variant="secondary">Enabled</Button>
      </Tooltip>
      <Tooltip
        content="Hidden"
        disabled
      >
        <Button variant="secondary">Disabled</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * Controlled: Manage open state externally with `open` and `onOpenChange`.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex flex-col items-center gap-4">
        <Tooltip
          content="Controlled tooltip"
          open={open}
          onOpenChange={setOpen}
        >
          <Button variant="secondary">Hover or click buttons below</Button>
        </Tooltip>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => setOpen(true)}
          >
            Open
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    )
  },
}

/**
 * Shortcut: Display keyboard shortcuts with `shortcut` prop.
 * Supports modifiers: `command`, `ctrl`, `shift`, `alt`, `option`.
 */
export const Shortcut: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip
        content="Save"
        shortcut={{ modifier: ["command"], keys: "S" }}
      >
        <Button variant="secondary">⌘S</Button>
      </Tooltip>
      <Tooltip
        content="Copy"
        shortcut={{ modifier: ["command"], keys: "C" }}
      >
        <Button variant="secondary">⌘C</Button>
      </Tooltip>
      <Tooltip
        content="Undo"
        shortcut={{ modifier: ["command", "shift"], keys: "Z" }}
      >
        <Button variant="secondary">⇧⌘Z</Button>
      </Tooltip>
    </div>
  ),
}

/**
 * DelayGroup: Use `TooltipProvider` for smooth transitions between tooltips.
 * First tooltip has delay, subsequent ones appear instantly while moving quickly.
 */
export const DelayGroup: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-body-small mb-4 text-gray-500">
          With TooltipProvider: hover first, wait 400ms, then move quickly between buttons.
        </p>
        <TooltipProvider delay={{ open: 400, close: 200 }}>
          <div className="flex gap-4">
            <Tooltip content="First - 400ms delay">
              <Button>First</Button>
            </Tooltip>
            <Tooltip content="Second - instant">
              <Button>Second</Button>
            </Tooltip>
            <Tooltip content="Third - instant">
              <Button>Third</Button>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div>
        <p className="text-body-small mb-4 text-gray-500">
          Without TooltipProvider: independent tooltips.
        </p>
        <div className="flex gap-4">
          <Tooltip content="Independent 1">
            <Button variant="secondary">First</Button>
          </Tooltip>
          <Tooltip content="Independent 2">
            <Button variant="secondary">Second</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
}

/**
 * Interactive: Control whether tooltip can be hovered and stays visible.
 *
 * - **interactive={true}** (default): Tooltip stays visible when mouse moves over it.
 *   You can hover on the tooltip content itself.
 *
 * - **interactive={false}**: Tooltip dismisses immediately when mouse leaves the trigger.
 *   Mouse cannot hover over tooltip content (pointer-events: none).
 *   No text cursor appears when hovering over tooltip.
 *
 * Try hovering over both buttons and moving your mouse to the tooltip content:
 * - Left button: You can hover on the tooltip, it stays visible
 * - Right button: Tooltip disappears immediately when you move away from the button
 */
export const Interactive: Story = {
  render: () => (
    <TooltipProvider delay={{ close: 1000 }}>
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <Tooltip
              content="Interactive tooltip (default) - hover me!"
              interactive={true}
            >
              <Button variant="secondary">Interactive (default)</Button>
            </Tooltip>
            <p className="text-body-small max-w-[200px] text-center text-gray-500">
              Hover button, then move mouse to tooltip - it stays visible
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Tooltip
              content="Non-interactive tooltip - try hovering!"
              interactive={false}
            >
              <Button variant="secondary">Non-Interactive</Button>
            </Tooltip>
            <p className="text-body-small max-w-[200px] text-center text-gray-500">
              Hover button, then move mouse away - tooltip disappears immediately
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
}
