import type { PaginationLabels } from "../types"

/**
 * Get default pagination labels
 */
export function getDefaultLabels(customLabels?: Partial<PaginationLabels>): PaginationLabels {
  return {
    page: "Page",
    ...customLabels,
  }
}

/**
 * Calculate pagination range
 */
export function calculatePaginationRange(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
): {
  endItem: number
  startItem: number
  totalPages: number
} {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return {
    startItem,
    endItem,
    totalPages,
  }
}

/**
 * Check if page navigation is disabled
 */
export function isPageDisabled(
  page: number,
  currentPage: number,
  totalPages: number,
  disabled?: boolean,
): boolean {
  if (disabled) return true
  if (page < 1 || page > totalPages) return true
  if (page === currentPage) return true
  return false
}
