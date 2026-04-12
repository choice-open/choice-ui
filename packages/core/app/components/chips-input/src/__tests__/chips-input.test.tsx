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
 *
 * BUG: Backspace on empty input deletes last chip without visual confirmation
 *   - User scenario: User has chips [A, B], input is empty, presses Backspace.
 *     The last chip (B) is immediately deleted without any selection step.
 *     Expected: first press selects B (highlight), second press deletes.
 *   - Regression it prevents: Accidental chip deletion without user intent confirmation
 *   - Logic change: handleKeyDown line 130-133 — when selectedChipIndex is null and
 *     input is empty, Backspace immediately calls removeChip instead of selecting first.
 */
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
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
      const onAdd = vi.fn()

      render(
        <ChipsInput
          value={["React"]}
          onAdd={onAdd}
          onRemove={vi.fn()}
          onChange={vi.fn()}
          allowDuplicates={false}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "React")
      await user.keyboard("{Enter}")

      expect(onAdd).not.toHaveBeenCalled()
      expect(input).toHaveValue("React")
    })
  })

  describe("BUG 3: selected chip highlight must reset after chip removal", () => {
    it("does not leave a stale selection highlight after removing a chip via button", async () => {
      const user = userEvent.setup()
      const onRemove = vi.fn()

      render(
        <ChipsInput
          value={["Alpha", "Beta", "Gamma"]}
          onAdd={vi.fn()}
          onRemove={onRemove}
          onChange={vi.fn()}
        />,
      )

      const removeButtons = screen.getAllByRole("button")
      const firstRemove = removeButtons[0]

      await user.click(firstRemove)

      expect(onRemove).toHaveBeenCalledWith("Alpha")

      const chipTexts = screen.getAllByText(/Alpha|Beta|Gamma/)
      for (const chip of chipTexts) {
        const chipWrapper = chip.closest("[data-chip]")
        if (chipWrapper) {
          expect(chipWrapper).not.toHaveAttribute("aria-selected", "true")
        }
      }
    })
  })

  describe("BUG 4: external onKeyDown with preventDefault must block chip behavior", () => {
    it("does NOT add chip when Enter is pressed after external onKeyDown calls preventDefault", async () => {
      const onAdd = vi.fn()
      const user = userEvent.setup()

      render(
        <ChipsInput
          value={[]}
          onAdd={onAdd}
          onRemove={vi.fn()}
          onChange={vi.fn()}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault()
          }}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.type(input, "Hello")
      await user.keyboard("{Enter}")

      expect(onAdd).not.toHaveBeenCalled()
    })
  })

  describe("BUG: Backspace on empty input deletes last chip immediately", () => {
    it("first Backspace press should select the last chip, not delete it", async () => {
      const onRemove = vi.fn()
      const user = userEvent.setup()

      render(
        <ChipsInput
          value={["Alpha", "Beta"]}
          onAdd={vi.fn()}
          onRemove={onRemove}
          onChange={vi.fn()}
        />,
      )

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.keyboard("{Backspace}")

      expect(onRemove).not.toHaveBeenCalled()
    })
  })
})
