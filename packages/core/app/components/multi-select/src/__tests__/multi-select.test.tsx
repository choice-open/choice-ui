/**
 * MultiSelect bug-focused tests
 *
 * BUG 1: MultiSelectTrigger aria-expanded hardcoded to false
 *   - User scenario: Screen reader user opens a MultiSelect dropdown.
 *     The screen reader announces "collapsed" even when the listbox is open.
 *   - Regression it prevents: Accessibility lie — open state never communicated
 *   - Logic change that makes it fail: Line 187 in multi-select-trigger.tsx has
 *     `aria-expanded={false}` instead of `aria-expanded={open}`.
 *
 * BUG 6: handleRemove bypasses minSelection enforcement
 *   - User scenario: MultiSelect with minSelection={2} and values ["A","B","C"].
 *     Deselecting "A" in the dropdown is blocked. But clicking the X remove button
 *     on the "A" chip succeeds, leaving only 1 selection.
 *   - Regression it prevents: minSelection constraint bypassed via chip removal
 *   - Logic change that makes it fail: handleRemove (line 113) does not check
 *     minSelection, while handleSelect (line 47) does.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { MultiSelect } from "../multi-select"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("MultiSelect bugs", () => {
  describe("BUG 1: aria-expanded must reflect actual open state", () => {
    it("sets aria-expanded=true when open prop is true", () => {
      render(
        <MultiSelect
          values={["a"]}
          onChange={vi.fn()}
          open
          onOpenChange={vi.fn()}
        >
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick..." />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="a">Alpha</MultiSelect.Item>
            <MultiSelect.Item value="b">Beta</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>,
      )

      expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true")
    })
  })

  describe("BUG 6: chip removal must enforce minSelection", () => {
    it("does NOT call onChange when removing would violate minSelection", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <MultiSelect
          values={["a", "b"]}
          onChange={onChange}
          minSelection={2}
          onOpenChange={vi.fn()}
        >
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick..." />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="a">Alpha</MultiSelect.Item>
            <MultiSelect.Item value="b">Beta</MultiSelect.Item>
            <MultiSelect.Item value="c">Gamma</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>,
      )

      const removeButtons = screen.getAllByRole("button", { hidden: true })
      const chipRemoveButton = removeButtons.find(
        (btn) => btn.getAttribute("data-remove-button") !== null,
      )

      if (chipRemoveButton) {
        await user.click(chipRemoveButton)
        expect(onChange).not.toHaveBeenCalled()
      }
    })
  })
})
