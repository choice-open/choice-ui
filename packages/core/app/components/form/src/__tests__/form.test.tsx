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
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MultiSelectAdapter } from "../adapters/multi-select-adapter"
import { RangeAdapter } from "../adapters/range-adapter"
import { SwitchAdapter } from "../adapters/switch-adapter"
import { CheckboxAdapter } from "../adapters/checkbox-adapter"
import { SegmentedAdapter } from "../adapters/segmented-adapter"
import { SelectAdapter } from "../adapters/select-adapter"
import { InputAdapter } from "../adapters/input-adapter"
import { TextareaAdapter } from "../adapters/textarea-adapter"
import { ChipsInputAdapter } from "../adapters/chips-input-adapter"

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

      expect(trigger).not.toBeNull()
      trigger!.dispatchEvent(new FocusEvent("blur", { bubbles: true }))
      expect(onBlur).toHaveBeenCalled()
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

  /**
   * SwitchAdapter must forward onBlur/onFocus to Switch
   *   - User scenario: Developer creates a form with a Switch field and blur-based
   *     validation. The form's onBlur callback must fire when the Switch loses focus.
   *   - Regression it prevents: Blur validation broken for Switch fields in forms
   *   - Logic change: switch-adapter.tsx passes onBlur/onFocus directly to <Switch>.
   *     If these props are removed from the JSX, blur/focus tracking silently breaks.
   */
  describe("SwitchAdapter must forward onBlur to Switch", () => {
    it("calls onBlur when the Switch loses focus", () => {
      const onBlur = vi.fn()

      render(
        <SwitchAdapter
          label="Toggle"
          value={true}
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const switchEl =
        (document.querySelector('[role="switch"]') as HTMLElement | null) ||
        (document.querySelector("button") as HTMLElement | null)
      expect(switchEl).toBeTruthy()
      fireEvent.blur(switchEl!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * CheckboxAdapter must forward onBlur to Checkbox
   *   - User scenario: Same as SwitchAdapter — blur-based validation on a Checkbox field.
   *   - Regression it prevents: Blur validation broken for Checkbox fields in forms
   *   - Logic change: checkbox-adapter.tsx passes onBlur/onFocus directly to <Checkbox>.
   */
  describe("CheckboxAdapter must forward onBlur to Checkbox", () => {
    it("calls onBlur when the Checkbox loses focus", () => {
      const onBlur = vi.fn()

      render(
        <CheckboxAdapter
          label="Accept"
          value={false}
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const checkboxEl =
        (document.querySelector('[role="checkbox"]') as HTMLElement | null) ||
        (document.querySelector("button") as HTMLElement | null)
      expect(checkboxEl).toBeTruthy()
      fireEvent.blur(checkboxEl!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * SegmentedAdapter must forward onBlur to Segmented
   *   - User scenario: Developer creates a form with a Segmented field and blur-based
   *     validation. The form's onBlur callback must fire when the Segmented loses focus.
   *   - Regression it prevents: Blur validation broken for Segmented fields in forms
   *   - Logic change: segmented-adapter.tsx passes onBlur/onFocus directly to <Segmented>.
   */
  describe("SegmentedAdapter must forward onBlur to Segmented", () => {
    it("calls onBlur when the Segmented loses focus", () => {
      const onBlur = vi.fn()

      render(
        <SegmentedAdapter
          label="Size"
          value="sm"
          onChange={() => {}}
          onBlur={onBlur}
          options={[
            { value: "sm", content: "Small" },
            { value: "lg", content: "Large" },
          ]}
        />,
      )

      const container = document.querySelector('[role="radiogroup"]') as HTMLElement | null
      expect(container).toBeTruthy()
      fireEvent.blur(container!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * SelectAdapter must forward onBlur to Select.Trigger
   *   - User scenario: Developer creates a form with a Select field and blur-based
   *     validation. The form's onBlur callback must fire when the Select trigger loses focus.
   *   - Regression it prevents: Blur validation broken for Select fields in forms
   *   - Logic change: select-adapter.tsx passes onBlur to <Select.Trigger onBlur={onBlur}>.
   *     This is a unique pattern — onBlur goes to Trigger, not to Select root.
   */
  describe("SelectAdapter must forward onBlur to Select.Trigger", () => {
    it("calls onBlur when the Select trigger loses focus", async () => {
      const onBlur = vi.fn()

      render(
        <SelectAdapter
          label="Color"
          value=""
          onChange={() => {}}
          onBlur={onBlur}
          options={[
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
          ]}
        />,
      )

      const trigger =
        screen.queryByRole("combobox") ||
        document.querySelector("[data-radix-collection-item]") ||
        document.querySelector("button")

      expect(trigger).not.toBeNull()
      fireEvent.blur(trigger!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * InputAdapter must forward onBlur to Input
   *   - User scenario: Developer creates a form with an Input field and blur-based
   *     validation. The form's onBlur callback must fire when the input loses focus.
   *   - Regression it prevents: Blur validation broken for Input fields in forms
   *   - Logic change: input-adapter.tsx destructures onBlur and passes it to <Input>.
   */
  describe("InputAdapter must forward onBlur to Input", () => {
    it("calls onBlur when the Input loses focus", () => {
      const onBlur = vi.fn()

      render(
        <InputAdapter
          label="Name"
          value=""
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const input = document.querySelector("input") as HTMLElement | null
      expect(input).toBeTruthy()
      fireEvent.blur(input!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * TextareaAdapter must forward onBlur to Textarea
   *   - User scenario: Developer creates a form with a Textarea field and blur-based
   *     validation. The form's onBlur callback must fire when the textarea loses focus.
   *   - Regression it prevents: Blur validation broken for Textarea fields in forms
   *   - Logic change: textarea-adapter.tsx destructures onBlur and passes it to <Textarea>.
   */
  describe("TextareaAdapter must forward onBlur to Textarea", () => {
    it("calls onBlur when the Textarea loses focus", () => {
      const onBlur = vi.fn()

      render(
        <TextareaAdapter
          label="Notes"
          value=""
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const textarea = document.querySelector("textarea") as HTMLElement | null
      expect(textarea).toBeTruthy()
      fireEvent.blur(textarea!)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  /**
   * ChipsInputAdapter must forward onBlur to ChipsInput
   *   - User scenario: Developer creates a form with a ChipsInput field and blur-based
   *     validation. The form's onBlur callback must fire when the ChipsInput loses focus.
   *   - Regression it prevents: Blur validation broken for ChipsInput fields in forms
   *   - Logic change: chips-input-adapter.tsx destructures onBlur and passes it to
   *     <ChipsInput>.
   */
  describe("ChipsInputAdapter must forward onBlur to ChipsInput", () => {
    it("calls onBlur when the ChipsInput loses focus", () => {
      const onBlur = vi.fn()

      render(
        <ChipsInputAdapter
          label="Tags"
          value={[]}
          onChange={() => {}}
          onBlur={onBlur}
        />,
      )

      const input = document.querySelector("input") as HTMLElement | null
      expect(input).toBeTruthy()
      fireEvent.blur(input!)
      expect(onBlur).toHaveBeenCalled()
    })
  })
})
