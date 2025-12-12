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
  cloneElement,
  HTMLProps,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface ContextMenuProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  disabled?: boolean
  disabledNested?: boolean
  focusManagerProps?: FloatingFocusManagerProps
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  readOnly?: boolean
  root?: HTMLElement | null
  selection?: boolean
  triggerRef?: React.RefObject<HTMLElement>
  triggerSelector?: string
  variant?: "default" | "light" | "reset"
}

interface ContextMenuTriggerProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

interface ContextMenuComponentProps extends React.ForwardRefExoticComponent<
  ContextMenuProps & React.RefAttributes<HTMLDivElement>
> {
  Button: typeof MenuButton
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Search: typeof MenuSearch
  SubTrigger: typeof MenuContextSubTrigger
  Trigger: React.FC<ContextMenuTriggerProps>
  Value: typeof MenuValue
}

// Context for ContextMenu
interface ContextMenuContextType {
  disabled: boolean
  handleContextMenu: (e: MouseEvent) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextType | null>(null)

// ContextMenu Trigger component
const ContextMenuTrigger = memo<ContextMenuTriggerProps>(function ContextMenuTrigger({
  children,
  ...props
}) {
  const contextMenu = useContext(ContextMenuContext)

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      // Don't handle context menu if disabled
      if (contextMenu?.disabled) {
        return
      }
      contextMenu?.handleContextMenu(e.nativeEvent)
    },
    [contextMenu],
  )

  return (
    <div
      {...props}
      data-disabled={contextMenu?.disabled ? "" : undefined}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  )
})

ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuComponent = memo(function ContextMenuComponent(props: ContextMenuProps) {
  const {
    children,
    disabled = false,
    disabledNested = false,
    offset: offsetDistance = DEFAULT_OFFSET,
    placement = "bottom-start",
    portalId = PORTAL_ROOT_ID,
    readOnly = false,
    selection = false,
    open: controlledOpen,
    onOpenChange,
    triggerRef,
    triggerSelector,
    focusManagerProps = {
      returnFocus: false,
      modal: false,
    },
    root,
    variant = "default",
    ...rest
  } = props

  // References
  const { scrollRef, elementsRef, labelsRef, selectTimeoutRef } = useMenuBaseRefs()
  const allowMouseUpCloseRef = useRef(false)

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)

  // Controlled/uncontrolled state handling
  const isControlledOpen = controlledOpen === undefined ? isOpen : controlledOpen

  // Generate unique ID
  const baseId = useId()
  const menuId = `context-menu-${baseId}`

  // Handle open state change (must be defined before useMenuTree)
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (disabled && newOpen) {
      return
    }

    if (controlledOpen === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // Use unified tree management
  const { tree, nodeId, parentId, item, isNested } = useMenuTree({
    disabledNested,
    handleOpenChange,
    isControlledOpen,
  })

  // Floating UI configuration - memoize middleware array to avoid recreating on each render
  const middleware = useMemo(
    () => [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply(args) {
          const { elements, availableHeight } = args
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
        },
      }),
    ],
    [isNested, offsetDistance, scrollRef],
  )

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    nodeId,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    placement: isNested ? "right-start" : placement,
    middleware,
    whileElementsMounted: autoUpdate,
  })

  // Interaction handlers configuration
  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, requireIntent: false, buffer: 10 }),
  })

  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
    stickIfOpen: false,
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

  // ContextMenu specific right-click handling
  const handleContextMenu = useEventCallback((e: MouseEvent) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    // Set virtual position reference based on mouse position
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: e.clientX,
          y: e.clientY,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
        }
      },
    })

    handleOpenChange(true)

    // Handle mouse up close behavior
    allowMouseUpCloseRef.current = false
    const timeout = setTimeout(() => {
      allowMouseUpCloseRef.current = true
    }, 200)

    return () => clearTimeout(timeout)
  })

  // Tree event handling is managed by useMenuTree

  // Ensure scroll container has correct height
  useMenuScrollHeight({
    isControlledOpen,
    isPositioned,
    scrollRef,
  })

  // Handle mouse up close
  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      if (allowMouseUpCloseRef.current) {
        const target = event.target as Node
        // Check if clicked inside any floating menu
        const menuElements = document.querySelectorAll('[role="menu"]')
        for (const menuElement of menuElements) {
          if (menuElement.contains(target)) {
            return // Don't close if clicked inside menu
          }
        }
        handleOpenChange(false)
      }
    }

    if (isControlledOpen) {
      document.addEventListener("mouseup", handleMouseUp)
      return () => document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isControlledOpen, handleOpenChange])

  // Handle triggerRef and triggerSelector support
  useEffect(() => {
    // Prefer triggerRef, fallback to triggerSelector
    const element =
      triggerRef?.current ??
      (triggerSelector ? document.querySelector<HTMLElement>(triggerSelector) : null)
    if (!element) return

    // Set the floating reference to the trigger element
    refs.setReference(element)

    // Add contextmenu event listener
    const handleTriggerContextMenu = (e: MouseEvent) => {
      handleContextMenu(e)
    }

    // Set disabled attribute for styling
    if (disabled) {
      element.setAttribute("data-context-menu-disabled", "")
    } else {
      element.removeAttribute("data-context-menu-disabled")
    }

    element.addEventListener("contextmenu", handleTriggerContextMenu)

    return () => {
      element.removeEventListener("contextmenu", handleTriggerContextMenu)
      element.removeAttribute("data-context-menu-disabled")
    }
  }, [triggerRef, triggerSelector, refs, handleContextMenu, disabled])

  // Use shared scroll logic
  const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
    scrollRef,
    selectTimeoutRef,
    scrollTop,
    setScrollTop,
    touch,
    isSelect: false,
    fallback: false,
    setInnerOffset: undefined,
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

  // Focus handling
  const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setHasFocusInside(false)
  })

  // Create close handler
  const handleClose = useEventCallback(() => {
    handleOpenChange(false)
  })

  // Process children
  const { targetElement, subTriggerElement, contentElement } = useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    const target = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === ContextMenuTrigger,
    ) as React.ReactElement | null

    const subTrigger = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === MenuContextSubTrigger,
    ) as React.ReactElement | null

    const content = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    return {
      targetElement: target,
      subTriggerElement: subTrigger,
      contentElement: content,
    }
  }, [children])

  // Ensure contentElement exists
  if (!contentElement && isControlledOpen) {
    console.error(
      "ContextMenu requires a ContextMenu.Content component as a child. Example: <ContextMenu><ContextMenu.Target>Target</ContextMenu.Target><ContextMenu.Content>{items}</ContextMenu.Content></ContextMenu>",
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

  // Create ContextMenu context value
  const contextMenuContextValue = useMemo(
    () => ({
      handleContextMenu,
      disabled,
    }),
    [handleContextMenu, disabled],
  )

  return (
    <FloatingNode id={nodeId}>
      <ContextMenuContext.Provider value={contextMenuContextValue}>
        {/* Render target for root level, SubTrigger for nested, but skip target if triggerRef or triggerSelector is provided */}
        {isNested
          ? subTriggerElement && (
              <div
                ref={refs.setReference}
                tabIndex={activeIndex === item.index ? 0 : -1}
                role="menuitem"
                data-open={isControlledOpen ? "" : undefined}
                data-nested=""
                data-focus-inside={hasFocusInside ? "" : undefined}
                onTouchStart={handleTouchStart}
                onPointerMove={handlePointerMove}
                {...getReferenceProps(
                  getItemProps({
                    onFocus: handleFocus,
                  }),
                )}
              >
                {cloneElement(subTriggerElement, { active: isControlledOpen })}
              </div>
            )
          : !triggerRef && !triggerSelector && targetElement}

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
                className="z-menu pointer-events-none"
              >
                <FloatingFocusManager
                  context={context}
                  initialFocus={isNested ? -1 : 0}
                  {...focusManagerProps}
                >
                  <div
                    id={menuId}
                    style={floatingStyles}
                    ref={refs.setFloating}
                    onTouchStart={handleTouchStart}
                    onPointerMove={handlePointerMove}
                    {...getFloatingProps({
                      onContextMenu(e: React.MouseEvent) {
                        e.preventDefault()
                      },
                    })}
                  >
                    <MenuContext.Provider value={contextValue}>
                      {contentElement &&
                        cloneElement(contentElement, {
                          ref: scrollRef,
                          variant,
                          ...scrollProps,
                          ...rest,
                        })}
                    </MenuContext.Provider>

                    {/* Scroll arrows */}
                    {["up", "down"].map((dir) => (
                      <MenuScrollArrow
                        key={dir}
                        dir={dir as "up" | "down"}
                        scrollTop={scrollTop}
                        scrollRef={scrollRef}
                        innerOffset={0}
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
      </ContextMenuContext.Provider>
    </FloatingNode>
  )
})

ContextMenuComponent.displayName = "ContextMenuComponent"

// Create base ContextMenu component
const BaseContextMenu = memo(function ContextMenu(props: ContextMenuProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <ContextMenuComponent {...rest}>{children}</ContextMenuComponent>
      </FloatingTree>
    )
  }

  return <ContextMenuComponent {...props}>{children}</ContextMenuComponent>
})

// Add static properties and export
export const ContextMenu = Object.assign(BaseContextMenu, {
  displayName: "ContextMenu",
  Trigger: ContextMenuTrigger,
  Item: MenuContextItem,
  SubTrigger: MenuContextSubTrigger,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Search: MenuSearch,
  Button: MenuButton,
  Input: MenuInput,
  Content: MenuContextContent,
  Value: MenuValue,
}) as unknown as ContextMenuComponentProps
