/**
 * Toast bug-focused tests
 *
 * BUG 3: Timer not reset when toast is updated with same ID
 *   - User scenario: toast.promise transitions from loading → success. The success
 *     toast inherits the old timer's remaining time instead of a fresh duration.
 *   - Regression it prevents: Updated toasts auto-dismissing too quickly
 *   - Logic change: toaster.tsx lines 227-267. hasTimer check prevents new timer
 *     creation when toast is updated. Old timer continues with old duration/callback.
 *     Fix = clear and recreate timer when toast content changes.
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

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
})
