import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Button } from "../button"
import { Dropdown } from "../dropdown"
import { Popover } from "../popover"
import { Scroll } from "../scroll"
import { Select } from "../select"
import { Dialog } from "./dialog"

const meta: Meta<typeof Dialog> = {
  title: "Overlays/Dialog",
  component: Dialog,
}

export default meta

type Story = StoryObj<typeof Dialog>

/**
 * `Dialog` is a versatile overlay component for displaying modal or non-modal content.
 *
 * Features:
 * - Modal and non-modal display modes
 * - Draggable dialog window with customizable handle
 * - Resizable width and height options
 * - Customizable backdrop/overlay
 * - Optional outside click dismissal
 * - Header component with built-in close button
 * - Structured content organization
 * - Proper focus management
 *
 * Usage Guidelines:
 * - Use for important information that requires user attention
 * - Control visibility with `open` and `onOpenChange` props
 * - Include a clear title in the Dialog.Header
 * - Provide close/cancel actions for users
 * - Consider using `outsidePress` for non-critical dialogs
 *
 * Accessibility:
 * - Proper focus management when opened/closed
 * - Keyboard navigation and dismissal
 * - Screen reader announcements for modal state
 * - ARIA attributes for semantic structure
 */

/**
 * Basic: Demonstrates the standard Dialog component with header and content.
 * This simple example shows the minimal required setup with controlled open state.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * Draggable: Demonstrates a dialog that can be moved around the screen.
 * Enable this feature with the `draggable` prop to allow repositioning.
 * The dialog header acts as the drag handle by default.
 */
export const Draggable: Story = {
  render: function DragStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          draggable
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Draggable Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * RememberPosition: Demonstrates a dialog that remembers its position when closed.
 * Enable this feature with the `rememberPosition` prop to keep the dialog in the same position when closed.
 */
export const RememberPosition: Story = {
  render: function RememberPositionStory() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          draggable
          rememberPosition
          open={open}
          onOpenChange={setOpen}
          outsidePress
        >
          <Dialog.Header title="Remember Position Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

export const Overlay: Story = {
  render: function OverlayStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          overlay
          draggable
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Overlay Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * CustomBackdrop: Demonstrates how to customize the backdrop component.
 * Use Dialog.Backdrop to explicitly include and customize the backdrop element.
 * This provides more control over the appearance and behavior of the overlay.
 */
export const CustomBackdrop: Story = {
  render: function CustomBackdropStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          overlay
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Backdrop />
          <Dialog.Header title="Custom Backdrop Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * OutsidePress: Demonstrates a dialog that closes when clicking outside.
 * Enable with the `outsidePress` prop to allow dismissal by clicking the backdrop.
 * Use for less critical dialogs where quick dismissal is appropriate.
 */
export const OutsidePress: Story = {
  render: function OutsidePressStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          outsidePress
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Outside Press Dialog Title" />
          <Dialog.Content className="w-96 p-3">{faker.lorem.paragraphs(3)}</Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * Resizable: Demonstrates a dialog that can be resized by the user.
 * Enable with the `resizable` prop and specify which dimensions can be adjusted.
 * When using resizable dialogs:
 * - Include scrollable content to handle overflow
 * - Set appropriate min/max dimensions
 * - Consider how content reflows when resized
 */
export const Resizable: Story = {
  render: function ResizableStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          draggable
          overlay
          resizable={{ width: true, height: true }}
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Resizable Dialog Title" />
          <Dialog.Content className="max-w-xl min-w-md overflow-hidden">
            <Scroll
              className="h-full"
              scrollbarMode="large-b"
            >
              <Scroll.Viewport className="h-full p-4">{faker.lorem.paragraphs(3)}</Scroll.Viewport>
            </Scroll>
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * RememberSize: Demonstrates a dialog that remembers its size when closed.
 * Enable this feature with the `rememberSize` prop to keep the dialog in the same size when closed.
 */
export const RememberSize: Story = {
  render: function RememberSizeStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          draggable
          rememberSize
          rememberPosition
          resizable={{ width: true, height: true }}
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Remember Size Dialog Title" />
          <Dialog.Content className="max-w-96 overflow-hidden">
            <Scroll
              className="h-full"
              scrollbarMode="large-b"
            >
              <Scroll.Viewport className="h-full p-4">{faker.lorem.paragraphs(3)}</Scroll.Viewport>
            </Scroll>
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * Nested: Demonstrates how dialogs work with other overlay components.
 * Shows proper stacking behavior with dropdowns, selects, and popovers.
 * Dialog manages focus and keyboard interactions correctly with nested components.
 */
export const Nested: Story = {
  render: function NestedStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          open={open}
          outsidePress
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Nested Dialog Title" />
          <Dialog.Content className="flex w-96 gap-4 p-4">
            <Select
              value="option-1"
              onChange={() => {}}
            >
              <Select.Trigger>Open</Select.Trigger>
              <Select.Content>
                <Select.Item value="option-1">Option 1</Select.Item>
                <Select.Item value="option-2">Option 2</Select.Item>
                <Select.Item value="option-3">Option 3</Select.Item>
              </Select.Content>
            </Select>
            <Popover>
              <Popover.Trigger>
                <Button>Open</Button>
              </Popover.Trigger>
              <Popover.Content className="w-64 p-3">{faker.lorem.paragraph(3)}</Popover.Content>
            </Popover>
            <Dropdown>
              <Dropdown.Trigger>Open</Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Option 1</Dropdown.Item>
                <Dropdown.Item>Option 2</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}
