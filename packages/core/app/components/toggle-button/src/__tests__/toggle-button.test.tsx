/**
 * Toggle Button bug-focused tests
 *
 * BUG 2: {...rest} overrides checked, type, tabIndex
 *   - User scenario: Consumer passes <ToggleButton value={false} checked={true} />
 *     thinking "checked" is the API. The spread puts checked=true after the explicit
 *     checked={value}, overriding it. Now native checkbox is checked but aria-checked
 *     is false — visual/semantic contradiction.
 *   - Regression it prevents: Conflicting HTML attributes breaking state
 *   - Logic change: Line 84 {...rest} is spread after checked={value} (line 73).
 *     Fix = omit `checked`, `type`, `defaultChecked` from rest, or move spread before.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
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

      const input = screen.getByRole("checkbox")
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

      const input = screen.getByRole("checkbox")
      expect(input).toHaveAttribute("aria-checked", "true")
      expect(input.checked).toBe(true)
    })
  })
})
