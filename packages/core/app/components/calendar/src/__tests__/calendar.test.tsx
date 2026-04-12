/**
 * Calendar bug-focused tests
 *
 * BUG 4: minDate/maxDate use timestamp comparison, not day-level
 *   - User scenario: Developer sets minDate=new Date(2025, 0, 15, 12, 0, 0) (Jan 15 noon).
 *     Jan 15 calendar cell is at midnight. midnight < noon = true, so Jan 15 is disabled.
 *   - Regression it prevents: Off-by-one day errors from time components in minDate/maxDate
 *   - Logic change: Line 196 `date < minDate` compares timestamps, not day-level.
 *     Fix = compare with startOfDay(minDate).
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
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

describe("Calendar bugs", () => {
  describe("BUG 4: minDate with non-midnight time must not disable the minDate day itself", () => {
    it("keeps minDate day clickable when minDate has a non-midnight time component", async () => {
      const { MonthCalendar } = await import("../index")

      const onDateClick = vi.fn()

      render(
        <MonthCalendar
          minDate={new Date(2025, 0, 15, 12, 0, 0)}
          timeZone="UTC"
          onDateClick={onDateClick}
        />,
      )

      const jan15Cells = screen.getAllByText("15")
      const jan15Button = jan15Cells.find(
        (el) => el.getAttribute("role") === "gridcell" || el.closest("button"),
      )

      expect(jan15Button).toBeTruthy()

      const cell = jan15Button!.closest("[aria-disabled]") || jan15Button!
      const isDisabled =
        cell.getAttribute("aria-disabled") === "true" ||
        cell.closest("[data-disabled]") !== null ||
        cell.className.includes("disabled")

      expect(isDisabled).toBe(false)
    })
  })
})
