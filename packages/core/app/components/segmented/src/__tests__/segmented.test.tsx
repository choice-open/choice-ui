/**
 * Segmented bug-focused tests
 *
 * BUG 9: No uncontrolled mode despite optional value/onChange types
 *   - User scenario: Developer renders <Segmented> without value/onChange, expecting
 *     it to work like native radio buttons (uncontrolled). Clicking items does nothing.
 *   - Regression it prevents: Wasted debugging time from misleading optional types
 *   - Logic change: segmented.tsx has no internal state for value, passes valueProp
 *     directly to context. When undefined, no item matches, clicks do nothing.
 *     Fix = add internal state fallback when value is undefined.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Segmented } from "../segmented"

describe("Segmented bugs", () => {
  describe("BUG 9: must work in uncontrolled mode without value prop", () => {
    it("selects an item when clicked without providing value prop", async () => {
      const user = userEvent.setup()

      render(
        <Segmented>
          <Segmented.Item value="a">Alpha</Segmented.Item>
          <Segmented.Item value="b">Beta</Segmented.Item>
        </Segmented>,
      )

      await user.click(screen.getByText("Beta"))

      const betaItem = screen.getByText("Beta").closest("[data-selected]")
      expect(betaItem?.getAttribute("data-selected")).toBe("true")
    })
  })
})
