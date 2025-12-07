import { createContext, useContext } from "react"
import type { PaginationContextValue } from "../types"

const PaginationContext = createContext<PaginationContextValue | null>(null)

export function usePaginationContext() {
  const context = useContext(PaginationContext)
  if (!context) {
    throw new Error("Pagination components must be used within a Pagination.Root")
  }
  return context
}

export { PaginationContext }
