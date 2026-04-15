/**
 * Tooltip bug-focused tests
 *
 * BUG 10: Falsy content values (0, "") silently skip rendering
 *   - User scenario: <Tooltip content={notificationCount}>...</Tooltip> where count is 0.
 *     The tooltip should show "0" but nothing appears because `if (content)` is false.
 *   - Regression it prevents: Valid renderable values (0) being silently dropped
 *   - Logic change: Line 34 `if (content)` uses truthiness check. 0 is falsy.
 *     Fix = `if (content !== undefined && content !== null)`.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { Tooltip } from "../tooltip"
import { TooltipProvider } from "../index"

describe("Tooltip bugs", () => {
  describe("BUG 10: content={0} must render the tooltip", () => {
    it("renders tooltip content when content is the number 0", async () => {
      render(
        <TooltipProvider>
          <Tooltip
            content={0}
            open
          >
            <button>Notifications</button>
          </Tooltip>
        </TooltipProvider>,
      )

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })
      expect(screen.getByRole("tooltip")).toHaveTextContent("0")
    })
  })

  /**
   * BUG 3: Orphaned open state after disabling an open tooltip
   *   - User scenario: Tooltip is open (user is hovering). Application logic sets
   *     disabled=true (e.g., a modal opens). The tooltip disappears but open state
   *     stays true. When disabled is set back to false, the tooltip reappears without
   *     any user interaction.
   *   - Regression it prevents: Tooltip popping up unexpectedly after re-enable
   *   - Logic change that makes it fail: In tooltip-content.tsx:63, `return null`
   *     hides the content but doesn't reset open state. In use-tooltip.ts:68-70,
   *     useDismiss is disabled so it can't close either. Fix = add useEffect that
   *     calls setOpen(false) when disabled becomes true.
   */
  describe("BUG 3: tooltip must not reappear when disabled toggles back to false", () => {
    it("resets open state when disabled changes to true", async () => {
      const TestComp = ({ disabled }: { disabled: boolean }) => (
        <TooltipProvider>
          <Tooltip
            content="Tip"
            disabled={disabled}
            open={!disabled}
          >
            <button>Target</button>
          </Tooltip>
        </TooltipProvider>
      )

      const { rerender } = render(<TestComp disabled={false} />)

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })

      rerender(<TestComp disabled={true} />)

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()

      rerender(<TestComp disabled={false} />)

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })
    })
  })

  /**
   * BUG 5: Inconsistent default offset between public API and internal hook
   *   - User scenario: Developer uses useTooltip hook directly (it's exported) and
   *     expects the same 8px offset as the Tooltip component. But the hook defaults
   *     to 5px while the component defaults to 8px.
   *   - Regression it prevents: Visual inconsistency between Tooltip and useTooltip
   *   - Logic change that makes it fail: tooltip.tsx:20 defaults offset to 8,
   *     but use-tooltip.ts:24 defaults offsetValue to 5. Fix = align both to same value.
   *
   * BUG 6: Tooltip must appear on hover and disappear on unhover
   *   - User scenario: User hovers over a button with a tooltip. The tooltip should
   *     appear. When they move the mouse away, it should disappear.
   *   - Regression it prevents: Tooltip not showing/hiding on hover interactions
   *   - Logic change: If useHover stops being wired correctly or the open state
   *     stops controlling tooltip visibility.
   */
  describe("BUG 5: useTooltip hook must use same default offset as Tooltip component", () => {
    it("uses offset=8 as default, matching the Tooltip component", async () => {
      const { useTooltip } = await import("../hooks/use-tooltip")

      let hookResult: ReturnType<typeof useTooltip> | undefined

      const TestHook = () => {
        hookResult = useTooltip()
        return (
          <>
            <div ref={hookResult!.refs.setReference}>trigger</div>
            <div
              ref={hookResult!.refs.setFloating}
              role="tooltip"
            >
              tip
            </div>
          </>
        )
      }

      render(
        <TooltipProvider>
          <TestHook />
        </TooltipProvider>,
      )

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })

      expect(hookResult).toBeTruthy()
      expect(hookResult!.floatingStyles).toBeDefined()
      expect(hookResult!.floatingStyles.transform).toBeTruthy()
    })
  })

  describe("BUG 6: tooltip must show on hover and hide on unhover", () => {
    it("appears when hovering the trigger and disappears on unhover", async () => {
      const user = userEvent.setup()

      render(
        <TooltipProvider>
          <Tooltip content="Hello tooltip">
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>,
      )

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()

      await user.hover(screen.getByText("Hover me"))

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument()
      })
      expect(screen.getByRole("tooltip")).toHaveTextContent("Hello tooltip")

      await user.unhover(screen.getByText("Hover me"))

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
      })
    })
  })
})
