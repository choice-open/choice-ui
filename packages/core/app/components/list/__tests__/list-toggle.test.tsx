import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { describe, expect, it } from "vitest"
import { List } from "../src/list"

describe("List Sublist Toggle Interaction", () => {
  it("should navigate and activate list items via keyboard", async () => {
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

    await user.tab()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByText("Item 1")).toHaveAttribute("data-active", "true")

    await user.keyboard("{ArrowDown}")
    const trigger = screen.getByText("Docs")
    expect(trigger).toHaveAttribute("data-active", "true")
    expect(document.activeElement).toBe(trigger)
  })

  /**
   * CLICK TOGGLE EXPAND/COLLAPSE
   *   User scenario: User clicks a SubTrigger "Docs". The sub-content should become
   *     visible. Clicking again should hide it.
   *   Regression it prevents: SubTrigger click not toggling expand state
   *   Logic change: handleClick in list-sub-trigger.tsx calls toggleSubList(id).
   *     ListContent returns null when parentId is not expanded. If toggleSubList or
   *     isSubListExpanded breaks, clicking does nothing.
   */
  it("toggles sublist visibility on SubTrigger click", async () => {
    const user = userEvent.setup()

    render(
      <List>
        <List.SubTrigger id="files">Files</List.SubTrigger>
        <List.Content parentId="files">
          <List.Item parentId="files">file1.txt</List.Item>
        </List.Content>
      </List>,
    )

    expect(screen.queryByText("file1.txt")).not.toBeInTheDocument()

    const trigger = screen.getByText("Files")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByText("file1.txt")).toBeInTheDocument()
    })

    await user.click(trigger)

    await waitFor(() => {
      expect(screen.queryByText("file1.txt")).not.toBeInTheDocument()
    })
  })

  /**
   * DISABLED SUBTRIGGER
   *   User scenario: Developer renders <List.SubTrigger disabled>. Clicking it
   *     should not expand the sublist.
   *   Regression it prevents: Disabled triggers still responding to clicks
   *   Logic change: handleClick checks `if (!disabled && !disableCollapse)`.
   *     If the disabled guard is removed, disabled triggers can expand/collapse.
   */
  it("does not toggle sublist when SubTrigger is disabled", async () => {
    const user = userEvent.setup()

    render(
      <List>
        <List.SubTrigger
          id="settings"
          disabled
        >
          Settings
        </List.SubTrigger>
        <List.Content parentId="settings">
          <List.Item parentId="settings">General</List.Item>
        </List.Content>
      </List>,
    )

    const trigger = screen.getByText("Settings")
    expect(trigger).toBeDisabled()

    await user.click(trigger)

    expect(screen.queryByText("General")).not.toBeInTheDocument()
  })

  /**
   * DEFAULTOPEN
   *   User scenario: Developer renders <List.SubTrigger defaultOpen>. The sub-content
   *     should be visible on initial render without needing a click.
   *   Regression it prevents: defaultOpen prop having no effect
   *   Logic change: useEffect checks defaultOpen && !defaultOpenApplied.current && !isOpen,
   *     then calls toggleSubList(id). If this effect breaks, sublists start collapsed.
   */
  it("renders sublist expanded when defaultOpen is true", async () => {
    render(
      <List>
        <List.SubTrigger
          id="open-docs"
          defaultOpen
        >
          Open Docs
        </List.SubTrigger>
        <List.Content parentId="open-docs">
          <List.Item parentId="open-docs">readme.md</List.Item>
        </List.Content>
      </List>,
    )

    await waitFor(() => {
      expect(screen.getByText("readme.md")).toBeInTheDocument()
    })
  })
})
