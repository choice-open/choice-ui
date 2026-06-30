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
 *
 * BUG 3: ESC must NOT dismiss dialog when closeOnEscape=false
 *   - User scenario: Developer shows a critical confirm dialog with
 *     closeOnEscape: false to prevent accidental dismissal. User presses ESC
 *     and the dialog closes anyway.
 *   - Regression it prevents: Modal dismissing when it shouldn't
 *   - Logic change: alert-dialog.tsx:56-63 — `config.closeOnEscape !== false`
 *     guard. If the guard is removed or inverted, ESC always closes.
 *
 * BUG 4: Sequential confirm() calls must queue and resolve in order
 *   - User scenario: Code rapidly calls confirm() twice (e.g., save + navigate).
 *     Both promises must resolve, not just the first.
 *   - Regression it prevents: Lost queued dialogs / unresolved promises
 *   - Logic change: utils/index.ts:39-45 — SHOW action enqueues when open.
 *     HIDE at lines 66-74 dequeues and shows next. If queue logic breaks,
 *     second dialog promise never resolves.
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

  describe("BUG 3: ESC must NOT dismiss dialog when closeOnEscape=false", () => {
    it("dialog stays open when ESC is pressed and closeOnEscape is false", async () => {
      const user = userEvent.setup()
      const onResult = vi.fn()

      function Harness() {
        const alertDialog = useAlertDialog()
        return (
          <button
            type="button"
            onClick={() => {
              alertDialog.confirm({ title: "Critical action", closeOnEscape: false }).then(onResult)
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

      await waitFor(() => {
        expect(screen.getByText("Critical action")).toBeInTheDocument()
      })

      await user.keyboard("{Escape}")

      expect(onResult).not.toHaveBeenCalled()
      expect(screen.getByText("Critical action")).toBeInTheDocument()
    })
  })

  describe("BUG 4: sequential confirm() calls queue and resolve in order", () => {
    it("both promises resolve when confirm is called twice rapidly", async () => {
      const user = userEvent.setup()
      const result1 = vi.fn()
      const result2 = vi.fn()
      let alertDialogRef: ReturnType<typeof useAlertDialog> | null = null

      function Harness() {
        const alertDialog = useAlertDialog()
        alertDialogRef = alertDialog
        return <button type="button">Trigger</button>
      }

      render(
        <AlertDialogProvider>
          <Harness />
        </AlertDialogProvider>,
      )

      alertDialogRef!.confirm({ title: "First" }).then(result1)
      alertDialogRef!.confirm({ title: "Second" }).then(result2)

      await waitFor(() => {
        expect(screen.getByText("First")).toBeInTheDocument()
      })

      await user.click(screen.getByRole("button", { name: /confirm/i }))

      await waitFor(() => {
        expect(result1).toHaveBeenCalledWith(true)
      })

      await waitFor(() => {
        expect(screen.getByText("Second")).toBeInTheDocument()
      })

      await user.click(screen.getByRole("button", { name: /confirm/i }))

      await waitFor(() => {
        expect(result2).toHaveBeenCalledWith(true)
      })
    })
  })
})
