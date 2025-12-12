import { tcx } from "@choice-ui/shared"
import { Segmented } from "@choice-ui/segmented"
import { forwardRef } from "react"
import type { PaginationItemsPerPageProps } from "../types"
import { usePaginationContext } from "../context"

export const PaginationItemsPerPage = forwardRef<HTMLDivElement, PaginationItemsPerPageProps>(
  (props, ref) => {
    const { className, options, asChild, children, ...rest } = props

    const {
      itemsPerPage,
      handleItemsPerPageChange,
      pageSizeOptions: contextOptions,
      showPageSizeSelector,
      disabled,
    } = usePaginationContext()

    const sizeOptions = options || contextOptions

    if (!showPageSizeSelector) {
      return null
    }

    return (
      <div
        ref={ref}
        className={tcx("flex items-center gap-2", className)}
        {...rest}
      >
        {asChild ? (
          children?.(itemsPerPage.toString(), handleItemsPerPageChange, disabled)
        ) : (
          <Segmented
            value={itemsPerPage.toString()}
            onChange={handleItemsPerPageChange}
            disabled={disabled}
          >
            {sizeOptions.map((option) => (
              <Segmented.Item
                key={option}
                value={option.toString()}
                className="px-2"
              >
                {option}
              </Segmented.Item>
            ))}
          </Segmented>
        )}
      </div>
    )
  },
)

PaginationItemsPerPage.displayName = "Pagination.ItemsPerPage"
