import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { List } from "../list"

describe("List Sublist Toggle Interaction", () => {
  it("should maintain focus on trigger after toggling via keyboard", async () => {
    const user = userEvent.setup()

    render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.SubTrigger id="docs">Docs</List.SubTrigger>
        <List.Content parentId="docs">
          <List.Item parentId="docs">SubItem 1</List.Item>
        </List.Content>
        <List.Item>Item 3</List.Item>
      </List>,
    )

    // Focus first item logic:
    // Tab focuses ListRoot. Then any key activates first item if none active.
    await user.tab()
    // First ArrowDown activates Item 1 (index 0)
    await user.keyboard("{ArrowDown}")
    expect(screen.getByText("Item 1")).toHaveAttribute("data-active", "true")

    // Navigate to SubTrigger (index 1)
    await user.keyboard("{ArrowDown}")
    const trigger = screen.getByText("Docs")
    expect(trigger).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(trigger)

    // Expands (ArrowRight)
    await user.keyboard("{ArrowRight}")

    // Should still be active and focused
    expect(trigger).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(trigger)
    expect(trigger).toHaveAttribute("data-open", "true")

    // Collapse (ArrowRight to toggle)
    await user.keyboard("{ArrowRight}")
    expect(trigger).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(trigger)
    expect(trigger).toHaveAttribute("data-open", "false")
  })
})
