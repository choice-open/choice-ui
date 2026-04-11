/**
 * Input bug-focused tests
 *
 * BUG 1: onIsEditingChange(false) fires on unmount even if editing was never started
 *   - User scenario: Parent renders an Input with onIsEditingChange to track editing state.
 *     The component unmounts (e.g. conditional render flips) before the user ever focused it.
 *   - Regression it prevents: Parent receives a spurious onIsEditingChange(false) callback
 *     on unmount, which can corrupt state machines that assume onIsEditingChange(true) was
 *     called first (e.g. toggling a draft indicator that was never shown).
 *   - Logic change that makes it fail: The unconditional useUnmount call at line 37-39
 *     fires onIsEditingChange(false) regardless of whether the Input was ever focused.
 *     Fix = only call onIsEditingChange(false) in useUnmount if editing was actually started.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Input } from "../input"

describe("Input bugs", () => {
  describe("BUG 1: onIsEditingChange must not fire on unmount if editing was never started", () => {
    it("does not call onIsEditingChange when unmounted without ever being focused", () => {
      const onIsEditingChange = vi.fn()

      const { unmount } = render(<Input onIsEditingChange={onIsEditingChange} />)

      expect(screen.getByRole("textbox")).toBeInTheDocument()

      unmount()

      expect(onIsEditingChange).not.toHaveBeenCalled()
    })

    it("calls onIsEditingChange(false) on unmount only after editing was started", async () => {
      const onIsEditingChange = vi.fn()

      const { unmount } = render(<Input onIsEditingChange={onIsEditingChange} />)

      expect(onIsEditingChange).not.toHaveBeenCalled()

      screen.getByRole("textbox").focus()
      expect(onIsEditingChange).toHaveBeenCalledWith(true)

      unmount()
      expect(onIsEditingChange).toHaveBeenCalledWith(false)
    })
  })
})
