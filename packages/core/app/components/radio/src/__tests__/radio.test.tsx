/**
 * Radio bug-focused tests
 *
 * BUG 1: Space/Enter on checked radio calls onChange(false), unchecking it
 *   - User scenario: Radio group with one selected. User tabs to the selected radio
 *     and presses Space. The radio unchecks, leaving no selection. Native HTML radios
 *     cannot be unchecked — this violates fundamental radio semantics.
 *   - Regression it prevents: Radio groups losing all selection via keyboard
 *   - Logic change: Line 56 `onChange(!value)` toggles. When value=true, sends false.
 *     Fix = `if (!value) onChange(true)` — only allow checking, never unchecking.
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
})
