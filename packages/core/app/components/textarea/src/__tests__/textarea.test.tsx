/**
 * Textarea bug-focused tests
 *
 * BUG 6.1: allowNewline=false does NOT block Shift+Enter
 *   - User scenario: Single-line chat input with allowNewline=false. User presses Shift+Enter
 *     expecting no newline (it's documented as "disable newlines"), but newline is inserted.
 *   - Regression it prevents: allowNewline=false becomes a lie — it only blocks plain Enter
 *   - Logic change that makes it fail: handleKeyDown (line 124) has `!e.shiftKey` guard,
 *     explicitly allowing Shift+Enter through. Fix = remove the shiftKey guard.
 *
 * BUG 6.3: style prop is silently dropped, never applied to any element
 *   - User scenario: Developer passes style={{ borderColor: "red" }} for a validation
 *     error state, but nothing visually changes
 *   - Regression it prevents: Consumers waste time debugging why style doesn't work
 *   - Logic change that makes it fail: line 131 destructures style out of rest into
 *     restWithoutStyle, but `style` is never used anywhere.
 */
import "@testing-library/jest-dom"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Textarea } from "../textarea"

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

describe("Textarea bugs", () => {
  describe("BUG 6.1: allowNewline=false must block ALL Enter, including Shift+Enter", () => {
    it("blocks plain Enter when allowNewline is false", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Textarea
          allowNewline={false}
          onChange={onChange}
        />,
      )

      const textarea = screen.getByRole("textbox")
      textarea.focus()
      await user.keyboard("{Enter}")

      expect(onChange).not.toHaveBeenCalled()
    })

    it("blocks Shift+Enter when allowNewline is false", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Textarea
          allowNewline={false}
          onChange={onChange}
        />,
      )

      const textarea = screen.getByRole("textbox")
      textarea.focus()
      await user.keyboard("{Shift>}{Enter}{/Shift}")

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 6.3: style prop must be applied to the container", () => {
    it("applies inline style to the component", () => {
      render(<Textarea style={{ border: "1px solid red" }} />)

      const container = screen.getByRole("textbox").closest("[class]")
      const styledElement = container?.parentElement || container
      expect(styledElement).toHaveStyle("border: 1px solid red")
    })
  })
})
