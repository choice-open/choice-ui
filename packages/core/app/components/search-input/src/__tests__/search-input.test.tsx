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
 *
 * BUG 8: i18n.placeholder is declared in interface but never used
 *   - User scenario: Developer passes i18n={{ clear: "Effacer", placeholder: "Rechercher..." }}
 *     to localize the search input. The clear button tooltip uses i18n.clear, but the
 *     input placeholder ignores i18n.placeholder entirely. It always uses the top-level
 *     `placeholder` prop (default "Search...").
 *   - Regression it prevents: Incomplete internationalization - placeholder not localizable via i18n
 *   - Logic change: search-input.tsx:14-17 declares `i18n.placeholder` in the interface,
 *     line 22 uses `placeholder = "Search..."` (top-level prop), line 28-30 default i18n
 *     has no placeholder key, line 43 uses `placeholder={placeholder}` (top-level only).
 *     Fix = use `i18n.placeholder ?? placeholder` as the fallback.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

vi.mock("@choiceform/icons-react", () => ({
  Search: () => <svg data-testid="search-icon" />,
  RemoveSmall: () => <svg data-testid="remove-icon" />,
}))

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

  describe("BUG 8: i18n.placeholder must override default placeholder text", () => {
    it("uses i18n.placeholder when provided", async () => {
      const { SearchInput } = await import("../search-input")

      render(<SearchInput i18n={{ clear: "Effacer", placeholder: "Rechercher..." }} />)

      const input = screen.getByPlaceholderText("Rechercher...")
      expect(input).toBeTruthy()
    })
  })
})
