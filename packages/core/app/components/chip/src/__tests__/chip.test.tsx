/**
 * Chip bug-focused tests
 *
 * BUG 8: Missing space in close button aria-label
 *   - User scenario: Screen reader user encounters a chip with text "React".
 *     The close button aria-label is "Remove chip:React" (no space) instead of
 *     "Remove chip: React". Screen readers may read it as a single garbled word.
 *   - Regression it prevents: Unreadable close button labels for screen readers
 *   - Logic change that makes it fail: Line 86 concatenates i18n.remove + children
 *     without a separator. Fix = add a space or use template literal.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
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
})
