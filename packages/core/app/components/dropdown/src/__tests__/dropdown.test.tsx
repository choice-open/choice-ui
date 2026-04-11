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
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
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
