import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import { Button } from "../button"
import { Dropdown } from "../dropdown"
import { Popover } from "../popover"
import { Select } from "../select"
import { Dialog, DialogPosition } from "./dialog"
import { ScrollArea } from "../scroll-area"
import { Checkbox } from "../checkbox"
import { NumericInput } from "../numeric-input"
import { FillWidth } from "@choiceform/icons-react"
import { Input } from "../input"

const meta: Meta<typeof Dialog> = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
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
 * InitialPosition: Demonstrates a dialog with preset initial positions.
 * Use the `initialPosition` prop to set the dialog's starting position without manual x,y coordinates.
 * Supports: left-top, center-top, right-top, left-center, center, right-center, left-bottom, center-bottom, right-bottom.
 */
export const InitialPosition: Story = {
  render: function InitialPositionStory() {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState<DialogPosition>("left-top")
    const [rememberPosition, setRememberPosition] = useState(false)
    const [resizable, setResizable] = useState({ width: false, height: false })
    const [rememberSize, setRememberSize] = useState(false)
    const [positionPadding, setPositionPadding] = useState(32)

    return (
      <>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="position-select">Position:</label>
              <Select
                value={position}
                onChange={(value) => setPosition(value as DialogPosition)}
              >
                <Select.Trigger>
                  <Select.Value>{position}</Select.Value>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="left-top">Left Top</Select.Item>
                  <Select.Item value="center-top">Center Top</Select.Item>
                  <Select.Item value="right-top">Right Top</Select.Item>
                  <Select.Item value="left-center">Left Center</Select.Item>
                  <Select.Item value="center">Center</Select.Item>
                  <Select.Item value="right-center">Right Center</Select.Item>
                  <Select.Item value="left-bottom">Left Bottom</Select.Item>
                  <Select.Item value="center-bottom">Center Bottom</Select.Item>
                  <Select.Item value="right-bottom">Right Bottom</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <Checkbox
              value={rememberPosition}
              onChange={setRememberPosition}
            >
              <Checkbox.Label>Remember Position</Checkbox.Label>
            </Checkbox>
            <div className="flex items-center gap-2">
              <Checkbox
                value={resizable.width}
                onChange={() => setResizable({ ...resizable, width: !resizable.width })}
              >
                <Checkbox.Label>Resizable Width</Checkbox.Label>
              </Checkbox>
              <Checkbox
                value={resizable.height}
                onChange={() => setResizable({ ...resizable, height: !resizable.height })}
              >
                <Checkbox.Label>Resizable Height</Checkbox.Label>
              </Checkbox>
            </div>
            <Checkbox
              value={rememberSize}
              onChange={setRememberSize}
            >
              <Checkbox.Label>Remember Size</Checkbox.Label>
            </Checkbox>
            <div className="flex items-center gap-2">
              <label htmlFor="position-padding-input">Position Padding:</label>
              <NumericInput
                value={positionPadding}
                onChange={(value) => setPositionPadding(value as number)}
              >
                <NumericInput.Prefix>
                  <FillWidth />
                </NumericInput.Prefix>
              </NumericInput>
            </div>
          </div>
        </div>
        <Dialog
          draggable
          open={open}
          onOpenChange={setOpen}
          initialPosition={position}
          positionPadding={positionPadding}
          rememberPosition={rememberPosition}
          rememberSize={rememberSize}
          resizable={resizable}
          defaultWidth={320}
          defaultHeight={240}
          minWidth={200}
          minHeight={150}
          maxWidth={800}
          maxHeight={600}
        >
          <Dialog.Header title={`Dialog at ${position}`} />
          <Dialog.Content className="w-full p-4">
            <p className="mb-2">
              This dialog starts at the <strong>{position}</strong> position.
            </p>
            <p className="text-secondary-foreground text-body-small break-words">
              You can drag this dialog around. Change the position in the dropdown and reopen to see
              different starting positions.
            </p>
          </Dialog.Content>
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
 * - Use the corner handle (bottom-right) to resize both width and height simultaneously
 * - Cursor styles are maintained throughout the resize operation for better UX
 * - Press ESC to cancel ongoing resize operations
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
          maxWidth={1024}
          maxHeight={768}
          defaultWidth={256}
          defaultHeight={480}
        >
          <Dialog.Header title="Resizable Dialog Title" />
          <Dialog.Content className="w-full min-w-0 overflow-hidden">
            <ScrollArea
              className="h-full"
              scrollbarMode="large-b"
            >
              <ScrollArea.Viewport className="h-full p-4">
                <ScrollArea.Content>{faker.lorem.paragraphs(3)}</ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
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
            <ScrollArea
              className="h-full"
              scrollbarMode="large-b"
            >
              <ScrollArea.Viewport className="h-full p-4">
                <ScrollArea.Content>{faker.lorem.paragraphs(3)}</ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * CornerResize: Demonstrates the corner resize handle for simultaneous width and height adjustment.
 * The 16x16 corner handle appears in the bottom-right when both width and height resize are enabled.
 * This provides an intuitive way to resize the dialog in both dimensions at once.
 *
 * Features:
 * - Persistent cursor styles during resize operations (even when mouse leaves the handle)
 * - Three different cursor styles for different resize modes
 * - ESC key cancellation support
 * - Automatic cleanup when window loses focus
 */
export const CornerResize: Story = {
  render: function CornerResizeStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Corner Resize Dialog</Button>
        <Dialog
          draggable
          overlay
          resizable={{ width: true, height: true }}
          open={open}
          onOpenChange={setOpen}
          defaultWidth={320}
          defaultHeight={240}
          minWidth={200}
          minHeight={150}
          maxWidth={800}
          maxHeight={600}
        >
          <Dialog.Header title="Corner Resize Demo" />
          <Dialog.Content className="w-full min-w-0 overflow-hidden">
            <ScrollArea
              className="h-full"
              scrollbarMode="large-b"
            >
              <ScrollArea.Viewport className="h-full p-4">
                <ScrollArea.Content className="space-y-2">
                  <p>
                    Use the corner handle (bottom-right) to resize both width and height
                    simultaneously.
                  </p>
                  <p>You can also use the individual handles:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Right edge: width only</li>
                    <li>Bottom edge: height only</li>
                    <li>Bottom-right corner: both dimensions</li>
                  </ul>
                  <p>{faker.lorem.paragraph(2)}</p>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
            </ScrollArea>
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

export const Footer: Story = {
  render: function FooterStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Dialog Title" />
          <Dialog.Content className="flex flex-col gap-4 p-4">
            {faker.lorem.paragraphs(3)}
          </Dialog.Content>
          <Dialog.Footer className="justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Dialog.Footer>
        </Dialog>
      </>
    )
  },
}

/**
 * FocusManagerProps: Demonstrates how to customize the focus manager props.
 * Use the `focusManagerProps` prop to customize the focus manager props.
 */
export const FocusManagerProps: Story = {
  render: function FocusManagerPropsStory() {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(!open)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="Dialog Title" />
          <Dialog.Content className="flex flex-col gap-4 p-4">
            <Input placeholder="Input" />
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}

/**
 * CloseOnEscape: Demonstrates the closeOnEscape prop functionality.
 * By default, dialogs can be closed with the ESC key. This story shows
 * two dialogs - one with ESC key enabled (default) and one with it disabled.
 */
export const CloseOnEscape: Story = {
  render: function CloseOnEscapeStory() {
    const [escEnabledOpen, setEscEnabledOpen] = useState(false)
    const [escDisabledOpen, setEscDisabledOpen] = useState(false)

    return (
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Button onClick={() => setEscEnabledOpen(true)}>Dialog with ESC (Default)</Button>
          <p className="text-secondary-foreground text-body-small">Press ESC to close</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => setEscDisabledOpen(true)}>Dialog without ESC</Button>
          <p className="text-secondary-foreground text-body-small">ESC key disabled</p>
        </div>

        {/* Dialog with ESC enabled (default behavior) */}
        <Dialog
          open={escEnabledOpen}
          onOpenChange={setEscEnabledOpen}
          closeOnEscape={true}
        >
          <Dialog.Header title="ESC Key Enabled" />
          <Dialog.Content className="w-96 p-3">
            <p>This dialog can be closed by pressing the ESC key.</p>
            <p className="text-secondary-foreground text-body-small mt-2">
              Try pressing ESC to close this dialog.
            </p>
          </Dialog.Content>
        </Dialog>

        {/* Dialog with ESC disabled */}
        <Dialog
          open={escDisabledOpen}
          onOpenChange={setEscDisabledOpen}
          closeOnEscape={false}
        >
          <Dialog.Header title="ESC Key Disabled" />
          <Dialog.Content className="w-96 p-3">
            <p>This dialog cannot be closed by pressing the ESC key.</p>
            <p className="text-secondary-foreground text-body-small mt-2">
              You must use the close button or click outside (if enabled) to close this dialog.
            </p>
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

/**
 * EventPropagation: Verifies that ESC key events do not propagate to window.
 * Press ESC outside dialog to increment counter, then press ESC inside dialog
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
          Press ESC to increment. Open dialog and press ESC - counter should NOT change.
        </p>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Header title="ESC Event Test" />
          <Dialog.Content className="w-96 p-4">
            Press ESC to close. The window counter should not increment.
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}
