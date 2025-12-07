import { useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import type { PageNumber, UsePaginationProps } from "../types"

export function usePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  maxPageButtons,
  onPageChange,
  onItemsPerPageChange,
  disabled,
}: UsePaginationProps) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: PageNumber[] = []

    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Complex pagination with ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1)
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1

      const firstPageIndex = 1
      const lastPageIndex = totalPages

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Show more pages at the start
        const leftItemCount = 3 + 2 // 3 siblings + 2 (current + right)
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
        pages.push(...leftRange, "ellipsis", lastPageIndex)
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show more pages at the end
        const rightItemCount = 3 + 2 // 3 siblings + 2 (current + left)
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1,
        )
        pages.push(firstPageIndex, "ellipsis", ...rightRange)
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show ellipsis on both sides
        const middleRange = [leftSiblingIndex, currentPage, rightSiblingIndex]
        pages.push(firstPageIndex, "ellipsis", ...middleRange, "ellipsis", lastPageIndex)
      } else {
        // This shouldn't happen with current logic
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      }
    }

    return pages
  }, [currentPage, totalPages, maxPageButtons])

  // Event handlers
  const handlePageChange = useEventCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return
    onPageChange?.(page)
  })

  const handleItemsPerPageChange = useEventCallback((value: string) => {
    const newItemsPerPage = parseInt(value, 10)
    if (isNaN(newItemsPerPage) || disabled) return

    // Calculate new current page to maintain position
    const currentFirstItem = (currentPage - 1) * itemsPerPage + 1
    const newPage = Math.ceil(currentFirstItem / newItemsPerPage)

    onItemsPerPageChange?.(newItemsPerPage)
    if (newPage !== currentPage) {
      onPageChange?.(newPage)
    }
  })

  const handlePageJump = useEventCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const pageValue = formData.get("page") as string
    const page = parseInt(pageValue, 10)

    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page)
      // Reset form
      e.currentTarget.reset()
    }
  })

  return {
    totalPages,
    startItem,
    endItem,
    pageNumbers,
    handlePageChange,
    handleItemsPerPageChange,
    handlePageJump,
  }
}
