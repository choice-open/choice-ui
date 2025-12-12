import { tcx } from "@choice-ui/shared"
import { forwardRef } from "react"
import { PaginationContext } from "../context"
import { usePagination } from "../hooks"
import { paginationTv } from "../tv"
import type { PaginationRootProps } from "../types"
import { getDefaultLabels } from "../utils"

export const PaginationRoot = forwardRef<HTMLDivElement, PaginationRootProps>((props, ref) => {
  const {
    className,
    currentPage,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    maxPageButtons = 7,
    showPageSizeSelector = true,
    pageSizeOptions = [10, 20, 30, 50, 100],
    labels = {},
    loading = false,
    disabled = false,
    children,
    ...rest
  } = props

  const defaultLabels = getDefaultLabels(labels)

  // Use pagination hook
  const {
    totalPages,
    startItem,
    endItem,
    pageNumbers,
    handlePageChange,
    handleItemsPerPageChange,
    handlePageJump,
  } = usePagination({
    currentPage,
    totalItems,
    itemsPerPage,
    maxPageButtons,
    onPageChange,
    onItemsPerPageChange,
    disabled,
  })

  const tv = paginationTv()

  // Don't render if no items
  if (totalItems === 0) {
    return null
  }

  const contextValue = {
    currentPage,
    totalItems,
    itemsPerPage,
    totalPages,
    startItem,
    endItem,
    pageNumbers,
    handlePageChange,
    handleItemsPerPageChange,
    handlePageJump,
    maxPageButtons,
    showPageSizeSelector,
    pageSizeOptions,
    labels: defaultLabels,
    disabled,
    loading,
  }

  return (
    <PaginationContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
        {...rest}
      >
        {children}
      </div>
    </PaginationContext.Provider>
  )
})

PaginationRoot.displayName = "Pagination.Root"
