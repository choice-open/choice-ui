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
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { MenuCheckbox } from "../components/menu-checkbox"
import { MenuContext } from "../context/menu-context"
import { MenuContextItem } from "../context/menu-context-item"

const stubMenuContext = {
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
}: {
  children: ReactNode
  emitSpy?: (event: string) => void
}) {
  return (
    <FloatingTree>
      <EmitSpy spy={emitSpy ?? (() => {})} />
      <FloatingNode id="test-node">
        <MenuContext.Provider value={stubMenuContext}>{children}</MenuContext.Provider>
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
