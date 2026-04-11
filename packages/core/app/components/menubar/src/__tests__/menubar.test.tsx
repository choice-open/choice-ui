/**
 * Menubar bug-focused tests
 *
 * BUG 3: returnFocus=false causes focus loss when dropdown closes via Escape
 *   - User scenario: Keyboard user opens a menubar dropdown, presses Escape.
 *     Focus goes to document.body instead of back to the trigger button.
 *     User must Tab from the top of the page to get back.
 *   - Regression it prevents: Keyboard navigation dead-end in menubar
 *   - Logic change that makes it fail: menubar-item.tsx line 248 hardcodes
 *     `returnFocus: false`. Fix = set `returnFocus: true`.
 */
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}))

describe("Menubar bugs", () => {
  describe("BUG 3: focus must return to trigger after Escape closes dropdown", () => {
    it("returns focus to the menubar trigger button after pressing Escape", async () => {
      const { Menubar } = await import("../menubar")
      const user = userEvent.setup()

      render(
        <Menubar>
          <Menubar.Item label="File">
            <Menubar.Item label="New">New File</Menubar.Item>
            <Menubar.Item label="Open">Open File</Menubar.Item>
          </Menubar.Item>
          <Menubar.Item label="Edit">
            <Menubar.Item label="Undo">Undo</Menubar.Item>
          </Menubar.Item>
        </Menubar>,
      )

      const fileTrigger = screen.getByText("File")
      await user.click(fileTrigger)

      await waitFor(
        () => {
          expect(screen.getByText("New File")).toBeInTheDocument()
        },
        { timeout: 3000 },
      )

      await user.keyboard("{Escape}")

      await waitFor(() => {
        expect(document.activeElement).toBe(fileTrigger)
      })
    })
  })
})
