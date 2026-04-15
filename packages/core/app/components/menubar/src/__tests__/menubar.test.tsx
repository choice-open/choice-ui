/**
 * Menubar bug-focused tests
 *
 * BUG 3: returnFocus=false causes focus loss when dropdown closes via Escape
 *   - User scenario: Keyboard user opens a menubar dropdown, presses Escape.
 *     Focus goes to document.body instead of back to the trigger button.
 *     User must Tab from the top of the page to get back.
 *   - Regression it prevents: Keyboard navigation dead-end in menubar
 *   - Logic change that makes it fail: menubar-item.tsx line 248 hardcodes
 *     `returnFocus: false`. Fix = set `returnFocus: true`.
 */
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
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

describe("Menubar bugs", () => {
  describe("BUG 3: focus must return to trigger after Escape closes dropdown", () => {
    it("returns focus to the menubar trigger button after pressing Escape", async () => {
      const { Menubar } = await import("../menubar")
      const user = userEvent.setup()

      render(
        <Menubar>
          <Menubar.Item label="File">
            <Menubar.Item label="New">New File</Menubar.Item>
            <Menubar.Item label="Open">Open File</Menubar.Item>
          </Menubar.Item>
          <Menubar.Item label="Edit">
            <Menubar.Item label="Undo">Undo</Menubar.Item>
          </Menubar.Item>
        </Menubar>,
      )

      const fileTrigger = screen.getByText("File")
      await user.click(fileTrigger)

      await waitFor(
        () => {
          expect(screen.getByText("New File")).toBeInTheDocument()
        },
        { timeout: 3000 },
      )

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(document.activeElement).toBe(fileTrigger)
      })
    })
  })

  /**
   * HOVER SWITCHING: When one menu is open, hovering another trigger switches the menu
   *   User scenario: User clicks "File" to open it, then hovers "Edit". The dropdown
   *     should switch from File's content to Edit's content without needing another click.
   *   Regression it prevents: Menus not switching on hover after initial click-open
   *   Logic change: handleTriggerMouseEnter checks hasAnyMenuOpen && !isOpen before
   *     calling openMenu. If this guard breaks, hover does nothing.
   */
  describe("hover switches menus when one is already open", () => {
    it("switches dropdown content when hovering another trigger after initial click", async () => {
      const { Menubar } = await import("../menubar")
      const user = userEvent.setup()

      render(
        <Menubar>
          <Menubar.Item label="File">
            <Menubar.Item label="New">New File</Menubar.Item>
          </Menubar.Item>
          <Menubar.Item label="Edit">
            <Menubar.Item label="Undo">Undo Action</Menubar.Item>
          </Menubar.Item>
        </Menubar>,
      )

      const fileTrigger = screen.getByText("File")
      await user.click(fileTrigger)

      await waitFor(() => {
        expect(screen.getByText("New File")).toBeInTheDocument()
      })

      const editTrigger = screen.getByText("Edit")
      await user.hover(editTrigger)

      await waitFor(() => {
        expect(screen.getByText("Undo Action")).toBeInTheDocument()
      })
    })
  })

  /**
   * ARROW KEY NAVIGATION between top-level menu items
   *   User scenario: Keyboard user opens "File" menu, then presses ArrowRight.
   *     Focus should move to "Edit" trigger and its dropdown should open.
   *   Regression it prevents: Arrow keys not navigating between top-level menus
   *   Logic change: handleKeyDown in menubar.tsx handles ArrowRight/Left by calling
   *     navigateNext/navigatePrev which call openMenu + triggerRef.focus(). If this
   *     key handling breaks, arrow keys do nothing.
   */
  describe("arrow key navigation between menus", () => {
    it("navigates to the next menu on ArrowRight after one is open", async () => {
      const { Menubar } = await import("../menubar")
      const user = userEvent.setup()

      const { container } = render(
        <Menubar>
          <Menubar.Item label="File">
            <Menubar.Item label="New">New File</Menubar.Item>
          </Menubar.Item>
          <Menubar.Item label="Edit">
            <Menubar.Item label="Undo">Undo Action</Menubar.Item>
          </Menubar.Item>
        </Menubar>,
      )

      const fileTrigger = screen.getByText("File")
      await user.click(fileTrigger)

      const menubarRoot = container.querySelector('[role="menubar"]')!
      await waitFor(() => {
        expect(screen.getByText("New File")).toBeInTheDocument()
        fireEvent.keyDown(menubarRoot, { key: "ArrowRight" })
      })

      await waitFor(() => {
        expect(screen.getByText("Undo Action")).toBeInTheDocument()
      })
    })
  })

  /**
   * DISABLED MENUBAR: disabled prop on root prevents all interaction
   *   User scenario: Developer renders <Menubar disabled>. Clicking a trigger
   *     should not open any dropdown.
   *   Regression it prevents: Disabled menubar still opening menus on click
   *   Logic change: openMenu in menubar.tsx checks `if (disabled) return`.
   *     If this guard is removed, disabled menubar remains fully interactive.
   */
  describe("disabled menubar", () => {
    it("does not open any menu when the menubar is disabled", async () => {
      const { Menubar } = await import("../menubar")
      const user = userEvent.setup()

      render(
        <Menubar disabled>
          <Menubar.Item label="File">
            <Menubar.Item label="New">New File</Menubar.Item>
          </Menubar.Item>
        </Menubar>,
      )

      const fileTrigger = screen.getByText("File")
      await user.click(fileTrigger)

      expect(screen.queryByText("New File")).not.toBeInTheDocument()
    })
  })
})
