/**
 * Switch bug-focused tests
 *
 * BUG 3.1: aria-label not set when children is a number
 *   - User scenario: Developer renders <Switch value={v} onChange={setV}>{42}</Switch>
 *     The label "42" is visible, but screen readers announce the switch as unnamed
 *   - Regression it prevents: Switches with numeric labels are inaccessible
 *   - Logic change that makes it fail: Line 129 checks `typeof children === "string"`
 *     but not `typeof children === "number"`, even though renderLabel (line 94)
 *     handles number children. Fix = add `|| typeof children === "number"`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Switch } from "../switch"

describe("Switch bugs", () => {
  describe("BUG 3.1: numeric children must produce a valid aria-label", () => {
    it("sets aria-label from numeric children", () => {
      render(
        <Switch
          value={false}
          onChange={vi.fn()}
        >
          {42}
        </Switch>,
      )

      const input = screen.getByRole("checkbox")
      expect(input).toHaveAttribute("aria-label", "42")
    })
  })
})
