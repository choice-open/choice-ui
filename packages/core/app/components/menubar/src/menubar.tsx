import { tcx } from "@choice-ui/shared"
import { FloatingTree, useFloatingParentNodeId } from "@floating-ui/react"
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react"
import { forwardRef, memo, useCallback, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { MenubarDivider } from "./components/menubar-divider"
import { MenubarItem } from "./components/menubar-item"
import { MenubarTrigger } from "./components/menubar-trigger"
import {
  MenubarContext,
  type MenubarContextType,
  type MenubarDropdownProps,
  type MenubarItemInfo,
} from "./context"
import { menubarTv } from "./tv"

export interface MenubarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Child elements */
  children?: ReactNode
  /** Whether the menubar is disabled */
  disabled?: boolean
  /** Whether to loop focus when navigating */
  loopFocus?: boolean
  /** Props to pass to all Dropdown components */
  dropdownProps?: MenubarDropdownProps
}

type MenubarComponentType = React.ForwardRefExoticComponent<
  MenubarProps & React.RefAttributes<HTMLDivElement>
> & {
  Divider: typeof MenubarDivider
  Item: typeof MenubarItem
  Trigger: typeof MenubarTrigger
}

/**
 * Menubar inner component
 */
const MenubarInner = memo(
  forwardRef<HTMLDivElement, MenubarProps>(function MenubarInner(props, ref) {
    const {
      className,
      children,
      disabled = false,
      loopFocus = true,
      dropdownProps,
      ...rest
    } = props

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const itemsRef = useRef<Map<string, MenubarItemInfo>>(new Map())
    const itemOrderRef = useRef<string[]>([])

    // Derived state
    const hasAnyMenuOpen = activeMenuId !== null

    // Open menu
    const openMenu = useEventCallback((id: string) => {
      if (disabled) return
      setActiveMenuId(id)
    })

    // Close all menus
    const closeAllMenus = useEventCallback(() => {
      setActiveMenuId(null)
    })

    // Register menu item
    const registerItem = useEventCallback((info: MenubarItemInfo) => {
      itemsRef.current.set(info.id, info)
      // Maintain registration order
      if (!itemOrderRef.current.includes(info.id)) {
        itemOrderRef.current.push(info.id)
      }
    })

    // Unregister menu item
    const unregisterItem = useEventCallback((id: string) => {
      itemsRef.current.delete(id)
      itemOrderRef.current = itemOrderRef.current.filter((itemId) => itemId !== id)
    })

    // Get enabled menu items (non-disabled)
    const getEnabledItems = useEventCallback(() => {
      return itemOrderRef.current.filter((id) => {
        const item = itemsRef.current.get(id)
        return item && !item.disabled
      })
    })

    // Get current focus index
    const getCurrentIndex = useCallback(() => {
      const enabledItems = getEnabledItems()
      if (!activeMenuId) return -1
      return enabledItems.indexOf(activeMenuId)
    }, [activeMenuId, getEnabledItems])

    // Navigate to next menu item
    const navigateNext = useEventCallback(() => {
      const enabledItems = getEnabledItems()
      if (enabledItems.length === 0) return

      const currentIndex = getCurrentIndex()
      let nextIndex: number

      if (currentIndex === -1) {
        // No current item, start from the first
        nextIndex = 0
      } else if (currentIndex === enabledItems.length - 1) {
        // Last item, loop or stay
        nextIndex = loopFocus ? 0 : currentIndex
      } else {
        nextIndex = currentIndex + 1
      }

      const nextId = enabledItems[nextIndex]
      if (nextId) {
        openMenu(nextId)
        // Focus the corresponding trigger
        const item = itemsRef.current.get(nextId)
        item?.triggerRef.current?.focus()
      }
    })

    // Navigate to previous menu item
    const navigatePrev = useEventCallback(() => {
      const enabledItems = getEnabledItems()
      if (enabledItems.length === 0) return

      const currentIndex = getCurrentIndex()
      let prevIndex: number

      if (currentIndex === -1) {
        // No current item, start from the last
        prevIndex = enabledItems.length - 1
      } else if (currentIndex === 0) {
        // First item, loop or stay
        prevIndex = loopFocus ? enabledItems.length - 1 : 0
      } else {
        prevIndex = currentIndex - 1
      }

      const prevId = enabledItems[prevIndex]
      if (prevId) {
        openMenu(prevId)
        // Focus the corresponding trigger
        const item = itemsRef.current.get(prevId)
        item?.triggerRef.current?.focus()
      }
    })

    // Keyboard event handler
    const handleKeyDown = useEventCallback((e: KeyboardEvent<HTMLDivElement>) => {
      // Only handle keyboard navigation when a menu is open
      if (!hasAnyMenuOpen) return

      // Skip if event was already handled (e.g., by useListNavigation for submenu expansion)
      if (e.defaultPrevented) return

      const nextKey = "ArrowRight"
      const prevKey = "ArrowLeft"

      // Handle arrow key navigation
      if (e.key === nextKey) {
        e.preventDefault()
        navigateNext()
      } else if (e.key === prevKey) {
        e.preventDefault()
        navigatePrev()
      }
    })

    // Context value - memoized to prevent unnecessary re-renders
    const contextValue = useMemo<MenubarContextType>(
      () => ({
        activeMenuId,
        closeAllMenus,
        dropdownProps: dropdownProps ?? {},
        hasAnyMenuOpen,
        loopFocus,
        navigateNext,
        navigatePrev,
        openMenu,
        registerItem,
        rootDisabled: disabled,
        unregisterItem,
      }),
      [
        activeMenuId,
        closeAllMenus,
        disabled,
        dropdownProps,
        hasAnyMenuOpen,
        loopFocus,
        navigateNext,
        navigatePrev,
        openMenu,
        registerItem,
        unregisterItem,
      ],
    )

    const tv = menubarTv({ disabled })

    return (
      <MenubarContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="menubar"
          data-disabled={disabled ? "" : undefined}
          className={tcx(tv.root(), className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </MenubarContext.Provider>
    )
  }),
)

/**
 * Menubar - Horizontal/vertical menu bar component
 *
 * Uses @floating-ui/react's FloatingTree to manage menu hierarchy
 *
 * Features:
 * - Click to open initially
 * - Hover to switch menus when one is already open
 * - Supports nested submenus
 * - Supports horizontal/vertical orientation
 * - Supports keyboard navigation (arrow keys)
 */
const MenubarBase = forwardRef<HTMLDivElement, MenubarProps>(function Menubar(props, ref) {
  const parentId = useFloatingParentNodeId()

  // If already inside a FloatingTree, render directly
  if (parentId !== null) {
    return (
      <MenubarInner
        ref={ref}
        {...props}
      />
    )
  }

  // Otherwise wrap in FloatingTree
  return (
    <FloatingTree>
      <MenubarInner
        ref={ref}
        {...props}
      />
    </FloatingTree>
  )
})

// Memo wrapper
const MemoizedMenubar = memo(MenubarBase) as unknown as MenubarComponentType

// Add static properties
MemoizedMenubar.displayName = "Menubar"

export const Menubar = Object.assign(MemoizedMenubar, {
  Divider: MenubarDivider,
  Item: MenubarItem,
  Trigger: MenubarTrigger,
}) as MenubarComponentType
