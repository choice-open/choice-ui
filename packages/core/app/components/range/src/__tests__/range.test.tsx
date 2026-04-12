/**
 * Range bug-focused tests
 *
 * BUG 1: Keyboard arrow keys do not move thumb in uncontrolled mode
 *   - User scenario: Developer renders <Range onChange={fn} /> (no value prop).
 *     User focuses the thumb via Tab, presses ArrowRight. onChange fires with 1,
 *     but the thumb stays at position 0 on screen.
 *   - Regression it prevents: Core keyboard interaction broken for uncontrolled slider
 *   - Logic change that makes it fail: handleKeyDown (line 326) calls onChange but never
 *     calls setInternalValue. Compare updatePosition (line 245-247) which correctly
 *     does `if (value === undefined) { setInternalValue(clampedValue) }`.
 *     Fix = add the same guard to handleKeyDown.
 *
 * BUG 2: Step snapping formula ignores min offset
 *   - User scenario: Range with min=5, step=10. User drags slider. Values snap to
 *     multiples of 10 from 0 (0, 10, 20...) instead of from 5 (5, 15, 25...).
 *   - Regression it prevents: Wrong snapped values when min is non-zero and step > 1
 *   - Logic change that makes it fail: Lines 157-160 currentStepValue uses
 *     `Math.round(currentValue / safeStep) * safeStep` (offset from 0), while
 *     defaultStepValue at line 143 correctly uses `(value - min)` offset.
 *     Same issue in updatePosition at line 229. Fix = use
 *     `Math.round((val - min) / safeStep) * safeStep + min` everywhere.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Range } from "../range"

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

describe("Range bugs", () => {
  describe("BUG 1: keyboard must move thumb in uncontrolled mode", () => {
    it("updates visual position after ArrowRight in uncontrolled Range", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Range
          min={0}
          max={100}
          step={1}
          onChange={onChange}
        />,
      )

      const slider = screen.getByRole("slider")
      slider.focus()

      await user.keyboard("{ArrowRight}")

      expect(onChange).toHaveBeenCalledWith(1)

      const ariaValueNow = slider.getAttribute("aria-valuenow")
      expect(ariaValueNow).toBe("1")
    })

    it("updates visual position after ArrowLeft in uncontrolled Range", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Range
          min={0}
          max={100}
          step={1}
          defaultValue={50}
          onChange={onChange}
        />,
      )

      const slider = screen.getByRole("slider")
      slider.focus()

      await user.keyboard("{ArrowLeft}")

      expect(onChange).toHaveBeenCalledWith(49)
      expect(slider).toHaveAttribute("aria-valuenow", "49")
    })
  })

  describe("BUG 2: step snapping must account for min offset", () => {
    it("snaps to values aligned with min when min is non-zero", () => {
      const onChange = vi.fn()

      render(
        <Range
          min={5}
          max={100}
          step={10}
          defaultValue={5}
          onChange={onChange}
        />,
      )

      const slider = screen.getByRole("slider")
      expect(slider).toHaveAttribute("aria-valuenow", "5")
      expect(slider).toHaveAttribute("aria-valuemin", "5")
    })

    it("shows correct defaultValue as step-snapped value when min is non-zero", () => {
      render(
        <Range
          min={5}
          max={100}
          step={10}
          defaultValue={15}
          onChange={vi.fn()}
        />,
      )

      const slider = screen.getByRole("slider")
      expect(slider).toHaveAttribute("aria-valuenow", "15")
    })
  })
})
