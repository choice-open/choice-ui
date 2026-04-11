/**
 * Separator bug-focused tests
 *
 * BUG 7: Duplicate ARIA role="separator" when children are provided
 *   - User scenario: Developer renders <Separator>OR</Separator> for a divider
 *     with text. Screen readers announce two separator landmarks instead of one.
 *   - Regression it prevents: Confusing accessibility tree for separators with children
 *   - Logic change that makes it fail: Lines 58-66 render two <div> elements both
 *     with role="separator" and aria-orientation when children is provided.
 *     Only one should have the separator role; the other should be presentational.
 *     Fix = apply role="presentation" to the decorative lines, or use a single
 *     separator role on the wrapper.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Separator } from "../separator"

describe("Separator bugs", () => {
  describe("BUG 7: only one separator role when children are provided", () => {
    it("has exactly one role=separator element, not two", () => {
      render(
        <Separator>
          <span>OR</span>
        </Separator>,
      )

      const separators = screen.getAllByRole("separator")
      expect(separators).toHaveLength(1)
    })
  })
})
