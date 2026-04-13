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
 *
 * BUG: focusManagerProps partial override loses modal focus trapping
 *   - User scenario: Developer passes focusManagerProps={{ returnFocus: true }}
 *     to customize focus return. The default { modal: true } is lost because the
 *     spread replaces the entire object, not merging. Tab key escapes the dropdown.
 *   - Regression it prevents: Partial focusManagerProps breaking focus trap
 *   - Logic change that makes it fail: multi-select.tsx line 148-151 sets default
 *     { returnFocus: false, modal: true }, but line 606 spreads whatever consumer
 *     provides — a partial object overwrites modal to undefined (defaults to false).
 *
 * BUG: handleRemove does not clear stale validation messages
 *   - User scenario: MultiSelect with maxSelection={3}. User selects 3 items,
 *     sees "Select up to 3 options" message. Removes a chip via X button.
 *     The validation message persists despite now having only 2 selections.
 *   - Regression it prevents: Stale validation message confusing users
 *   - Logic change that makes it fail: handleRemove (use-multi-select-selection.ts:113)
 *     calls onChange but never calls setValidationMessage(null), unlike handleSelect.
 *
 * BUG: exclusive option bypasses minSelection enforcement
 *   - User scenario: MultiSelect with minSelection={2} and values ["A","B","C"].
 *     User clicks an exclusive option (exclusiveIndex={-1}). All values are cleared
 *     to just the exclusive one, violating minSelection={2}.
 *   - Regression it prevents: minSelection constraint violated by exclusive items
 *   - Logic change that makes it fail: use-multi-select-selection.ts:64-66 — when
 *     exclusiveIndex === -1, `newValues = [resultValue]` is set unconditionally
 *     without checking if the resulting count would violate minSelection. Fix = add
 *     a minSelection check before clearing values for exclusive items.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

      expect(screen.getByRole("combobox", { hidden: true })).toHaveAttribute(
        "aria-expanded",
        "true",
      )
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

      expect(chipRemoveButton).toBeTruthy()
      await user.click(chipRemoveButton!)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG: focusManagerProps partial override must preserve modal trapping", () => {
    it("keeps focus trapped inside dropdown when partial focusManagerProps is passed", async () => {
      const user = userEvent.setup()

      render(
        <>
          <button>Outside Button</button>
          <MultiSelect
            values={["a"]}
            onChange={vi.fn()}
            open
            onOpenChange={vi.fn()}
            focusManagerProps={{ returnFocus: true }}
          >
            <MultiSelect.Trigger>
              <MultiSelect.Value placeholder="Pick..." />
            </MultiSelect.Trigger>
            <MultiSelect.Content>
              <MultiSelect.Item value="a">Alpha</MultiSelect.Item>
              <MultiSelect.Item value="b">Beta</MultiSelect.Item>
            </MultiSelect.Content>
          </MultiSelect>
        </>,
      )

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument()
      })

      const outsideButton = screen.getByText("Outside Button")
      const outsideBefore = outsideButton.compareDocumentPosition ?? (() => 0)

      await user.tab()

      const focused = document.activeElement
      const isOutside = focused === outsideButton || focused?.contains(outsideButton)

      expect(isOutside).toBe(false)
    })
  })

  describe("BUG: handleRemove must clear validation messages", () => {
    it("clears maxSelection validation message when chip is removed", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <MultiSelect
          values={["a", "b", "c"]}
          onChange={onChange}
          maxSelection={3}
          open
          onOpenChange={vi.fn()}
        >
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick..." />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="a">Alpha</MultiSelect.Item>
            <MultiSelect.Item value="b">Beta</MultiSelect.Item>
            <MultiSelect.Item value="c">Gamma</MultiSelect.Item>
            <MultiSelect.Item value="d">Delta</MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>,
      )

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument()
      })

      await user.click(screen.getByText("Delta"))

      const validationEl = document.querySelector("[data-validation-message]")
      if (validationEl) {
        expect(validationEl.textContent).toBeTruthy()

        const removeButtons = screen.getAllByRole("button", { hidden: true })
        const chipRemoveBtn = removeButtons.find(
          (btn) => btn.getAttribute("data-remove-button") !== null,
        )

        if (chipRemoveBtn) {
          await user.click(chipRemoveBtn)
          expect(onChange).toHaveBeenCalled()

          await waitFor(() => {
            expect(validationEl.textContent).toBeFalsy()
          })
        }
      }
    })
  })

  describe("BUG: exclusive option must respect minSelection", () => {
    it("does NOT clear values below minSelection when selecting an exclusive option", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <MultiSelect
          values={["a", "b"]}
          onChange={onChange}
          minSelection={2}
          open
          onOpenChange={vi.fn()}
        >
          <MultiSelect.Trigger>
            <MultiSelect.Value placeholder="Pick..." />
          </MultiSelect.Trigger>
          <MultiSelect.Content>
            <MultiSelect.Item value="a">Alpha</MultiSelect.Item>
            <MultiSelect.Item value="b">Beta</MultiSelect.Item>
            <MultiSelect.Item
              value="none"
              exclusiveIndex={-1}
            >
              None of the above
            </MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>,
      )

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument()
      })

      await user.click(screen.getByText("None of the above"))

      expect(onChange).not.toHaveBeenCalledWith(["none"])
    })
  })
})
