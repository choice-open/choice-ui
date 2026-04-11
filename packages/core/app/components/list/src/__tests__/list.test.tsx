/**
 * List bug-focused tests
 *
 * BUG 4: ArrowRight unconditionally toggles expand on non-sub-trigger items
 *   - User scenario: Flat list with no sub-triggers. User presses ArrowRight on a
 *     regular item. toggleSubList is called, adding a non-sub-trigger ID to
 *     expandedSubLists state. This pollutes the expand state.
 *   - Regression it prevents: ArrowRight corrupting expand state on flat lists
 *   - Logic change: use-list-keyboard.tsx line 90. No check for whether activeItem
 *     is a sub-trigger. Comment says "Only expand when item is a sub-list trigger"
 *     but the code doesn't implement the check.
 *     Fix = check `item?.isSubTrigger` before calling toggleSubList.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

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

describe("List bugs", () => {
  describe("BUG 4: ArrowRight must not toggle expand on non-sub-trigger items", () => {
    it("does not call onToggleSubList when ArrowRight is pressed on a flat list item", async () => {
      const { List } = await import("../list")
      const onToggleSubList = vi.fn()
      const user = userEvent.setup()

      render(
        <List
          activeItem="a"
          onActiveItemChange={() => {}}
          expandedSubLists={[]}
          onToggleSubList={onToggleSubList}
        >
          <List.Item id="a">Alpha</List.Item>
          <List.Item id="b">Beta</List.Item>
        </List>,
      )

      const alpha = screen.getByText("Alpha")
      alpha.focus()

      await user.keyboard("{ArrowRight}")

      expect(onToggleSubList).not.toHaveBeenCalled()
    })
  })
})
