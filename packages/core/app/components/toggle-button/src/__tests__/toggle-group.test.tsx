/**
 * Toggle Group bug-focused tests
 *
 * BUG 14: {...rest} overrides keyboard navigation onKeyDown handler
 *   - User scenario: Consumer passes <ToggleGroup onKeyDown={myHandler}> to add custom
 *     key handling. Their handler completely replaces the built-in arrow key navigation
 *     because {...rest} (line 197) is spread AFTER explicit onKeyDown={handleKeyDown}
 *     (line 196). Arrow key navigation stops working entirely.
 *   - Regression it prevents: Breaking keyboard accessibility when adding custom key handlers
 *   - Logic change: toggle-group.tsx:196-197 - onKeyDown={handleKeyDown} is set, then
 *     {...rest} overwrites it if rest.onKeyDown exists. Fix = merge handlers: call
 *     handleKeyDown first, then call rest.onKeyDown.
 *
 * BUG 15: Missing aria-multiselectable for multiple-select groups
 *   - User scenario: Developer renders <ToggleGroup multiple> to allow selecting multiple
 *     items. Screen reader users cannot distinguish between single-select and multi-select
 *     groups because aria-multiselectable is never set. Only data-multiple (a data
 *     attribute invisible to screen readers) is applied.
 *   - Regression it prevents: WCAG violation - screen readers can't communicate multiselect
 *   - Logic change: toggle-group.tsx:195 - `data-multiple={multiple ? "" : undefined}`
 *     is set but `aria-multiselectable` is not. Fix = add
 *     `aria-multiselectable={multiple || undefined}`.
 *
 * BUG 16: Clicking a ToggleGroup.Item must call onChange with updated value array
 *   - User scenario: User clicks an unselected item in a ToggleGroup. The group's
 *     onChange should fire with the new value array including the clicked item.
 *   - Regression it prevents: Item clicks not updating group selection
 *   - Logic change: If ToggleGroupItem's handleChange stops calling context.onChange.
 */
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ToggleGroup } from "../toggle-group"

describe("Toggle Group bugs", () => {
  describe("BUG 14: rest onKeyDown must not replace built-in keyboard navigation", () => {
    it("still moves focus on arrow keys when consumer passes onKeyDown", async () => {
      const user = userEvent.setup()
      const customKeyDown = vi.fn()

      render(
        <ToggleGroup onKeyDown={customKeyDown}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup>,
      )

      const inputs = screen.getAllByRole("checkbox")
      expect(inputs.length).toBeGreaterThanOrEqual(2)

      await user.click(inputs[0])
      expect(inputs[0]).toHaveFocus()

      await user.keyboard("{ArrowRight}")

      expect(customKeyDown).toHaveBeenCalled()

      expect(inputs[1]).toHaveFocus()
    })
  })

  describe("BUG 15: must set aria-multiselectable when multiple is true", () => {
    it("has aria-multiselectable=true on the group when multiple is set", () => {
      render(
        <ToggleGroup multiple>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup>,
      )

      const group = screen.getByRole("group")
      expect(group).toHaveAttribute("aria-multiselectable", "true")
    })

    it("does not set aria-multiselectable when multiple is false", () => {
      render(
        <ToggleGroup>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup>,
      )

      const group = screen.getByRole("group")
      expect(group).not.toHaveAttribute("aria-multiselectable")
    })
  })

  describe("BUG 16: clicking item must call onChange with updated value", () => {
    it("calls onChange with clicked item value when an unselected item is clicked", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <ToggleGroup
          value={[]}
          onChange={onChange}
        >
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup>,
      )

      const inputs = screen.getAllByRole("checkbox")
      await user.click(inputs[0])

      expect(onChange).toHaveBeenCalledWith(["a"])
    })

    it("calls onChange with removed item when a selected item is clicked again", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <ToggleGroup
          value={["a"]}
          onChange={onChange}
        >
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup>,
      )

      const inputs = screen.getAllByRole("checkbox")
      await user.click(inputs[0])

      expect(onChange).toHaveBeenCalledWith([])
    })
  })
})
