/**
 * Tabs/TabItem bug-focused tests
 *
 * BUG 5.1: Right-click and middle-click trigger tab change via onMouseDown
 *   - User scenario: User right-clicks a tab to open browser context menu,
 *     but the tab changes first -- disorienting and broken UX
 *   - Regression it prevents: Non-left-click interactions changing the active tab
 *   - Logic change that makes it fail: handleMouseDown in tab-item.tsx (line 47-58)
 *     fires onChange for ALL mouse buttons without checking e.button === 0.
 *     Fix = add `if (e.button !== 0) return` at the top.
 *
 * BUG 5.2: Clicking a tab does not move focus to it
 *   - User scenario: User clicks a tab. The tab activates but focus stays on the
 *     previously focused element. Next Tab key press moves focus from wrong element.
 *   - Regression it prevents: Keyboard navigation disoriented after mouse click
 *   - Logic change that makes it fail: tab-item.tsx:51 -- handleMouseDown calls
 *     e.preventDefault() which prevents the browser's default focus behavior.
 *     The CSS already uses select-none so preventDefault is unnecessary for text
 *     selection. Fix = remove e.preventDefault(), or add e.currentTarget.focus().
 *
 * BUG 6: aria-label prop silently dropped on icon-only tabs
 *   - User scenario: Developer renders icon-only tabs with aria-label for
 *     accessibility. Screen readers announce "tab, not selected" with no name.
 *   - Regression it prevents: Icon-only tabs inaccessible to screen readers
 *   - Logic change: tab-item.tsx line 22 destructures "aria-label" out of props.
 *     The value is placed into a span with aria-hidden="true" (line 93), so screen
 *     readers skip it. The tab element itself never receives aria-label.
 *     Fix = apply aria-label to the rendered tab element directly.
 *
 * BUG 7: User event handlers silently dropped when Tabs is readOnly
 *   - User scenario: Developer passes onMouseDown or onKeyDown to a TabItem inside
 *     a readOnly Tabs container. The handlers never fire because the readOnly check
 *     returns early before calling user handlers.
 *   - Regression it prevents: Custom event handlers broken in readOnly mode
 *   - Logic change: tab-item.tsx lines 48, 61. `if (contextReadOnly) return` exits
 *     before calling user's onMouseDown/onKeyDown. Compare with disabled mode which
 *     still calls user handlers. Fix = only suppress onChange, not user handlers.
 *
 * BUG 8: disabled prop on parent Tabs must prevent tab activation
 *   - User scenario: Developer renders <Tabs disabled><Tabs.Item value="b">B</Tabs.Item></Tabs>.
 *     User clicks tab B. onChange must not fire because the Tabs container is disabled.
 *   - Regression it prevents: Clicking disabled tabs still changing the active tab
 *   - Logic change: tab-item.tsx:56 — `if (!contextDisabled && !disabled)` guard.
 *     If removed, disabled tabs respond to clicks.
 *
 * BUG 9: Enter and Space keys must activate a tab
 *   - User scenario: Keyboard user navigates to a tab and presses Enter or Space.
 *     The tab should activate (onChange fires).
 *   - Regression it prevents: Keyboard activation of tabs broken
 *   - Logic change: tab-item.tsx:71 — `if (!contextDisabled && !disabled &&
 *     (e.key === "Enter" || e.key === " "))` calls onChange. If guard breaks,
 *     keyboard can't activate tabs.
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

  describe("BUG 5.2: clicking a tab must move focus to it", () => {
    it("focuses the clicked tab so subsequent keyboard navigation works", async () => {
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

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      await user.click(tabB)

      expect(tabB).toHaveFocus()
    })
  })

  describe("BUG 6: icon-only tabs must have accessible name via aria-label", () => {
    it("applies aria-label to the tab element for screen readers", () => {
      render(
        <Tabs value="a">
          <Tabs.Item
            value="a"
            aria-label="Settings"
          >
            <svg data-testid="icon" />
          </Tabs.Item>
        </Tabs>,
      )

      const tab = screen.getByRole("tab")
      expect(tab).toHaveAttribute("aria-label", "Settings")
    })
  })

  describe("BUG 7: user event handlers must fire in readOnly mode", () => {
    it("calls onMouseDown when Tabs is readOnly", async () => {
      const onMouseDown = vi.fn()
      const user = userEvent.setup()

      render(
        <Tabs
          value="a"
          readOnly
        >
          <Tabs.Item
            value="b"
            onMouseDown={onMouseDown}
          >
            Tab B
          </Tabs.Item>
        </Tabs>,
      )

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      await user.click(tabB)

      expect(onMouseDown).toHaveBeenCalled()
    })
  })

  describe("BUG 8: disabled Tabs must not activate on click", () => {
    it("does not fire onChange when the Tabs container is disabled", async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Tabs
          value="a"
          onChange={onChange}
          disabled
        >
          <Tabs.Item value="a">Tab A</Tabs.Item>
          <Tabs.Item value="b">Tab B</Tabs.Item>
        </Tabs>,
      )

      await user.click(screen.getByRole("tab", { name: "Tab B" }))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 9: Enter and Space keys must activate a tab", () => {
    it("fires onChange when Enter is pressed on a focused tab", async () => {
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

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      tabB.focus()
      await user.keyboard("{Enter}")

      expect(onChange).toHaveBeenCalledWith("b")
    })

    it("fires onChange when Space is pressed on a focused tab", async () => {
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

      const tabB = screen.getByRole("tab", { name: "Tab B" })
      tabB.focus()
      await user.keyboard(" ")

      expect(onChange).toHaveBeenCalledWith("b")
    })
  })
})
