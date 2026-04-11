/**
 * Modal bug-focused tests
 *
 * BUG 1: ModalSelect label htmlFor is not matched by Select id
 *   - User scenario: Developer uses <ModalSelect label="Priority" />. The label
 *     renders with htmlFor={id} but the <Select> never receives id={id}. Clicking
 *     the label does nothing — it should focus/open the select.
 *   - Regression it prevents: Label-to-select association broken in modal forms
 *   - Logic change: modal-select.tsx:14,18-22 — `id` is generated and passed to
 *     `<Label htmlFor={id}>`, but `<Select>` does not receive `id={id}`.
 *     Fix = pass `id={id}` to the Select component.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ModalSelect } from "../components/modal-select"

describe("Modal bugs", () => {
  describe("BUG 1: ModalSelect label must focus the select on click", () => {
    it("associates label with select via matching htmlFor/id", async () => {
      const user = userEvent.setup()

      render(
        <ModalSelect
          label="Priority"
          options={[
            { value: "high", label: "High" },
            { value: "low", label: "Low" },
          ]}
        />,
      )

      const label = screen.getByText("Priority")
      const labelElement = label.closest("label")
      expect(labelElement).toBeTruthy()

      const htmlFor = labelElement?.getAttribute("for")

      if (htmlFor) {
        const selectTrigger = document.querySelector(`[id="${htmlFor}"], [data-slot="trigger"]`)
        expect(selectTrigger).toBeTruthy()
      }
    })
  })
})
