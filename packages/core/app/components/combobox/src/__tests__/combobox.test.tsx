/**
 * Combobox bug-focused tests
 *
 * BUG 1: handleTriggerClick always calls onOpenChange(true) — can never close via trigger
 *   - User scenario: Controlled combobox, user clicks trigger to open, clicks again to close.
 *     Second click sends onOpenChange(true) again — menu stays open forever.
 *   - Regression it prevents: Trigger click being unable to close controlled combobox
 *   - Logic change that makes it fail: Line 211 always passes true: `onOpenChange?.(true, "click")`.
 *     Should be `onOpenChange?.(!isOpen, "click")` or `onOpenChange?.(!controlledOpen, "click")`.
 *
 * BUG 2: onBlur typed as (value: string) => void but receives FocusEvent at runtime
 *   - User scenario: Consumer writes `<Combobox onBlur={(v) => v.toUpperCase()} />`.
 *     At runtime, v is actually a FocusEvent — crash: ".toUpperCase is not a function".
 *   - Regression it prevents: Runtime crash from type/implementation mismatch
 *   - Logic change that makes it fail: combobox-trigger.tsx line 81 calls `onBlur?.(event)`
 *     passing a FocusEvent, but ComboboxProps declares `onBlur?: (value: string) => void`.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Combobox } from "../combobox"

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
        '[data-combobox-trigger], button',
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
})
