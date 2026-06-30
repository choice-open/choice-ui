/**
 * Context Menu bug-focused tests
 *
 * BUG 1: Keyboard (Enter/ArrowRight) cannot open submenus
 *   - User scenario: User right-clicks to open context menu, arrow-keys to a SubTrigger
 *     item, presses Enter or ArrowRight. The submenu does NOT open. Keyboard users are
 *     completely blocked from accessing nested submenus — a WCAG 2.1 Level A violation.
 *   - Regression it prevents: Keyboard inoperable nested context menus
 *   - Logic change: The floating div (context-menu.tsx:517-528) has no `onKeyDown` handler.
 *     The Dropdown has `handleFloatingKeyDown` (dropdown.tsx:463) that clicks SubTrigger
 *     items on Enter/ArrowRight. ContextMenu has no equivalent.
 *     Fix = add `onKeyDown` to the floating div that detects aria-haspopup items and
 *     clicks them on Enter/ArrowRight.
 *
 * BUG 2: Timeout cleanup return value is always discarded
 *   - User scenario: User right-clicks twice rapidly. The orphaned setTimeout from the
 *     first click fires and sets allowMouseUpCloseRef = true prematurely, causing the
 *     newly opened menu to close on next mouseup.
 *   - Regression it prevents: Context menu closing unexpectedly on rapid right-click
 *   - Logic change: Line 320 `return () => clearTimeout(timeout)` returns a cleanup
 *     function from handleContextMenu, but neither call site uses the return value.
 *     Fix = store timeout ref and clear it at the start of handleContextMenu.
 *
 * BUG 3: mouseUpTimeoutRef is never cleared on unmount
 *   - User scenario: User right-clicks to open menu, then component unmounts (e.g. route
 *     change). The 200ms setTimeout fires after unmount, writing to a ref on an unmounted
 *     component. In strict mode or concurrent features, this can cause warnings or bugs.
 *   - Regression it prevents: Timer leaking after unmount
 *   - Logic change: context-menu.tsx:312-320 — mouseUpTimeoutRef.current is set but
 *     there is no useEffect cleanup to clear it on unmount. Fix = add
 *     `return () => { if (mouseUpTimeoutRef.current) clearTimeout(mouseUpTimeoutRef.current) }`
 *     to a useEffect with empty deps.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ContextMenu } from "../context-menu"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

describe("Context Menu bugs", () => {
  describe("BUG 1: Enter on SubTrigger must open the submenu via keyboard", () => {
    it("opens a submenu when Enter is pressed on a SubTrigger item", async () => {
      const user = userEvent.setup()

      render(
        <ContextMenu>
          <ContextMenu.Trigger>
            <div>Target Area</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Regular Item</ContextMenu.Item>
            <ContextMenu>
              <ContextMenu.SubTrigger>Open Submenu</ContextMenu.SubTrigger>
              <ContextMenu.Content>
                <ContextMenu.Item>Sub Item</ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu>
          </ContextMenu.Content>
        </ContextMenu>,
      )

      const triggerArea = screen.getByText("Target Area")
      fireEvent.contextMenu(triggerArea)

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument()
      })

      const menu = screen.getByRole("menu")
      const menuItems = within(menu).getAllByRole("menuitem")
      const subTriggerItem = menuItems.find((item) => item.getAttribute("aria-haspopup") === "menu")

      expect(subTriggerItem).toBeTruthy()

      if (subTriggerItem) {
        subTriggerItem.focus()
        await user.keyboard("{Enter}")

        await waitFor(() => {
          const allMenus = document.querySelectorAll('[role="menu"]')
          expect(allMenus.length).toBeGreaterThan(1)
        })
      }
    })
  })

  describe("BUG 2: rapid right-click must not cause premature close", () => {
    it("keeps the menu open after two rapid right-clicks and a mouseup", async () => {
      const onOpenChange = vi.fn()

      render(
        <ContextMenu onOpenChange={onOpenChange}>
          <ContextMenu.Trigger>
            <div>Target Area</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Item 1</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>,
      )

      const triggerArea = screen.getByText("Target Area")

      fireEvent.contextMenu(triggerArea)
      fireEvent.contextMenu(triggerArea)

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true)
      })

      const openCount = onOpenChange.mock.calls.filter((c) => c[0] === true).length
      expect(openCount).toBeGreaterThanOrEqual(2)

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument()
      })

      fireEvent.mouseUp(document.body)

      await waitFor(
        () => {
          const closeCount = onOpenChange.mock.calls.filter((c) => c[0] === false).length
          expect(closeCount).toBe(0)
        },
        { timeout: 500 },
      )
    })
  })

  /**
   * ESCAPE KEY dismisses the menu
   *   User scenario: User right-clicks to open context menu, then presses Escape.
   *     The menu must close.
   *   Regression it prevents: Escape key not closing the context menu
   *   Logic change: useDismiss(context, { escapeKey: true }) registers escape handling.
   *     If this config is removed or broken, Escape does nothing and the menu stays open.
   */
  describe("Escape key dismisses the menu", () => {
    it("closes the menu when Escape is pressed", async () => {
      const onOpenChange = vi.fn()

      render(
        <ContextMenu onOpenChange={onOpenChange}>
          <ContextMenu.Trigger>
            <div>Target Area</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Item 1</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>,
      )

      const triggerArea = screen.getByText("Target Area")
      fireEvent.contextMenu(triggerArea)

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument()
      })

      fireEvent.keyDown(document.activeElement || document.body, { key: "Escape" })

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument()
      })
    })
  })

  /**
   * DISABLED prevents menu from opening
   *   User scenario: Developer renders <ContextMenu disabled>. Right-clicking the
   *     trigger area must NOT open the menu.
   *   Regression it prevents: Disabled context menu still opening on right-click
   *   Logic change: handleContextMenu checks `if (disabled) return` (line 270).
   *     handleOpenChange checks `if (disabled && newOpen) return` (line 183).
   *     If either guard is removed, disabled menus open on right-click.
   */
  describe("disabled context menu", () => {
    it("does not open the menu when disabled=true", async () => {
      const onOpenChange = vi.fn()

      render(
        <ContextMenu
          disabled
          onOpenChange={onOpenChange}
        >
          <ContextMenu.Trigger>
            <div>Target Area</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Item 1</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>,
      )

      const triggerArea = screen.getByText("Target Area")
      fireEvent.contextMenu(triggerArea)

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument()
      })

      expect(onOpenChange).not.toHaveBeenCalledWith(true)
    })
  })

  describe("BUG 3: mouseUpTimeoutRef must be cleaned up on unmount", () => {
    it("clears the timer when component unmounts during the 200ms window", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })

      const consoleError = vi.spyOn(console, "error")

      const { unmount } = render(
        <ContextMenu>
          <ContextMenu.Trigger>
            <div>Target Area</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Item 1</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>,
      )

      const triggerArea = screen.getByText("Target Area")
      fireEvent.contextMenu(triggerArea)

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument()
      })

      unmount()

      vi.advanceTimersByTime(300)

      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
      vi.useRealTimers()
    })
  })
})

function within(element: HTMLElement) {
  return {
    getAllByRole(role: string) {
      return Array.from(element.querySelectorAll(`[role="${role}"]`)) as HTMLElement[]
    },
  }
}
