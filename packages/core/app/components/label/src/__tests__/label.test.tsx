/**
 * Label bug-focused tests
 *
 * BUG 1: Required asterisk has no accessible label
 *   - User scenario: Developer renders <Label required>Theme</Label>. A screen
 *     reader announces "Theme asterisk" — meaningless. The `*` should have an
 *     aria-label like "required" so screen readers announce "Theme required".
 *   - Regression it prevents: Inaccessible required field indicator
 *   - Logic change: label.tsx:42 — `<span className={tv.required()}>*</span>`
 *     has no aria-label. Fix = add `aria-label="required"`.
 *
 * BUG 2: as="legend" with htmlFor produces invalid HTML
 *   - User scenario: Developer renders <Label as="legend" htmlFor="field">Label</Label>.
 *     The <legend> element receives `htmlFor` from the spread, but <legend> does not
 *     support `htmlFor` — it's only valid on <label>. This produces invalid HTML.
 *   - Regression it prevents: Invalid HTML from legend+htmlFor combination
 *   - Logic change: label.tsx:34-39 — `{...rest}` spreads all props including
 *     `htmlFor` onto the Component, which may be `<legend>`.
 *     Fix = filter out `htmlFor` when `as="legend"`.
 *
 * BUG 3: default as="label" must preserve htmlFor attribute
 *   - User scenario: Developer renders <Label htmlFor="name-input">Name</Label>.
 *     The rendered <label> must have for="name-input" so clicking the label
 *     focuses the associated input.
 *   - Regression it prevents: htmlFor being accidentally filtered on label elements
 *   - Logic change: label.tsx:36-37 — `as === "legend" ? restFiltered : rest`
 *     returns full `rest` for label, including `htmlFor`. If the condition is
 *     inverted or `restFiltered` always used, htmlFor is lost.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Label } from "../label"

describe("Label bugs", () => {
  describe("BUG 1: required asterisk must have an accessible label", () => {
    it("renders the required indicator with aria-label for screen readers", () => {
      render(<Label required>Theme</Label>)

      const asterisk = screen.getByText("*")
      expect(asterisk).toHaveAttribute("aria-label", "required")
    })
  })

  describe("BUG 2: as=legend must not receive htmlFor attribute", () => {
    it("does not pass htmlFor to a legend element", () => {
      render(
        <Label
          as="legend"
          htmlFor="field-id"
        >
          Legend Text
        </Label>,
      )

      const legend = screen.getByText("Legend Text").closest("legend")
      expect(legend).toBeTruthy()
      expect(legend).not.toHaveAttribute("for")
    })
  })

  describe("BUG 3: default as=label must preserve htmlFor attribute", () => {
    it("passes htmlFor to the rendered label element", () => {
      render(<Label htmlFor="name-input">Name</Label>)

      const label = screen.getByText("Name").closest("label")
      expect(label).toBeTruthy()
      expect(label).toHaveAttribute("for", "name-input")
    })
  })
})
