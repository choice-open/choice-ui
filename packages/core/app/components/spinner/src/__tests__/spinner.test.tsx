/**
 * Spinner bug-focused tests
 *
 * BUG 1: Hardcoded aria-label="Loading" overrides visible custom label (SpinnerBounce)
 *   - User scenario: Developer renders <SpinnerBounce label="Saving your data..." />.
 *     The visible text says "Saving your data..." but screen readers announce "Loading"
 *     because the hardcoded aria-label takes precedence over child text content.
 *   - Regression it prevents: Screen reader text not matching visible label
 *   - Logic change: spinner-bounce.tsx:50 - `aria-label="Loading"` is always "Loading".
 *     Fix = `aria-label={label || "Loading"}`.
 *
 * BUG 5: Same hardcoded aria-label="Loading" bug in SpinnerSpin
 *   - User scenario: Developer renders <SpinnerSpin label="Uploading file..." />.
 *     The visible text says "Uploading file..." but screen readers announce "Loading"
 *     because spinner-spin.tsx:53 has the same hardcoded `aria-label="Loading"`.
 *   - Regression it prevents: Screen reader text not matching visible label for SpinnerSpin
 *   - Logic change: spinner-spin.tsx:53 - `aria-label="Loading"` is always "Loading".
 *     Fix = `aria-label={label || "Loading"}`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpinnerBounce } from "../spinner-bounce"
import { SpinnerSpin } from "../spinner-spin"

describe("Spinner bugs", () => {
  describe("BUG 1: custom label must override default aria-label (SpinnerBounce)", () => {
    it("uses the custom label as aria-label when provided", () => {
      render(<SpinnerBounce label="Saving your data..." />)

      const statusElement = screen.getByRole("status")
      expect(statusElement).toHaveAttribute("aria-label", "Saving your data...")
    })
  })

  describe("BUG 5: custom label must override default aria-label (SpinnerSpin)", () => {
    it("uses the custom label as aria-label when provided", () => {
      render(<SpinnerSpin label="Uploading file..." />)

      const statusElement = screen.getByRole("status")
      expect(statusElement).toHaveAttribute("aria-label", "Uploading file...")
    })
  })
})
