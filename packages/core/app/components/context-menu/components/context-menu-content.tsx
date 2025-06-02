import * as CM from "@radix-ui/react-context-menu"
import { forwardRef, ReactNode } from "react"
import { tcx } from "~/utils/tcx"
import { MenusTv } from "../../menus/tv"

export interface ContextMenuContentProps {
  align?: "start" | "center" | "end"
  alignOffset?: number
  children: ReactNode
  className?: string
  sideOffset?: number
}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ children, className, sideOffset = 5, align = "start", alignOffset }, ref) => {
    const styles = MenusTv()

    return (
      <CM.Portal>
        <CM.Content
          ref={ref}
          className={tcx(styles, className)}
          loop={true}
          data-side-offset={sideOffset}
          data-align={align}
          data-align-offset={alignOffset}
        >
          {children}
        </CM.Content>
      </CM.Portal>
    )
  },
)
ContextMenuContent.displayName = "ContextMenuContent"
