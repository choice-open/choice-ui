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
})
