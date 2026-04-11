/**
 * Popover bug-focused tests
 *
 * BUG 5: interactions="none" still closes on Escape
 *   - User scenario: Developer sets interactions="none" for full programmatic control.
 *     Outside clicks correctly don't close, but pressing Escape still closes the popover.
 *     The developer's state is now out of sync — they set open=true but it's visually closed.
 *   - Regression it prevents: interactions="none" being a lie — Escape bypasses it
 *   - Logic change that makes it fail: use-floating-popover.ts line 233 disables useDismiss
 *     when interactions="none", but line 279's standalone escape handler only checks
 *     closeOnEscape, not interactions. Fix = add `&& interactions !== "none"` guard.
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

describe("Popover bugs", () => {
  describe("BUG 5: interactions=none must not close on Escape", () => {
    it("keeps popover open when Escape is pressed and interactions is none", async () => {
      const { Popover } = await import("../popover")
      const user = userEvent.setup()

      const onOpenChange = vi.fn()

      render(
        <Popover
          open
          onOpenChange={onOpenChange}
          interactions="none"
        >
          <Popover.Trigger>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Header>Header</Popover.Header>
          <Popover.Content>Content</Popover.Content>
        </Popover>,
      )

      await waitFor(() => {
        expect(screen.getByText("Content")).toBeInTheDocument()
      })

      await user.keyboard("{Escape}")

      expect(onOpenChange).not.toHaveBeenCalled()
    })
  })
})
