/**
 * Rich Input bug-focused tests
 *
 * BUG 6: Focus/Blur handlers pass empty {} instead of real events
 *   - User scenario: Developer provides onFocus handler that reads event.target.
 *     Handler crashes because event is {} — no target, no type, nothing.
 *   - Regression it prevents: Consumer handlers crashing on mock events
 *   - Logic change: Lines 113, 120 — `{} as React.FocusEvent<HTMLDivElement>`.
 *     Fix = pass the original Slate event or construct a real event.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

describe("Rich Input bugs", () => {
  describe("BUG 6: onFocus must receive an event with a target property", () => {
    it("passes an event object with target to onFocus callback", async () => {
      const onFocus = vi.fn()
      const user = userEvent.setup()

      const { RichInput } = await import("../rich-input")

      render(
        <RichInput
          onFocus={onFocus}
          placeholder="Type here..."
        />,
      )

      const editor = screen.getByPlaceholderText("Type here...")
      await user.click(editor)

      await waitFor(() => {
        expect(onFocus).toHaveBeenCalled()
      })

      const event = onFocus.mock.calls[0][0]
      expect(event.target).toBeDefined()
    })
  })
})
