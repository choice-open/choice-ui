/**
 * Bells bug-focused tests
 *
 * BUG 1: Sonner duration mismatch — custom duration ignored
 *   - User scenario: Developer calls bells({ duration: 8000, ... }).
 *   - Regression it prevents: Custom duration being ignored by sonner
 *   - Logic change: bells.tsx:209 — passes undefined for non-Infinity durations
 *
 * BUG 2: Close button never calls sonnerToast.dismiss
 *   - User scenario: User clicks the X button on a notification.
 *   - Regression it prevents: Toast remaining visible after close button click
 *   - Logic change: bells.tsx:79-81 — handleCloseClick must call dismiss
 *
 * BUG 3: Auto-close timer fires onClose with correct id after duration elapses
 *   - User scenario: Notification with 2000ms auto-close. After 2s, onClose fires.
 *   - Regression it prevents: Timer not firing or onClose not called
 *   - Logic change: bells.tsx:84-92 — scheduleAutoClose sets window.setTimeout
 *     calling closeNotification. If timer ref is overwritten, callback breaks.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useAnimationControls: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
}))

describe("Bells bugs", () => {
  describe("BUG 1: bells() must pass custom duration to sonner, not undefined", () => {
    it("passes the custom duration value to the sonner toast options", async () => {
      const { bells } = await import("../bells")
      const sonnerModule = await import("sonner")
      const customSpy = vi.spyOn(sonnerModule.toast, "custom")
      bells({ text: "Test notification", duration: 8000, onClose: () => {} })
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

  describe("BUG 3: auto-close timer fires onClose after duration", () => {
    it("calls onClose with the notification id after duration elapses", async () => {
      vi.useFakeTimers()
      const onClose = vi.fn()
      const { Bell } = await import("../bells")
      render(
        <Bell
          id="timer-test"
          text="Auto close"
          duration={2000}
          onClose={onClose}
        />,
      )

      act(() => {
        vi.advanceTimersByTime(1999)
      })
      expect(onClose).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(onClose).toHaveBeenCalledWith("timer-test")

      vi.useRealTimers()
    })
  })
})
