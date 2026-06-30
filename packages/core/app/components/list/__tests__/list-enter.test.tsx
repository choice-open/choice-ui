import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"
import { List } from "../src/list"

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

    expect(handleClick).not.toHaveBeenCalled()

    await user.click(item1)

    await user.keyboard("{Enter}")

    expect(handleClick).toHaveBeenCalledTimes(2)

    handleClick.mockClear()

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

    await user.tab()

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")

    const item2 = screen.getByText("Item 2")
    expect(item2).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(item2)

    await user.keyboard("{Enter}")

    expect(handleClick2).toHaveBeenCalledTimes(1)
    expect(handleClick1).not.toHaveBeenCalled()
  })

  /**
   * SPACE KEY triggers onClick on non-button list items
   *   User scenario: Keyboard user navigates to a list item and presses Space.
   *     The item's onClick must fire, same as Enter.
   *   Regression it prevents: Space key not activating list items
   *   Logic change: handleKeyDown in list-item.tsx handles Space for non-button/non-anchor
   *     elements by calling onClick directly. If this branch is removed, Space does nothing.
   */
  it("should trigger onClick when pressing Space on a ListItem", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <List>
        <List.Item onClick={handleClick}>Clickable</List.Item>
      </List>,
    )

    const item = screen.getByText("Clickable")
    await user.click(item)
    handleClick.mockClear()

    item.focus()
    await user.keyboard(" ")

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /**
   * DISABLED item ignores Enter/Space
   *   User scenario: Developer renders <List.Item disabled>. Navigating to it with
   *     keyboard and pressing Enter or Space must NOT fire onClick.
   *   Regression it prevents: Disabled items still responding to keyboard activation
   *   Logic change: handleKeyDown in list-item.tsx checks disabled and returns early.
   *     If the guard is removed, disabled items can be activated.
   */
  it("does not fire onClick for a disabled item when pressing Enter", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <List>
        <List.Item onClick={handleClick}>Active</List.Item>
        <List.Item
          disabled
          onClick={handleClick}
        >
          Disabled
        </List.Item>
      </List>,
    )

    await user.tab()
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")

    const disabledItem = screen.getByText("Disabled")
    expect(disabledItem).toHaveAttribute("data-disabled")

    await user.keyboard("{Enter}")

    expect(handleClick).not.toHaveBeenCalled()
  })
})
