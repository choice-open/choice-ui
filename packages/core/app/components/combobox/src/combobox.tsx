import { getDocument, tcx, useIsomorphicLayoutEffect } from "@choice-ui/shared"
import {
  MenuButton,
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuInput,
  MenuScrollArrow,
  MenuValue,
  useMenuBaseRefs,
  useMenuScroll,
  useMenuScrollHeight,
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
  shift,
  size,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useInteractions,
  useListNavigation,
  useRole,
  type FloatingFocusManagerProps,
  type Placement,
} from "@floating-ui/react"
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { ComboboxTrigger } from "./combobox-trigger"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface ComboboxRef {
  handleKeyDown: (event: React.KeyboardEvent) => void
}

export interface ComboboxProps {
  /**
   * @default true
   */
  autoSelection?: boolean
  children?: React.ReactNode
  disabled?: boolean
  /**
   * @default { returnFocus: true, modal: false }
   */
  focusManagerProps?: Partial<Omit<FloatingFocusManagerProps, "children" | "context">>
  /**
   * @default true
   */
  matchTriggerWidth?: boolean
  onBlur?: (value: string) => void
  onChange?: (value: string) => void
  onOpenChange?: (open: boolean, trigger?: "click" | "focus" | "input") => void
  open?: boolean
  /**
   * @default "bottom-start"
   */
  placement?: Placement
  portalId?: string
  position?: { x: number; y: number } | null
  readOnly?: boolean
  root?: HTMLElement | null
  /**
   * Trigger type: "input" for input mode, "coordinate" for coordinate mode
   * @default "input"
   */
  trigger?: "input" | "coordinate"
  value?: string
  /**
   * @default "default"
   */
  variant?: "default" | "light" | "reset"
}

interface ComboboxComponentType extends React.ForwardRefExoticComponent<
  ComboboxProps & React.RefAttributes<ComboboxRef>
> {
  Button: typeof MenuButton
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof ComboboxTrigger
  Value: typeof MenuValue
}

const ComboboxComponent = memo(function ComboboxComponent(props: ComboboxProps) {
  const {
    children,
    autoSelection = true,
    disabled = false,
    placement = "bottom-start",
    portalId = PORTAL_ROOT_ID,
    matchTriggerWidth = true,
    open: controlledOpen,
    onChange,
    onBlur,
    onOpenChange,
    position,
    readOnly = false,
    trigger = "input",
    value: controlledValue = "",
    focusManagerProps = {
      returnFocus: true,
      modal: false,
    },
    root,
    variant = "default",
  } = props

  // References
  const { scrollRef, elementsRef, labelsRef, selectTimeoutRef } = useMenuBaseRefs()
  const inputRef = useRef<HTMLInputElement>(null)

  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(controlledValue)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)

  // Coordinate mode detection
  const isCoordinateMode = trigger === "coordinate"

  // Controlled/uncontrolled state handling - coordinate mode forces controlled mode
  const isControlledOpen = isCoordinateMode
    ? (controlledOpen ?? false)
    : controlledOpen === undefined
      ? isOpen
      : controlledOpen

  // FloatingNode 相关
  const tree = useFloatingTree()
  const nodeId = useFloatingNodeId()
  const parentId = useFloatingParentNodeId()

  // Generate unique ID
  const baseId = useId()
  const listboxId = `combobox-listbox-${baseId}`

  // Sync external value
  useEffect(() => {
    setInputValue(controlledValue)
  }, [controlledValue])

  // Internal state update logic
  const updateInputState = useEventCallback((value: string, triggerCallback = true) => {
    if (readOnly) return

    setInputValue(value)
    const activeIndex = autoSelection ? 0 : null

    if (triggerCallback) {
      onChange?.(value)
    }

    if (value) {
      setActiveIndex(activeIndex)
      if (controlledOpen === undefined) {
        setIsOpen(true)
      }
      onOpenChange?.(true, "input")
    } else {
      if (controlledOpen === undefined) {
        setIsOpen(false)
      }
      onOpenChange?.(false, "input")
    }
  })

  // Value change handler - external callback
  const handleValueChange = useEventCallback((value: string) => {
    updateInputState(value, true)
  })

  // Handle trigger click
  const handleTriggerClick = useEventCallback(() => {
    if (disabled) return

    // Force open menu when clicking trigger
    if (controlledOpen === undefined) {
      setIsOpen(!isOpen)
    }
    onOpenChange?.(true, "click")
  })

  // DOM event handlers
  const handleInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return
    const value = event.target.value
    handleValueChange(value)
  })

  // Focus handler - show menu when there's a value
  const handleInputFocus = useEventCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const activeIndex = autoSelection ? 0 : null
    // Show menu on focus if there's a value
    if (inputValue.trim()) {
      onOpenChange?.(true, "focus")
      setActiveIndex(activeIndex)
    }
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
      offset({ mainAxis: DEFAULT_OFFSET, alignmentAxis: 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply(args) {
          const { elements, availableHeight, rects } = args
          // Prefer floating element's scrollHeight as scrollRef may not be updated yet on re-render
          // This avoids height calculation errors when recovering from no-match to match state
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

          // Only set width in non-coordinate mode when matching trigger width
          if (!isCoordinateMode && matchTriggerWidth && rects.reference.width > 0) {
            elements.floating.style.width = `${rects.reference.width}px`
          }
        },
      }),
    ],
    [isCoordinateMode, matchTriggerWidth, scrollRef],
  )

  const { context, refs, floatingStyles, isPositioned } = useFloating({
    nodeId,
    open: isControlledOpen,
    onOpenChange: (newOpen, event, reason) => {
      if (controlledOpen === undefined) {
        setIsOpen(newOpen)
      }

      // Determine trigger type based on event type
      let trigger: "click" | "focus" | "input" = "click"
      if (reason === "outside-press" || reason === "escape-key") {
        trigger = "click"
      }

      onOpenChange?.(newOpen, trigger)
      if (!newOpen) {
        setActiveIndex(null)
      }
    },
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  })

  // Interaction handlers
  const role = useRole(context, { role: "listbox" })
  const dismiss = useDismiss(context)
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
    allowEscape: !isCoordinateMode,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNavigation,
  ])

  // Sync virtual position - used in coordinate mode
  useIsomorphicLayoutEffect(() => {
    if (position && isCoordinateMode) {
      // Set virtual position whenever position is available, regardless of open state
      if (
        !lastPositionRef.current ||
        lastPositionRef.current.x !== position.x ||
        lastPositionRef.current.y !== position.y
      ) {
        setVirtualPosition(position)
        lastPositionRef.current = position
      }
    }
  }, [position, isCoordinateMode, setVirtualPosition])

  // Auto-select first item in coordinate mode
  useEffect(() => {
    if (isCoordinateMode && isControlledOpen && autoSelection) {
      // Slight delay to ensure elements are rendered
      const timer = setTimeout(() => {
        if (elementsRef.current.length > 0 && activeIndex === null) {
          setActiveIndex(0)
        }
      }, 16) // Use 16ms to ensure execution after next frame render

      return () => clearTimeout(timer)
    }
  }, [isCoordinateMode, isControlledOpen, autoSelection, activeIndex, elementsRef])

  // Re-select first item when filter results change in coordinate mode
  useEffect(() => {
    if (isCoordinateMode && isControlledOpen && autoSelection && elementsRef.current.length > 0) {
      if (activeIndex === null || activeIndex >= elementsRef.current.length) {
        setActiveIndex(0)
      }
    }
  }, [isCoordinateMode, isControlledOpen, autoSelection, activeIndex, elementsRef])

  // Transfer focus to first item when menu opens in coordinate mode
  useEffect(() => {
    if (isCoordinateMode && isControlledOpen && elementsRef.current.length > 0) {
      const timer = setTimeout(() => {
        const firstItem = elementsRef.current[0]
        if (firstItem) {
          firstItem.focus()
        }
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isCoordinateMode, isControlledOpen, elementsRef])

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
    isSelect: false, // Combobox is not a Select
    fallback: false, // Combobox does not have fallback mechanism
    setInnerOffset: undefined, // Combobox does not use innerOffset
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

  // Tree event handling
  useEffect(() => {
    if (!tree) return

    const handleTreeClick = () => {
      if (controlledOpen === undefined) {
        setIsOpen(false)
      }
      onOpenChange?.(false)
    }

    tree.events.on("click", handleTreeClick)

    return () => {
      tree.events.off("click", handleTreeClick)
    }
  }, [tree, controlledOpen, onOpenChange])

  // Emit menu open event
  useEffect(() => {
    if (isControlledOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId })
    }
  }, [tree, isControlledOpen, nodeId, parentId])

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      if (event.key === "Enter" && activeIndex !== null && isControlledOpen) {
        event.preventDefault()
        const activeElement = elementsRef.current[activeIndex]

        if (activeElement) {
          activeElement.click()
        }
      }
    },
  )

  // Create close handler
  const handleClose = useEventCallback(() => {
    if (controlledOpen === undefined) {
      setIsOpen(false)
    }
    onOpenChange?.(false)
  })

  // Process children
  const { triggerElement, contentElement } = useMemo(() => {
    const childrenArray = Children.toArray(children)

    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === ComboboxTrigger,
    ) as React.ReactElement | null

    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    return {
      triggerElement: trigger,
      contentElement: content,
    }
  }, [children])

  // Create MenuContext value
  const contextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside: () => {},
      isOpen: isControlledOpen,
      readOnly,
      selection: false,
      close: handleClose,
      variant,
    }),
    [activeIndex, getItemProps, handleClose, isControlledOpen, readOnly, variant],
  )

  return (
    <FloatingNode id={nodeId}>
      {!isCoordinateMode && (
        <div
          ref={refs.setReference}
          onTouchStart={handleTouchStart}
          onPointerMove={handlePointerMove}
        >
          {triggerElement &&
            cloneElement(triggerElement, {
              ...getReferenceProps({
                ref: inputRef,
                onChange: handleInputChange,
                onFocus: handleInputFocus,
                value: inputValue,
                "aria-autocomplete": "list" as const,
                "aria-haspopup": "listbox",
                "aria-expanded": isControlledOpen,
                "aria-controls": listboxId,
                onKeyDown: handleKeyDown,
              }),
              onChange: handleValueChange,
              active: isControlledOpen,
              onBlur,
              disabled,
              readOnly,
              onClick: handleTriggerClick,
            })}
        </div>
      )}

      {/* Floating content */}
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
                initialFocus={isCoordinateMode && elementsRef.current.length > 0 ? 0 : -1}
                visuallyHiddenDismiss
                {...focusManagerProps}
              >
                <div
                  id={listboxId}
                  style={floatingStyles}
                  ref={refs.setFloating}
                  {...getFloatingProps({
                    onContextMenu(e: React.MouseEvent) {
                      e.preventDefault()
                    },
                    // Add keyboard event handling in coordinate mode
                    ...(isCoordinateMode && {
                      tabIndex: 0,
                      onKeyDown: handleKeyDown,
                    }),
                  })}
                >
                  <MenuContext.Provider value={contextValue}>
                    {contentElement &&
                      cloneElement(contentElement, {
                        ref: scrollRef,
                        matchTriggerWidth,
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
                      innerOffset={0} // Combobox does not use innerOffset
                      isPositioned={isPositioned}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                      variant={variant}
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

// Base Combobox component
const BaseCombobox = memo(function Combobox(props: ComboboxProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <ComboboxComponent {...rest}>{children}</ComboboxComponent>
      </FloatingTree>
    )
  }

  return <ComboboxComponent {...props}>{children}</ComboboxComponent>
})

// Export component with static properties
export const Combobox = Object.assign(BaseCombobox, {
  displayName: "Combobox",
  Trigger: ComboboxTrigger,
  Item: MenuContextItem,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Button: MenuButton,
  Input: MenuInput,
  Content: MenuContextContent,
  Value: MenuValue,
}) as unknown as ComboboxComponentType
