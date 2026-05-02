/**
 * Icon Button bug-focused tests
 *
 * BUG 6: type="button" forced on non-button elements via asChild
 *   - User scenario: Developer uses <IconButton asChild><a href="/"><Icon/></a></IconButton>.
 *     The rendered <a> gets type="button", which is invalid HTML for anchor elements.
 *   - Regression it prevents: Invalid DOM attributes on non-button asChild targets
 *   - Logic change: Line 59 forces type="button" regardless of rendered element.
 *     Fix = only apply type when the rendered element is a button.
 *
 * BUG 7: Missing aria-disabled and aria-busy attributes
 *   - User scenario: Developer renders <IconButton disabled /> or <IconButton loading />.
 *     Unlike the Button component which sets aria-disabled and aria-busy, IconButton only
 *     sets the native HTML disabled attribute. When rendered as a non-button (via as="a"
 *     or asChild), the disabled attribute is invalid HTML and has no effect on accessibility.
 *     Screen readers cannot determine the button is disabled or in a loading state.
 *   - Regression it prevents: WCAG accessibility violation for disabled/loading icon buttons
 *   - Logic change: icon-button.tsx:61 sets disabled={disabled || loading} but has no
 *     aria-disabled or aria-busy. Lines 56-65 have no ARIA attributes at all.
 *     Fix = add aria-disabled={disabled || loading} and aria-busy={loading}.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { IconButton } from "../icon-button"

vi.mock("@choiceform/icons-react", () => ({
  LoaderCircle: () => <svg data-testid="loader" />,
}))

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

  describe("BUG 7: must set aria-disabled and aria-busy for accessibility", () => {
    it("sets aria-disabled when disabled is true", () => {
      render(
        <IconButton
          disabled
          aria-label="Action"
        >
          <span>★</span>
        </IconButton>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-disabled", "true")
    })

    it("sets aria-busy when loading is true", () => {
      render(
        <IconButton
          loading
          aria-label="Action"
        >
          <span>★</span>
        </IconButton>,
      )

      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("aria-busy", "true")
    })

    it("sets aria-disabled when rendered as anchor with disabled", () => {
      render(
        <IconButton
          as="a"
          disabled
          aria-label="Link"
        >
          <span>★</span>
        </IconButton>,
      )

      const element = screen.getByLabelText("Link")
      expect(element).toHaveAttribute("aria-disabled", "true")
    })
  })
})
