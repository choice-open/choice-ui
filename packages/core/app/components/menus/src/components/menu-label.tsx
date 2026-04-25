import { tcx } from "@choice-ui/shared"
import { forwardRef, memo, ReactNode } from "react"
import { MenuLabelTv } from "../tv"

export interface MenuLabelProps {
  children?: ReactNode
  className?: string
  selection?: boolean
}

type MenuLabelDOMProps = MenuLabelProps & Omit<React.HTMLProps<HTMLDivElement>, "label">

export const MenuLabel = memo(
  forwardRef<HTMLDivElement, MenuLabelDOMProps>(
    ({ className, children, selection, ...props }, ref) => {
      const tv = MenuLabelTv({ selection })

      return (
        <div
          ref={ref}
          className={tcx(tv, className)}
          {...props}
        >
          {children}
        </div>
      )
    },
  ),
)

MenuLabel.displayName = "MenuLabel"
