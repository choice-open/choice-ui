/**
 * Description bug-focused tests
 *
 * BUG 1: disabled prop doesn't set aria-disabled
 *   - User scenario: Developer renders <Description disabled>Some text</Description>.
 *     The visual style changes (via TV variants), but screen readers have no indication
 *     the description is disabled because aria-disabled is not set.
 *   - Regression it prevents: Disabled descriptions not announced to screen readers
 *   - Logic change: description.tsx:12-19 — <p> element receives {...rest} but never
 *     explicitly sets aria-disabled={disabled}. Fix = add aria-disabled={disabled || undefined}.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Description } from "../description"

describe("Description bugs", () => {
  describe("BUG 1: disabled description must set aria-disabled", () => {
    it("sets aria-disabled=true when disabled prop is true", () => {
      render(<Description disabled>Disabled text</Description>)

      const paragraph = screen.getByText("Disabled text")
      expect(paragraph).toHaveAttribute("aria-disabled", "true")
    })

    it("does not set aria-disabled when disabled is not provided", () => {
      render(<Description>Normal text</Description>)

      const paragraph = screen.getByText("Normal text")
      expect(paragraph).not.toHaveAttribute("aria-disabled")
    })
  })
})
