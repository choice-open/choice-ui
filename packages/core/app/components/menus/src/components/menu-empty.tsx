import { tcx } from "@choice-ui/shared"
import { forwardRef, memo } from "react"
import { MenuEmptyTv } from "../tv"

export interface MenuEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const MenuEmpty = memo(
  forwardRef<HTMLDivElement, MenuEmptyProps>((props, ref) => {
    const { children, className, ...rest } = props

    const tv = MenuEmptyTv()

    return (
      <div
        ref={ref}
        {...rest}
        className={tcx(tv.root(), className)}
      >
        {children}
      </div>
    )
  }),
)

MenuEmpty.displayName = "MenuEmpty"
