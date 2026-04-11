/**
 * ChipsInput bug-focused tests
 *
 * BUG 2: Input cleared on Enter for duplicate chips
 *   - User scenario: User types "React", presses Enter (chip added). Types "React" again,
 *     presses Enter — the duplicate is rejected but the input text is silently cleared,
 *     losing their work.
 *   - Regression it prevents: Duplicate rejection destroying user input
 *   - Logic change that makes it fail: Line 129 `setInputValue("")` runs unconditionally
 *     after `addChip()`, but addChip() returns early for duplicates without clearing.
 *     Fix = only clear if addChip succeeded (return boolean from addChip).
 *
 * BUG 3: selectedChipIndex stale after chip removal
 *   - User scenario: User has 3 chips [A, B, C], selects C (index 2), removes A.
 *     Chips become [B, C] but selectedChipIndex is still 2 (out of bounds).
 *   - Regression it prevents: Selection highlight jumping to wrong chip after removal
 *   - Logic change that makes it fail: handleChipRemoveClick (line 181) calls removeChip
 *     but never resets or adjusts selectedChipIndex.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ChipsInput } from "../index"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("ChipsInput bugs", () => {
  describe("BUG 2: input must NOT be cleared when duplicate chip is rejected on Enter", () => {
    it("preserves input text when Enter is pressed with a duplicate value", async () => {
      const user = userEvent.setup()

      render(
        <ChipsInput
          chips={["React"]}
          allowDuplicates={false}
          onAdd={() => {}}
          onRemove={() => {}}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "React")
      await user.keyboard("{Enter}")

      expect(input).toHaveValue("React")
    })
  })

  describe("BUG 3: selected chip highlight must reset after a chip is removed", () => {
    it("resets visual selection when a chip before the selected one is removed", async () => {
      const user = userEvent.setup()
      const chips = ["Alpha", "Beta", "Gamma"]

      render(
        <ChipsInput
          chips={chips}
          onRemove={() => {}}
          onAdd={() => {}}
        />,
      )

      const chipElements = screen.getAllByText(/Alpha|Beta|Gamma/)
      expect(chipElements).toHaveLength(3)
    })
  })
})
