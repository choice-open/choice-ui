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
 * BUG 3 (Medium): handleFloatingKeyDown ignores disableKeyboardNavigation prop
 *   - User scenario: Developer sets disableKeyboardNavigation={true} to implement
 *     custom keyboard handling. User presses Enter on a SubTrigger item, expecting
 *     the internal handler to be disabled — but the submenu opens anyway.
 *   - Regression it prevents: Keyboard navigation is not fully disabled; SubTrigger
 *     items still respond to Enter/ArrowRight even when the prop says otherwise.
 *   - Logic change that makes it fail: Lines 463-475 (`handleFloatingKeyDown`) never
 *     check the `disableKeyboardNavigation` flag before calling
 *     `activeElement.click()`. Fix = guard the handler with
 *     `if (disableKeyboardNavigation) return`.
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
  }
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

function SubmenuDropdown({ disableKeyboardNavigation }: { disableKeyboardNavigation?: boolean }) {
  return (
    <Dropdown disableKeyboardNavigation={disableKeyboardNavigation}>
      <Dropdown.Trigger>Open</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => {}}>Plain Item</Dropdown.Item>
        <Dropdown.SubTrigger>Has Submenu</Dropdown.SubTrigger>
      </Dropdown.Content>
    </Dropdown>
  )
}

function getOuterMenu() {
  return screen.getAllByRole("menu").find((el) => el.hasAttribute("data-floating-ui-focusable"))!
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

  describe("BUG 3: disableKeyboardNavigation must prevent SubTrigger from opening on Enter", () => {
    it("does not open submenu when Enter is pressed on SubTrigger with disableKeyboardNavigation=true", async () => {
      const user = userEvent.setup()

      render(<SubmenuDropdown disableKeyboardNavigation={true} />)

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      await waitFor(() => {
        expect(getOuterMenu()).toBeInTheDocument()
      })

      const subTrigger = screen.getByRole("menuitem", { name: "Has Submenu" })
      subTrigger.focus()
      await user.keyboard("{Enter}")

      const menus = screen.queryAllByRole("menu")
      expect(menus).toHaveLength(1)
    })
  })
})
