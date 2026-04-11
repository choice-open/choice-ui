/**
 * Tabs/TabItem bug-focused tests
 *
 * BUG 5.1: Right-click and middle-click trigger tab change via onMouseDown
 *   - User scenario: User right-clicks a tab to open browser context menu,
 *     but the tab changes first — disorienting and broken UX
 *   - Regression it prevents: Non-left-click interactions changing the active tab
 *   - Logic change that makes it fail: handleMouseDown in tab-item.tsx (line 47-58)
 *     fires onChange for ALL mouse buttons without checking e.button === 0.
 *     Fix = add `if (e.button !== 0) return` at the top.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Tabs } from "../tabs"

describe("TabItem bugs", () => {
  describe("BUG 5.1: right-click must NOT change the active tab", () => {
    it("fires onChange on left-click (button 0)", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Tabs
          value="a"
          onChange={onChange}
        >
          <Tabs.Item value="a">Tab A</Tabs.Item>
          <Tabs.Item value="b">Tab B</Tabs.Item>
        </Tabs>,
      )

      await user.click(screen.getByRole("tab", { name: "Tab B" }))
      expect(onChange).toHaveBeenCalledWith("b")
    })

    it("does NOT fire onChange on right-click (button 2)", () => {
      const onChange = vi.fn()

      render(
        <Tabs
          value="a"
          onChange={onChange}
        >
          <Tabs.Item value="a">Tab A</Tabs.Item>
          <Tabs.Item value="b">Tab B</Tabs.Item>
        </Tabs>,
      )

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      fireEvent(tabB, new MouseEvent("mousedown", { button: 2, bubbles: true }))

      expect(onChange).not.toHaveBeenCalled()
    })

    it("does NOT fire onChange on middle-click (button 1)", () => {
      const onChange = vi.fn()

      render(
        <Tabs
          value="a"
          onChange={onChange}
        >
          <Tabs.Item value="a">Tab A</Tabs.Item>
          <Tabs.Item value="b">Tab B</Tabs.Item>
        </Tabs>,
      )

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      fireEvent(tabB, new MouseEvent("mousedown", { button: 1, bubbles: true }))

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
