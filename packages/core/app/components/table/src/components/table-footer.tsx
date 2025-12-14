import { tcx } from "@choice-ui/shared"
import type { ReactNode } from "react"
import type { TableFooterProps } from "../types"

/**
 * Table footer component for additional content below rows
 * (e.g., loading indicator for infinite scroll)
 */
export function TableFooter({ children, className }: TableFooterProps): ReactNode {
  return (
    <div
      role="row"
      className={tcx("flex w-full items-center justify-center py-3", className)}
    >
      {children}
    </div>
  )
}
