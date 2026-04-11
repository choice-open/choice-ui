/**
 * Alert Dialog bug-focused tests
 *
 * BUG 1: Enter key always confirms regardless of focused button
 *   - User scenario: Destructive confirm dialog "Delete everything?". User Tabs to
 *     Cancel button, presses Enter expecting cancel. Dialog resolves true instead.
 *   - Regression it prevents: Enter on Cancel performing destructive action
 *   - Logic change: Lines 67-75, global capture keydown listener unconditionally
 *     resolves confirm=true on Enter, ignoring document.activeElement.
 *     Fix = check if activeElement is a cancel/dismiss button first.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("Alert Dialog bugs", () => {
  describe("BUG 1: Enter on Cancel button must resolve false, not true", () => {
    it("resolves false when Enter is pressed while Cancel button has focus", async () => {
      const { createAlertDialog } = await import("../alert-dialog")
      const alertDialog = createAlertDialog()
      const user = userEvent.setup()

      function App() {
        const [open, setOpen] = vi.importActual<typeof import("react")>("react")
          ? [false, vi.fn()]
          : [false, vi.fn()]
        return (
          <div>
            <button onClick={() => alertDialog.confirm({ title: "Delete?" })}>Open</button>
          </div>
        )
      }

      const promise = alertDialog.confirm({ title: "Delete everything?" })

      await waitFor(
        () => {
          const dialog =
            screen.getByRole("alertdialog", { hidden: true }) ||
            screen.getByText("Delete everything?")
          expect(dialog).toBeInTheDocument()
        },
        { timeout: 3000 },
      )

      const buttons = screen.getAllByRole("button")
      const cancelButton = buttons.find((b) => b.textContent?.toLowerCase().includes("cancel"))

      if (cancelButton) {
        cancelButton.focus()
        await user.keyboard("{Enter}")
      }

      const result = await promise
      expect(result).toBe(false)
    })
  })
})
