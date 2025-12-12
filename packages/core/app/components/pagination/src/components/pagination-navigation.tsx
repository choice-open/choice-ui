import { Button } from "@choice-ui/button"
import { tcx } from "@choice-ui/shared"
import { EllipsisSmall } from "@choiceform/icons-react"
import { forwardRef } from "react"
import { usePaginationContext } from "../context"
import { paginationTv } from "../tv"
import type { PaginationNavigationProps } from "../types"

export const PaginationNavigation = forwardRef<HTMLDivElement, PaginationNavigationProps>(
  (props, ref) => {
    const { className, variant = (isActive) => (isActive ? "solid" : "ghost"), ...rest } = props

    const { currentPage, pageNumbers, handlePageChange, labels, disabled, loading } =
      usePaginationContext()

    const tv = paginationTv()

    return (
      <div
        ref={ref}
        className={tcx(tv.pages(), className)}
        {...rest}
      >
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className={tv.ellipsis()}
              >
                <EllipsisSmall />
              </div>
            )
          }

          const isActive = pageNumber === currentPage
          return (
            <Button
              key={pageNumber}
              variant={variant(isActive)}
              disabled={disabled}
              loading={currentPage === pageNumber && loading}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`${labels.page} ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
              className={tv.pageButton({ active: isActive })}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>
    )
  },
)

PaginationNavigation.displayName = "Pagination.Navigation"
