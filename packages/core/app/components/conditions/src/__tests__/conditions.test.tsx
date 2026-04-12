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
 *
 * BUG 2: Conditions ignores value prop changes after mount
 *   - User scenario: Developer passes a `value` prop to Conditions and later changes
 *     it (e.g., loading saved filter state from server). The component ignores the
 *     updated value prop and continues showing the old or initial conditions.
 *   - Regression it prevents: External state synchronization broken — server-loaded
 *     conditions, preset loading, and controlled mode all fail to update the UI.
 *   - Logic change: conditions.tsx:24-43 — `useState(value || ...)` only uses `value`
 *     on first render. There is no useEffect or sync mechanism to update internal
 *     `conditions` state when `value` prop changes after mount. Fix = add a useEffect
 *     that syncs `conditions` when `value` changes, or use `value` directly as the
 *     source of truth when provided.
 *
 * BUG 3: Conditions fires onChange on mount with initial value
 *   - User scenario: Developer renders Conditions with an initial `value` prop and
 *     an `onChange` callback. On mount, onChange fires immediately with the initial
 *     value, causing an unnecessary network request or state update cycle.
 *   - Regression it prevents: Spurious onChange calls on mount causing side effects
 *     like duplicate API requests, infinite re-render loops, or dirty form state.
 *   - Logic change: conditions.tsx:92-94 — `useEffect(() => { onChange?.(conditions) },
 *     [conditions, onChange])` fires on first render, calling onChange with the initial
 *     state. Fix = use a ref to skip the first invocation, or use useLayoutEffect with
 *     a mount guard.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Conditions } from "../conditions"
import { ConditionsFieldType } from "../types"
import { MultiSelectInput } from "../components/condition-items/multi-select-input"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

const sampleFields = [
  {
    type: ConditionsFieldType.Text,
    name: "name",
    label: "Name",
    operators: [],
  },
]

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

  describe("BUG 2: Conditions must sync internal state when value prop changes", () => {
    it("updates displayed conditions when value prop changes after mount", () => {
      const initialValue = {
        id: "root",
        groups: [
          {
            id: "group_1",
            logicalOperator: "and" as const,
            name: "Group 1",
            conditions: [
              {
                id: "cond_1",
                fieldKey: "name",
                operator: "equals" as const,
                value: "Alice",
              },
            ],
          },
        ],
      }

      const updatedValue = {
        id: "root",
        groups: [
          {
            id: "group_2",
            logicalOperator: "and" as const,
            name: "Group 1",
            conditions: [
              {
                id: "cond_2",
                fieldKey: "name",
                operator: "equals" as const,
                value: "Bob",
              },
            ],
          },
        ],
      }

      const { rerender } = render(
        <Conditions
          value={initialValue}
          fields={sampleFields}
          onChange={vi.fn()}
        />,
      )

      expect(screen.getByText("Alice")).toBeInTheDocument()

      rerender(
        <Conditions
          value={updatedValue}
          fields={sampleFields}
          onChange={vi.fn()}
        />,
      )

      expect(screen.getByText("Bob")).toBeInTheDocument()
    })
  })

  describe("BUG 3: Conditions must not fire onChange on mount", () => {
    it("does NOT call onChange when component first mounts with value", () => {
      const onChange = vi.fn()

      const initialValue = {
        id: "root",
        groups: [
          {
            id: "group_1",
            logicalOperator: "and" as const,
            name: "Group 1",
            conditions: [
              {
                id: "cond_1",
                fieldKey: "name",
                operator: "equals" as const,
                value: "Alice",
              },
            ],
          },
        ],
      }

      render(
        <Conditions
          value={initialValue}
          fields={sampleFields}
          onChange={onChange}
        />,
      )

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
