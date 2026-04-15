/**
 * Radio bug-focused tests
 *
 * BUG 1: Space/Enter on checked radio calls onChange(false), unchecking it
 *   - User scenario: Radio group with one selected. User tabs to the selected radio
 *     and presses Space. The radio unchecks, leaving no selection. Native HTML radios
 *     cannot be unchecked -- this violates fundamental radio semantics.
 *   - Regression it prevents: Radio groups losing all selection via keyboard
 *   - Logic change: Line 56 `onChange(!value)` toggles. When value=true, sends false.
 *     Fix = `if (!value) onChange(true)` -- only allow checking, never unchecking.
 *
 * BUG 2: RadioLabel uses descriptionId as label element id, causing aria-describedby
 *   to point to the label itself. Screen readers announce the label text twice.
 *   - User scenario: Screen reader encounters a radio with label "Option A". The label
 *     text is announced once via native <label htmlFor> and again via aria-describedby
 *     pointing to that same label element.
 *   - Regression it prevents: Confusing double-announcement for screen reader users
 *   - Logic change: radio-label.tsx line 22 sets `id={descriptionId}` on the label.
 *     radio.tsx line 101 sets `aria-describedby={ariaDescribedby || descriptionId}`.
 *     When no custom ariaDescribedby is provided, aria-describedby points to the label.
 *     Fix = only set aria-describedby when an explicit description or custom value exists.
 *
 * BUG 3: Clicking an unchecked radio must call onChange(true)
 *   - User scenario: User clicks an unchecked radio button. The radio should become
 *     selected and onChange should fire with true.
 *   - Regression it prevents: Radio not selectable via click
 *   - Logic change: If the input onChange handler stops firing or the checked guard
 *     incorrectly prevents selection.
 *
 * BUG 4: readOnly sets disabled on the native input, making it unfocusable
 *   - User scenario: Form with readOnly radio. User tabs through form fields but
 *     the readOnly radio is skipped because disabled=true on the native input.
 *   - Regression it prevents: readOnly radio becomes unreachable via keyboard navigation
 *   - Logic change: radio.tsx:96 — `disabled={disabled || readOnly}` on the <input>.
 *     This matches Switch's bug (switch.tsx:96). Fix = remove readOnly from disabled,
 *     use aria-disabled={disabled || readOnly} only (already present on line 101).
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Radio } from "../radio"

describe("Radio bugs", () => {
  describe("BUG 1: Space on checked radio must NOT uncheck it", () => {
    it("does not call onChange when Space is pressed on an already-checked radio", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Radio
          value={true}
          onChange={onChange}
        >
          Selected
        </Radio>,
      )

      screen.getByRole("radio", { name: "Selected" }).focus()
      await user.keyboard(" ")

      expect(onChange).not.toHaveBeenCalled()
    })

    it("does not call onChange(false) when Enter is pressed on a checked radio", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Radio
          value={true}
          onChange={onChange}
        >
          Selected
        </Radio>,
      )

      screen.getByRole("radio", { name: "Selected" }).focus()
      await user.keyboard("{Enter}")

      expect(onChange).not.toHaveBeenCalledWith(false)
    })
  })

  describe("BUG 2: aria-describedby must not point to the label element itself", () => {
    it("does not set aria-describedby to descriptionId when no custom description is provided", () => {
      render(
        <Radio
          value={false}
          onChange={vi.fn()}
        >
          Option A
        </Radio>,
      )

      const input = screen.getByRole("radio", { name: "Option A" })
      const describedBy = input.getAttribute("aria-describedby")

      if (describedBy) {
        const describedByElement = document.getElementById(describedBy)
        const tagName = describedByElement?.tagName.toLowerCase()
        expect(tagName).not.toBe("label")
      }
    })
  })

  describe("BUG 3: clicking unchecked radio must call onChange(true)", () => {
    it("calls onChange(true) when user clicks an unchecked radio", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Radio
          value={false}
          onChange={onChange}
        >
          Option A
        </Radio>,
      )

      const radio = screen.getByRole("radio", { name: "Option A" })
      await user.click(radio)

      expect(onChange).toHaveBeenCalledWith(true)
    })
  })

  describe("BUG 4: readOnly must not set disabled on the native input", () => {
    it("readOnly radio remains focusable (not disabled)", () => {
      render(
        <Radio
          value={true}
          onChange={vi.fn()}
          readOnly
        >
          Read Only
        </Radio>,
      )

      const input = screen.getByRole("radio", { name: "Read Only" }) as HTMLInputElement
      expect(input.disabled).toBe(false)
      expect(input).toHaveAttribute("aria-disabled", "true")
    })
  })
})
