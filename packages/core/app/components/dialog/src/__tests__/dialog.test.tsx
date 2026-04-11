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
 * These tests are purely behavioral: they focus the interactive element, dispatch
 * real keyboard events, and then assert an observable outcome on the DOM (the
 * dialog's inline style changes, because a keyboard-driven drag/resize updates the
 * same position/size state that mouse drag/resize uses). They do not read React
 * internals, so they fail against the current buggy implementation and pass against
 * any correct fix regardless of internal handler structure.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
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
      // Wait until the open/opening transition settles so the baseline style
      // we capture is stable and any later style change must be keyboard-driven.
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

      // With the bug, no keydown handler is attached and the dialog cannot be
      // moved via keyboard — the inline style is unchanged. Any correct fix that
      // lets keyboard drag feed `dragState.position` (the same state mouse drag
      // uses) will flow through `floating.getStyles(...)` and mutate the inline
      // style, making these strings differ.
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

      // With the bug, arrow keys on the focused handle do nothing; any correct
      // fix that updates `resizeState.size` (or the equivalent) will flow into
      // the inline style produced by `getStyleWithDefaults`, changing it here.
      expect(styleAfter).not.toBe(styleBefore)
    })
  })
})
