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
})
