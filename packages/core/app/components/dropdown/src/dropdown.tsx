import { getDocument, tcx } from "@choice-ui/shared"
import { Slot } from "@choice-ui/slot"
import {
  MenuButton,
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuContextSubTrigger,
  MenuDivider,
  MenuInput,
  MenuScrollArrow,
  MenuSearch,
  MenuTrigger,
  MenuValue,
  useMenuBaseRefs,
  useMenuScroll,
  useMenuScrollHeight,
  useMenuTree,
} from "@choice-ui/menus"
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingParentNodeId,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingFocusManagerProps,
  type Placement,
} from "@floating-ui/react"
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { useIsomorphicLayoutEffect } from "@choice-ui/shared"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface DropdownProps {
  /**
   * Whether to automatically select the first item in coordinate mode.
   * @default true
   */
  autoSelectFirstItem?: boolean
  children?: React.ReactNode
  disabledNested?: boolean
  focusManagerProps?: Partial<FloatingFocusManagerProps>
  matchTriggerWidth?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  position?: { x: number; y: number } | null
  readOnly?: boolean
  root?: HTMLElement | null
  selection?: boolean
  triggerRef?: React.RefObject<HTMLElement>
  triggerSelector?: string
  variant?: "default" | "light" | "reset"
}

interface DropdownComponentType extends React.ForwardRefExoticComponent<
  DropdownProps & React.RefAttributes<HTMLDivElement>
> {
  Button: typeof MenuButton
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Search: typeof MenuSearch
  SubTrigger: typeof MenuContextSubTrigger
  Trigger: typeof MenuTrigger
  Value: typeof MenuValue
}

/**
 * Dropdown - Nested dropdown menu component
 *
 * Core features:
 * - Support for infinite nested submenus
 * - Hover and click interaction support
 * - Unified MenuContext components
 * - Optimized performance and code quality
 * - Complete keyboard navigation support
 * - Touch device compatibility
 * - Coordinate positioning mode support
 */
const DropdownComponent = memo(function DropdownComponent(props: DropdownProps) {
  const {
    children,
    autoSelectFirstItem = true,
    disabledNested = false,
    offset: offsetDistance = DEFAULT_OFFSET,
    placement = "bottom-start",
    portalId = PORTAL_ROOT_ID,
    position,
    readOnly = false,
    selection = false,
    matchTriggerWidth = false,
    open: controlledOpen,
    onOpenChange,
    triggerRef,
    triggerSelector,
    focusManagerProps = {
      returnFocus: false,
      modal: position ? false : true,
      ...(position && { disabled: true }), // Disable focus management in coordinate mode
    },
    root,
    variant = "default",
  } = props

  // Whether using external trigger (triggerRef or triggerSelector)
  const hasExternalTrigger = Boolean(triggerRef || triggerSelector)

  // References
  const { scrollRef, elementsRef, labelsRef, selectTimeoutRef } = useMenuBaseRefs()

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)
  const [isMouseOverMenu, setIsMouseOverMenu] = useState(false)

  // Coordinate mode detection
  const isCoordinateMode = position !== null && position !== undefined

  // Controlled/uncontrolled state handling - coordinate mode forces controlled mode
  const isControlledOpen = isCoordinateMode
    ? controlledOpen || false
    : controlledOpen === undefined
      ? isOpen
      : controlledOpen

  // Generate unique ID
  const baseId = useId()
  const menuId = `menu-${baseId}`

  // Context and hooks
  const parent = useContext(MenuContext)

  // Handle open state change (must be defined before useMenuTree)
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (!isCoordinateMode && controlledOpen === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // Use unified tree management
  const { nodeId, item, isNested } = useMenuTree({
    disabledNested,
    handleOpenChange,
    isControlledOpen,
  })

  // Virtual positioning function - for coordinate mode
  const setVirtualPosition = useEventCallback((pos: { x: number; y: number }) => {
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          left: pos.x,
          right: pos.x,
          top: pos.y,
          bottom: pos.y,
        }
      },
      contextElement: getDocument()?.body,
    })
  })

  // Use ref to avoid redundant virtual position updates
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  // Floating UI configuration - memoize middleware array to avoid recreating on each render
  const middleware = useMemo(
    () => [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply({ elements, availableHeight, rects }) {
          // Prefer floating element's scrollHeight as scrollRef may not be updated yet on re-render
          const floatingScrollHeight = elements.floating.scrollHeight
          const scrollRefHeight = scrollRef.current?.scrollHeight || 0
          const contentHeight = Math.max(floatingScrollHeight, scrollRefHeight)

          // Calculate appropriate height based on actual content height and available space
          // When contentHeight is 0 (content not yet rendered), use availableHeight to avoid maxHeight: 0
          const maxHeight =
            contentHeight > 0 ? Math.min(contentHeight, availableHeight) : availableHeight

          Object.assign(elements.floating.style, {
            maxHeight: `${maxHeight}px`,
            display: "flex",
            flexDirection: "column",
          })

          // Ensure scroll container properly inherits height and can scroll
          if (scrollRef.current) {
            scrollRef.current.style.height = "100%"
            scrollRef.current.style.maxHeight = "100%"
          }

          // Match trigger width if needed
          if (matchTriggerWidth) {
            elements.floating.style.width = `${rects.reference.width}px`
          }
        },
      }),
    ],
    [isNested, offsetDistance, matchTriggerWidth, scrollRef],
  )

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    nodeId,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    placement: isNested ? "right-start" : placement,
    middleware,
    whileElementsMounted: autoUpdate,
  })

  // Sync virtual position - used in coordinate mode
  useIsomorphicLayoutEffect(() => {
    if (
      position &&
      isCoordinateMode &&
      isControlledOpen &&
      (!lastPositionRef.current ||
        lastPositionRef.current.x !== position.x ||
        lastPositionRef.current.y !== position.y)
    ) {
      setVirtualPosition(position)
      lastPositionRef.current = position
    }
  }, [position, isCoordinateMode, isControlledOpen, setVirtualPosition])

  // Auto-activate first option when menu opens in coordinate mode (only when mouse not over menu)
  useEffect(() => {
    if (isCoordinateMode && isControlledOpen && activeIndex === null && !isMouseOverMenu) {
      setActiveIndex(autoSelectFirstItem ? 0 : null)
    }
  }, [isCoordinateMode, isControlledOpen, activeIndex, isMouseOverMenu, autoSelectFirstItem])

  // Reset activeIndex when menu closes in coordinate mode
  useEffect(() => {
    if (isCoordinateMode && !isControlledOpen) {
      setActiveIndex(null)
    }
  }, [isCoordinateMode, isControlledOpen])

  // Store current open state in ref to avoid useEffect dependency on isControlledOpen
  const isOpenRef = useRef(isControlledOpen)
  isOpenRef.current = isControlledOpen

  // Handle triggerRef and triggerSelector
  useEffect(() => {
    if (isCoordinateMode || (!triggerRef && !triggerSelector)) return

    const element =
      triggerRef?.current ??
      (triggerSelector ? document.querySelector<HTMLElement>(triggerSelector) : null)
    if (!element) return

    refs.setReference(element)

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      handleOpenChange(!isOpenRef.current)
    }

    element.addEventListener("click", handleClick)

    return () => {
      element.removeEventListener("click", handleClick)
    }
  }, [triggerRef, triggerSelector, refs, handleOpenChange, isCoordinateMode])

  // Interaction handlers configuration
  const hover = useHover(context, {
    enabled: isNested && !isCoordinateMode,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, requireIntent: false, buffer: 10 }),
  })

  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested && !isCoordinateMode,
    ignoreMouse: isNested,
    stickIfOpen: false,
    enabled: !isCoordinateMode, // Disable click interaction in coordinate mode
  })

  const role = useRole(context, { role: "menu" })
  const dismiss = useDismiss(context, {
    bubbles: true,
    escapeKey: true,
  })

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
    loop: true,
  })

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isControlledOpen ? setActiveIndex : undefined,
    activeIndex,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    role,
    dismiss,
    listNavigation,
    typeahead,
  ])

  // Tree event handling is managed by useMenuTree

  // Ensure scroll container has correct height
  useMenuScrollHeight({
    isControlledOpen,
    isPositioned,
    scrollRef,
  })

  // Use shared scroll logic
  const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
    scrollRef,
    selectTimeoutRef,
    scrollTop,
    setScrollTop,
    touch,
    isSelect: false, // Dropdown is not a Select
    fallback: false, // Dropdown does not have fallback mechanism
    setInnerOffset: undefined, // Dropdown does not use innerOffset
  })

  // Touch handling
  const handleTouchStart = useEventCallback(() => {
    setTouch(true)
  })

  const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  })

  // Handle mouse enter menu
  const handleMouseEnterMenu = useEventCallback(() => {
    if (isCoordinateMode) {
      setIsMouseOverMenu(true)
    }
  })

  // Handle mouse leave menu
  const handleMouseLeaveMenu = useEventCallback(() => {
    if (isCoordinateMode) {
      setIsMouseOverMenu(false)
    }
  })

  // Handle keyboard events - for triggering SubTrigger to open submenu
  const handleFloatingKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    if (activeIndex !== null && (e.key === "Enter" || e.key === "ArrowRight")) {
      const activeElement = elementsRef.current[activeIndex]
      if (activeElement) {
        // Check if it's a SubTrigger (has aria-haspopup attribute)
        if (activeElement.getAttribute("aria-haspopup") === "menu") {
          e.preventDefault()
          e.stopPropagation()
          activeElement.click()
        }
      }
    }
  })

  // Focus handling
  const handleFocus = useEventCallback(() => {
    // Don't execute nested focus management in coordinate mode to avoid interfering with input focus
    if (isCoordinateMode) {
      return
    }
    setHasFocusInside(false)
    parent?.setHasFocusInside(true)
  })

  // Create close handler
  const handleClose = useEventCallback(() => {
    handleOpenChange(false)
  })

  // Process children
  const { triggerElement, subTriggerElement, contentElement } = useMemo(() => {
    const childrenArray = Children.toArray(children)

    // Find trigger element
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuTrigger,
    ) as React.ReactElement | null

    const subTrigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextSubTrigger,
    ) as React.ReactElement | null

    // Find content wrapper element
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    return {
      triggerElement: trigger,
      subTriggerElement: subTrigger,
      contentElement: content,
    }
  }, [children])

  // Ensure contentElement exists
  if (!contentElement && isControlledOpen) {
    console.error(
      "Dropdown requires a Dropdown.Content component as a child. Example: <Dropdown><Dropdown.Trigger>Trigger</Dropdown.Trigger><Dropdown.Content>{items}</Dropdown.Content></Dropdown>",
    )
  }

  // Create MenuContext value
  const contextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      readOnly,
      selection,
      close: handleClose,
      variant,
    }),
    [activeIndex, getItemProps, handleClose, isControlledOpen, readOnly, selection, variant],
  )

  return (
    <FloatingNode id={nodeId}>
      {/* Render built-in Slot when not in coordinate mode and no external trigger */}
      {!isCoordinateMode && !hasExternalTrigger && (
        <Slot
          ref={refs.setReference}
          tabIndex={!isNested ? undefined : parent?.activeIndex === item.index ? 0 : -1}
          role={isNested ? "menuitem" : undefined}
          data-open={isControlledOpen ? "" : undefined}
          data-nested={isNested ? "" : undefined}
          data-focus-inside={hasFocusInside ? "" : undefined}
          onTouchStart={handleTouchStart}
          onPointerMove={handlePointerMove}
          aria-haspopup="menu"
          aria-expanded={isControlledOpen}
          aria-controls={menuId}
          {...getReferenceProps(
            parent
              ? parent.getItemProps({
                  onFocus: handleFocus,
                })
              : {},
          )}
        >
          {isNested
            ? subTriggerElement && cloneElement(subTriggerElement, { active: isControlledOpen })
            : triggerElement && cloneElement(triggerElement, { active: isControlledOpen })}
        </Slot>
      )}

      <FloatingList
        elementsRef={elementsRef}
        labelsRef={labelsRef}
      >
        <FloatingPortal
          id={portalId}
          root={root}
        >
          {isControlledOpen && (
            <FloatingOverlay
              lockScroll={!touch}
              className={tcx("z-menu", focusManagerProps.modal ? "" : "pointer-events-none")}
            >
              <FloatingFocusManager
                context={context}
                initialFocus={isCoordinateMode || isNested ? -1 : 0}
                visuallyHiddenDismiss={isCoordinateMode}
                {...focusManagerProps}
              >
                <div
                  id={menuId}
                  style={floatingStyles}
                  ref={refs.setFloating}
                  onTouchStart={handleTouchStart}
                  onPointerMove={handlePointerMove}
                  onMouseEnter={handleMouseEnterMenu}
                  onMouseLeave={handleMouseLeaveMenu}
                  {...getFloatingProps({
                    onContextMenu(e: React.MouseEvent) {
                      e.preventDefault()
                    },
                    onKeyDown: handleFloatingKeyDown,
                  })}
                >
                  <MenuContext.Provider value={contextValue}>
                    {contentElement &&
                      cloneElement(contentElement, {
                        ref: scrollRef,
                        matchTriggerWidth: matchTriggerWidth,
                        variant,
                        ...scrollProps,
                      })}
                  </MenuContext.Provider>

                  {/* Scroll arrows */}
                  {["up", "down"].map((dir) => (
                    <MenuScrollArrow
                      key={dir}
                      dir={dir as "up" | "down"}
                      scrollTop={scrollTop}
                      scrollRef={scrollRef}
                      innerOffset={0} // Dropdown does not use innerOffset
                      isPositioned={isPositioned}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                    />
                  ))}
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </FloatingList>
    </FloatingNode>
  )
})

// Base Dropdown component
const BaseDropdown = memo(function Dropdown(props: DropdownProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <DropdownComponent {...rest}>{children}</DropdownComponent>
      </FloatingTree>
    )
  }

  return <DropdownComponent {...props}>{children}</DropdownComponent>
})

// Export component with static properties
export const Dropdown = Object.assign(BaseDropdown, {
  displayName: "Dropdown",
  Trigger: MenuTrigger,
  Item: MenuContextItem,
  SubTrigger: MenuContextSubTrigger,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Search: MenuSearch,
  Button: MenuButton,
  Input: MenuInput,
  Content: MenuContextContent,
  Value: MenuValue,
}) as unknown as DropdownComponentType
