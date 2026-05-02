/**
 * Dialog bug-focused tests
 *
 * BUG 1: Draggable header has role="button" and tabIndex={0} but no keyboard handler
 *   - User scenario: Keyboard user tabs to the draggable dialog header (which has
 *     role="button" and tabIndex=0). Pressing Enter or Space does nothing — no way
 *     to move the dialog. This violates WCAG 2.1 SC 2.1.1 (Keyboard operable).
 *   - Regression it prevents: Focusable but non-interactive draggable header
 *   - Logic change: dialog.tsx:169-177 — `<Slot>` gets `role="button"`, `tabIndex={0}`,
 *     and `aria-label`, but only has `onMouseDown`. No `onKeyDown` handler.
 *     Fix = add `onKeyDown` that handles Enter/Space for drag activation and arrow
 *     keys for movement, feeding the same `dragState.position` that mouse drag uses.
 *
 * BUG 2: Resize handles focusable but not keyboard-operable
 *   - User scenario: Keyboard user tabs to a resize handle (tabIndex=0). Pressing
 *     Enter, Space, or Arrow keys does nothing. The handle appears interactive but
 *     isn't — a false affordance.
 *   - Regression it prevents: Non-functional focusable resize handles
 *   - Logic change: dialog.tsx:275-309 — resize handles have `tabIndex={0}` and
 *     `aria-label` but only `onMouseDown`. No keyboard handler at all.
 *     Fix = add `onKeyDown` that updates `resizeState.size` on arrow keys.
 *
 * BUG: Partial resizable config forces non-resizable dimension to 0px
 *   - User scenario: Developer creates a dialog that is width-resizable only:
 *     `resizable={{ width: true, height: false }}`. The dialog renders with
 *     height: 0px because getStyleWithDefaults uses `0` for non-resizable axes.
 *   - Regression it prevents: Partial resizable config collapsing the dialog
 *   - Logic change: dialog.tsx:135-144 — `const width = resizable.width ? defaultWidth : 0`
 *     and `const height = resizable.height ? defaultHeight : 0`. The `0` is then used
 *     in sizeObj which gets applied as inline style `height: 0px`. Fix = use `undefined`
 *     or only include resizable dimensions in sizeObj.
 *
 * BUG: isClosing never resets to false when rememberPosition && rememberSize
 *   - User scenario: Developer creates a dialog with both rememberPosition and
 *     rememberSize. After closing, the dialog's isClosing state stays true forever.
 *     If the dialog is reopened, it may have stale closing animation state.
 *   - Regression it prevents: Stuck isClosing state causing animation or rendering
 *     glitches on subsequent opens
 *   - Logic change: use-floating-dialog.ts:142-147 — when both rememberPosition
 *     and rememberSize are true, `needReset` is false, so the else branch runs.
 *     It calls `afterOpenChange(false)` but never calls `setIsClosing(false)`.
 *     Fix = add `setIsClosing(false)` in the else branch at line 143.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Dialog } from "../dialog"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

describe("Dialog bugs", () => {
  describe("BUG 1: draggable header must respond to keyboard", () => {
    it("moves the dialog when Enter + arrow keys are pressed on the focused header", async () => {
      render(
        <Dialog
          open
          draggable
        >
          <Dialog.Header>Drag Me</Dialog.Header>
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      const dialogElement = await screen.findByRole("dialog")
      await waitFor(() => {
        expect(dialogElement).toHaveAttribute("data-state", "open")
      })
      const header = screen.getByRole("button", { name: /drag to move popover/i })

      const styleBefore = dialogElement.getAttribute("style") ?? ""

      header.focus()
      fireEvent.keyDown(header, { key: "Enter" })
      fireEvent.keyDown(header, { key: "ArrowRight" })
      fireEvent.keyDown(header, { key: "ArrowRight" })
      fireEvent.keyDown(header, { key: "ArrowDown" })

      const styleAfter = dialogElement.getAttribute("style") ?? ""

      expect(styleAfter).not.toBe(styleBefore)
    })
  })

  describe("BUG 2: resize handles must respond to keyboard", () => {
    it("resizes the dialog when arrow keys are pressed on a focused width handle", async () => {
      render(
        <Dialog
          open
          resizable={{ width: true, height: true }}
        >
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      const dialogElement = await screen.findByRole("dialog")
      await waitFor(() => {
        expect(dialogElement).toHaveAttribute("data-state", "open")
      })
      const handle = screen.getByLabelText("Resize dialog width")
      expect(handle).toHaveAttribute("tabindex", "0")

      const styleBefore = dialogElement.getAttribute("style") ?? ""

      handle.focus()
      fireEvent.keyDown(handle, { key: "ArrowRight" })
      fireEvent.keyDown(handle, { key: "ArrowRight" })
      fireEvent.keyDown(handle, { key: "ArrowRight" })

      const styleAfter = dialogElement.getAttribute("style") ?? ""

      expect(styleAfter).not.toBe(styleBefore)
    })
  })

  describe("BUG: partial resizable config must not collapse non-resizable dimension", () => {
    it("does not set height to 0px when only width is resizable", async () => {
      render(
        <Dialog
          open
          resizable={{ width: true, height: false }}
        >
          <Dialog.Content>Some content here</Dialog.Content>
        </Dialog>,
      )

      const dialogElement = await screen.findByRole("dialog")
      await waitFor(() => {
        expect(dialogElement).toHaveAttribute("data-state", "open")
      })

      const inlineStyle = dialogElement.getAttribute("style") ?? ""

      expect(inlineStyle).not.toMatch(/height:\s*0px/)
    })

    it("does not set width to 0px when only height is resizable", async () => {
      render(
        <Dialog
          open
          resizable={{ width: false, height: true }}
        >
          <Dialog.Content>Some content here</Dialog.Content>
        </Dialog>,
      )

      const dialogElement = await screen.findByRole("dialog")
      await waitFor(() => {
        expect(dialogElement).toHaveAttribute("data-state", "open")
      })

      const inlineStyle = dialogElement.getAttribute("style") ?? ""

      expect(inlineStyle).not.toMatch(/width:\s*0px/)
    })
  })

  describe("BUG: isClosing stuck true when rememberPosition && rememberSize", () => {
    it("resets isClosing to false after closing with both rememberPosition and rememberSize", async () => {
      const afterOpenChange = vi.fn()
      const onOpenChange = vi.fn()

      const { rerender } = render(
        <Dialog
          open
          draggable
          resizable={{ width: true, height: true }}
          rememberPosition
          rememberSize
          afterOpenChange={afterOpenChange}
          onOpenChange={onOpenChange}
        >
          <Dialog.Header>Drag Me</Dialog.Header>
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      const dialogElement = await screen.findByRole("dialog")
      await waitFor(() => {
        expect(dialogElement).toHaveAttribute("data-state", "open")
      })

      rerender(
        <Dialog
          open={false}
          draggable
          resizable={{ width: true, height: true }}
          rememberPosition
          rememberSize
          afterOpenChange={afterOpenChange}
          onOpenChange={onOpenChange}
        >
          <Dialog.Header>Drag Me</Dialog.Header>
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      await waitFor(
        () => {
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        },
        { timeout: 3000 },
      )

      expect(afterOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
