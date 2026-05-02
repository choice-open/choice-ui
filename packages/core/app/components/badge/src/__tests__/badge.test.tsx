/**
 * Badge bug-focused tests
 *
 * BUG 1: isMultiElement detection gives wrong padding for single wrapped elements with array children
 *   - User scenario: Developer wraps an icon and text in a single <span> inside Badge:
 *     `<Badge><span><Icon /><span>Text</span></span></Badge>`. The span has two children (an array),
 *     so the current `Array.isArray(children.props.children)` check (line 16-17) incorrectly
 *     classifies this as "multi-element", applying `pr-1` instead of `px-1` padding.
 *   - Regression it prevents: Single-child badges with rich content get asymmetric padding
 *     (right-only) instead of horizontal padding, causing visual misalignment.
 *   - Logic change that makes it fail: The first branch of isMultiElement (lines 15-17) treats
 *     any valid element whose .props.children is an array as multi-element. Fix = only consider
 *     it multi-element when Badge itself receives multiple top-level children (the second branch),
 *     or inspect the top-level children count, not the nested children array.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Badge } from "../badge"

describe("Badge bugs", () => {
  describe("BUG 1: single wrapping element with array children should not get multi-element padding", () => {
    it("applies px-1 padding when a single wrapper element contains multiple children", () => {
      render(
        <Badge data-testid="badge">
          <span>
            <span>Icon</span>
            <span>Text</span>
          </span>
        </Badge>,
      )

      const badge = screen.getByTestId("badge")
      expect(badge.className).toContain("px-1")
      expect(badge.className).not.toContain("pr-1")
    })

    it("applies pr-1 padding when badge truly has multiple top-level children", () => {
      render(
        <Badge data-testid="badge">
          <span>Icon</span>
          <span>Text</span>
        </Badge>,
      )

      const badge = screen.getByTestId("badge")
      expect(badge.className).toContain("pr-1")
    })
  })
})
