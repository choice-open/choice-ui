/**
 * Toggle Button bug-focused tests
 *
 * BUG 2: {...rest} overrides checked, type, tabIndex
 *   - User scenario: Consumer passes <ToggleButton value={false} checked={true} />
 *     thinking "checked" is the API. The spread puts checked=true after the explicit
 *     checked={value}, overriding it. Now native checkbox is checked but aria-checked
 *     is false - visual/semantic contradiction.
 *   - Regression it prevents: Conflicting HTML attributes breaking state
 *   - Logic change: Line 84 {...rest} is spread after checked={value} (line 73).
 *     Fix = omit `checked`, `type`, `defaultChecked` from rest, or move spread before.
 *
 * BUG 11: sr-only text is orphaned, not associated with the input
 *   - User scenario: Screen reader encounters a ToggleButton. The sr-only span on line 65
 *     announces "Enabled"/"Disabled" but is not associated with the input via aria-label,
 *     aria-describedby, or aria-labelledby. Meanwhile aria-checked={value} on line 80
 *     already communicates the checked state. The sr-only span is dead code that duplicates
 *     information and may cause confusing double-announcements.
 *   - Regression it prevents: Redundant/confusing screen reader announcements
 *   - Logic change: toggle-button.tsx:65 - `<span className="sr-only">{value ? "Enabled" :
 *     "Disabled"}</span>` sits inside a role="presentation" div with no ARIA association.
 *     Fix = remove the sr-only span (aria-checked already conveys state), or connect it
 *     via aria-describedby on the input.
 *
 * BUG 3: Clicking the toggle must call onChange with the new value
 *   - User scenario: User clicks the toggle switch. onChange should fire with the
 *     opposite boolean value. If it was true, onChange receives false.
 *   - Regression it prevents: Click not toggling the value
 *   - Logic change: If the input's onChange handler stops firing or stops calling
 *     the external onChange callback.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ToggleButton } from "../toggle-button"

describe("Toggle Button bugs", () => {
  describe("BUG 2: rest props must not override checked state", () => {
    it("checked={value} wins over conflicting checked in rest props", () => {
      render(
        <ToggleButton
          value={false}
          checked={true}
          onChange={vi.fn()}
        >
          Toggle
        </ToggleButton>,
      )

      const input = screen.getByRole("checkbox") as HTMLInputElement
      expect(input).toHaveAttribute("aria-checked", "false")
      expect(input.checked).toBe(false)
    })

    it("checked={value} wins when value is true and rest has checked={false}", () => {
      render(
        <ToggleButton
          value={true}
          checked={false}
          onChange={vi.fn()}
        >
          Toggle
        </ToggleButton>,
      )

      const input = screen.getByRole("checkbox") as HTMLInputElement
      expect(input).toHaveAttribute("aria-checked", "true")
      expect(input.checked).toBe(true)
    })
  })

  describe("BUG 11: sr-only text must be properly associated with the input", () => {
    it("does not render orphaned sr-only text that duplicates aria-checked", () => {
      render(
        <ToggleButton
          value={true}
          onChange={vi.fn()}
        >
          Toggle
        </ToggleButton>,
      )

      const container = screen.getByRole("checkbox").closest("[role=presentation]")
      expect(container).toBeTruthy()

      const srOnly = container!.querySelector(".sr-only")
      expect(srOnly).toBeNull()
    })
  })

  describe("BUG 3: clicking toggle must call onChange with new value", () => {
    it("calls onChange(false) when clicking a toggle that is currently true", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <ToggleButton
          value={true}
          onChange={onChange}
        >
          Toggle
        </ToggleButton>,
      )

      const input = screen.getByRole("checkbox")
      await user.click(input)

      expect(onChange).toHaveBeenCalledWith(false)
    })

    it("calls onChange(true) when clicking a toggle that is currently false", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <ToggleButton
          value={false}
          onChange={onChange}
        >
          Toggle
        </ToggleButton>,
      )

      const input = screen.getByRole("checkbox")
      await user.click(input)

      expect(onChange).toHaveBeenCalledWith(true)
    })
  })
})
