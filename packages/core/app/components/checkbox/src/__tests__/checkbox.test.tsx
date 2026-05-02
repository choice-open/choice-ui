/**
 * Checkbox bug-focused tests
 *
 * BUG 2.2: handleKeyDown uses !value, handleChange uses e.target.checked — inconsistent
 *   - User scenario: In a controlled component where state update is async (e.g. batched),
 *     Space key and mouse click could send different values to onChange
 *   - Regression it prevents: Two interaction methods producing different results
 *   - Logic change that makes it fail: handleKeyDown (line 58) computes `!value` from the
 *     prop, while handleChange (line 51) reads `e.target.checked` from the DOM.
 *     Fix = both should use the same strategy.
 *
 * BUG 2.1: handleKeyDown does not check disabled
 *   - User scenario: Programmatic focus on a disabled checkbox + Space key
 *   - Regression it prevents: onChange fires on disabled checkbox via keyboard
 *   - Logic change that makes it fail: handleKeyDown (line 54) only checks readOnly,
 *     not disabled. Fix = add `if (disabled) return`.
 *
 * BUG 2.3: aria-checked is missing when value is undefined
 *   - User scenario: Developer renders <Checkbox onChange={fn}>Label</Checkbox> without
 *     value prop. The checkbox renders with role="checkbox" but no aria-checked attribute,
 *     violating WAI-ARIA which requires aria-checked for role=checkbox.
 *   - Regression it prevents: Screen readers cannot determine checkbox state
 *   - Logic change that makes it fail: Line 113 `aria-checked={mixed ? "mixed" : value}`
 *     evaluates to undefined when value is undefined, causing the attribute to be omitted.
 *     Fix = `aria-checked={mixed ? "mixed" : !!value}` or `Boolean(value)`.
 *
 * BUG 4 (High): Enter key incorrectly toggles checkbox (should only be Space)
 *   - User scenario: User presses Enter on a focused checkbox. Per WAI-ARIA checkbox
 *     pattern, only Space should toggle. Enter instead activates the form element
 *     (e.g., submits a form). The checkbox toggles unexpectedly.
 *   - Regression it prevents: Form submission or unintended toggling when user
 *     presses Enter to navigate or submit.
 *   - Logic change that makes it fail: Line 56 checks `e.key === " " || e.key === "Enter"`.
 *     Fix = remove Enter from the condition, only allow Space.
 *
 * BUG 5 (Medium): CheckboxIcon data-active ignores mixed state
 *   - User scenario: Developer renders a mixed/indeterminate checkbox and reads
 *     data-active attribute for styling. The attribute is false even though the
 *     checkbox visually appears active/indeterminate.
 *   - Regression it prevents: CSS selectors relying on data-active fail for
 *     indeterminate checkboxes, causing styling inconsistencies.
 *   - Logic change that makes it fail: checkbox-icon.tsx line 36 sets
 *     `data-active={value}` without considering mixed. Fix = `data-active={value || mixed}`.
 *
 * BUG 6 (Medium): aria-describedby redundantly points to label element
 *   - User scenario: Screen reader announces the label text twice - once as the
 *     accessible name (via label element) and again as the description
 *     (via aria-describedby pointing to the same label element).
 *   - Regression it prevents: Screen reader double-announcement of labels.
 *   - Logic change that makes it fail: checkbox.tsx line 112 sets
 *     aria-describedby to descriptionId, and checkbox-label.tsx line 22
 *     sets the label's id to descriptionId. The label already provides the
 *     accessible name via htmlFor/id association, so aria-describedby is redundant.
 *     Fix = separate the description ID from the label ID.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Checkbox } from "../checkbox"

describe("Checkbox bugs", () => {
  describe("BUG 2.2: Space and click must produce the same onChange value", () => {
    it("click and Space key send the same value for a controlled unchecked checkbox", async () => {
      const clickOnChange = vi.fn()
      const keyOnChange = vi.fn()
      const user = userEvent.setup()

      const { unmount } = render(
        <Checkbox
          value={false}
          onChange={clickOnChange}
        >
          Test
        </Checkbox>,
      )

      await user.click(screen.getByRole("checkbox", { name: "Test" }))
      unmount()

      render(
        <Checkbox
          value={false}
          onChange={keyOnChange}
        >
          Test
        </Checkbox>,
      )
      screen.getByRole("checkbox", { name: "Test" }).focus()
      await user.keyboard(" ")

      expect(clickOnChange.mock.calls[0][0]).toBe(keyOnChange.mock.calls[0][0])
    })
  })

  describe("BUG 2.1: disabled checkbox must not fire onChange from keyboard", () => {
    it("Space key on a focused disabled checkbox does not call onChange", async () => {
      const onChange = vi.fn()

      render(
        <Checkbox
          value={false}
          disabled
          onChange={onChange}
        >
          Disabled
        </Checkbox>,
      )

      const checkbox = screen.getByRole("checkbox", { name: "Disabled" })
      checkbox.focus()

      const user = userEvent.setup()
      await user.keyboard(" ")

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 2.3: aria-checked must always be present on role=checkbox", () => {
    it("has aria-checked attribute even when value prop is not provided", () => {
      render(<Checkbox onChange={vi.fn()}>Unchecked</Checkbox>)

      const checkbox = screen.getByRole("checkbox", { name: "Unchecked" })
      const ariaChecked = checkbox.getAttribute("aria-checked")
      expect(ariaChecked).not.toBeNull()
      expect(ariaChecked).toBe("false")
    })
  })

  describe("BUG 4: Enter key must not toggle checkbox (only Space should)", () => {
    it("does not call onChange when Enter is pressed on a focused checkbox", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Checkbox
          value={false}
          onChange={onChange}
        >
          Test
        </Checkbox>,
      )

      screen.getByRole("checkbox", { name: "Test" }).focus()
      await user.keyboard("{Enter}")

      expect(onChange).not.toHaveBeenCalled()
    })

    it("does call onChange when Space is pressed on a focused checkbox", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Checkbox
          value={false}
          onChange={onChange}
        >
          Test
        </Checkbox>,
      )

      screen.getByRole("checkbox", { name: "Test" }).focus()
      await user.keyboard(" ")

      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe("BUG 5: CheckboxIcon data-active must be true for mixed/indeterminate state", () => {
    it("sets data-active to true when checkbox is in mixed state", () => {
      render(
        <Checkbox
          value={false}
          mixed={true}
          onChange={vi.fn()}
        >
          <Checkbox.Icon />
          Indeterminate
        </Checkbox>,
      )

      const checkbox = screen.getByRole("checkbox", { name: "Indeterminate" })
      const parentDiv = checkbox.closest("div")
      const allDivs = parentDiv?.querySelectorAll("div") ?? []
      const iconContainer = Array.from(allDivs).find((d) => d.hasAttribute("data-active"))
      expect(iconContainer).toBeTruthy()
      expect(iconContainer?.getAttribute("data-active")).not.toBe("false")
    })
  })

  describe("BUG 6: aria-describedby must not point to the same element as the label", () => {
    it("aria-describedby target is different from the label element", () => {
      render(
        <Checkbox
          value={false}
          onChange={vi.fn()}
        >
          My Label
        </Checkbox>,
      )

      const checkbox = screen.getByRole("checkbox", { name: "My Label" })
      const describedby = checkbox.getAttribute("aria-describedby")
      expect(describedby).toBeTruthy()

      const label = document.querySelector(`label[for="${checkbox.id}"]`)
      expect(label).toBeTruthy()
      expect(label?.id).not.toBe(describedby)
    })
  })
})
