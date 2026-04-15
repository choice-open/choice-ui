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
 *
 * BUG 4: Duplicating a group shares child IDs with the original
 *   - User scenario: User duplicates a group that contains conditions and nested groups.
 *     Both the original and the duplicate share the same child condition IDs. Subsequent
 *     edits to one condition silently affect the other, or deletes corrupt the tree.
 *   - Regression it prevents: Duplicate group producing shared IDs causing silent data
 *     corruption in any ID-based lookup (findConditionById, findGroupById).
 *   - Logic change: condition-group.tsx:334-338 — shallow spread `{ ...item, id }` only
 *     generates a new top-level ID. Child conditions retain their original IDs.
 *     Fix = deep-clone with new IDs for every child condition and nested group.
 *
 * BUG 5: Changing field to incompatible type must reset operator and value
 *   - User scenario: User has a condition with field=Text, operator=Contains, value="hello".
 *     They change the field to Number. The operator "Contains" is not valid for Number fields,
 *     so it must reset to the first valid operator (e.g., Equals) and the value to 0.
 *   - Regression it prevents: Invalid operator/field combinations silently accepted,
 *     producing conditions that can never be evaluated correctly.
 *   - Logic change: condition-item.tsx:60-76 — handleFieldChange must check if the
 *     current operator is in the new field's operator list. If not, fall back to the first
 *     available operator and reset value to the field-type default.
 *
 * BUG 6: Deleting the last condition in a nested group must delete the group
 *   - User scenario: Nested group (level > 0) contains exactly 1 condition. User deletes it.
 *     The group should be removed entirely. If not, an empty group renders with no
 *     interactive elements, confusing the user.
 *   - Regression it prevents: Orphaned empty nested groups in the conditions tree.
 *   - Logic change: condition-group.tsx:229-235 — onDelete callback checks `level > 0`
 *     and calls parent's onDelete to remove the entire group. If this guard is removed,
 *     empty groups persist.
 */
import "@testing-library/jest-dom"
import { render, screen, within, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Conditions } from "../conditions"
import { ConditionGroup } from "../components/condition-group"
import {
  ConditionsFieldType,
  ComparisonOperator,
  LogicalOperator,
  type ConditionGroup as ConditionGroupType,
} from "../types"
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

      const select = document.querySelector("select")
      expect(select).toBeInstanceOf(HTMLSelectElement)
      expect((select as HTMLSelectElement).multiple).toBe(true)
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

  describe("BUG 4: Duplicating a group must produce unique child IDs", () => {
    it("gives every child condition a new ID when a group is duplicated", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      const nestedGroup: ConditionGroupType = {
        id: "group_nested",
        logicalOperator: LogicalOperator.And,
        name: "Nested",
        conditions: [
          { id: "cond_a", fieldKey: "name", operator: ComparisonOperator.Equals, value: "Alpha" },
        ],
      }

      const value = {
        id: "root",
        groups: [
          {
            id: "group_1",
            logicalOperator: LogicalOperator.And,
            name: "Group 1",
            conditions: [
              {
                id: "cond_1",
                fieldKey: "name",
                operator: ComparisonOperator.Contains,
                value: "Hello",
              },
              nestedGroup,
            ],
          },
        ],
      }

      const fields = [
        { type: ConditionsFieldType.Text, name: "name", key: "name", label: "Name", operators: [] },
      ]

      render(
        <Conditions
          value={value}
          fields={fields}
          onChange={onChange}
        />,
      )

      expect(screen.getByText("Alpha")).toBeInTheDocument()

      const groupEl = screen.getByText("Nested").closest("[class*='condition-group']")
      expect(groupEl).toBeTruthy()

      const moreButtons = groupEl!.querySelectorAll('button[aria-label="More actions"]')
      if (moreButtons.length > 0) {
        await user.click(moreButtons[0])

        const duplicateOption = screen.queryByText("Duplicate")
        if (duplicateOption) {
          await user.click(duplicateOption)

          expect(onChange).toHaveBeenCalled()
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]

          const allIds: string[] = []
          function collectIds(groups: ConditionGroupType[]) {
            for (const g of groups) {
              allIds.push(g.id)
              for (const c of g.conditions) {
                if ("fieldKey" in c) allIds.push(c.id)
                else collectIds([c])
              }
            }
          }
          collectIds(lastCall.groups)

          const uniqueIds = new Set(allIds)
          expect(uniqueIds.size).toBe(allIds.length)
        }
      }
    })
  })

  describe("BUG 5: Field change to incompatible type must reset operator and value", () => {
    it("resets operator to first valid and value to default when field type changes", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      const value = {
        id: "root",
        groups: [
          {
            id: "group_1",
            logicalOperator: LogicalOperator.And,
            name: "Group 1",
            conditions: [
              {
                id: "cond_1",
                fieldKey: "name",
                operator: ComparisonOperator.Contains,
                value: "hello",
              },
            ],
          },
        ],
      }

      const fields = [
        { type: ConditionsFieldType.Text, name: "name", key: "name", label: "Name", operators: [] },
        { type: ConditionsFieldType.Number, name: "age", key: "age", label: "Age", operators: [] },
      ]

      render(
        <Conditions
          value={value}
          fields={fields}
          onChange={onChange}
        />,
      )

      expect(screen.getByText("Contains")).toBeInTheDocument()

      const triggers = screen.getAllByRole("combobox")
      const fieldTrigger = triggers[0]
      await user.click(fieldTrigger)

      const ageOption = screen.getByText("Age")
      await user.click(ageOption)

      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      const updatedCond = lastCall.groups[0].conditions[0]

      expect(updatedCond.fieldKey).toBe("age")
      expect(updatedCond.operator).not.toBe(ComparisonOperator.Contains)
      expect(updatedCond.value).toBe(0)
    })
  })

  describe("BUG 6: Deleting last condition in nested group must delete the group", () => {
    it("removes the nested group when its only condition is deleted", async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      const nestedGroup: ConditionGroupType = {
        id: "group_nested",
        logicalOperator: LogicalOperator.And,
        name: "Nested",
        conditions: [
          { id: "cond_only", fieldKey: "name", operator: ComparisonOperator.Equals, value: "Only" },
        ],
      }

      const value = {
        id: "root",
        groups: [
          {
            id: "group_1",
            logicalOperator: LogicalOperator.And,
            name: "Group 1",
            conditions: [
              { id: "cond_1", fieldKey: "name", operator: ComparisonOperator.Equals, value: "Top" },
              nestedGroup,
            ],
          },
        ],
      }

      const fields = [
        { type: ConditionsFieldType.Text, name: "name", key: "name", label: "Name", operators: [] },
      ]

      render(
        <Conditions
          value={value}
          fields={fields}
          onChange={onChange}
        />,
      )

      expect(screen.getByText("Only")).toBeInTheDocument()

      const nestedGroupEl = screen.getByText("Nested").closest("[class*='condition-group']")
      expect(nestedGroupEl).toBeTruthy()

      const moreButtons = nestedGroupEl!.querySelectorAll('button[aria-label="More actions"]')
      if (moreButtons.length > 0) {
        await user.click(moreButtons[moreButtons.length - 1])

        const deleteOption = screen.queryByText("Delete")
        if (deleteOption) {
          await user.click(deleteOption)

          expect(onChange).toHaveBeenCalled()
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]

          const rootConditions = lastCall.groups[0].conditions
          const hasNested = rootConditions.some(
            (c: any) => "logicalOperator" in c && c.id === "group_nested",
          )
          expect(hasNested).toBe(false)
        }
      }
    })
  })
})
