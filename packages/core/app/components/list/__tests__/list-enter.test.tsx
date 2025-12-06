import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { List } from "../list"

describe("List Enter Key Interaction", () => {
  it("should trigger onClick when pressing Enter on a ListItem", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <List>
        <List.Item onClick={handleClick}>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )

    const item1 = screen.getByText("Item 1")

    // Initial state: not called
    expect(handleClick).not.toHaveBeenCalled()

    // Tab to focus the first item (or click to focus if needed, but keyboard nav is key here)
    // List implements roving tabindex, so we might need to focus the list or item first.
    // The ListRoot has tabIndex={0}, and handles keys.
    // Let's try clicking to set focus/active item first to simulate user entering the list.
    await user.click(item1)

    // Now press Enter
    await user.keyboard("{Enter}")

    expect(handleClick).toHaveBeenCalledTimes(2) // Once for click, once for Enter?
    // Actually, if it's a button, click triggers it.
    // If the bug exists, Enter might be prevented by the parent hook.

    // Let's reset and try purely keyboard
    handleClick.mockClear()

    // Focus the item (if possible directly, otherwise tab into it)
    item1.focus()
    await user.keyboard("{Enter}")

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("should trigger onClick on the active item after keyboard navigation", async () => {
    const user = userEvent.setup()
    const handleClick1 = vi.fn()
    const handleClick2 = vi.fn()

    render(
      <List>
        <List.Item onClick={handleClick1}>Item 1</List.Item>
        <List.Item onClick={handleClick2}>Item 2</List.Item>
      </List>,
    )

    // Focus via Tab
    await user.tab()

    // Note: Behavior depends on whether focus lands on ListRoot or Item1.
    // If ListRoot has tabindex=0, it might land there.

    // activeItem starts null. First ArrowDown sets Item 1.
    await user.keyboard("{ArrowDown}")
    // Second ArrowDown sets Item 2.
    await user.keyboard("{ArrowDown}")

    const item2 = screen.getByText("Item 2")
    expect(item2).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(item2) // Verify focus moved!

    // Press Enter
    await user.keyboard("{Enter}")

    // Verification
    // If bug "toggles first item" exists, handleClick1 might be called.
    // If correct, handleClick2 should be called.

    if (handleClick1.mock.calls.length > 0) {
      console.log("Bug confirmed: Item 1 clicked instead of Item 2")
    }

    expect(handleClick2).toHaveBeenCalledTimes(1)
    expect(handleClick1).not.toHaveBeenCalled()
  })
})
