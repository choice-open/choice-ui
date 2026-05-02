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
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

  /**
   * FOCUS SELECTION "all": text must be fully selected on focus
   *   User scenario: User clicks or tabs into an Input with focusSelection="all"
   *     (or default). All text should be selected so the user can immediately
   *     type to replace it.
   *   Regression it prevents: Text not being selected on focus, forcing users
   *     to manually select-all before replacing
   *   Logic change: input.tsx:64-65 calls e.target.select() in onFocus.
   *     If this line is removed or guarded incorrectly, no text is selected.
   */
  describe("focusSelection=all must select all text on focus", () => {
    it("selects all text when the input is focused", async () => {
      const user = userEvent.setup()

      render(
        <Input
          defaultValue="hello world"
          focusSelection="all"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      await user.click(input)

      expect(input.selectionStart).toBe(0)
      expect(input.selectionEnd).toBe("hello world".length)
    })
  })

  /**
   * FOCUS SELECTION "end": cursor must be placed at the end of the value
   *   User scenario: User tabs into an Input with focusSelection="end".
   *     The cursor should appear after the last character so typing appends.
   *   Regression it prevents: Cursor appearing at position 0 instead of the end,
   *     causing users to prepend text instead of append
   *   Logic change: input.tsx:66-72 uses setTimeout + setSelectionRange to move
   *     the cursor. This setTimeout pattern is fragile and can break in test
   *     environments or React concurrent mode.
   */
  describe("focusSelection=end must place cursor at end of value", () => {
    it("places the cursor at the end of the value after focus", async () => {
      const user = userEvent.setup()

      render(
        <Input
          defaultValue="hello"
          focusSelection="end"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      await user.click(input)

      await act(async () => {
        await new Promise((r) => setTimeout(r, 10))
      })

      expect(input.selectionStart).toBe("hello".length)
      expect(input.selectionEnd).toBe("hello".length)
    })
  })

  /**
   * FOCUS SELECTION "none": text must not be selected on focus
   *   User scenario: User focuses an Input with focusSelection="none".
   *     The cursor should appear where the browser naturally places it (typically
   *     at the click position or at the end), but no text should be pre-selected.
   *   Regression it prevents: Text being auto-selected when focusSelection="none"
   *     is explicitly set to avoid that behavior
   *   Logic change: The fallback branch (lines 74) does nothing. If someone adds
   *     a default select() call outside the if/else, this mode breaks.
   */
  describe("focusSelection=none must not select text on focus", () => {
    it("does not select all text when focusSelection is none", async () => {
      const user = userEvent.setup()

      render(
        <Input
          defaultValue="hello world"
          focusSelection="none"
        />,
      )

      const input = screen.getByRole("textbox") as HTMLInputElement
      await user.click(input)

      expect(input.selectionStart).not.toBe(0)
    })
  })
})
