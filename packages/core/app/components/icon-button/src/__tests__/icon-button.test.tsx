/**
 * Icon Button bug-focused tests
 *
 * BUG 6: type="button" forced on non-button elements via asChild
 *   - User scenario: Developer uses <IconButton asChild><a href="/"><Icon/></a></IconButton>.
 *     The rendered <a> gets type="button", which is invalid HTML for anchor elements.
 *   - Regression it prevents: Invalid DOM attributes on non-button asChild targets
 *   - Logic change: Line 59 forces type="button" regardless of rendered element.
 *     Fix = only apply type when the rendered element is a button.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { IconButton } from "../icon-button"

describe("Icon Button bugs", () => {
  describe("BUG 6: type=button must not be forced on non-button asChild elements", () => {
    it("does not set type attribute on an anchor element via asChild", () => {
      render(
        <IconButton
          asChild
          aria-label="Link"
        >
          <a href="/page">
            <span>★</span>
          </a>
        </IconButton>,
      )

      const link = screen.getByRole("link")
      expect(link).not.toHaveAttribute("type")
    })
  })
})
