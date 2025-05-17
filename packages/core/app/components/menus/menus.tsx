import { forwardRef, HTMLProps } from "react"
import { tcx } from "~/utils"
import {
  MenuButton,
  MenuCheckbox,
  MenuDivider,
  MenuInput,
  MenuItem,
  MenuLabel,
  MenuSearch,
  MenuSearchEmpty,
  MenuValue,
} from "./components"
import { MenusTv } from "./tv"

interface MenusProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  matchTriggerWidth?: boolean
}

interface MenusComponentProps
  extends React.ForwardRefExoticComponent<MenusProps & React.RefAttributes<HTMLDivElement>> {
  Item: typeof MenuItem
  Button: typeof MenuButton
  Checkbox: typeof MenuCheckbox
  Divider: typeof MenuDivider
  Label: typeof MenuLabel
  Search: typeof MenuSearch
  SearchEmpty: typeof MenuSearchEmpty
  Input: typeof MenuInput
  Value: typeof MenuValue
}

export const MenusBase = forwardRef<HTMLDivElement, MenusProps>((props, ref) => {
  const { children, className, matchTriggerWidth, ...rest } = props

  const styles = MenusTv({ matchTriggerWidth })

  return (
    <div
      ref={ref}
      role="menu"
      {...rest}
      className={tcx(styles, className)}
    >
      {children}
    </div>
  )
})

MenusBase.displayName = "Menus"

const Menus = MenusBase as MenusComponentProps
Menus.Item = MenuItem
Menus.Button = MenuButton
Menus.Checkbox = MenuCheckbox
Menus.Divider = MenuDivider
Menus.Label = MenuLabel
Menus.Search = MenuSearch
Menus.SearchEmpty = MenuSearchEmpty
Menus.Input = MenuInput
Menus.Value = MenuValue
export { Menus }
