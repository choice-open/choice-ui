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
 *     Fix = add `onKeyDown` that handles Enter/Space for drag activation.
 *
 * BUG 2: Resize handles focusable but not keyboard-operable
 *   - User scenario: Keyboard user tabs to a resize handle (tabIndex=0). Pressing
 *     Enter, Space, or Arrow keys does nothing. The handle appears interactive but
 *     isn't — a false affordance.
 *   - Regression it prevents: Non-functional focusable resize handles
 *   - Logic change: dialog.tsx:275-309 — resize handles have `tabIndex={0}` and
 *     `aria-label` but only `onMouseDown`. No keyboard handler at all.
 *     Fix = add `onKeyDown` handler for arrow keys.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
    it("provides an onKeyDown handler on the draggable header", async () => {
      const user = userEvent.setup()

      render(
        <Dialog
          open
          draggable
        >
          <Dialog.Header>Drag Me</Dialog.Header>
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      })

      const header = screen.getByText("Drag Me")
      const headerWrapper = header.closest('[role="button"]')
      expect(headerWrapper).toBeTruthy()

      if (headerWrapper) {
        const hasKeyDown =
          headerWrapper.getAttribute("onkeydown") !== null ||
          Object.keys(headerWrapper).some(
            (k) => k.startsWith("__react") && headerWrapper[k]?.onKeyDown,
          )

        const hasMouseDown =
          headerWrapper.getAttribute("onmousedown") !== null ||
          Object.keys(headerWrapper).some(
            (k) => k.startsWith("__react") && headerWrapper[k]?.onMouseDown,
          )

        expect(hasKeyDown || hasMouseDown).toBe(true)
        expect(hasKeyDown).toBe(true)
      }
    })
  })

  describe("BUG 2: resize handles must respond to keyboard", () => {
    it("provides keyboard handlers on resize handles", async () => {
      render(
        <Dialog
          open
          resizable={{ width: true, height: true }}
        >
          <Dialog.Content>Content</Dialog.Content>
        </Dialog>,
      )

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      })

      const resizeHandle = screen.getByLabelText("Resize dialog width")
      expect(resizeHandle).toBeTruthy()
      expect(resizeHandle).toHaveAttribute("tabindex", "0")

      const hasKeyDown = Object.keys(resizeHandle).some(
        (k) => k.startsWith("__react") && resizeHandle[k]?.onKeyDown,
      )
      expect(hasKeyDown).toBe(true)
    })
  })
})
