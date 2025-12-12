import { Check } from "@choiceform/icons-react"
import { useFloatingTree, useListItem } from "@floating-ui/react"
import { forwardRef, memo, startTransition, useCallback, useContext, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuItem, type MenuItemProps } from "../components/menu-item"
import { MenuContext } from "./menu-context"

export interface MenuContextItemProps extends MenuItemProps {
  customActive?: boolean
  exclusiveIndex?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onTouchStart?: (e: React.TouchEvent<HTMLButtonElement>) => void
  value?: string
}

/**
 * Generic menu item component
 *
 * Shared by Select and Dropdown, unify all interaction logic:
 * - touch event handling
 * - selection logic
 * - keyboard navigation
 * - visual state management
 */
export const MenuContextItem = memo(
  forwardRef<HTMLButtonElement, MenuContextItemProps>(
    function MenuContextItem(props, forwardedRef) {
      const {
        value = "",
        disabled,
        selected,
        size,
        shortcut,
        prefixElement,
        variant,
        onClick,
        onMouseUp,
        onTouchStart,
        onKeyDown,
        customActive,
        ...rest
      } = props

      const menu = useContext(MenuContext)
      const item = useListItem()
      const tree = useFloatingTree()

      // If there is no menu context, throw an error
      if (!menu) {
        throw new Error(
          "MenuContextItem must be used within a Menu component (SelectV2 or DropdownV2)",
        )
      }

      // Calculate active state
      const isActive = useMemo(
        () => item.index === menu.activeIndex,
        [item.index, menu.activeIndex],
      )

      // Handle click event
      const handleClick = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        // If in readOnly mode, prevent onClick from executing
        if (menu.readOnly) {
          return
        }

        onClick?.(event)

        // Use startTransition to optimize performance, avoid setTimeout
        startTransition(() => {
          tree?.events.emit("click")
        })
      })

      // Handle mouse down event (prevent event bubbling)
      const handleMouseDown = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
      })

      // Handle mouse up event
      const handleMouseUp = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onMouseUp?.(event)

        // Use startTransition to optimize performance, avoid setTimeout
        startTransition(() => {
          tree?.events.emit("click")
        })
      })

      // Handle touch start event
      const handleTouchStart = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
        onTouchStart?.(event)
      })

      // Handle keyboard event
      const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event)
      })

      // Handle focus event
      const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
        props.onFocus?.(event)
        menu.setHasFocusInside(true)
      })

      // Prefix element configuration - use reusable empty Fragment
      const prefixConfig = useMemo(() => {
        if (prefixElement !== undefined) return prefixElement
        if (menu.selection && !customActive) {
          return selected ? <Check /> : <></>
        }
        return undefined
      }, [prefixElement, menu.selection, selected, customActive])

      // Shortcut configuration
      const shortcutConfig = useMemo(
        () => ({
          modifier: shortcut?.modifier,
          keys: shortcut?.keys,
        }),
        [shortcut?.modifier, shortcut?.keys],
      )

      // Combine ref processor, handling both item.ref and forwardedRef
      const combinedRef = useCallback(
        (node: HTMLButtonElement | null) => {
          // Always need to call item.ref, for keyboard navigation of useListItem
          item.ref(node)

          // If there is forwardedRef, also call it (for registerItem of Select)
          if (forwardedRef) {
            if (typeof forwardedRef === "function") {
              forwardedRef(node)
            } else {
              forwardedRef.current = node
            }
          }
        },
        [item, forwardedRef],
      )

      return (
        <MenuItem
          {...rest}
          ref={combinedRef}
          active={isActive}
          disabled={disabled}
          selected={selected}
          prefixElement={prefixConfig}
          shortcut={shortcutConfig}
          variant={variant}
          size={size}
          {...menu.getItemProps({
            onClick: handleClick,
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
            onTouchStart: handleTouchStart,
            onKeyDown: handleKeyDown,
            onFocus: handleFocus,
          })}
        />
      )
    },
  ),
)
