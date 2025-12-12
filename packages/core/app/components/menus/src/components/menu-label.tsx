import { tcx } from "@choice-ui/shared"
import { memo, ReactNode } from "react"
import { MenuLabelTv } from "../tv"

export interface MenuLabelProps {
  children?: ReactNode
  className?: string
  selection?: boolean
}

export const MenuLabel = memo(function MenuLabel({
  className,
  children,
  selection,
  ...props
}: MenuLabelProps & Omit<React.HTMLProps<HTMLDivElement>, "label">) {
  const tv = MenuLabelTv({ selection })

  return (
    <div
      className={tcx(tv, className)}
      {...props}
    >
      {children}
    </div>
  )
})

MenuLabel.displayName = "MenuLabel"
