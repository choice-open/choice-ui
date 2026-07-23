/**
 * Dropdown bug-focused tests
 *
 * BUG 1 (High): focusManagerProps default is replaced by partial user override
 *   - User scenario: Developer renders a coordinate-mode Dropdown (with `position` prop)
 *     and passes focusManagerProps={{ returnFocus: true }} to restore focus on close.
 *   - Regression it prevents: In coordinate mode, the FloatingFocusManager must be
 *     disabled so focus guards and dismiss buttons don't interfere with the page beneath.
 *     When the user's partial override replaces the default object, `disabled: true` is
 *     lost, the focus manager re-enables, and focus guards / dismiss buttons appear —
 *     breaking coordinate-mode overlay behavior.
 *   - Logic change that makes it fail: Lines 159-163 spread `focusManagerProps` as a
 *     single default value. When the user provides a partial object, the entire default
 *     (including `disabled: true`) is replaced. Fix = deep-merge the user's partial
 *     override with the computed defaults.
 *
 * BUG 2 (Medium): hasFocusInside state is never reset when dropdown closes
 *   - User scenario: User opens a dropdown, an item receives focus (setting
 *     hasFocusInside=true via MenuContext). User presses Escape to close. The trigger
 *     element retains data-focus-inside="" forever, which can cause persistent visual
 *     highlight styles.
 *   - Regression it prevents: Trigger element shows a permanent "focused" data attribute
 *     after close, leaking focus state across open/close cycles.
 *   - Logic change that makes it fail: Line 176 sets `hasFocusInside` state, line 558
 *     binds it to `data-focus-inside`, but no effect resets it when `isControlledOpen`
 *     transitions from true to false. Fix = add a useEffect that calls
 *     `setHasFocusInside(false)` when the dropdown closes.
 *
 * BUG 3 (Medium): nested Dropdowns do not inherit disableKeyboardNavigation
 *   - User scenario: Developer disables keyboard navigation on the root Dropdown
 *     to implement custom handling, but a horizontal arrow on a nested SubTrigger still
 *     opens the child because the child Dropdown owns a separate navigation hook.
 *   - Regression it prevents: A disabled menu tree still responds to internal
 *     Enter/horizontal-arrow handling in nested Dropdown instances.
 *   - Fix: expose the effective flag through MenuContext so nested Dropdowns inherit it.
 *
 * BUG 4 (Medium): isMouseOverMenu state is never reset when coordinate-mode dropdown closes
 *   - User scenario: User opens a coordinate-mode dropdown, moves mouse over it
 *     (setting isMouseOverMenu=true), then closes it. On next open, the stale
 *     isMouseOverMenu=true may cause incorrect behavior.
 *   - Regression it prevents: Stale mouse-over state leaking across open/close cycles
 *     in coordinate mode, potentially causing hover detection bugs.
 *   - Logic change that makes it fail: Line 180 sets isMouseOverMenu state,
 *     lines 449-460 set it on mouseEnter/Leave, but no effect resets it when
 *     isControlledOpen transitions from true to false. Fix = add useEffect to reset.
 *
 * BUG 5 (Medium): loop:true on useListNavigation causes unexpected wrap-around
 *   - User scenario: User navigates with ArrowDown past the last item in a dropdown.
 *     Instead of stopping at the bottom, focus wraps back to the first item,
 *     which is unexpected in a dropdown menu (unlike a tab list).
 *   - Regression it prevents: Users accidentally selecting wrong items due to
 *     unexpected focus wrapping in dropdown menus.
 *   - Logic change that makes it fail: Line 396 hardcodes loop:true in
 *     useListNavigation. Fix = set loop:false or make it configurable.
 *
 * BUG 7 (Medium): touch state is never reset when dropdown closes
 *   - User scenario: User opens dropdown via touch (setting touch=true),
 *     then closes it. On next open via mouse, the stale touch=true state
 *     causes FloatingOverlay to skip scroll lock (lockScroll={!touch}),
 *     leading to page scroll behind the dropdown.
 *   - Regression it prevents: Stale touch state causes incorrect scroll
 *     lock behavior on subsequent opens.
 *   - Logic change that makes it fail: Line 179 sets touch state,
 *     lines 438-446 set it on touchStart/pointerMove, but no effect
 *     resets it when isControlledOpen transitions to false.
 *     Fix = add useEffect to reset touch on close.
 *
 * BUG 8 (High): non-selectable SubTrigger discards nested interaction handlers
 *   - User scenario: User focuses a SubTrigger and presses Enter.
 *   - Regression it prevents: The synthetic click has no nested useClick handler,
 *     so the submenu stays closed.
 *   - Fix: preserve Slot-injected click/pointer handlers for non-selectable triggers.
 *
 * BUG 9 (High): nested portals are hidden from assistive technology
 *   - User scenario: The arrow pointing toward a submenu focuses its first item, but
 *     the focused item is inside an aria-hidden portal.
 *   - Regression it prevents: Visual focus moves into content removed from the
 *     accessibility tree.
 *   - Fix: let nested FloatingPortal instances use their parent portal context.
 */
import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { Dropdown } from "../dropdown"

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.IntersectionObserver
  Element.prototype.scrollIntoView = vi.fn()
})

function BasicDropdown({ children, ...props }: React.ComponentProps<typeof Dropdown>) {
  return (
    <Dropdown {...props}>
      <Dropdown.Trigger>Open</Dropdown.Trigger>
      <Dropdown.Content>
        {children ?? (
          <>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Item 2</Dropdown.Item>
          </>
        )}
      </Dropdown.Content>
    </Dropdown>
  )
}

interface SubmenuDropdownProps {
  activeIndex?: number | null
  disableKeyboardNavigation?: boolean
  onDesignClick?: () => void
  onSubTriggerClick?: () => void
  openSubmenuOnArrowNavigation?: boolean
  selectableSubTrigger?: boolean
}

function SubmenuDropdown({
  activeIndex,
  disableKeyboardNavigation,
  onDesignClick,
  onSubTriggerClick,
  openSubmenuOnArrowNavigation,
  selectableSubTrigger = false,
}: SubmenuDropdownProps) {
  return (
    <Dropdown
      activeIndex={activeIndex}
      disableKeyboardNavigation={disableKeyboardNavigation}
      openSubmenuOnArrowNavigation={openSubmenuOnArrowNavigation}
      selection
    >
      <Dropdown.Trigger>Open</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => {}}>Plain Item</Dropdown.Item>

        <Dropdown selection>
          <Dropdown.SubTrigger
            selected={selectableSubTrigger ? false : undefined}
            onClick={onSubTriggerClick}
          >
            Has Submenu
          </Dropdown.SubTrigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={onDesignClick}>Design</Dropdown.Item>
            <Dropdown.Item>Asset</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </Dropdown.Content>
    </Dropdown>
  )
}

function getOuterMenu() {
  return screen.getAllByRole("menu").find((el) => el.hasAttribute("data-floating-ui-focusable"))!
}

function getAllMenus() {
  return Array.from(document.querySelectorAll<HTMLElement>('[role="menu"]'))
}

async function openAndFocusSubTrigger(props: SubmenuDropdownProps = {}) {
  const user = userEvent.setup()
  render(<SubmenuDropdown {...props} />)

  const trigger = screen.getByRole("button", { name: "Open" })
  trigger.focus()
  await user.keyboard("{Enter}")

  const plainItem = await screen.findByRole("menuitem", { name: "Plain Item" })
  await waitFor(() => {
    expect(plainItem).toHaveFocus()
  })

  await user.keyboard("{ArrowDown}")

  const subTrigger = screen.getByRole("menuitem", { name: "Has Submenu" })
  await waitFor(() => {
    expect(subTrigger).toHaveFocus()
  })

  return { subTrigger, user }
}

describe("Dropdown bugs", () => {
  describe("BUG 1: focusManagerProps partial override must not lose coordinate-mode defaults", () => {
    it("disables focus management in coordinate mode even with partial focusManagerProps override", async () => {
      const onOpenChange = vi.fn()

      render(
        <Dropdown
          open={true}
          onOpenChange={onOpenChange}
          position={{ x: 100, y: 100 }}
          focusManagerProps={{ returnFocus: true }}
        >
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const focusGuards = document.querySelectorAll("[data-floating-ui-focus-guard]")
      const dismissButtons = Array.from(document.querySelectorAll("button")).filter(
        (btn) => btn.textContent === "Dismiss",
      )
      expect(focusGuards).toHaveLength(0)
      expect(dismissButtons).toHaveLength(0)
    })
  })

  describe("BUG 2: hasFocusInside must be reset when dropdown closes", () => {
    it("removes data-focus-inside from trigger after closing via Escape", async () => {
      const user = userEvent.setup()

      render(<BasicDropdown />)

      const trigger = screen.getByRole("button")

      await user.click(trigger)
      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const item = screen.getByRole("menuitem", { name: "Item 1" })
      trigger.focus()
      item.focus()

      await waitFor(() => {
        expect(trigger).toHaveAttribute("data-focus-inside")
      })

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(screen.queryAllByRole("menu").length).toBe(0)
      })

      expect(trigger).not.toHaveAttribute("data-focus-inside")
    })
  })

  describe("BUG 4: isMouseOverMenu state must be reset when coordinate-mode dropdown closes", () => {
    it("does not retain isMouseOverMenu=true after closing coordinate-mode dropdown", async () => {
      const onOpenChange = vi.fn()
      const user = userEvent.setup()

      const { rerender } = render(
        <Dropdown
          open={true}
          onOpenChange={onOpenChange}
          position={{ x: 100, y: 100 }}
        >
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const menu = getOuterMenu()
      fireEvent.mouseEnter(menu)

      rerender(
        <Dropdown
          open={false}
          onOpenChange={onOpenChange}
          position={{ x: 100, y: 100 }}
        >
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(screen.queryAllByRole("menu").length).toBe(0)
      })

      rerender(
        <Dropdown
          open={true}
          onOpenChange={onOpenChange}
          position={{ x: 100, y: 100 }}
        >
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      expect(document.querySelector('[data-mouse-over-menu="true"]')).toBeNull()
    })
  })

  describe("BUG 5: loop:true on useListNavigation causes unexpected wrap-around", () => {
    it("ArrowDown on last item wraps to first item when loop is true", async () => {
      const user = userEvent.setup()

      render(
        <Dropdown>
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>First</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Second</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Third</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await user.click(screen.getByRole("button"))
      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const thirdItem = screen.getByRole("menuitem", { name: "Third" })
      thirdItem.focus()

      await user.keyboard("{ArrowDown}")

      const firstItem = screen.getByRole("menuitem", { name: "First" })
      expect(document.activeElement).not.toBe(firstItem)
    })
  })

  describe("BUG 7: touch state must be reset when dropdown closes", () => {
    it("resets touch state on close so scroll lock works correctly on next open", async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <Dropdown
          open={true}
          onOpenChange={() => {}}
        >
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const menu = getOuterMenu()
      fireEvent.touchStart(menu)

      rerender(
        <Dropdown
          open={false}
          onOpenChange={() => {}}
        >
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(screen.queryAllByRole("menu").length).toBe(0)
      })

      rerender(
        <Dropdown
          open={true}
          onOpenChange={() => {}}
        >
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>,
      )

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const overlay = document.querySelector("[data-floating-ui-overlay]")
      const overlayClass = typeof overlay?.className === "string" ? overlay.className : ""
      expect(overlayClass).not.toContain("pointer-events-none")
    })
  })

  describe("nested submenu keyboard interaction", () => {
    async function expectSubmenuOpen(subTrigger: HTMLElement) {
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      const designItem = await screen.findByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })

      expect(subTrigger).toHaveAttribute("aria-haspopup", "menu")
      expect(subTrigger).toHaveAttribute("aria-expanded", "true")

      const controlledMenu = document.getElementById(subTrigger.getAttribute("aria-controls")!)
      expect(controlledMenu).toHaveAttribute("role", "menu")
      expect(designItem.closest('[aria-hidden="true"], [inert]')).toBeNull()
    }

    it("opens a non-selectable SubTrigger with Enter and focuses the first submenu item", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      await user.keyboard("{Enter}")

      await expectSubmenuOpen(subTrigger)
    })

    it("opens a non-selectable SubTrigger with ArrowRight and focuses the first submenu item", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowRight}")

      await expectSubmenuOpen(subTrigger)
    })

    it("does not open a right-side SubTrigger with ArrowLeft", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowLeft}")

      expect(getAllMenus()).toHaveLength(1)
      expect(subTrigger).toHaveFocus()
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("keeps pointer hover opening behavior for a non-selectable SubTrigger", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      await user.hover(subTrigger)

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "true")
    })

    it("pre-opens a SubTrigger on arrow navigation while keeping focus on the parent item", async () => {
      const { subTrigger } = await openAndFocusSubTrigger({
        openSubmenuOnArrowNavigation: true,
      })

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      expect(subTrigger).toHaveFocus()
      expect(subTrigger).toHaveAttribute("aria-expanded", "true")
      expect(subTrigger.closest('[aria-hidden="true"], [inert]')).toBeNull()
      expect(screen.getByRole("menuitem", { name: "Design" })).not.toHaveFocus()
    })

    it("enters a pre-opened submenu with ArrowRight and does not reopen it after ArrowLeft", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger({
        openSubmenuOnArrowNavigation: true,
      })

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowRight}")
      const designItem = screen.getByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowLeft}")
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
        expect(subTrigger).toHaveFocus()
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("closes a right-side pre-opened submenu with ArrowLeft", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger({
        openSubmenuOnArrowNavigation: true,
      })

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowLeft}")
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
      })
      expect(subTrigger).toHaveFocus()
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("enters a left-side pre-opened submenu with ArrowLeft and returns with ArrowRight", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger({
        openSubmenuOnArrowNavigation: true,
      })

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      subTrigger.setAttribute("data-submenu-side", "left")
      await user.keyboard("{ArrowLeft}")
      const designItem = screen.getByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })

      subTrigger.setAttribute("data-submenu-side", "left")
      await user.keyboard("{ArrowRight}")
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
        expect(subTrigger).toHaveFocus()
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("closes a pre-opened submenu when arrow navigation moves to a sibling item", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger({
        openSubmenuOnArrowNavigation: true,
      })

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(2)
      })

      await user.keyboard("{ArrowUp}")
      const plainItem = screen.getByRole("menuitem", { name: "Plain Item" })
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
        expect(plainItem).toHaveFocus()
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("activates a submenu item exactly once and closes the entire menu tree", async () => {
      const onDesignClick = vi.fn()
      const { user } = await openAndFocusSubTrigger({ onDesignClick })

      await user.keyboard("{Enter}")
      const designItem = await screen.findByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })
      await user.keyboard("{Enter}")

      expect(onDesignClick).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(0)
      })
    })

    it("closes the submenu with ArrowLeft and returns focus to its SubTrigger", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowRight}")
      const designItem = await screen.findByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })
      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowLeft}")

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
        expect(subTrigger).toHaveFocus()
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("closes the submenu with Escape and returns focus to its SubTrigger", async () => {
      const { subTrigger, user } = await openAndFocusSubTrigger()

      subTrigger.setAttribute("data-submenu-side", "right")
      await user.keyboard("{ArrowRight}")
      const designItem = await screen.findByRole("menuitem", { name: "Design" })
      await waitFor(() => {
        expect(designItem).toHaveFocus()
      })
      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(1)
        expect(subTrigger).toHaveFocus()
      })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })

    it("preserves selectable SubTrigger activation and closes the menu tree", async () => {
      const onSubTriggerClick = vi.fn()
      const { user } = await openAndFocusSubTrigger({
        onSubTriggerClick,
        selectableSubTrigger: true,
      })

      await user.keyboard("{Enter}")

      expect(onSubTriggerClick).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(getAllMenus()).toHaveLength(0)
      })
    })

    it("inherits disableKeyboardNavigation and prevents nested Enter or horizontal-arrow handling", async () => {
      const user = userEvent.setup()
      render(<SubmenuDropdown disableKeyboardNavigation />)

      const trigger = screen.getByRole("button", { name: "Open" })
      trigger.focus()
      await user.keyboard("{Enter}")

      const subTrigger = await screen.findByRole("menuitem", { name: "Has Submenu" })
      subTrigger.focus()

      await user.keyboard("{ArrowRight}")
      expect(getAllMenus()).toHaveLength(1)
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")

      await user.keyboard("{ArrowLeft}")
      expect(getAllMenus()).toHaveLength(1)
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")

      await user.keyboard("{Enter}")
      expect(getAllMenus()).toHaveLength(1)
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
    })
  })
})
