/**
 * Pagination bug-focused tests
 *
 * BUG 1: Double page change when clicking prev/next while editing spinner input
 *   - User scenario: User clicks the page number to edit it, then clicks the next/prev
 *     button to navigate instead of confirming their edit.
 *   - Regression it prevents: Both the input's onBlur handler and the button's onClick
 *     handler fire, causing onPageChange to be called twice and skipping a page.
 *   - Logic change that makes it fail: pagination-spinner.tsx lines 83-85: handleInputBlur
 *     calls submitPageChange unconditionally on blur, and lines 87-97: handlePrevious/
 *     handleNext also call handlePageChange. When a button click steals focus from the
 *     input, both handlers execute. Fix = track whether the blur is caused by an internal
 *     button click and skip the submit in that case.
 *
 * BUG 2: Disabled pagination spinner still allows entering edit mode
 *   - User scenario: Pagination is disabled (loading, permissions, etc.), user clicks
 *     the page number and expects no interaction.
 *   - Regression it prevents: Clicking the spinner in a disabled pagination enters edit
 *     mode, showing an input field that the user can interact with.
 *   - Logic change that makes it fail: pagination-spinner.tsx lines 118-122: the onClick
 *     handler on the input wrapper checks `!isEditing` but never checks `disabled`.
 *     Fix = add `|| disabled` to the guard condition.
 *
 * BUG 3: Clicking prev/next must call onPageChange with correct page number
 *   - User scenario: User is on page 5 and clicks "Next page". onPageChange should
 *     fire with page 6. Clicks "Previous page" — should fire with page 4.
 *   - Regression it prevents: Navigation buttons not triggering page change
 *   - Logic change: If PaginationNavigation stops calling onPageChange on button click.
 */
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Pagination } from "../pagination"

function renderPagination(overrides: { currentPage?: number; disabled?: boolean } = {}) {
  const onPageChange = vi.fn()
  const { currentPage = 5, disabled = false } = overrides

  const result = render(
    <Pagination
      currentPage={currentPage}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
      disabled={disabled}
    >
      <Pagination.Spinner />
    </Pagination>,
  )

  return { onPageChange, ...result }
}

describe("Pagination bugs", () => {
  describe("BUG 1: double page change when clicking prev/next while editing spinner", () => {
    it("calls onPageChange only once when user edits input then clicks next", async () => {
      const user = userEvent.setup()
      const { onPageChange } = renderPagination({ currentPage: 5 })

      await user.click(screen.getByText("5"))
      const input = screen.getByRole("spinbutton")
      await user.clear(input)
      await user.type(input, "3")

      await user.click(screen.getByLabelText("Next page"))

      expect(onPageChange).toHaveBeenCalledTimes(1)
    })

    it("calls onPageChange only once when user edits input then clicks previous", async () => {
      const user = userEvent.setup()
      const { onPageChange } = renderPagination({ currentPage: 5 })

      await user.click(screen.getByText("5"))
      const input = screen.getByRole("spinbutton")
      await user.clear(input)
      await user.type(input, "7")

      await user.click(screen.getByLabelText("Previous page"))

      expect(onPageChange).toHaveBeenCalledTimes(1)
    })
  })

  describe("BUG 2: disabled pagination spinner still allows entering edit mode", () => {
    it("does not show an input when clicking the page number while disabled", async () => {
      const user = userEvent.setup()
      renderPagination({ disabled: true })

      const pageNumber = screen.getByText("5")
      await user.click(pageNumber)

      expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument()
    })
  })

  describe("BUG 3: clicking prev/next must call onPageChange", () => {
    it("calls onPageChange with next page when Next is clicked", async () => {
      const user = userEvent.setup()
      const { onPageChange } = renderPagination({ currentPage: 5 })

      await user.click(screen.getByLabelText("Next page"))

      expect(onPageChange).toHaveBeenCalledWith(6)
    })

    it("calls onPageChange with previous page when Previous is clicked", async () => {
      const user = userEvent.setup()
      const { onPageChange } = renderPagination({ currentPage: 5 })

      await user.click(screen.getByLabelText("Previous page"))

      expect(onPageChange).toHaveBeenCalledWith(4)
    })
  })
})
