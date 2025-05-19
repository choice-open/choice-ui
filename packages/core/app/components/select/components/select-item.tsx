import { Check } from "@choiceform/icons-react"
import { forwardRef, memo, useMemo } from "react"
import { MenuItem, type MenuItemProps } from "../../menus"

export interface SelectItemPublicProps extends MenuItemProps {
  value?: string
  disabled?: boolean
  active?: boolean
  selected?: boolean
  customActive?: boolean
}

export const SelectItem = memo(
  forwardRef<HTMLButtonElement, SelectItemPublicProps>((props, ref) => {
    const { selected, children, customActive, ...rest } = props

    const shortcutConfig = useMemo(
      () => ({
        modifier: props.shortcut?.modifier,
        keys: props.shortcut?.keys,
      }),
      [props.shortcut?.modifier, props.shortcut?.keys],
    )

    const prefixConfig = useMemo(
      () => props.prefixElement || (customActive ? false : selected ? <Check /> : <></>),
      [props.prefixElement, selected, customActive],
    )

    return (
      <MenuItem
        ref={ref}
        shortcut={shortcutConfig}
        prefixElement={prefixConfig}
        {...rest}
      >
        {children}
      </MenuItem>
    )
  }),
)

SelectItem.displayName = "SelectItem"
