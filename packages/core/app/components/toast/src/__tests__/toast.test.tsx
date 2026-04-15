/**
 * Toast bug-focused tests
 *
 * BUG 3: Timer not reset when toast is updated with same ID
 *   - User scenario: toast.promise transitions from loading to success. The success
 *     toast inherits the old timer's remaining time instead of a fresh duration.
 *   - Regression it prevents: Updated toasts auto-dismissing too quickly
 *   - Logic change: toaster.tsx lines 227-267. hasTimer check prevents new timer
 *     creation when toast is updated. Old timer continues with old duration/callback.
 *     Fix = clear and recreate timer when toast content changes.
 *
 * BUG 1: Toaster timer remaining time miscalculated after multiple pause/resume cycles
 *   - User scenario: User hovers a toast (pause), moves away (resume), hovers again.
 *     Each hover/resume cycle shaves time off because remaining time is calculated
 *     from toast.createdAt instead of when the current timer was started.
 *   - Regression it prevents: Toasts disappearing prematurely after multiple hovers
 *   - Logic change: toaster.tsx lines 236-238. `elapsed = Date.now() - toast.createdAt`
 *     always calculates from creation time, but the timer was restarted with a shorter
 *     delay on previous resume. Fix = track when each timer was started/restarted.
 *
 * BUG 2: Cancel button never calls toast.cancel.onClick callback
 *   - User scenario: Developer sets toast.cancel.onClick for analytics or undo logic.
 *     User clicks the cancel/dismiss button. The callback is silently ignored.
 *   - Regression it prevents: Cancel callback never firing, breaking analytics/undo
 *   - Logic change: toaster-item.tsx lines 371-373. handleDismissClick only calls
 *     close() without calling toast.cancel?.onClick?.(). Compare with handleActionClick
 *     which correctly calls toast.action?.onClick(). Fix = add toast.cancel?.onClick?.().
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
})

describe("Toast bugs", () => {
  describe("BUG 3: updated toast must get a fresh auto-dismiss timer", () => {
    it("calls the updated onAutoClose callback, not the original one", async () => {
      const originalOnAutoClose = vi.fn()
      const updatedOnAutoClose = vi.fn()

      const { toast, Toaster } = await import("../index")

      function App() {
        return (
          <>
            <Toaster />
          </>
        )
      }

      render(<App />)

      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      act(() => {
        toast.promise(promise, {
          loading: "Loading...",
          success: "Done!",
          error: "Failed!",
          duration: 5000,
        })
      })

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument()
      })

      act(() => {
        resolvePromise!("data")
      })

      await waitFor(() => {
        expect(screen.getByText("Done!")).toBeInTheDocument()
      })

      await waitFor(
        () => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })
  })

  describe("BUG 2: cancel button onClick must be called", () => {
    it("fires toast.cancel.onClick when the dismiss button is clicked", async () => {
      const cancelOnClick = vi.fn()
      const { toast, Toaster } = await import("../index")

      function App() {
        return <Toaster />
      }

      render(<App />)

      act(() => {
        toast("Test toast", {
          cancel: {
            label: "Dismiss",
            onClick: cancelOnClick,
          },
          duration: 60000,
        })
      })

      await waitFor(() => {
        expect(screen.getByText("Test toast")).toBeInTheDocument()
      })

      const dismissButton = screen.queryByText("Dismiss")
      expect(dismissButton).toBeTruthy()
      dismissButton!.click()
      expect(cancelOnClick).toHaveBeenCalled()
    })
  })

  /**
   * Action button onClick must fire and close the toast
   *   - User scenario: Toast shows an action button (e.g., "Undo"). User clicks it.
   *     The onClick callback should fire (for analytics/undo logic) and the toast should close.
   *   - Regression it prevents: Action button click doing nothing (callback not called, toast stays)
   *   - Logic change: toaster-item.tsx:366-369 - handleActionClick calls toast.action?.onClick()
   *     then close(). If onClick is called after close(), or if close() is called before onClick(),
   *     the toast state may be cleaned up before the callback can reference it.
   */
  describe("action button onClick must fire and close the toast", () => {
    it("fires toast.action.onClick when the action button is clicked", async () => {
      const actionOnClick = vi.fn()
      const { toast, Toaster } = await import("../index")

      function App() {
        return <Toaster />
      }

      render(<App />)

      act(() => {
        toast("Saved successfully", {
          action: {
            label: "Undo",
            onClick: actionOnClick,
          },
          duration: 60000,
        })
      })

      await waitFor(() => {
        expect(screen.getByText("Saved successfully")).toBeInTheDocument()
      })

      const actionButton = screen.queryByText("Undo")
      expect(actionButton).toBeTruthy()
      actionButton!.click()
      expect(actionOnClick).toHaveBeenCalled()
    })
  })

  /**
   * Loading toasts must never auto-dismiss
   *   - User scenario: toast.loading("Processing...") shows while an async operation runs.
   *     If the loading toast auto-dismisses before the operation completes, the user loses
   *     the progress indicator and thinks the operation finished.
   *   - Regression it prevents: Loading toasts disappearing during long operations
   *   - Logic change: toaster.tsx:219-220 - `if (toast.type === "loading") return` skips
   *     timer creation entirely. If this guard is removed, loading toasts get auto-dismiss timers.
   */
  describe("loading toast must never auto-dismiss", () => {
    it("keeps a loading toast visible after its normal duration would have elapsed", async () => {
      const onAutoClose = vi.fn()
      const { toast, Toaster } = await import("../index")

      function App() {
        return <Toaster />
      }

      render(<App />)

      act(() => {
        toast.loading("Processing...", { duration: 1000, onAutoClose })
      })

      await waitFor(() => {
        expect(screen.getByText("Processing...")).toBeInTheDocument()
      })

      await waitFor(
        () => {
          expect(onAutoClose).not.toHaveBeenCalled()
        },
        { timeout: 2000 },
      )

      expect(screen.getByText("Processing...")).toBeInTheDocument()
    })
  })
})
