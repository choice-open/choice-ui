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
  Placement,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react"
import { Slot } from "@radix-ui/react-slot"
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
import { flushSync } from "react-dom"
import { useEventCallback } from "usehooks-ts"
import {
  MenuButton,
  MenuDivider,
  MenuInput,
  MenuLabel,
  MenuScrollArrow,
  MenuSearch,
  MenuTrigger,
  MenuValue,
} from "../menus"
import { DropdownContent, DropdownItem, DropdownSubTrigger } from "./components"
import { DropdownContext, DropdownSelectionContext } from "./dropdown-context"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface DropdownProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  nested?: boolean
  selection?: boolean
  portalId?: string
  placement?: Placement
  disabledNested?: boolean
  offset?: number
  matchTriggerWidth?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface DropdownComponentProps
  extends React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<HTMLDivElement>> {
  Item: typeof DropdownItem
  Trigger: typeof MenuTrigger
  SubTrigger: typeof DropdownSubTrigger
  Divider: typeof MenuDivider
  Label: typeof MenuLabel
  Search: typeof MenuSearch
  Button: typeof MenuButton
  Input: typeof MenuInput
  Content: typeof DropdownContent
  Value: typeof MenuValue
}

const DropdownComponent = memo(function DropdownComponent(props: DropdownProps) {
  const {
    children,
    disabledNested = false,
    offset: offsetDistance = DEFAULT_OFFSET,
    placement = "bottom-start",
    portalId = PORTAL_ROOT_ID,
    selection = false,
    matchTriggerWidth = false,
    open: controlledOpen,
    onOpenChange,
    ...rest
  } = props

  // References
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])

  // Local state management
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)

  // Controlled/uncontrolled state handling
  const isControlledOpen = controlledOpen === undefined ? isOpen : controlledOpen

  // Accessibility identifiers
  const baseId = useId()
  const menuId = `menu-${baseId}`
  const triggerId = `trigger-${baseId}`

  // Context and hooks
  const parent = useContext(DropdownContext)
  const tree = useFloatingTree()
  const nodeId = useFloatingNodeId()
  const parentId = useFloatingParentNodeId()
  const item = useListItem()
  const isNested = !disabledNested && parentId != null

  // Handle state changes with proper controlled/uncontrolled behavior
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setIsOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange],
  )

  // Floating UI setup
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    nodeId,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    placement: isNested ? "right-start" : placement,
    middleware: [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply(args) {
          const { elements, availableHeight, rects } = args
          Object.assign(elements.floating.style, {
            height: `${Math.min(elements.floating.clientHeight, availableHeight)}px`,
          })
          if (matchTriggerWidth) {
            elements.floating.style.width = `${rects.reference.width}px`
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    enabled: isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, buffer: 1 }),
  })

  const click = useClick(context, {
    event: "mousedown",
    toggle: !isNested,
    ignoreMouse: isNested,
  })

  const role = useRole(context, { role: "menu" })
  const dismiss = useDismiss(context)

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

  useEffect(() => {
    if (!tree) return

    const handleTreeClick = () => {
      handleOpenChange(false)
    }

    const onSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        handleOpenChange(false)
      }
    }

    tree.events.on("click", handleTreeClick)
    tree.events.on("menuopen", onSubMenuOpen)

    return () => {
      tree.events.off("click", handleTreeClick)
      tree.events.off("menuopen", onSubMenuOpen)
    }
  }, [tree, nodeId, parentId, handleOpenChange])

  // Emit menu open event
  useEffect(() => {
    if (isControlledOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId })
    }
  }, [tree, isControlledOpen, nodeId, parentId])

  // Scroll handlers
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop -= amount
      flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
    }
  })

  const handleArrowHide = useEventCallback(() => {
    if (touch) {
      clearTimeout(selectTimeoutRef.current)
    }
  })

  // Handle touch input
  const handleTouchStart = useCallback(() => {
    setTouch(true)
  }, [])

  const handlePointerMove = useCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  }, [])

  // Handle scroll events
  const handleScroll = useCallback(({ currentTarget }: React.UIEvent) => {
    flushSync(() => setScrollTop(currentTarget.scrollTop))
  }, [])

  // Focus handling
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setHasFocusInside(false)
      parent.setHasFocusInside(true)
    },
    [parent, rest],
  )

  // Process children
  const { triggerElement, subTriggerElement, contentElement } = useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    // Find trigger elements
    const trigger = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === MenuTrigger,
    ) as React.ReactElement | null

    const subTrigger = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === DropdownSubTrigger,
    ) as React.ReactElement | null

    // Find content wrapper element
    const content = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === DropdownContent,
    ) as React.ReactElement | null

    return {
      triggerElement: trigger,
      subTriggerElement: subTrigger,
      contentElement: content,
    }
  }, [children])

  // Ensure that contentElement exists
  if (!contentElement && isControlledOpen) {
    console.error(
      "Dropdown requires a Dropdown.Content component as a child. Example: <Dropdown><Dropdown.Trigger>Trigger</Dropdown.Trigger><Dropdown.Content>{items}</Dropdown.Content></Dropdown>",
    )
  }

  // Create close method
  const handleClose = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  // Create focus manager context
  const contextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      selection,
      close: handleClose,
    }),
    [activeIndex, getItemProps, handleClose, isControlledOpen, selection],
  )

  return (
    <FloatingNode id={nodeId}>
      <Slot
        id={triggerId}
        ref={refs.setReference}
        tabIndex={!isNested ? undefined : parent.activeIndex === item.index ? 0 : -1}
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
          parent.getItemProps({
            onFocus: handleFocus,
          }),
        )}
      >
        {isNested
          ? subTriggerElement &&
            React.cloneElement(subTriggerElement, { active: isControlledOpen, selection })
          : triggerElement && React.cloneElement(triggerElement, { active: isControlledOpen })}
      </Slot>

      <DropdownContext.Provider value={contextValue}>
        <DropdownSelectionContext.Provider value={selection}>
          <FloatingList
            elementsRef={elementsRef}
            labelsRef={labelsRef}
          >
            <FloatingPortal id={portalId}>
              {isControlledOpen && (
                <FloatingOverlay
                  lockScroll={!touch}
                  className="z-menu"
                >
                  <FloatingFocusManager
                    context={context}
                    modal={false}
                    initialFocus={isNested ? -1 : 0}
                    returnFocus={false}
                  >
                    <div
                      id={menuId}
                      style={floatingStyles}
                      ref={refs.setFloating}
                      {...getFloatingProps({
                        onContextMenu(e) {
                          e.preventDefault()
                        },
                      })}
                    >
                      {contentElement &&
                        cloneElement(contentElement, {
                          ref: scrollRef,
                          matchTriggerWidth: matchTriggerWidth,
                          onScroll: handleScroll,
                          ...rest,
                        })}

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
        </DropdownSelectionContext.Provider>
      </DropdownContext.Provider>
    </FloatingNode>
  )
})

DropdownComponent.displayName = "DropdownComponent"

// 创建基础 Dropdown 组件
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

// 添加静态属性并导出
export const Dropdown = Object.assign(BaseDropdown, {
  displayName: "Dropdown",
  Trigger: MenuTrigger,
  Item: DropdownItem,
  SubTrigger: DropdownSubTrigger,
  Divider: MenuDivider,
  Label: MenuLabel,
  Search: MenuSearch,
  Button: MenuButton,
  Input: MenuInput,
  Content: DropdownContent,
  Value: MenuValue,
}) as unknown as DropdownComponentProps
