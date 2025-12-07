import { Button } from "@choiceform/button"
import { tcx } from "@choiceform/design-shared"
import { EllipsisSmall } from "@choiceform/icons-react"
import { forwardRef } from "react"
import { paginationTv } from "../tv"
import type { PaginationNavigationProps } from "../types"
import { usePaginationContext } from "./pagination-context"

export const PaginationNavigation = forwardRef<HTMLDivElement, PaginationNavigationProps>(
  (props, ref) => {
    const { className, variant = (isActive) => (isActive ? "solid" : "ghost"), ...rest } = props

    const { currentPage, pageNumbers, handlePageChange, labels, disabled, loading } =
      usePaginationContext()

    const styles = paginationTv()

    return (
      <div
        ref={ref}
        className={tcx(styles.pages(), className)}
        {...rest}
      >
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className={styles.ellipsis()}
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
              className={styles.pageButton({ active: isActive })}
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
