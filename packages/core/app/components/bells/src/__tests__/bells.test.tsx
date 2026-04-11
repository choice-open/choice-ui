/**
 * Bells bug-focused tests
 *
 * BUG 1: Sonner duration mismatch — custom duration ignored
 *   - User scenario: Developer calls bells({ duration: 8000, ... }). The internal
 *     progress bar and timer use 8000ms, but sonner receives `undefined` duration
 *     (falls back to sonner's default 4000ms). Sonner dismisses the toast at 4s
 *     while the progress bar is only halfway through.
 *   - Regression it prevents: Custom duration being ignored by sonner
 *   - Logic change: bells.tsx:208 — `duration: bell.duration === Infinity ? Infinity : undefined`.
 *     Always passes undefined for non-Infinity durations. Fix = pass `bell.duration`.
 *
 * BUG 2: Close button never calls sonnerToast.dismiss
 *   - User scenario: User clicks the X button on a notification. The `onClose`
 *     callback fires, but `sonnerToast.dismiss` is never called. If the consumer's
 *     `onClose` doesn't dismiss the toast itself, it stays visible forever.
 *   - Regression it prevents: Toast remaining visible after close button click
 *   - Logic change: bells.tsx:79-81 — `handleCloseClick` only calls `onClose?.(id)`,
 *     never `sonnerToast.dismiss(id)`. The auto-close path has a fallback dismiss
 *     when onClose is absent, but the close button only renders when onClose IS present.
 *     Fix = also call `sonnerToast.dismiss(id)` in handleCloseClick.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

describe("Bells bugs", () => {
  describe("BUG 1: bells() must pass custom duration to sonner, not undefined", () => {
    it("passes the custom duration value to the sonner toast options", async () => {
      const { bells } = await import("../bells")
      const sonnerModule = await import("sonner")

      const customSpy = vi.spyOn(sonnerModule.toast, "custom")

      bells({
        text: "Test notification",
        duration: 8000,
        onClose: () => {},
      })

      expect(customSpy).toHaveBeenCalled()
      const options = customSpy.mock.calls[0][1] as Record<string, unknown>
      expect(options?.duration).toBe(8000)
    })
  })

  describe("BUG 2: close button click must call sonnerToast.dismiss", () => {
    it("calls sonnerToast.dismiss when the close button is clicked", async () => {
      const { Bell } = await import("../bells")
      const sonnerModule = await import("sonner")

      const dismissSpy = vi.spyOn(sonnerModule.toast, "dismiss")
      const onClose = vi.fn()

      render(
        <Bell
          id="test-1"
          text="Hello"
          onClose={onClose}
        />,
      )

      const closeButton = screen.getByRole("button")
      const user = userEvent.setup()
      await user.click(closeButton)

      expect(dismissSpy).toHaveBeenCalledWith("test-1")
    })
  })
})
