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
 *
 * BUG 2: RangeAdapter destructures onBlur/onFocus but never passes them to <Range>
 *   - User scenario: Developer creates a form with a Range field and blur-based
 *     validation. The form's onBlur callback is never called because RangeAdapter
 *     destructures onBlur and onFocus but does not forward them to the Range component.
 *   - Regression it prevents: Blur/focus validation and touched-state tracking broken
 *     for Range fields in forms
 *   - Logic change: range-adapter.tsx:15-16 — `onBlur` and `onFocus` are destructured
 *     in the function params but never passed to `<Range>`. The `{...filteredProps}`
 *     spread does NOT include onBlur/onFocus because filterFormProps strips them
 *     along with other form-specific props. Fix = explicitly pass onBlur and onFocus
 *     to the <Range> component.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MultiSelectAdapter } from "../adapters/multi-select-adapter"
import { RangeAdapter } from "../adapters/range-adapter"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

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

  describe("BUG 2: RangeAdapter must forward onBlur and onFocus to Range", () => {
    it("calls onBlur when the Range slider loses focus", () => {
      const onBlur = vi.fn()

      render(
        <RangeAdapter
          label="Volume"
          value={50}
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const slider = document.querySelector('[role="slider"]') as HTMLElement | null
      expect(slider).toBeTruthy()

      slider!.dispatchEvent(new FocusEvent("blur", { bubbles: true }))
      expect(onBlur).toHaveBeenCalled()
    })

    it("calls onFocus when the Range slider gains focus", () => {
      const onFocus = vi.fn()

      render(
        <RangeAdapter
          label="Volume"
          value={50}
          onChange={() => {}}
          onFocus={onFocus}
        />,
      )

      const slider = document.querySelector('[role="slider"]') as HTMLElement | null
      expect(slider).toBeTruthy()

      slider!.dispatchEvent(new FocusEvent("focus", { bubbles: true }))
      expect(onFocus).toHaveBeenCalled()
    })
  })
})
