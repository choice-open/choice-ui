/**
 * Hint bug-focused tests
 *
 * BUG 1 (Medium): Setting disabled={true} while hint is open does not close it.
 *   - User scenario: User hovers over a hint icon to see a tooltip. The component
 *     then becomes disabled (e.g., the parent form field becomes read-only). Later
 *     the component is re-enabled. The tooltip should NOT reappear without a fresh
 *     hover interaction.
 *   - Regression it prevents: Ghost tooltips that reappear without user action after a
 *     disabled→enabled transition, violating the user's expectation that they dismissed
 *     the tooltip.
 *   - Logic change that makes it fail: In `hooks/use-hint.ts:88-101`, when `disabled`
 *     changes to `true`, `useHover` is disabled via `enabled: false` but the `open`
 *     state is never reset to `false`. HintContent hides visually (returns null on
 *     line 36 of info-content.tsx) but the floating-ui open state persists. When
 *     disabled returns to false, isMounted is still true so the tooltip reappears.
 *     Fix = add a useEffect in useHint that calls setOpen(false) when disabled
 *     becomes true.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Hint } from "../hint"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver

describe("Hint bugs", () => {
  describe("BUG 1: tooltip must not reappear when disabled toggles back to false", () => {
    it("does not reopen after disabled→enabled transition without a new hover", async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <Hint delay={0}>
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      // Step 1: hover trigger to open tooltip
      const trigger = screen.getByRole("button")
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text")
      })

      // Step 2: disable while tooltip is open — content returns null visually
      rerender(
        <Hint
          delay={0}
          disabled
        >
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
      })

      // Step 3: re-enable without any new user interaction
      rerender(
        <Hint delay={0}>
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      // BUG: open state was never reset to false, so isMounted stays true and
      // HintContent re-renders the tooltip immediately.
      // Expected: tooltip stays hidden until user hovers again.
      // This assertion FAILS — the tooltip IS present in the document.
      await waitFor(
        () => {
          expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
        },
        { timeout: 500 },
      )
    })
  })
})
