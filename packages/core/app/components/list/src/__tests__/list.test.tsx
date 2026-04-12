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
 *
 * BUG 5: User's onKeyDown prop is silently overridden by internal handler
 *   - User scenario: Developer passes onKeyDown to a List.Item for custom keyboard
 *     behavior. The handler never fires because internal handleKeyDown overrides it.
 *   - Regression it prevents: Custom keyboard handlers silently broken on list items
 *   - Logic change: list-item.tsx lines 38-54 and 173. onKeyDown is NOT destructured
 *     from props, so it ends up in ...rest. Then line 173 sets
 *     onKeyDown={handleKeyDown}, overriding the user's handler from ...rest.
 *     Fix = destructure onKeyDown and call it at end of handleKeyDown.
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

  describe("BUG 5: user onKeyDown must not be silently overridden", () => {
    it("calls user-provided onKeyDown when a key is pressed on a list item", async () => {
      const { List } = await import("../list")
      const onKeyDown = vi.fn()
      const user = userEvent.setup()

      render(
        <List
          activeItem="a"
          onActiveItemChange={() => {}}
          expandedSubLists={[]}
          onToggleSubList={() => {}}
        >
          <List.Item
            id="a"
            onKeyDown={onKeyDown}
          >
            Alpha
          </List.Item>
        </List>,
      )

      const alpha = screen.getByText("Alpha")
      alpha.focus()

      await user.keyboard("x")

      expect(onKeyDown).toHaveBeenCalled()
    })
  })
})
