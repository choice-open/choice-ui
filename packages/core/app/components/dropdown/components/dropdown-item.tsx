import { useFloatingTree, useListItem } from "@floating-ui/react"
import { memo, useCallback, useContext, useMemo } from "react"
import { MenuItem, type MenuItemProps } from "../../menus"
import { DropdownContext } from "../dropdown-context"
import { Check } from "@choiceform/icons-react"

export interface DropdownItemProps extends MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const DropdownItem = memo(function DropdownItem(props: DropdownItemProps) {
  const { disabled, selected, shortcut, prefixElement, variant, onClick, onMouseUp, ...rest } =
    props

  const menu = useContext(DropdownContext)
  const item = useListItem()
  const tree = useFloatingTree()

  // Use useMemo to calculate active state to avoid unnecessary renders
  const isActive = useMemo(() => item.index === menu.activeIndex, [item.index, menu.activeIndex])

  // Use useCallback to optimize event handlers
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClick?.(event)
      tree?.events.emit("click")
    },
    [onClick, tree],
  )

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }, [])

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onMouseUp?.(event)
      tree?.events.emit("click")
    },
    [onMouseUp, tree],
  )

  const handleFocus = useCallback(
    (_event: React.FocusEvent<HTMLButtonElement>) => {
      props.onFocus?.(_event)
      menu.setHasFocusInside(true)
    },
    [menu, props],
  )

  const shortcutConfig = useMemo(
    () => ({
      modifier: shortcut?.modifier,
      keys: shortcut?.keys,
    }),
    [shortcut?.modifier, shortcut?.keys],
  )

  const prefixConfig = useMemo(
    () => prefixElement || (menu.selection ? selected ? <Check /> : <></> : undefined),
    [prefixElement, menu.selection, selected],
  )

  return (
    <MenuItem
      {...rest}
      ref={item.ref}
      active={isActive}
      disabled={disabled}
      selected={selected}
      prefixElement={prefixConfig}
      shortcut={shortcutConfig}
      variant={variant}
      {...menu.getItemProps({
        onClick: handleClick,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onFocus: handleFocus,
      })}
    />
  )
})
