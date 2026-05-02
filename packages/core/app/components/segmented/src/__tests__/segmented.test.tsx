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
 *
 * BUG 10: onHoverChange callback never fires due to pointer-events-none on label
 *   - User scenario: Developer passes onHoverChange to Segmented.Item for tooltip
 *     or analytics. The callback is never invoked because the wrapping <label>
 *     has className="pointer-events-none", blocking mouseenter/mouseleave events.
 *   - Regression it prevents: onHoverChange prop being completely non-functional
 *   - Logic change: segmented-item.tsx:99 — label has className="pointer-events-none"
 *     but lines 101-102 attach onMouseEnter/onMouseLeave to the same label.
 *     Fix = move hover handlers to the inner div with pointer-events-auto, or remove
 *     pointer-events-none from the label.
 *
 * BUG 6: Re-clicking the already-active item re-fires onChange
 *   - User scenario: User clicks the already-selected segmented item. Even though
 *     nothing visually changes, onChange fires again with the same value, causing
 *     unnecessary re-renders, network requests, or side effects.
 *   - Regression it prevents: Wasteful re-renders and side effects from clicking
 *     an already-active item.
 *   - Logic change: segmented-item.tsx line 53-58 — handleChange fires onChange(value)
 *     whenever e.target.checked is true (radio button re-checks on click). Fix = add
 *     `if (isActive) return` guard before calling onChange.
 *
 * BUG 7: Invalid HTML IDs generated when value contains spaces or special chars
 *   - User scenario: Developer uses <Segmented.Item value="Option A">. The generated
 *     HTML id becomes "seg-0-Option A" which is invalid (spaces not allowed in IDs).
 *   - Regression it prevents: DOM validation errors, broken label htmlFor associations,
 *     CSS selectors failing.
 *   - Logic change: segmented-item.tsx line 49 — `optionId = \`${groupId}-${value}\``
 *     uses raw value without sanitization. Fix = sanitize the value for use in IDs.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
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

  describe("BUG 10: onHoverChange must fire when item is hovered", () => {
    it("calls onHoverChange(true) when mouse enters a segmented item", async () => {
      const onHoverChange = vi.fn()

      render(
        <Segmented
          value="a"
          onChange={() => {}}
        >
          <Segmented.Item
            value="a"
            onHoverChange={onHoverChange}
          >
            Alpha
          </Segmented.Item>
          <Segmented.Item value="b">Beta</Segmented.Item>
        </Segmented>,
      )

      const alphaText = screen.getByText("Alpha")
      const label = alphaText.closest("label")
      expect(label).toBeTruthy()
      fireEvent.mouseEnter(label!)
      expect(onHoverChange).toHaveBeenCalledWith(true)
    })
  })

  describe("BUG 6: clicking already-active item must not re-fire onChange", () => {
    it("does not call onChange when clicking the already selected item", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Segmented
          value="a"
          onChange={onChange}
        >
          <Segmented.Item value="a">Alpha</Segmented.Item>
          <Segmented.Item value="b">Beta</Segmented.Item>
        </Segmented>,
      )

      await user.click(screen.getByText("Alpha"))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 7: value with spaces must not produce invalid HTML IDs", () => {
    it("generates a valid HTML id when value contains spaces", () => {
      render(
        <Segmented
          value="opt a"
          onChange={() => {}}
        >
          <Segmented.Item value="opt a">Option A</Segmented.Item>
          <Segmented.Item value="opt b">Option B</Segmented.Item>
        </Segmented>,
      )

      const input = screen.getByRole("radio", { checked: true })
      const id = input.id
      const isValidId = /^[a-zA-Z][a-zA-Z0-9:_-]*$/.test(id)
      expect(isValidId).toBe(true)
    })

    it("does not collide ids across values that differ only in non-alphanumeric chars", () => {
      // Regression: "a-b" and "a b" both used to sanitize to "a_b", giving
      // two radio inputs the same id and mis-targeting htmlFor.
      render(
        <Segmented
          value="a-b"
          onChange={() => {}}
        >
          <Segmented.Item value="a-b">Dash</Segmented.Item>
          <Segmented.Item value="a b">Space</Segmented.Item>
        </Segmented>,
      )

      const inputs = screen.getAllByRole("radio")
      expect(inputs).toHaveLength(2)
      expect(inputs[0]!.id).not.toBe(inputs[1]!.id)
    })
  })
})
