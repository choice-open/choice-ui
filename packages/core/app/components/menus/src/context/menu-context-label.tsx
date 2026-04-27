import { forwardRef, memo, useContext } from "react"
import { MenuLabel, MenuLabelProps } from "../components/menu-label"
import { MenuContext } from "./menu-context"

export const MenuContextLabel = memo(
  forwardRef<HTMLDivElement, MenuLabelProps>((props, ref) => {
    const menu = useContext(MenuContext)

    // If there is no menu context, throw an error
    if (!menu) {
      throw new Error("MenuContextLabel must be used within a MenuContext component")
    }

    return (
      <MenuLabel
        ref={ref}
        selection={menu.selection}
        {...props}
      />
    )
  }),
)

MenuContextLabel.displayName = "MenuContextLabel"
