/**
 * Numeric Input bug-focused tests
 *
 * BUG 1: ArrowUp/ArrowDown missing preventDefault — cursor jumps in real browser
 *   - User scenario: User presses ArrowUp to increment a numeric value. The value
 *     changes but in a real browser the cursor jumps to position 0 (default ArrowUp
 *     behavior in text inputs). ArrowDown jumps cursor to the end.
 *   - Regression it prevents: Browser default cursor jump on ArrowUp/ArrowDown
 *   - Logic change: use-input-interactions.ts:127-132 — no `e.preventDefault()` in
 *     the ArrowUp/ArrowDown blocks. Fix = add `e.preventDefault()` before `updateValue`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NumericInput } from "../numeric-input"

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
})
