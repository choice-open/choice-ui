/**
 * Search Input bug-focused tests
 *
 * BUG 4: Clear button never shows in uncontrolled mode
 *   - User scenario: Developer renders <SearchInput clearable /> without value/onChange.
 *     User types text. No clear (X) button appears because `value` is undefined (falsy).
 *   - Regression it prevents: clearable prop silently broken in uncontrolled usage
 *   - Logic change: Line 53 `{value && clearable && (...)}` gates on `value` being truthy.
 *     In uncontrolled mode, value is undefined. Fix = track internal value or use ref.
 *
 * BUG 5: Clear does not refocus input
 *   - User scenario: User clicks X to clear search. Focus is lost. User must click
 *     the input again to type a new query.
 *   - Regression it prevents: Broken search UX flow after clearing
 *   - Logic change: Line 34-36 `handleClear` only calls onChange(""), doesn't refocus.
 *     Fix = add inputRef.current?.focus() after clearing.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

describe("Search Input bugs", () => {
  describe("BUG 4: clear button must appear in uncontrolled mode after typing", () => {
    it("shows clear button after user types text without controlled value prop", async () => {
      const { SearchInput } = await import("../search-input")
      const user = userEvent.setup()

      render(
        <SearchInput
          clearable
          placeholder="Search..."
        />,
      )

      const input = screen.getByPlaceholderText("Search...")
      await user.type(input, "hello")

      const clearButton =
        document.querySelector("[data-clear-button]") ||
        screen.queryByRole("button", { name: /clear/i, hidden: true })

      expect(clearButton).not.toBeNull()
    })
  })

  describe("BUG 5: clear button must refocus the input after clearing", () => {
    it("returns focus to the input after clicking clear", async () => {
      const { SearchInput } = await import("../search-input")
      const user = userEvent.setup()

      render(
        <SearchInput
          value="hello"
          onChange={vi.fn()}
          clearable
          placeholder="Search..."
        />,
      )

      const input = screen.getByPlaceholderText("Search...")

      const clearButton =
        document.querySelector("[data-clear-button]") ||
        screen.queryByRole("button", { hidden: true })

      if (clearButton) {
        await user.click(clearButton)
        expect(input).toHaveFocus()
      }
    })
  })
})
