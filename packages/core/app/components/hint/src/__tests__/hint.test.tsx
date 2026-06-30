/**
 * Hint bug-focused tests
 *
 * BUG 1 (Medium): Setting disabled={true} while hint is open does not close it.
 *   - User scenario: User hovers over a hint icon to see a tooltip. The component
 *     then becomes disabled (e.g., the parent form field becomes read-only). Later
 *     the component is re-enabled. The tooltip should NOT reappear without a fresh
 *     hover interaction.
 *   - Regression it prevents: Ghost tooltips that reappear without user action after a
 *     disabled to enabled transition, violating the user's expectation that they dismissed
 *     the tooltip.
 *   - Logic change that makes it fail: In `hooks/use-hint.ts:88-101`, when `disabled`
 *     changes to `true`, `useHover` is disabled via `enabled: false` but the `open`
 *     state is never reset to `false`. HintContent hides visually (returns null on
 *     line 36 of info-content.tsx) but the floating-ui open state persists. When
 *     disabled returns to false, isMounted is still true so the tooltip reappears.
 *     Fix = add a useEffect in useHint that calls setOpen(false) when disabled
 *     becomes true.
 *
 * BUG 6: Only detects Hint.Trigger as a direct child
 *   - User scenario: Developer wraps Hint.Trigger in a styling element like
 *     <span className="ml-2"><Hint.Trigger /></span>. Children.toArray only finds
 *     direct children, so the trigger is not detected. A duplicate default trigger
 *     renders (hint.tsx:52), causing two reference elements and incorrect tooltip
 *     positioning with no error thrown.
 *   - Regression it prevents: Nested triggers silently produce broken tooltip positioning
 *   - Logic change: hint.tsx:38-43 - `Children.toArray(children).find(...)` only
 *     inspects top-level children. Fix = recursively search children or document
 *     that Trigger must be a direct child.
 *
 * BUG 7: disabled=true must prevent tooltip from opening on hover
 *   - User scenario: Developer renders <Hint disabled> with a tooltip. User hovers
 *     the trigger. The tooltip must NOT appear because the component is disabled.
 *   - Regression it prevents: Tooltips appearing when they should be disabled
 *   - Logic change: use-hint.ts:94-96 — `useHover` receives `enabled: !disabled`.
 *     Also use-hint.ts:64-68 — useEffect closes any open tooltip when disabled
 *     becomes true. If both guards break, tooltip opens even when disabled.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Hint } from "../hint"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver

vi.mock("@choiceform/icons-react", () => ({
  InfoCircle: () => <svg data-testid="info-icon" />,
}))

describe("Hint bugs", () => {
  describe("BUG 1: tooltip must not reappear when disabled toggles back to false", () => {
    it("does not reopen after disabled to enabled transition without a new hover", async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <Hint delay={0}>
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      const trigger = screen.getByRole("button")
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text")
      })

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

      rerender(
        <Hint delay={0}>
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      await waitFor(
        () => {
          expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
        },
        { timeout: 500 },
      )
    })
  })

  describe("BUG 6: must detect Hint.Trigger even when wrapped in another element", () => {
    it("does not render a duplicate default trigger when Trigger is nested", () => {
      render(
        <Hint delay={0}>
          <span data-testid="wrapper">
            <Hint.Trigger />
          </span>
          <Hint.Content>Tooltip text</Hint.Content>
        </Hint>,
      )

      const triggers = screen.getAllByRole("button")
      expect(triggers.length).toBe(1)
    })
  })

  describe("BUG 7: disabled=true must prevent tooltip from opening on hover", () => {
    it("does not show tooltip when hovering a disabled hint", async () => {
      const user = userEvent.setup()

      render(
        <Hint
          delay={0}
          disabled
        >
          <Hint.Content>Disabled tooltip</Hint.Content>
        </Hint>,
      )

      const trigger = screen.getByRole("button")
      await user.hover(trigger)

      await waitFor(
        () => {
          expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
        },
        { timeout: 500 },
      )
    })
  })
})
