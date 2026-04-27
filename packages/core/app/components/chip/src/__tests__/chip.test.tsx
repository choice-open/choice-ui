/**
 * Chip bug-focused tests
 *
 * BUG 8: Missing space in close button aria-label
 *   - User scenario: Screen reader encounters chip "React". Close button aria-label
 *     is "Remove chip:React" (no space). Screen readers read it as one garbled word.
 *   - Regression it prevents: Unreadable close button labels for screen readers
 *   - Logic change: chip.tsx line 86 concatenates i18n.remove + children without separator.
 *     Fix = add a space or use template literal.
 *
 * BUG 1: onClick fires when chip is disabled
 *   - User scenario: Developer renders a chip with disabled={true}. The chip looks
 *     visually disabled but clicking it still fires onClick. No aria-disabled is set.
 *   - Regression it prevents: Disabled chips being interactive
 *   - Logic change: chip.tsx lines 68-71. onClick handler has no disabled guard.
 *     disabled is destructured out and only used for visual styling. Fix = guard
 *     onClick with `if (disabled) return` and add `aria-disabled`.
 *
 * BUG 4: onRemove must fire when close button is clicked
 *   - User scenario: User clicks the X button on a chip to remove it. The onRemove
 *     callback should fire. If it doesn't, chips can never be removed.
 *   - Regression it prevents: Chip close button not working
 *   - Logic change: If the close button stops calling onRemove or if stopPropagation
 *     prevents the event from reaching the handler.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Chip } from "../chip"

describe("Chip bugs", () => {
  describe("BUG 8: close button aria-label must have a space separator", () => {
    it('announces "Remove chip: React" with a space, not "Remove chip:React"', () => {
      render(<Chip onRemove={vi.fn()}>React</Chip>)

      const closeButton = screen.getByRole("button", { hidden: true })
      const ariaLabel = closeButton.getAttribute("aria-label") || ""

      expect(ariaLabel).toMatch(/chip[:\s]\s*React/i)
    })
  })

  describe("BUG 1: onClick must NOT fire when chip is disabled", () => {
    it("does not call onClick when a disabled chip is clicked", async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Chip
          disabled
          onClick={onClick}
        >
          React
        </Chip>,
      )

      const chip = screen.getByText("React")
      await user.click(chip)

      expect(onClick).not.toHaveBeenCalled()
    })

    it("has aria-disabled=true when disabled prop is set", () => {
      render(<Chip disabled>React</Chip>)

      const chip = screen.getByText("React").closest("[aria-disabled]")
      expect(chip).toHaveAttribute("aria-disabled", "true")
    })
  })

  describe("BUG 4: clicking close button must call onRemove", () => {
    it("calls onRemove when the close button is clicked", async () => {
      const onRemove = vi.fn()
      const user = userEvent.setup()

      render(<Chip onRemove={onRemove}>React</Chip>)

      const closeButton = screen.getByRole("button", { hidden: true })
      await user.click(closeButton)

      expect(onRemove).toHaveBeenCalled()
    })
  })
})
