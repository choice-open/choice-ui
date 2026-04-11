/**
 * Panel bug-focused tests
 *
 * BUG 1: aria-hidden on title text makes collapse button unlabeled
 *   - User scenario: Developer renders a collapsible Panel with a title. The title
 *     button has its text wrapped in `<span aria-hidden="true">`, removing it from
 *     the accessibility tree. Screen readers announce an unnamed button.
 *   - Regression it prevents: Collapsible panel buttons invisible to screen readers
 *   - Logic change: panel-title.tsx:41 — `<span aria-hidden="true">{title}</span>`.
 *     Fix = remove aria-hidden, or add aria-label to the button.
 *
 * BUG 2: Clicking action buttons triggers collapse via mousedown bubbling
 *   - User scenario: Panel has action buttons (e.g., settings gear) in the title area.
 *     User clicks the settings button. The mousedown event bubbles up to the outer div
 *     which has `onMouseDown={handleMouseDown}`, toggling the collapse state.
 *   - Regression it prevents: Action button clicks collapsing the panel
 *   - Logic change: panel-title.tsx:72 — `onMouseDown` on the outer wrapper div with
 *     no target filtering. Fix = stopPropagation on action buttons or check event target.
 *
 * BUG 3: aria-expanded on non-collapsible panels (!undefined = true)
 *   - User scenario: Developer renders <Panel> without collapsible. The panel div
 *     gets `aria-expanded={!isCollapsed}`. Since `isCollapsed` is `undefined`,
 *     `!undefined = true`, so screen readers announce the panel as expanded.
 *   - Regression it prevents: Non-collapsible panels incorrectly announced as expandable
 *   - Logic change: panel.tsx:126 — `aria-expanded={!isCollapsed}` always rendered.
 *     Fix = `aria-expanded={collapsible ? !isCollapsed : undefined}`.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Panel } from "../panel"

describe("Panel bugs", () => {
  describe("BUG 1: collapsible title button must have an accessible name", () => {
    it("does not use aria-hidden on the title text inside the button", () => {
      render(
        <Panel
          collapsible
          isCollapsed={false}
        >
          <Panel.Title title="Settings" />
        </Panel>,
      )

      const button = screen.getByRole("button")
      expect(button).toBeTruthy()

      const hiddenSpan = button.querySelector("[aria-hidden]")
      expect(hiddenSpan).toBeNull()

      expect(button).toHaveTextContent("Settings")
    })
  })

  describe("BUG 2: clicking action buttons must NOT trigger collapse", () => {
    it("does not call onCollapsedChange when an action button is clicked", async () => {
      const onCollapsedChange = vi.fn()
      const user = userEvent.setup()

      render(
        <Panel
          collapsible
          isCollapsed={false}
          onCollapsedChange={onCollapsedChange}
        >
          <Panel.Title
            title="Settings"
            onHeaderClick={() => {}}
          >
            <button data-testid="action-btn">Action</button>
          </Panel.Title>
        </Panel>,
      )

      const actionBtn = screen.getByTestId("action-btn")
      await user.click(actionBtn)

      expect(onCollapsedChange).not.toHaveBeenCalled()
    })
  })

  describe("BUG 3: non-collapsible panel must NOT have aria-expanded", () => {
    it("does not set aria-expanded when collapsible is not set", () => {
      const { container } = render(
        <Panel>
          <Panel.Title title="Info" />
        </Panel>,
      )

      const panelDiv = container.querySelector("[aria-expanded]")
      expect(panelDiv).toBeNull()
    })
  })
})
