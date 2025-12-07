import type { ButtonProps } from "@choiceform/button"
import type { HTMLProps } from "react"

// ==================== Base Types ====================

export interface PaginationLabels {
  page: string
}

export type PageNumber = number | "ellipsis"

// ==================== Component Props ====================

export interface PaginationRootProps extends Omit<HTMLProps<HTMLDivElement>, "onChange"> {
  /** Current active page (1-indexed) */
  currentPage: number
  /** Disabled state */
  disabled?: boolean
  /** Number of items per page */
  itemsPerPage?: number
  /** Custom labels */
  labels?: Partial<PaginationLabels>
  /** Loading state */
  loading?: boolean
  /** Maximum number of page buttons to display */
  maxPageButtons?: number
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Available page size options */
  pageSizeOptions?: number[]
  /** Show page size selector */
  showPageSizeSelector?: boolean
  /** Total number of items */
  totalItems: number
}

export type PaginationSpinnerProps = HTMLProps<HTMLDivElement>

export interface PaginationNavigationProps extends HTMLProps<HTMLDivElement> {
  variant?: (isActive: boolean) => ButtonProps["variant"]
}

export interface PaginationItemsPerPageProps extends Omit<HTMLProps<HTMLDivElement>, "children"> {
  asChild?: boolean
  children?: (
    value: string,
    onChange: (value: string) => void,
    disabled: boolean,
  ) => React.ReactNode
  options?: number[]
}

// ==================== Context Types ====================

export interface PaginationContextValue {
  currentPage: number
  disabled: boolean
  endItem: number
  handleItemsPerPageChange: (value: string) => void
  handlePageChange: (page: number) => void
  handlePageJump: (e: React.FormEvent<HTMLFormElement>) => void
  itemsPerPage: number
  labels: PaginationLabels
  loading: boolean
  maxPageButtons: number
  pageNumbers: PageNumber[]
  pageSizeOptions: number[]
  showPageSizeSelector: boolean
  startItem: number
  totalItems: number
  totalPages: number
}

// ==================== Hook Types ====================

export interface UsePaginationProps {
  currentPage: number
  disabled?: boolean
  itemsPerPage: number
  maxPageButtons: number
  onItemsPerPageChange?: (itemsPerPage: number) => void
  onPageChange?: (page: number) => void
  totalItems: number
}

export interface UsePaginationReturn {
  endItem: number
  handleItemsPerPageChange: (value: string) => void
  handlePageChange: (page: number) => void
  handlePageJump: (e: React.FormEvent<HTMLFormElement>) => void
  pageNumbers: PageNumber[]
  startItem: number
  totalPages: number
}
