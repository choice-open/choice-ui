/**
 * Spinner bug-focused tests
 *
 * BUG 1: Hardcoded aria-label="Loading" overrides visible custom label
 *   - User scenario: Developer renders <SpinnerBounce label="Saving your data..." />.
 *     The visible text says "Saving your data..." but screen readers announce "Loading"
 *     because the hardcoded aria-label takes precedence over child text content.
 *   - Regression it prevents: Screen reader text not matching visible label
 *   - Logic change: spinner-bounce.tsx:50 — `aria-label="Loading"` is always "Loading".
 *     Fix = `aria-label={label || "Loading"}`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpinnerBounce } from "../spinner-bounce"

describe("Spinner bugs", () => {
  describe("BUG 1: custom label must override default aria-label", () => {
    it("uses the custom label as aria-label when provided", () => {
      render(<SpinnerBounce label="Saving your data..." />)

      const statusElement = screen.getByRole("status")
      expect(statusElement).toHaveAttribute("aria-label", "Saving your data...")
    })
  })
})
