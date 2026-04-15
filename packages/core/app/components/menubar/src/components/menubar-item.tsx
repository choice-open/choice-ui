import { Dropdown, type DropdownProps } from "@choice-ui/dropdown"
import { tcx } from "@choice-ui/shared"
import { useDismiss, useFloating, useInteractions, type Placement } from "@floating-ui/react"
import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { useMenubarContext } from "../context"
import { MenubarTrigger } from "./menubar-trigger"

export interface MenubarItemProps extends Omit<DropdownProps, "open" | "onOpenChange"> {
  children?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  placement?: Placement
}

/**
 * MenubarItem - Child item of Menubar
 *
 * Uses @floating-ui/react's useDismiss to handle close logic
 *
 * Core logic:
 * 1. First open must be via click
 * 2. When any menu is open, hovering other triggers can switch menus
 * 3. Supports nested submenus (handled internally by Dropdown)
 * 4. Uses floating-ui's dismiss to handle outside clicks and ESC
 * 5. Supports keyboard navigation
 */
const MenubarItemComponent = memo(function MenubarItemComponent(props: MenubarItemProps) {
  const {
    children,
    placement: placementProp,
    disabled = false,
    label,
    ...itemDropdownProps
  } = props
  const {
    activeMenuId,
    hasAnyMenuOpen,
    openMenu,
    closeAllMenus,
    registerItem,
    unregisterItem,
    rootDisabled,
    dropdownProps,
  } = useMenubarContext()

  // Set default placement based on orientation
  const defaultPlacement: Placement = "bottom-start"
  const placement = placementProp ?? defaultPlacement

  const menuId = useId()
  const isOpen = activeMenuId === menuId
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)

  // Register/unregister menu item
  useEffect(() => {
    registerItem({
      id: menuId,
      disabled,
      triggerRef: triggerRef as React.RefObject<HTMLElement | null>,
    })
    return () => unregisterItem(menuId)
  }, [menuId, disabled, registerItem, unregisterItem])

  // Use floating-ui to handle dismiss logic
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        closeAllMenus()
      }
    },
  })

  // Use useDismiss to handle outside clicks and ESC
  const dismiss = useDismiss(context, {
    // Close on outside click, but exclude other items in menubar
    outsidePress: (event) => {
      // Early return if no trigger ref
      if (!triggerRef.current) return true

      const target = event.target as HTMLElement
      // Check if clicked another trigger in the menubar
      const menubar = triggerRef.current.closest('[role="menubar"]')
      if (menubar?.contains(target)) {
        // If clicked another menubar item's trigger, don't close
        // Let hover logic handle the switch
        const clickedTrigger = target.closest("[data-menubar-trigger]")
        if (clickedTrigger && clickedTrigger !== triggerRef.current) {
          return false
        }
      }
      return true
    },
    escapeKey: true,
    bubbles: {
      escapeKey: true,
      outsidePress: true,
    },
  })

  const { getFloatingProps } = useInteractions([dismiss])

  // Sync refs
  useEffect(() => {
    if (triggerRef.current) {
      refs.setReference(triggerRef.current)
    }
  }, [refs])

  useEffect(() => {
    if (contentRef.current) {
      refs.setFloating(contentRef.current)
    }
  }, [refs, isOpen])

  // Handle Dropdown's onOpenChange
  const handleOpenChange = useEventCallback((open: boolean) => {
    if (disabled || rootDisabled) return

    if (open) {
      openMenu(menuId)
    } else {
      // When closing, check if it's due to selecting a menu item
      // Dropdown internally triggers onOpenChange(false) after selection
      if (isOpen) {
        closeAllMenus()
      }
    }
  })

  // Trigger mouse enter - when a menu is open, hover can switch menus
  const handleTriggerMouseEnter = useCallback(() => {
    if (disabled || rootDisabled) return
    if (hasAnyMenuOpen && !isOpen) {
      openMenu(menuId)
    }
  }, [disabled, rootDisabled, hasAnyMenuOpen, isOpen, menuId, openMenu])

  // Merge refs
  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
      if (node) {
        refs.setReference(node)
      }
    },
    [refs],
  )

  const setContentRef = useCallback(
    (node: HTMLElement | null) => {
      contentRef.current = node
      if (node) {
        refs.setFloating(node)
      }
    },
    [refs],
  )

  // Enhance children with memoization for performance
  const enhancedChildren = useMemo(() => {
    if (label) {
      const trigger = (
        <Dropdown.Trigger
          asChild
          key="__trigger__"
          disabled={disabled || rootDisabled}
        >
          <MenubarTrigger
            ref={setTriggerRef}
            data-menubar-trigger=""
            active={isOpen}
            disabled={disabled || rootDisabled}
            className={tcx("data-[multi-element=true]:border-transparent")}
            onMouseEnter={handleTriggerMouseEnter}
          >
            {label}
          </MenubarTrigger>
        </Dropdown.Trigger>
      )

      const items = Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        if (child.type === MenubarItem) {
          return (
            <Dropdown.Item
              key={child.key ?? undefined}
              {...child.props}
              onClick={() => {}}
            >
              {child.props.children}
            </Dropdown.Item>
          )
        }
        return child
      })

      const content = <Dropdown.Content key="__content__">{items}</Dropdown.Content>

      return [trigger, content]
    }

    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child

      if (child.type === MenubarTrigger) {
        const childProps = child.props as { ref?: React.Ref<HTMLElement> }
        const originalRef = childProps.ref
        return (
          <Dropdown.Trigger
            asChild
            disabled={disabled || rootDisabled}
          >
            {cloneElement(child, {
              ...child.props,
              "data-menubar-trigger": "",
              active: isOpen,
              disabled: disabled || rootDisabled,
              className: tcx("data-[multi-element=true]:border-transparent", child.props.className),
              ref: (node: HTMLElement | null) => {
                setTriggerRef(node)
                if (typeof originalRef === "function") {
                  originalRef(node)
                } else if (originalRef && typeof originalRef === "object") {
                  ;(originalRef as React.MutableRefObject<HTMLElement | null>).current = node
                }
              },
              onMouseEnter: (e: React.MouseEvent) => {
                child.props.onMouseEnter?.(e)
                handleTriggerMouseEnter()
              },
            } as React.HTMLAttributes<HTMLElement>)}
          </Dropdown.Trigger>
        )
      }

      if (child.type === Dropdown.Content) {
        const childProps = child.props as { ref?: React.Ref<HTMLElement> }
        const originalRef = childProps.ref
        const floatingProps = getFloatingProps()
        return cloneElement(child, {
          ...child.props,
          ...floatingProps,
          ref: (node: HTMLElement | null) => {
            setContentRef(node)
            if (typeof originalRef === "function") {
              originalRef(node)
            } else if (originalRef && typeof originalRef === "object") {
              ;(originalRef as React.MutableRefObject<HTMLElement | null>).current = node
            }
          },
        } as React.HTMLAttributes<HTMLElement>)
      }

      return child
    })
  }, [
    children,
    label,
    disabled,
    rootDisabled,
    isOpen,
    setTriggerRef,
    setContentRef,
    handleTriggerMouseEnter,
    getFloatingProps,
  ])

  return (
    <Dropdown
      {...dropdownProps}
      {...itemDropdownProps}
      placement={placement}
      open={isOpen && !disabled}
      onOpenChange={handleOpenChange}
      focusManagerProps={{
        modal: false,
        returnFocus: true,
      }}
    >
      {enhancedChildren}
    </Dropdown>
  )
})

MenubarItemComponent.displayName = "MenubarItem"

export const MenubarItem = MenubarItemComponent
