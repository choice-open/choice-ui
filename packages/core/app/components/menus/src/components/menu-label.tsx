import { tcx } from "@choiceform/design-shared"
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
  const styles = MenuLabelTv({ selection })

  return (
    <div
      className={tcx(styles, className)}
      {...props}
    >
      {children}
    </div>
  )
})

MenuLabel.displayName = "MenuLabel"
