/**
 * Command bug-focused tests
 *
 * BUG 1: Group sorting by search score never works (ID mismatch)
 *   - User scenario: User types a search query in a Command palette with multiple groups.
 *     Items within each group are correctly sorted by relevance, but the groups themselves
 *     stay in their original order — the most relevant group may remain at the bottom.
 *   - Regression it prevents: Groups never reorder by search relevance
 *   - Logic change: command.tsx:210-219 — `groups` array contains React `useId` values
 *     (e.g., ":r0:") but the DOM `data-value` attribute contains the user-provided value.
 *     The `querySelector` at line 213 encodes the useId into a CSS selector that never
 *     matches. Fix = use the correct data-value or store a mapping.
 *
 * BUG 2: forceMount items are not registered, breaking aria-activedescendant
 *   - User scenario: Developer renders a CommandItem with forceMount={true}. The item
 *     appears in the DOM and can be navigated to via keyboard, but when selected, the
 *     listbox's aria-activedescendant becomes undefined because the item was never
 *     registered in the ids map. Screen readers cannot announce the active item.
 *   - Regression it prevents: Broken a11y for forceMount items
 *   - Logic change: command-item.tsx:65-69 — when forceMount is truthy, the useEffect
 *     returns early without calling `context.item()`, so the item is never added to
 *     allItems or ids. Fix = always register the item, but skip visibility filtering.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Command as CommandRoot } from "../command"
import { CommandGroup } from "../components/command-group"
import { CommandInput } from "../components/command-input"
import { CommandItem } from "../components/command-item"
import { CommandList } from "../components/command-list"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver

Element.prototype.scrollIntoView = vi.fn()

const Command = Object.assign(CommandRoot, {
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
})

describe("Command bugs", () => {
  describe("BUG 1: groups must be reordered by search relevance", () => {
    it("reorders groups so the best-matching group appears first", async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <Command.Input placeholder="Type..." />
          <Command.List>
            <Command.Group heading="Network">
              <Command.Item value="network-item">Network Settings</Command.Item>
            </Command.Group>
            <Command.Group heading="Display">
              <Command.Item value="display-item">Display Settings</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>,
      )

      const input = screen.getByPlaceholderText("Type...")
      await user.type(input, "network")

      await waitFor(() => {
        expect(screen.getByText("Network Settings")).toBeVisible()
      })

      const listbox = screen.getByRole("listbox")
      const groups = within(listbox).getAllByRole("presentation")
      const groupHeadings = groups.map((g) => {
        const heading = g.querySelector('[aria-hidden="true"]')
        return heading?.textContent
      })

      expect(groupHeadings[0]).toBe("Network")
    })
  })

  describe("BUG 2: forceMount items must be registered in the ids map", () => {
    it("sets aria-activedescendant when a forceMount item is selected", async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <Command.Input placeholder="Type..." />
          <Command.List>
            <Command.Item
              forceMount
              value="always-visible"
            >
              Always Visible
            </Command.Item>
          </Command.List>
        </Command>,
      )

      const input = screen.getByPlaceholderText("Type...")
      input.focus()

      await user.keyboard("{ArrowDown}")

      await waitFor(() => {
        const listbox = screen.getByRole("listbox")
        const ariaActiveDescendant = listbox.getAttribute("aria-activedescendant")
        expect(ariaActiveDescendant).toBeTruthy()
      })
    })
  })

  /**
   * ENTER KEY SELECTS ITEM: fires onSelect callback
   *   User scenario: User navigates to a command item with ArrowDown, then presses Enter.
   *     The item's onSelect callback must fire with the item's value.
   *   Regression it prevents: Enter key not selecting items
   *   Logic change: handleKeyDown in command.tsx dispatches SELECT_EVENT on Enter.
   *     CommandItem listens for SELECT_EVENT and calls onSelect. If the event chain
   *     breaks, Enter does nothing.
   */
  describe("Enter key selects the active item", () => {
    it("fires onSelect with the item value when Enter is pressed on a selected item", async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()

      render(
        <Command>
          <Command.Input placeholder="Type..." />
          <Command.List>
            <Command.Item
              value="first"
              onSelect={onSelect}
            >
              First Item
            </Command.Item>
          </Command.List>
        </Command>,
      )

      const input = screen.getByPlaceholderText("Type...")
      input.focus()

      await user.keyboard("{ArrowDown}")
      await user.keyboard("{Enter}")

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith("first")
      })
    })
  })

  /**
   * ARROW KEY NAVIGATION: ArrowDown/ArrowUp moves selection between items
   *   User scenario: User opens a command palette with multiple items. Pressing
   *     ArrowDown moves to the next item, ArrowUp moves to the previous item.
   *     The active item is indicated by aria-selected="true".
   *   Regression it prevents: Arrow keys not changing the selected item
   *   Logic change: handleKeyDown in command.tsx:428-431 calls next(e)/prev(e)
   *     which call updateSelectedByItem(1/-1). If getValidItems() or index
   *     calculation breaks, navigation silently stops working.
   */
  describe("ArrowDown/ArrowUp navigates between items", () => {
    it("changes the selected item when ArrowDown is pressed from input focus", async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <Command.Input placeholder="Type..." />
          <Command.List>
            <Command.Item value="alpha">Alpha</Command.Item>
            <Command.Item value="beta">Beta</Command.Item>
          </Command.List>
        </Command>,
      )

      const input = screen.getByPlaceholderText("Type...")
      input.focus()

      await user.keyboard("{ArrowDown}")

      await waitFor(() => {
        const listbox = screen.getByRole("listbox")
        const activeId = listbox.getAttribute("aria-activedescendant")
        expect(activeId).toBeTruthy()
      })

      const alphaOption = screen.getByText("Alpha").closest("[role='option']")
      const betaOption = screen.getByText("Beta").closest("[role='option']")
      const oneIsSelected =
        alphaOption?.getAttribute("aria-selected") === "true" ||
        betaOption?.getAttribute("aria-selected") === "true"
      expect(oneIsSelected).toBe(true)
    })
  })

  /**
   * SEARCH FILTERING: typing in the input hides non-matching items
   *   User scenario: User types "net" in a command palette with items like
   *     "Network Settings" and "Display Settings". Only "Network Settings"
   *     should remain visible.
   *   Regression it prevents: Search not filtering items (all items always visible)
   *   Logic change: filterItems in command.tsx scores items and sets visibility.
   *     If the scoring function returns wrong values, items that should be hidden
   *     remain visible.
   */
  describe("search filtering hides non-matching items", () => {
    it("hides items that do not match the search query", async () => {
      const user = userEvent.setup()

      render(
        <Command>
          <Command.Input placeholder="Type..." />
          <Command.List>
            <Command.Item value="network-settings">Network Settings</Command.Item>
            <Command.Item value="display-settings">Display Settings</Command.Item>
            <Command.Item value="audio-settings">Audio Settings</Command.Item>
          </Command.List>
        </Command>,
      )

      const input = screen.getByPlaceholderText("Type...")
      await user.type(input, "net")

      await waitFor(() => {
        expect(screen.getByText("Network Settings")).toBeInTheDocument()
      })

      const displayItem = screen.getByText("Display Settings").closest("[role='option']")
      expect(displayItem?.getAttribute("data-hidden")).toBe("true")

      const audioItem = screen.getByText("Audio Settings").closest("[role='option']")
      expect(audioItem?.getAttribute("data-hidden")).toBe("true")
    })
  })
})
