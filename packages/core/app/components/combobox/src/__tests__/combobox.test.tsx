/**
 * Combobox bug-focused tests
 *
 * BUG 1: handleTriggerClick always calls onOpenChange(true) -- can never close via trigger
 *   - User scenario: Controlled combobox, user clicks trigger to open, clicks again to close.
 *     Second click sends onOpenChange(true) again -- menu stays open forever.
 *   - Regression it prevents: Trigger click being unable to close controlled combobox
 *   - Logic change that makes it fail: Line 211 always passes true: `onOpenChange?.(true, "click")`.
 *     Should be `onOpenChange?.(!isOpen, "click")` or `onOpenChange?.(!controlledOpen, "click")`.
 *
 * BUG 2: onBlur typed as (value: string) => void but receives FocusEvent at runtime
 *   - User scenario: Consumer writes `<Combobox onBlur={(v) => v.toUpperCase()} />`.
 *     At runtime, v is actually a FocusEvent -- crash: ".toUpperCase is not a function".
 *   - Regression it prevents: Runtime crash from type/implementation mismatch
 *   - Logic change that makes it fail: combobox-trigger.tsx line 81 calls `onBlur?.(event)`
 *     passing a FocusEvent, but ComboboxProps declares `onBlur?: (value: string) => void`.
 *
 * BUG 3: handleInputFocus never opens menu in uncontrolled mode
 *   - User scenario: User focuses the combobox input when it already has a value.
 *     The dropdown should appear but stays closed.
 *   - Regression it prevents: Focus-triggered dropdown not opening
 *   - Logic change: combobox.tsx lines 222-229. handleInputFocus calls onOpenChange(true)
 *     but never calls setIsOpen(true). In uncontrolled mode, isControlledOpen resolves
 *     to isOpen which stays false. Fix = add setIsOpen(true) for uncontrolled mode.
 *
 * BUG 4: Clicking an item in the dropdown must close the menu via tree event
 *   - User scenario: User types in combobox, sees filtered results, clicks "Banana".
 *     The dropdown should close by emitting a tree "click" event.
 *   - Regression it prevents: Item click not closing the dropdown
 *   - Logic change: If MenuContextItem's onClick stops emitting tree "click" event
 *     or the Combobox stops listening to tree events.
 *
 * BUG 5: handleInputChange only checks readOnly, not disabled
 *   - User scenario: Developer renders <Combobox disabled>. The native HTML disabled
 *     attribute on the input prevents onChange from firing, so the bug is currently
 *     masked. However, handleInputChange (line 216) only guards on `readOnly`, not
 *     `disabled`. If the input element ever loses its disabled attribute (e.g. via
 *     a custom Input override), onChange would fire despite disabled=true.
 *   - Regression it prevents: Disabled combobox accepting user input if HTML attribute is bypassed
 *   - Logic change: combobox.tsx:215-218 — `if (readOnly) return` with no disabled check.
 *     Fix = add `if (disabled) return` or `if (readOnly || disabled) return`.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Combobox } from "../combobox"

window.IntersectionObserver ??= vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver ??= vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("Combobox bugs", () => {
  describe("BUG 1: trigger click must toggle open state in controlled mode", () => {
    it("calls onOpenChange(false) when trigger is clicked while open", async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Combobox
          value="a"
          onChange={vi.fn()}
          open={true}
          onOpenChange={onOpenChange}
        >
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Item value="a">Apple</Combobox.Item>
          </Combobox.Content>
        </Combobox>,
      )

      // The Combobox trigger is an IconButton rendered next to the
      // role="combobox" input. Query it explicitly — if the trigger wiring or
      // markup breaks so the chevron button isn't rendered, this test must
      // fail rather than silently skip its assertion.
      const triggerButton = document.querySelector<HTMLButtonElement>(
        "[data-combobox-trigger], button",
      )
      expect(triggerButton).not.toBeNull()

      await user.click(triggerButton!)

      // BUG: combobox.tsx:211 always calls `onOpenChange?.(true, "click")`
      // regardless of current state. Controlled combobox with open={true}
      // receiving a trigger click should emit (false, "click") to close.
      expect(onOpenChange).toHaveBeenCalledWith(false, "click")
    })
  })

  describe("BUG 2: onBlur must receive a string, not a FocusEvent", () => {
    it("passes the current input value (string) to onBlur, not an event object", async () => {
      const onBlur = vi.fn()
      const user = userEvent.setup()

      render(
        <Combobox
          value="hello"
          onChange={vi.fn()}
          onBlur={onBlur}
        >
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Item value="a">Apple</Combobox.Item>
          </Combobox.Content>
        </Combobox>,
      )

      const input = screen.getByRole("combobox")
      await user.click(input)
      await user.tab()

      expect(onBlur).toHaveBeenCalled()
      const receivedArg = onBlur.mock.calls[0][0]
      expect(typeof receivedArg).toBe("string")
    })
  })

  describe("BUG 3: focusing input with value must open dropdown in uncontrolled mode", () => {
    it("opens the dropdown when the input is focused and has a value", async () => {
      const user = userEvent.setup()

      render(
        <Combobox
          value="hello"
          onChange={vi.fn()}
        >
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Item value="hello">Hello</Combobox.Item>
            <Combobox.Item value="world">World</Combobox.Item>
          </Combobox.Content>
        </Combobox>,
      )

      const input = screen.getByRole("combobox")
      await user.click(input)

      await waitFor(
        () => {
          expect(screen.getByRole("listbox")).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })
  })

  describe("BUG 4: clicking an item must close the dropdown via tree event", () => {
    it("closes the dropdown when user clicks a Combobox.Item", async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Combobox
          value="a"
          onChange={vi.fn()}
          open={true}
          onOpenChange={onOpenChange}
        >
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Item value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
          </Combobox.Content>
        </Combobox>,
      )

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument()
      })

      const bananaItem = screen.getByText("Banana")
      await user.click(bananaItem)

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe("BUG 5: handleInputChange must respect disabled state", () => {
    it("does not call onChange when typing in a disabled combobox", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Combobox
          value=""
          onChange={onChange}
          disabled
        >
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Item value="a">Apple</Combobox.Item>
          </Combobox.Content>
        </Combobox>,
      )

      const input = screen.getByRole("combobox")
      await user.type(input, "hello")

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
