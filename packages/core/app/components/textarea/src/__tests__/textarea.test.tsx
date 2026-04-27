/**
 * Textarea bug-focused tests
 *
 * BUG 6.1: allowNewline=false does NOT block Shift+Enter
 *   - User scenario: Single-line chat input with allowNewline=false. User presses Shift+Enter
 *     expecting no newline (it's documented as "disable newlines"), but newline is inserted.
 *   - Regression it prevents: allowNewline=false becomes a lie - it only blocks plain Enter
 *   - Logic change that makes it fail: handleKeyDown (line 124) has `!e.shiftKey` guard,
 *     explicitly allowing Shift+Enter through. Fix = remove the shiftKey guard.
 *
 * BUG 6.3: style prop is silently dropped, never applied to any element
 *   - User scenario: Developer passes style={{ borderColor: "red" }} for a validation
 *     error state, but nothing visually changes
 *   - Regression it prevents: Consumers waste time debugging why style doesn't work
 *   - Logic change that makes it fail: line 131 destructures style out of rest into
 *     restWithoutStyle, but `style` is never used anywhere.
 *
 * BUG 4: Compound pattern silently drops onChange from Textarea.Content
 *   - User scenario: Developer uses <Textarea><Textarea.Content onChange={fn}/></Textarea>.
 *     The child's onChange is overridden by handleChange (line 303) which comes AFTER
 *     {...child.props} (line 298). The child's onChange is never called.
 *   - Regression it prevents: Consumer's onChange handler silently ignored in compound pattern
 *   - Logic change: textarea.tsx:295-306 - {...textareaAutosizeProps} then {...child.props}
 *     then onChange={handleChange}. The last onChange wins, discarding child.props.onChange.
 *     Fix = merge the handlers or call child.props.onChange inside handleChange.
 *
 * BUG 2: resize={false} does not disable auto-resize without explicit rows
 *   - User scenario: Developer sets resize={false} expecting a fixed-height textarea.
 *     Without also passing a rows prop, viewportStyle is undefined (line 240) so the
 *     textarea auto-grows identically to resize="auto".
 *   - Regression it prevents: resize={false} silently broken unless rows is also supplied
 *   - Logic change: textarea.tsx:235-241 - `if (resize === false && rest.rows)` only
 *     returns a fixed height when rows is explicitly set. Without rows, returns undefined.
 *     Fix = use minRows to compute a fixed height when resize=false and rows is not set.
 *
 * BUG 5: onIsEditingChange(false) fires on unmount even if editing was never started
 *   - User scenario: Parent renders a Textarea with onIsEditingChange to track editing
 *     state. The component unmounts before the user ever focused it.
 *   - Regression it prevents: Parent receives a spurious onIsEditingChange(false)
 *     callback on unmount, corrupting state machines (e.g. draft indicator toggled off
 *     when it was never shown).
 *   - Logic change: textarea.tsx:86-88 — useUnmount unconditionally calls
 *     onIsEditingChange(false). Input (input.tsx:37-43) has an editingStartedRef guard
 *     that Textarea lacks. Fix = add the same guard.
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

  describe("BUG 4: compound pattern must not silently drop child onChange", () => {
    it("calls the child onChange handler when using compound pattern", async () => {
      const parentOnChange = vi.fn()
      const childOnChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Textarea onChange={parentOnChange}>
          <Textarea.Content onChange={childOnChange} />
        </Textarea>,
      )

      const textarea = screen.getByRole("textbox")
      await user.type(textarea, "hello")

      expect(childOnChange).toHaveBeenCalled()
    })
  })

  describe("BUG 5: onIsEditingChange must not fire on unmount if editing was never started", () => {
    it("does not call onIsEditingChange when unmounted without ever being focused", () => {
      const onIsEditingChange = vi.fn()

      const { unmount } = render(<Textarea onIsEditingChange={onIsEditingChange} />)

      expect(screen.getByRole("textbox")).toBeInTheDocument()

      unmount()

      expect(onIsEditingChange).not.toHaveBeenCalled()
    })

    it("calls onIsEditingChange(false) on unmount only after editing was started", async () => {
      const onIsEditingChange = vi.fn()
      const user = userEvent.setup()

      const { unmount } = render(<Textarea onIsEditingChange={onIsEditingChange} />)

      expect(onIsEditingChange).not.toHaveBeenCalled()

      const textarea = screen.getByRole("textbox")
      await user.click(textarea)
      expect(onIsEditingChange).toHaveBeenCalledWith(true)

      unmount()
      expect(onIsEditingChange).toHaveBeenCalledWith(false)
    })
  })

  describe("BUG 2: resize=false must produce a fixed height without needing rows", () => {
    it("applies a fixed height style when resize is false and no rows prop", () => {
      const { container } = render(
        <Textarea
          resize={false}
          minRows={3}
        />,
      )

      const viewport =
        container.querySelector("[data-slot=viewport]") ||
        container.querySelector("[class*='overflow']")
      expect(viewport).toBeTruthy()

      const hasFixedHeight = container.innerHTML.includes("height:")
      expect(hasFixedHeight).toBe(true)
    })
  })
})
