import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps } from "react"
import { MenuDividerTv } from "../tv"

export const MenuDivider = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const tv = MenuDividerTv()

  return (
    <div
      ref={ref}
      className={tcx(tv.root(), className)}
      aria-hidden="true"
      {...rest}
    >
      <div className={tv.divider()} />
    </div>
  )
})

MenuDivider.displayName = "MenuDivider"
