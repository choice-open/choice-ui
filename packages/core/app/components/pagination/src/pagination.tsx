import {
  PaginationItemsPerPage,
  PaginationNavigation,
  PaginationRoot,
  PaginationSpinner,
} from "./components"

// Create compound component
export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  Spinner: PaginationSpinner,
  Navigation: PaginationNavigation,
  ItemsPerPage: PaginationItemsPerPage,
})
