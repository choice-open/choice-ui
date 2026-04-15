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
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

  /**
   * DATE CLICK SELECTION (single mode)
   *   User scenario: User clicks a day cell in the calendar. The onDateClick callback
   *     fires with the clicked date, and the cell becomes visually selected.
   *   Regression it prevents: Clicking a date does nothing (selection broken)
   *   Logic change: MonthCalendarDateCell's handleClick calls onDateClick(date).
   *     MonthCalendar's handleDateClick calls updateInternalValue(date) in single mode.
   *     If the click chain breaks, dates can't be selected.
   */
  describe("date click selection", () => {
    it("calls onChange with the selected date when a cell is clicked", async () => {
      const { MonthCalendar } = await import("../index")
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <MonthCalendar
          currentMonth={new Date(2025, 0, 1)}
          timeZone="UTC"
          onChange={onChange}
        />,
      )

      const cell15 = screen.getByTestId("2025-1-15")
      await user.click(cell15)

      expect(onChange).toHaveBeenCalledTimes(1)
      const selectedDate = onChange.mock.calls[0][0]
      expect(selectedDate).toBeInstanceOf(Date)
      expect(selectedDate.getDate()).toBe(15)
      expect(selectedDate.getMonth()).toBe(0)
    })
  })

  /**
   * READONLY MODE
   *   User scenario: Developer renders <MonthCalendar readOnly>. Clicking a date cell
   *     should NOT trigger any selection change.
   *   Regression it prevents: Calendar still selectable in readOnly mode
   *   Logic change: handleDateClick starts with `if (readOnly) return`. If this guard
   *     is removed, readOnly calendar allows selection.
   */
  describe("readOnly mode", () => {
    it("does not call onDateClick when readOnly is true and a cell is clicked", async () => {
      const { MonthCalendar } = await import("../index")
      const user = userEvent.setup()
      const onDateClick = vi.fn()

      render(
        <MonthCalendar
          currentMonth={new Date(2025, 0, 1)}
          readOnly
          timeZone="UTC"
          onDateClick={onDateClick}
        />,
      )

      const cell15 = screen.getByTestId("2025-1-15")
      await user.click(cell15)

      expect(onDateClick).not.toHaveBeenCalled()
    })
  })

  /**
   * DISABLEDDATES
   *   User scenario: Developer passes disabledDates=[jan20]. The cell for Jan 20
   *     should have data-disabled attribute and clicking it should not fire onDateClick.
   *   Regression it prevents: Disabled dates remaining clickable
   *   Logic change: isDateDisabled checks disabledDates array. handleDateClick checks
   *     `if (isDateDisabled(date)) return`. If either breaks, disabled dates are clickable.
   */
  describe("disabled dates", () => {
    it("marks disabled dates and prevents their selection", async () => {
      const { MonthCalendar } = await import("../index")
      const user = userEvent.setup()
      const onDateClick = vi.fn()

      render(
        <MonthCalendar
          currentMonth={new Date(2025, 0, 1)}
          disabledDates={[new Date(2025, 0, 20)]}
          timeZone="UTC"
          onDateClick={onDateClick}
        />,
      )

      const cell20 = screen.getByTestId("2025-1-20")
      expect(cell20.closest("[data-disabled]")).toBeTruthy()

      await user.click(cell20)

      expect(onDateClick).not.toHaveBeenCalled()
    })
  })
})
