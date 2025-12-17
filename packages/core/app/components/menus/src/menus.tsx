import { tcx } from "@choice-ui/shared"
import React, { Children, forwardRef, Fragment, HTMLProps, isValidElement } from "react"
import { MenuButton } from "./components/menu-button"
import { MenuCheckbox } from "./components/menu-checkbox"
import { MenuDivider } from "./components/menu-divider"
import { MenuInput } from "./components/menu-input"
import { MenuItem } from "./components/menu-item"
import { MenuLabel } from "./components/menu-label"
import { MenuSearch, MenuSearchEmpty } from "./components/menu-search"
import { MenuValue } from "./components/menu-value"
import { MenusTv } from "./tv"

export interface MenusProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  matchTriggerWidth?: boolean
  variant?: "default" | "light" | "reset"
}

interface MenusComponentProps extends React.ForwardRefExoticComponent<
  MenusProps & React.RefAttributes<HTMLDivElement>
> {
  Button: typeof MenuButton
  Checkbox: typeof MenuCheckbox
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof MenuItem
  Label: typeof MenuLabel
  Search: typeof MenuSearch
  SearchEmpty: typeof MenuSearchEmpty
  Value: typeof MenuValue
}

export const MenusBase = forwardRef<HTMLDivElement, MenusProps>((props, ref) => {
  const { children, className, matchTriggerWidth, variant = "default", ...rest } = props

  const tv = MenusTv({ matchTriggerWidth, variant })

  // Recursively process child components, expand all Fragments
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === Fragment) {
          return processChildren(child.props.children)
        }

        if (child.props.children) {
          return React.cloneElement(child, {
            ...child.props,
            children: processChildren(child.props.children),
          })
        }
      }
      return child
    })
  }

  const processedChildren = processChildren(children)

  return (
    <div
      ref={ref}
      role="menu"
      {...rest}
      className={tcx(tv, className)}
      data-variant={variant}
    >
      {processedChildren}
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
