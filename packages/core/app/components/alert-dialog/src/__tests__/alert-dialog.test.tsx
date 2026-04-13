/**
 * Alert Dialog bug-focused tests
 *
 * BUG 1: Enter key always confirms regardless of focused button
 *   - User scenario: Destructive confirm dialog "Delete everything?". User Tabs to
 *     Cancel button, presses Enter expecting cancel. Dialog resolves true instead.
 *   - Regression it prevents: Enter on Cancel performing destructive action
 *   - Logic change: alert-dialog.tsx:67-75 - the global capture keydown listener
 *     unconditionally resolves confirm=true on Enter, ignoring document.activeElement.
 *     Fix = check if activeElement is the Cancel button (or any non-confirm button)
 *     and either skip the listener so the native button click fires, or resolve
 *     with the focused button's value.
 *
 * BUG 2: closeAll() leaves pending dialog promises unresolved forever
 *   - User scenario: App calls `await alertDialog.confirm("Delete?")`, then
 *     immediately calls `alertDialog.closeAll()` (e.g., on navigation). The `await`
 *     never completes, freezing the app or leaking memory.
 *   - Regression it prevents: Promise leaks on unmount/navigation
 *   - Logic change: utils/index.ts:110-120 - CLEAR_QUEUE action sets resolve=null
 *     and clears queue WITHOUT calling any pending resolvers. The HIDE action at
 *     line 61 properly calls state.resolve(value). Fix = call state.resolve(false)
 *     and resolve all queued items before clearing.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AlertDialogProvider, useAlertDialog } from "../"

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
      const user = userEvent.setup()
      const onResult = vi.fn()

      function Harness() {
        const alertDialog = useAlertDialog()
        return (
          <button
            type="button"
            onClick={() => {
              alertDialog.confirm({ title: "Delete everything?" }).then(onResult)
            }}
          >
            Open
          </button>
        )
      }

      render(
        <AlertDialogProvider>
          <Harness />
        </AlertDialogProvider>,
      )

      await user.click(screen.getByRole("button", { name: "Open" }))

      // Wait for the alert dialog to appear.
      await waitFor(() => {
        expect(screen.getByText("Delete everything?")).toBeInTheDocument()
      })

      // Move focus onto the Cancel button and press Enter.
      const cancelButton = await screen.findByRole("button", { name: /cancel/i })
      cancelButton.focus()
      expect(cancelButton).toHaveFocus()

      await user.keyboard("{Enter}")

      // With the bug, the global capture keydown listener resolves the confirm
      // promise with `true` even though Cancel had focus. With a correct fix,
      // focusing Cancel + Enter resolves with `false` (either by letting the
      // button's native Enter-to-click fire, or by checking activeElement).
      await waitFor(() => {
        expect(onResult).toHaveBeenCalledWith(false)
      })
    })
  })

  describe("BUG 2: closeAll must resolve pending dialog promises, not leak them", () => {
    it("resolves pending confirm promise with false when closeAll is called", async () => {
      const onResult = vi.fn()
      let alertDialogRef: ReturnType<typeof useAlertDialog> | null = null

      function Harness() {
        const alertDialog = useAlertDialog()
        alertDialogRef = alertDialog
        return (
          <button
            type="button"
            onClick={() => {
              alertDialog.confirm({ title: "Save changes?" }).then(onResult)
            }}
          >
            Open
          </button>
        )
      }

      render(
        <AlertDialogProvider>
          <Harness />
        </AlertDialogProvider>,
      )

      await screen.getByRole("button", { name: "Open" }).click()

      await waitFor(() => {
        expect(screen.getByText("Save changes?")).toBeInTheDocument()
      })

      alertDialogRef!.closeAll()

      await waitFor(() => {
        expect(onResult).toHaveBeenCalledWith(false)
      })
    })
  })
})
