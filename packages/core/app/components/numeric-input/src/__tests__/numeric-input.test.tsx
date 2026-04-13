/**
 * Numeric Input bug-focused tests
 *
 * BUG 1: ArrowUp/ArrowDown missing preventDefault - cursor jumps in real browser
 *   - User scenario: User presses ArrowUp to increment a numeric value. The value
 *     changes but in a real browser the cursor jumps to position 0 (default ArrowUp
 *     behavior in text inputs). ArrowDown jumps cursor to the end.
 *   - Regression it prevents: Browser default cursor jump on ArrowUp/ArrowDown
 *   - Logic change: use-input-interactions.ts:127-132 - no `e.preventDefault()` in
 *     the ArrowUp/ArrowDown blocks. Fix = add `e.preventDefault()` before `updateValue`.
 *
 * BUG 2: onPressStart and onPressEnd callbacks called twice per press
 *   - User scenario: Developer passes onPressStart/onPressEnd for analytics.
 *     Each press/release fires the callback twice - once with native event and
 *     once with synthetic event. Double API calls, double state updates.
 *   - Regression it prevents: Double side effects per pointer interaction
 *   - Logic change: use-numeric-input.ts:240-266 - onPressStart has both a
 *     conditional call with nativeEvent AND an unconditional fallback call.
 *     Same for onPressEnd. Fix = keep only one call path.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NumericInput } from "../numeric-input"
import { useNumericInput } from "../hooks/use-numeric-input"

describe("Numeric Input bugs", () => {
  describe("BUG 1: ArrowUp/ArrowDown must call preventDefault to stop cursor jump", () => {
    it("calls preventDefault on ArrowUp keydown", () => {
      render(
        <NumericInput
          defaultValue={5}
          step={1}
        />,
      )

      const input = screen.getByRole("textbox")
      input.focus()

      const event = new KeyboardEvent("keydown", {
        key: "ArrowUp",
        bubbles: true,
        cancelable: true,
      })
      const spy = vi.spyOn(event, "preventDefault")
      input.dispatchEvent(event)

      expect(spy).toHaveBeenCalled()
    })

    it("calls preventDefault on ArrowDown keydown", () => {
      render(
        <NumericInput
          defaultValue={5}
          step={1}
        />,
      )

      const input = screen.getByRole("textbox")
      input.focus()

      const event = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      })
      const spy = vi.spyOn(event, "preventDefault")
      input.dispatchEvent(event)

      expect(spy).toHaveBeenCalled()
    })
  })

  describe("BUG 2: onPressStart and onPressEnd must be called exactly once per press", () => {
    it("calls onPressStart exactly once per pointer interaction", async () => {
      const onPressStart = vi.fn()
      const onChange = vi.fn()

      function TestHarness() {
        const { inputProps, handlerProps } = useNumericInput({
          value: 5,
          onChange,
          onPressStart,
          step: 1,
        })
        return (
          <div>
            <input
              {...inputProps}
              data-testid="input"
            />
            <div
              {...handlerProps}
              data-testid="handler"
            >
              ⟷
            </div>
          </div>
        )
      }

      render(<TestHarness />)

      const handler = screen.getByTestId("handler")

      act(() => {
        fireEvent.pointerDown(handler, { pointerId: 1, button: 0 })
      })

      expect(onPressStart).toHaveBeenCalledTimes(1)
    })
  })
})
