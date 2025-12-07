import { forwardRef, HTMLProps } from "react"
import { MenusBase } from "../menus"

interface MenuContextContentProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  matchTriggerWidth?: boolean
}

export const MenuContextContent = forwardRef<HTMLDivElement, MenuContextContentProps>(
  function MenuContextContent(props, ref) {
    const { children, className, matchTriggerWidth, ...rest } = props

    return (
      <MenusBase
        ref={ref}
        matchTriggerWidth={matchTriggerWidth}
        className={className}
        {...rest}
      >
        {children}
      </MenusBase>
    )
  },
)

MenuContextContent.displayName = "MenuContextContent"
