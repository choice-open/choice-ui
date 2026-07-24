/**
 * Menus bug-focused tests
 *
 * BUG 1: MenuContextItem emits "click" tree event twice per interaction
 *   - User scenario: User clicks a context menu item to select it and close the menu.
 *     The menu's onOpenChange callback fires twice with (false), causing double-close
 *     side effects (e.g., analytics events counted twice, state update flicker).
 *   - Regression it prevents: Double-firing of close handlers on every menu item click.
 *   - Logic change that makes it fail: Both handleClick (line 83) and handleMouseUp
 *     (line 99) call tree?.events.emit("click"). During a normal click, both fire.
 *     Fix = remove the tree?.events.emit("click") from handleMouseUp.
 *
 * BUG 2: MenuCheckbox ignores indeterminate prop entirely
 *   - User scenario: Developer renders <MenuCheckbox indeterminate /> to show a dash/minus
 *     indicator for a partially-selected state (e.g., "Select All" when some items are checked).
 *   - Regression it prevents: indeterminate visual state is never rendered; users see
 *     an empty checkbox when it should show a dash.
 *   - Logic change that makes it fail: The indeterminate prop is destructured (line 13)
 *     but never used in rendering logic (lines 17-24). Only `selected` gates the Check icon.
 *     Fix = add an indeterminate branch that renders a dash icon when indeterminate=true.
 */
import "@testing-library/jest-dom"
import { FloatingNode, FloatingTree, useFloatingTree } from "@floating-ui/react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { MenuCheckbox } from "../components/menu-checkbox"
import { MenuContext, type MenuContextType } from "../context/menu-context"
import { MenuContextItem } from "../context/menu-context-item"
import { MenuContextSubTrigger } from "../context/menu-context-sub-trigger"

const stubMenuContext: MenuContextType = {
  activeIndex: null,
  close: vi.fn(),
  getItemProps: <T extends React.HTMLProps<HTMLElement>>(userProps?: T) =>
    ({ ...userProps }) as Record<string, unknown>,
  isOpen: true,
  readOnly: false,
  selection: false,
  setActiveIndex: vi.fn(),
  setHasFocusInside: vi.fn(),
  variant: "default" as const,
}

type SpyableEmit = NonNullable<ReturnType<typeof useFloatingTree>>["events"]["emit"] & {
  _spy?: boolean
}

function EmitSpy({ spy }: { spy: (event: string) => void }) {
  const tree = useFloatingTree()
  if (tree && !(tree.events.emit as SpyableEmit)._spy) {
    const orig = tree.events.emit.bind(tree.events)
    const patched = ((event: string, ...args: unknown[]) => {
      spy(event)
      return orig(event, ...args)
    }) as SpyableEmit
    patched._spy = true
    tree.events.emit = patched
  }
  return null
}

function MenuWrapper({
  children,
  emitSpy,
  menuContext,
}: {
  children: ReactNode
  emitSpy?: (event: string) => void
  menuContext?: Partial<MenuContextType>
}) {
  return (
    <FloatingTree>
      <EmitSpy spy={emitSpy ?? (() => {})} />
      <FloatingNode id="test-node">
        <MenuContext.Provider value={{ ...stubMenuContext, ...menuContext }}>
          {children}
        </MenuContext.Provider>
      </FloatingNode>
    </FloatingTree>
  )
}

describe("Menu bugs", () => {
  describe("BUG 1: MenuContextItem must emit click tree event exactly once per click", () => {
    it("calls tree.events.emit('click') exactly once when a menu item is clicked", async () => {
      const user = userEvent.setup()
      const emitSpy = vi.fn()

      render(
        <MenuWrapper emitSpy={emitSpy}>
          <MenuContextItem>Menu Item</MenuContextItem>
        </MenuWrapper>,
      )

      await user.click(screen.getByRole("menuitem"))

      const clickEmissions = emitSpy.mock.calls.filter((args) => args[0] === "click")
      expect(clickEmissions).toHaveLength(1)
    })

    it("uses a legacy onMouseUp handler for a keyboard-originated click", () => {
      const emitSpy = vi.fn()
      const onMouseUp = vi.fn()

      render(
        <MenuWrapper emitSpy={emitSpy}>
          <MenuContextItem onMouseUp={onMouseUp}>Menu Item</MenuContextItem>
        </MenuWrapper>,
      )

      const menuItem = screen.getByRole("menuitem")
      fireEvent.click(menuItem, { detail: 0 })

      expect(onMouseUp).toHaveBeenCalledTimes(1)
      const clickEmissions = emitSpy.mock.calls.filter((args) => args[0] === "click")
      expect(clickEmissions).toHaveLength(1)
    })

    it("does not call a legacy onMouseUp handler twice for a pointer click", async () => {
      const user = userEvent.setup()
      const onMouseUp = vi.fn()

      render(
        <MenuWrapper>
          <MenuContextItem onMouseUp={onMouseUp}>Menu Item</MenuContextItem>
        </MenuWrapper>,
      )

      await user.click(screen.getByRole("menuitem"))

      expect(onMouseUp).toHaveBeenCalledTimes(1)
    })

    it("uses click as the single activation path for a selectable SubTrigger", async () => {
      const user = userEvent.setup()
      const emitSpy = vi.fn()
      const onClick = vi.fn()

      render(
        <MenuWrapper
          emitSpy={emitSpy}
          menuContext={{ selection: true }}
        >
          <MenuContextSubTrigger
            selected={false}
            onClick={onClick}
          >
            Submenu action
          </MenuContextSubTrigger>
        </MenuWrapper>,
      )

      await user.click(screen.getByRole("menuitem"))

      expect(onClick).toHaveBeenCalledTimes(1)
      const clickEmissions = emitSpy.mock.calls.filter((args) => args[0] === "click")
      expect(clickEmissions).toHaveLength(1)
    })

    it("activates a selectable SubTrigger with Enter", async () => {
      const user = userEvent.setup()
      const emitSpy = vi.fn()
      const onClick = vi.fn()

      render(
        <MenuWrapper
          emitSpy={emitSpy}
          menuContext={{ selection: true }}
        >
          <MenuContextSubTrigger
            selected={false}
            onClick={onClick}
          >
            Submenu action
          </MenuContextSubTrigger>
        </MenuWrapper>,
      )

      const subTrigger = screen.getByRole("menuitem")
      subTrigger.focus()
      await user.keyboard("{Enter}")

      expect(onClick).toHaveBeenCalledTimes(1)
      const clickEmissions = emitSpy.mock.calls.filter((args) => args[0] === "click")
      expect(clickEmissions).toHaveLength(1)
    })
  })

  describe("BUG 2: MenuCheckbox must render an indeterminate indicator", () => {
    it("shows a visual indicator when indeterminate=true", () => {
      const { container } = render(<MenuCheckbox indeterminate />)

      const checkbox = container.firstChild as HTMLElement
      expect(checkbox).toBeInTheDocument()

      const hasDashIcon =
        checkbox.querySelector("[data-indeterminate]") !== null ||
        checkbox.textContent?.includes("−") === true ||
        checkbox.textContent?.includes("-") === true ||
        checkbox.querySelector("svg") !== null
      expect(hasDashIcon).toBe(true)
    })

    it("shows a check icon when selected=true (sanity check)", () => {
      const { container } = render(<MenuCheckbox selected />)

      const checkbox = container.firstChild as HTMLElement
      const svg = checkbox.querySelector("svg")
      expect(svg).toBeInTheDocument()
    })

    it("shows nothing when neither selected nor indeterminate", () => {
      const { container } = render(<MenuCheckbox />)

      const checkbox = container.firstChild as HTMLElement
      expect(checkbox.innerHTML).toBe("")
    })
  })
})
