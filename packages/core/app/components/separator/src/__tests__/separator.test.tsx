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
 *
 * BUG 8: Decorative separator must NOT include aria-orientation
 *   - User scenario: Screen reader encounters <Separator decorative /> and navigates
 *     using aria-orientation attribute which shouldn't exist on decorative elements.
 *   - Regression it prevents: Decorative separators leaking semantic attributes
 *   - Logic change: separator.tsx:34-39 — decorative branch returns { role: "none" }
 *     with NO aria-orientation. If conditional breaks, decorative separators get
 *     aria-orientation which is invalid on role="none".
 *
 * BUG 9: Children path inner divs must have role="presentation"
 *   - User scenario: Developer renders <Separator>OR</Separator>. The inner div
 *     separators should be presentational, not appear in the a11y tree.
 *   - Regression it prevents: Visual-only separator lines becoming a11y landmarks
 *   - Logic change: separator.tsx:59-66 — both inner divs have role="presentation".
 *     If removed, they pollute the accessibility tree.
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

  describe("BUG 8: decorative separator must NOT include aria-orientation", () => {
    it("has no aria-orientation when decorative=true", () => {
      const { container } = render(
        <Separator
          decorative
          orientation="vertical"
        />,
      )

      const el = container.firstElementChild as HTMLElement
      expect(el).toHaveAttribute("role", "none")
      expect(el).not.toHaveAttribute("aria-orientation")
    })
  })

  describe("BUG 9: children path inner divs must have role=presentation", () => {
    it("both inner separator divs are presentational", () => {
      render(
        <Separator>
          <span>OR</span>
        </Separator>,
      )

      const wrapper = screen.getByRole("separator")
      const innerDivs = wrapper.querySelectorAll("div")

      expect(innerDivs).toHaveLength(2)
      innerDivs.forEach((div) => {
        expect(div).toHaveAttribute("role", "presentation")
      })
    })
  })

  describe("existing: decorative separator accessibility", () => {
    it("applies role=none when decorative=true, hiding it from screen readers", () => {
      render(<Separator decorative />)

      expect(screen.queryByRole("separator")).toBeNull()
      expect(screen.queryByRole("none")).not.toBeNull()
    })

    it("applies aria-orientation matching the orientation prop", () => {
      render(<Separator orientation="vertical" />)

      const separator = screen.getByRole("separator")
      expect(separator).toHaveAttribute("aria-orientation", "vertical")
    })
  })
})
