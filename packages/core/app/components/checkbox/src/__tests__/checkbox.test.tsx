/**
 * Checkbox bug-focused tests
 *
 * BUG 2.2: handleKeyDown uses !value, handleChange uses e.target.checked — inconsistent
 *   - User scenario: In a controlled component where state update is async (e.g. batched),
 *     Space key and mouse click could send different values to onChange
 *   - Regression it prevents: Two interaction methods producing different results
 *   - Logic change that makes it fail: handleKeyDown (line 58) computes `!value` from the
 *     prop, while handleChange (line 51) reads `e.target.checked` from the DOM.
 *     Fix = both should use the same strategy.
 *
 * BUG 2.1: handleKeyDown does not check disabled
 *   - User scenario: Programmatic focus on a disabled checkbox + Space key
 *   - Regression it prevents: onChange fires on disabled checkbox via keyboard
 *   - Logic change that makes it fail: handleKeyDown (line 54) only checks readOnly,
 *     not disabled. Fix = add `if (disabled) return`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Checkbox } from "../checkbox"

describe("Checkbox bugs", () => {
  describe("BUG 2.2: Space and click must produce the same onChange value", () => {
    it("click and Space key send the same value for a controlled unchecked checkbox", async () => {
      const clickOnChange = vi.fn()
      const keyOnChange = vi.fn()
      const user = userEvent.setup()

      const { unmount } = render(
        <Checkbox
          value={false}
          onChange={clickOnChange}
        >
          Test
        </Checkbox>,
      )

      await user.click(screen.getByRole("checkbox", { name: "Test" }))
      unmount()

      render(
        <Checkbox
          value={false}
          onChange={keyOnChange}
        >
          Test
        </Checkbox>,
      )
      screen.getByRole("checkbox", { name: "Test" }).focus()
      await user.keyboard(" ")

      expect(clickOnChange.mock.calls[0][0]).toBe(keyOnChange.mock.calls[0][0])
    })
  })

  describe("BUG 2.1: disabled checkbox must not fire onChange from keyboard", () => {
    it("Space key on a focused disabled checkbox does not call onChange", async () => {
      const onChange = vi.fn()

      render(
        <Checkbox
          value={false}
          disabled
          onChange={onChange}
        >
          Disabled
        </Checkbox>,
      )

      const checkbox = screen.getByRole("checkbox", { name: "Disabled" })
      checkbox.focus()

      const user = userEvent.setup()
      await user.keyboard(" ")

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
