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
 *
 * BUG 3.2: Missing role="switch" — announced as "checkbox" by screen readers
 *   - User scenario: Screen reader user navigates to a Switch. The <input type="checkbox">
 *     has implicit role="checkbox" instead of role="switch". Screen readers announce it
 *     as "checkbox" rather than "switch", which is semantically wrong for an on/off toggle.
 *   - Regression it prevents: Incorrect semantic role for toggle controls
 *   - Logic change that makes it fail: switch.tsx:118 — <input type="checkbox"> renders
 *     without an explicit role="switch". Fix = add role="switch" to the input element.
 *
 * BUG 3.3: sr-only "Enabled"/"Disabled" text overrides accessible name when no label
 *   - User scenario: Developer renders <Switch value={v} onChange={setV} /> without
 *     children or label. The sr-only span reads "Enabled" or "Disabled" as the
 *     accessible name of the switch, which is confusing since screen readers already
 *     announce the checked state. If aria-label is provided, it gets overridden.
 *   - Regression it prevents: Screen readers announce "Enabled" or "Disabled" instead
 *     of the intended aria-label or meaningful name.
 *   - Logic change that makes it fail: switch.tsx line 117 renders
 *     <span className="sr-only">{value ? "Enabled" : "Disabled"}</span> inside the
 *     <label> before the <input>, making it part of the label's text content.
 *     When no children/label is provided, this sr-only text becomes the accessible name.
 *     Fix = use aria-checked for state communication instead of sr-only text.
 *
 * BUG 3.4: readOnly sets disabled attribute, making switch unfocusable
 *   - User scenario: Developer renders <Switch value={true} onChange={fn} readOnly />
 *     to show a non-interactive switch that users can still tab to and read.
 *     Because readOnly causes disabled={true} on the input, the switch is
 *     completely unfocusable and skipped in tab order.
 *   - Regression it prevents: ReadOnly switches cannot receive focus, preventing
 *     screen reader users from reading the switch state via keyboard navigation.
 *   - Logic change that makes it fail: switch.tsx line 124 sets
 *     `disabled={disabled || readOnly}` on the input element. Fix = use
 *     aria-readonly + tabIndex for readOnly mode instead of disabled.
 *
 * BUG 3.5: aria-describedby points to label element, causing double-announce
 *   - User scenario: Screen reader encounters a switch with label "Dark Mode".
 *     The label is announced once via native <label htmlFor> association, and
 *     again via aria-describedby pointing to the same label text in a <span>.
 *   - Regression it prevents: Confusing double-announcement for screen reader users
 *   - Logic change: switch.tsx:96 sets `id={descriptionId}` on the label <span>,
 *     and switch.tsx:135 sets `aria-describedby={descriptionId}` on the input.
 *     The describedby points to the label content itself. Fix = only set
 *     aria-describedby when an explicit description is provided, not for the label.
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

      const input = screen.getByRole("switch")
      expect(input).toHaveAttribute("aria-label", "42")
    })
  })

  describe("BUG 3.2: Switch must have role=switch for screen readers", () => {
    it("renders with role=switch instead of implicit checkbox role", () => {
      render(
        <Switch
          value={false}
          onChange={vi.fn()}
        >
          Dark Mode
        </Switch>,
      )

      const input = screen.getByRole("switch")
      expect(input).toBeTruthy()
    })
  })

  describe("BUG 3.3: sr-only text must not override custom aria-label when no children/label", () => {
    it("uses aria-label as accessible name, not sr-only Enabled/Disabled text", () => {
      render(
        <Switch
          value={true}
          onChange={vi.fn()}
          aria-label="Dark Mode"
        />,
      )

      const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(input).toHaveAttribute("aria-label", "Dark Mode")
      const labelText = input.closest("label")?.textContent?.trim()
      expect(labelText).not.toContain("Enabled")
    })
  })

  describe("BUG 3.4: readOnly must not set disabled on the input element", () => {
    it("readOnly switch remains focusable (not disabled)", () => {
      render(
        <Switch
          value={true}
          onChange={vi.fn()}
          readOnly
        >
          Read Only
        </Switch>,
      )

      const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(input).toBeTruthy()
      expect(input.disabled).toBe(false)
      expect(input).toHaveAttribute("aria-disabled", "true")
    })

    it("readOnly switch does not call onChange on click", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Switch
          value={true}
          onChange={onChange}
          readOnly
        >
          Read Only
        </Switch>,
      )

      const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement
      await user.click(input)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 3.5: aria-describedby must not point to the label itself", () => {
    it("does not set aria-describedby to the label span when only children are provided", () => {
      render(
        <Switch
          value={true}
          onChange={vi.fn()}
        >
          Dark Mode
        </Switch>,
      )

      const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement
      const describedBy = input.getAttribute("aria-describedby")

      if (describedBy) {
        const describedByEl = document.getElementById(describedBy)
        const textContent = describedByEl?.textContent?.trim()
        expect(textContent).not.toBe("Dark Mode")
      }
    })
  })
})
