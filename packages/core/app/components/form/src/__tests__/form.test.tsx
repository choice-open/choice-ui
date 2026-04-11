/**
 * Form adapter bug-focused tests
 *
 * BUG 1: MultiSelect adapter silently drops onBlur
 *   - User scenario: Developer uses form with mode="onBlur" and a MultiSelect field.
 *     Blur-based validation never fires because the adapter destructures onBlur
 *     but never passes it to any child element.
 *   - Regression it prevents: Blur validation broken for multi-select form fields
 *   - Logic change: multi-select-adapter.tsx:16 — `onBlur` destructured but never
 *     passed to <MultiSelect.Trigger> or any other element. Fix = pass onBlur to
 *     the trigger element, like SelectAdapter does.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MultiSelectAdapter } from "../adapters/multi-select-adapter"

describe("Form adapter bugs", () => {
  describe("BUG 1: MultiSelect adapter must forward onBlur to a child element", () => {
    it("calls onBlur when the multi-select trigger loses focus", async () => {
      const onBlur = vi.fn()

      render(
        <MultiSelectAdapter
          name="colors"
          label="Colors"
          value={[]}
          onChange={() => {}}
          onBlur={onBlur}
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
          ]}
        />,
      )

      const trigger =
        document.querySelector('[data-slot="trigger"]') || screen.queryByRole("button")

      if (trigger) {
        trigger.dispatchEvent(new FocusEvent("blur", { bubbles: true }))
        expect(onBlur).toHaveBeenCalled()
      } else {
        expect(trigger).toBeTruthy()
      }
    })
  })
})
