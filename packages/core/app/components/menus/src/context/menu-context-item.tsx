import { Check, Launch } from "@choiceform/icons-react"
import { useFloatingTree, useListItem } from "@floating-ui/react"
import { forwardRef, memo, startTransition, useCallback, useContext, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuItem, type MenuItemProps } from "../components/menu-item"
import { MenuContext } from "./menu-context"

export interface MenuContextItemProps extends MenuItemProps {
  customActive?: boolean
  exclusiveIndex?: number
  /**
   * Whether this item is a link item. When true, a link icon will be displayed on the right.
   * The actual link navigation should be handled by the onClick handler.
   */
  asLink?: boolean
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
        suffixElement,
        variant,
        asLink,
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

      // Calculate active state (customActive overrides internal activeIndex)
      const isActive = useMemo(
        () => customActive ?? item.index === menu.activeIndex,
        [customActive, item.index, menu.activeIndex],
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
      // If prefixElement exists, use it; otherwise show Check icon in selection mode
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

      // Suffix element configuration
      // Priority: suffixElement > Check icon (when prefixElement exists and selected) > Link icon (when asLink)
      const suffixConfig = useMemo(() => {
        // If suffixElement is explicitly provided, use it
        if (suffixElement !== undefined) return suffixElement

        // If prefixElement exists and in selection mode and selected, show Check icon at suffix
        if (prefixElement !== undefined && menu.selection && !customActive && selected) {
          return <Check />
        }

        // Show link icon when asLink is true
        if (asLink) {
          return <Launch className="h-3 w-3 text-current" />
        }

        return undefined
      }, [suffixElement, prefixElement, menu.selection, selected, customActive, asLink])

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
          suffixElement={suffixConfig}
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
