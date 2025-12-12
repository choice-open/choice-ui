import { Check, ChevronRightSmall } from "@choiceform/icons-react"
import { useFloatingTree, useListItem } from "@floating-ui/react"
import { forwardRef, memo, startTransition, useCallback, useContext, useMemo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenuItem, MenuItemProps } from "../components/menu-item"
import { MenuContext } from "./menu-context"

export const MenuContextSubTrigger = memo(
  forwardRef<HTMLButtonElement, MenuItemProps>((props, forwardedRef) => {
    const {
      children,
      active,
      selected,
      prefixElement,
      suffixElement = <ChevronRightSmall />,
      onClick,
      onMouseUp,
      onPointerUp,
      ...rest
    } = props

    const item = useListItem()
    const menu = useContext(MenuContext)
    const tree = useFloatingTree()
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    // If there is no menu context, throw an error
    if (!menu) {
      throw new Error("MenuContextSubTrigger must be used within a MenuContext component")
    }

    const isActive = useMemo(
      () => item.index === menu.activeIndex || !!active,
      [item.index, menu.activeIndex, active],
    )

    const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
      props.onFocus?.(event)
      menu.setHasFocusInside(true)
    })

    const closeMenu = useEventCallback(() => {
      if (menu.selection && selected !== undefined) {
        startTransition(() => {
          tree?.events.emit("click")
        })
      }
    })

    const handleClick = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (menu.readOnly) {
        return
      }

      onClick?.(event)
      closeMenu()
    })

    const handleMouseUp = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (menu.readOnly) {
        return
      }

      onMouseUp?.(event)
      closeMenu()
    })

    const handlePointerUp = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (menu.readOnly) {
        return
      }

      onPointerUp?.(event)
      closeMenu()
    })

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node

        if (typeof item.ref === "function") {
          item.ref(node)
        }

        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [item, forwardedRef],
    )

    // Prefix configuration - support selected state display
    const prefixConfig = useMemo(() => {
      if (prefixElement) return prefixElement
      if (menu.selection && selected) {
        // When in selection mode and selected, display selected marker
        return <Check />
      }
      if (menu.selection) return <></>
      return undefined
    }, [prefixElement, menu.selection, selected])

    return (
      <MenuItem
        ref={setRefs}
        active={isActive}
        selected={selected}
        suffixElement={suffixElement}
        prefixElement={prefixConfig}
        aria-haspopup="menu"
        {...menu.getItemProps({
          ...rest,
          // In selection mode, if the selected property exists (indicates it is selectable), use handleClick to close the menu
          // Otherwise keep default behavior (open submenu)
          onClick: menu.selection && selected !== undefined ? handleClick : undefined,
          onMouseUp: menu.selection && selected !== undefined ? handleMouseUp : undefined,
          onPointerUp: menu.selection && selected !== undefined ? handlePointerUp : undefined,
          onFocus: handleFocus,
          size: undefined,
        })}
      >
        {children}
      </MenuItem>
    )
  }),
)

MenuContextSubTrigger.displayName = "MenuContextSubTrigger"
