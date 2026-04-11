/**
 * Conditions bug-focused tests
 *
 * BUG 1: MultiSelectInput renders a single-select <select> element
 *   - User scenario: Developer creates a condition with fieldType=MultiSelect.
 *     The user expects to select multiple values, but the rendered <select> element
 *     has no `multiple` attribute. Only one value can be selected.
 *   - Regression it prevents: MultiSelect fields being limited to single selection
 *   - Logic change: multi-select-input.tsx:22-37 — the <select> element is missing
 *     the `multiple` attribute. Fix = add `multiple` and handle array values.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ConditionsFieldType } from "../types"
import { MultiSelectInput } from "../components/condition-items/multi-select-input"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

describe("Conditions bugs", () => {
  describe("BUG 1: MultiSelectInput must render a multi-select element", () => {
    it("renders a <select> element with the multiple attribute", () => {
      render(
        <MultiSelectInput
          condition={{ field: "tags", operator: "in", value: "" }}
          field={{
            type: ConditionsFieldType.MultiSelect,
            name: "tags",
            label: "Tags",
            operators: [],
            options: [
              { value: "a", label: "A" },
              { value: "b", label: "B" },
            ],
          }}
          disabled={false}
          onChange={() => {}}
        />,
      )

      const select =
        screen.getByRole("combobox") ||
        screen.getByRole("listbox") ||
        document.querySelector("select")
      expect(select).toBeTruthy()

      if (select instanceof HTMLSelectElement) {
        expect(select.multiple).toBe(true)
      }
    })
  })
})
