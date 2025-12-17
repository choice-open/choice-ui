import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import {
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuEmpty,
  MenuScrollArrow,
  MenuTrigger,
  MenuValue,
  useMenuScroll,
  type MenuContextItemProps,
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
  inner,
  offset,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingFocusManagerProps,
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

const PORTAL_ROOT_ID = "floating-menu-root"

export interface SelectProps {
  children?: React.ReactNode
  className?: string
  closeOnEscape?: boolean
  disabled?: boolean
  focusManagerProps?: Partial<FloatingFocusManagerProps>
  matchTriggerWidth?: boolean
  onChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: "bottom-start" | "bottom-end"
  portalId?: string
  readOnly?: boolean
  root?: HTMLElement | null
  size?: "default" | "large"
  value?: string | null
  variant?: "default" | "light" | "reset"
}

interface SelectComponentType extends React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLButtonElement>
> {
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Empty: typeof MenuEmpty
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof MenuTrigger
  Value: typeof MenuValue
}

/**
 * Select - High-performance select component with macOS-style positioning
 *
 * Core features:
 * - Uses inner middleware for macOS-style positioning
 * - Currently selected item displays near the trigger
 * - Supports fallback mechanism
 * - Optimized performance and code quality
 */
const SelectComponent = memo(function SelectComponent(props: SelectProps) {
  const {
    className,
    closeOnEscape = true,
    matchTriggerWidth = false,
    value,
    onChange,
    open: controlledOpen,
    onOpenChange,
    disabled = false,
    portalId = PORTAL_ROOT_ID,
    placement = "bottom-start",
    readOnly = false,
    children,
    size: sizeProp = "default",
    focusManagerProps = {
      returnFocus: false,
      modal: true,
    },
    root,
    variant = "default",
  } = props

  // Extract children elements
  const [itemElements, triggerElement, contentElement] = useMemo(() => {
    if (!children) return [[], null, null]

    const childrenArray = Children.toArray(children)

    // Find first MenuTrigger element
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuTrigger,
    ) as React.ReactElement | null

    // Find MenuContextContent element
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    // Must use MenuContextContent, collect options from its children
    if (!content) {
      return [[], trigger, null]
    }

    const contentChildren = Children.toArray(content.props.children)

    // Recursive function to handle child elements inside Fragment
    const extractSelectItems = (children: React.ReactNode[]): React.ReactNode[] => {
      const result: React.ReactNode[] = []

      children.forEach((child) => {
        if (!isValidElement(child)) return

        if (
          child.type === MenuContextItem ||
          child.type === MenuDivider ||
          child.type === MenuContextLabel ||
          child.type === MenuEmpty
        ) {
          result.push(child)
        } else if (child.type === React.Fragment && child.props.children) {
          const fragmentChildren = Children.toArray(child.props.children)
          result.push(...extractSelectItems(fragmentChildren))
        }
      })

      return result
    }

    const items = extractSelectItems(contentChildren)
    return [items, trigger, content]
  }, [children])

  // Extract option data from SelectItem elements
  const options = useMemo(() => {
    if (itemElements.length === 0) return []

    return itemElements.map((child, index) => {
      if (!isValidElement(child)) return { divider: true }

      if (child.type === MenuDivider) {
        return { divider: true }
      }

      if (child.type === MenuContextLabel) {
        return { label: true, children: child.props.children }
      }

      if (child.type === MenuEmpty) {
        return { empty: true, children: child.props.children, element: child }
      }

      // Extract props from MenuContextItem element
      const {
        value: itemValue,
        children: itemChildren,
        disabled: itemDisabled,
      } = child.props as MenuContextItemProps

      return {
        value: itemValue,
        disabled: itemDisabled,
        _originalIndex: index,
        element: child,
        children: itemChildren,
      }
    })
  }, [itemElements])

  // Create array containing only selectable items (excluding divider, label and empty)
  const selectableOptions = useMemo(() => {
    return options.filter((option) => !option.divider && !option.label && !option.empty)
  }, [options])

  // References
  const listRef = useRef<Array<HTMLElement | null>>([])
  const listContentRef = useRef<Array<string | null>>([])
  const overflowRef = useRef<SideObject>(null)
  const allowSelectRef = useRef(false)
  const allowMouseUpRef = useRef(true)
  const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const scrollRef = useRef<HTMLDivElement>(null)
  // Track if mouse is being held down from trigger (for native select-like behavior)
  const isMouseDownFromTriggerRef = useRef(false)

  // Combine all refs into one object, wrapped with useMemo to avoid recreation
  const refs = useMemo(
    () => ({
      list: listRef,
      listContent: listContentRef,
      overflow: overflowRef,
      allowSelect: allowSelectRef,
      allowMouseUp: allowMouseUpRef,
      selectTimeout: selectTimeoutRef,
      scroll: scrollRef,
      isMouseDownFromTrigger: isMouseDownFromTriggerRef,
    }),
    [], // refs are stable references, no dependencies needed
  )

  // State management
  const [open, setOpen] = useState(false)
  const [fallback, setFallback] = useState(false) // Key: fallback mechanism
  const [touch, setTouch] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [innerOffset, setInnerOffset] = useState(0) // Key: inner offset

  // Merge controlled and uncontrolled open state
  const isControlledOpen = controlledOpen !== undefined ? controlledOpen : open

  // Generate unique ID
  const baseId = useId()
  const menuId = `menu-${baseId}`
  const nodeId = useFloatingNodeId()

  // Handle open state change
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // Determine current selected index
  const currentSelectedIndex = useMemo(() => {
    if (value === undefined) return selectedIndex

    // Find index in selectable options
    const index = selectableOptions.findIndex((option) => option.value === value)
    return index === -1 ? selectedIndex : index
  }, [value, selectedIndex, selectableOptions])

  // Reset state when menu closes
  if (!open) {
    if (innerOffset !== 0) setInnerOffset(0)
    if (fallback) setFallback(false)
  }

  // Core: macOS-style floating configuration
  const floating = useFloating({
    nodeId,
    placement,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    whileElementsMounted: (reference, floating, update) => {
      return autoUpdate(reference, floating, () => requestAnimationFrame(update), {
        animationFrame: true,
      })
    },
    transform: false,
    // Key: two middleware configurations
    middleware: fallback
      ? [
          // Fallback mode: standard dropdown menu
          offset(8),
          touch ? shift({ crossAxis: true, padding: 16 }) : flip({ padding: 16 }),
          size({
            apply(args) {
              const { availableHeight } = args
              requestAnimationFrame(() => {
                if (refs.scroll.current) {
                  refs.scroll.current.style.maxHeight = `${availableHeight}px`
                }
              })
            },
            padding: 4,
          }),
        ]
      : [
          // Normal mode: macOS-style inner positioning
          inner({
            listRef: refs.list,
            overflowRef: refs.overflow,
            scrollRef: refs.scroll,
            index: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
            offset: innerOffset,
            onFallbackChange: setFallback,
            padding: 16,
            minItemsVisible: touch ? 8 : 4,
            referenceOverflowThreshold: 20,
          }),
          offset(placement.includes("end") ? { crossAxis: 8 } : { crossAxis: -8 }),
          size({
            apply(args) {
              const { rects, elements } = args
              if (matchTriggerWidth) {
                elements.floating.style.width = `${rects.reference.width + 16}px`
              }
            },
          }),
        ],
  })

  // Interaction handlers configuration
  const click = useClick(floating.context, {
    event: "mousedown",
    stickIfOpen: false,
  })

  const dismiss = useDismiss(floating.context, {
    escapeKey: closeOnEscape,
  })

  const role = useRole(floating.context, { role: "listbox" })

  // Key: useInnerOffset for handling inner offset (Select-specific)
  const innerOffsetInteraction = useInnerOffset(floating.context, {
    enabled: !fallback,
    onChange: (offset) => setInnerOffset(offset as number),
    overflowRef: refs.overflow,
    scrollRef: refs.scroll,
  })

  const listNavigation = useListNavigation(floating.context, {
    listRef: refs.list,
    activeIndex,
    selectedIndex: currentSelectedIndex >= 0 ? currentSelectedIndex : 0,
    onNavigate: setActiveIndex,
  })

  const typeahead = useTypeahead(floating.context, {
    listRef: refs.listContent,
    activeIndex,
    onMatch: isControlledOpen
      ? setActiveIndex
      : (index) => {
          if (index !== -1) setSelectedIndex(index)
        },
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    innerOffsetInteraction,
    listNavigation,
    typeahead,
  ])

  // Effect when menu opens
  useEffect(() => {
    if (isControlledOpen) {
      refs.selectTimeout.current = setTimeout(() => {
        refs.allowSelect.current = true
      }, 300)

      return () => {
        if (refs.selectTimeout.current) {
          clearTimeout(refs.selectTimeout.current)
        }
      }
    } else {
      refs.allowSelect.current = false
      refs.allowMouseUp.current = true
      refs.isMouseDownFromTrigger.current = false
    }
  }, [isControlledOpen])

  // Use shared scroll logic
  const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
    scrollRef: refs.scroll,
    selectTimeoutRef: refs.selectTimeout,
    scrollTop,
    setScrollTop,
    touch,
    isSelect: true,
    fallback,
    setInnerOffset,
  })

  // Handle selection
  const handleSelect = useEventCallback((index: number) => {
    if (readOnly) return

    if (refs.allowSelect.current) {
      setSelectedIndex(index)
      handleOpenChange(false)
      setOpen(false)

      const selectedOption = selectableOptions[index]
      if (selectedOption) {
        const resultValue = selectedOption.value ?? ""

        if (resultValue !== value) {
          onChange?.(resultValue)
        }
      }
    }
  })

  // Handle focus state
  const [hasFocusInside, setHasFocusInside] = useState(false)

  // Create MenuContext value
  const menuContextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      readOnly,
      selection: true, // Select always has selection
      close: () => handleOpenChange(false),
      variant,
    }),
    [activeIndex, getItemProps, isControlledOpen, readOnly, variant, handleOpenChange],
  )

  // Register list item
  const registerItem = useEventCallback((index: number, node: HTMLElement | null) => {
    refs.list.current[index] = node
    const option = selectableOptions[index]
    refs.listContent.current[index] = option ? option.value || null : null
  })

  // Render menu items
  const menuItems = useMemo(() => {
    let selectableIndex = 0

    return options.map((option, index) => {
      // Divider
      if (option.divider) {
        return <MenuDivider key={`divider-${index}`} />
      }

      // Label
      if (option.label) {
        return <MenuContextLabel key={`label-${index}`}>{option.children}</MenuContextLabel>
      }

      // Empty
      if (option.empty) {
        return <MenuEmpty key={`empty-${index}`}>{option.children}</MenuEmpty>
      }

      // Option item
      const currentSelectableIndex = selectableIndex
      selectableIndex++ // Increment selectable item index

      const isSelected = currentSelectedIndex === currentSelectableIndex
      const isDisabled = !!option.disabled

      // Check if custom onClick exists
      const childProps = option.element?.props as MenuContextItemProps
      const customActive = childProps?.onClick

      // Event handlers
      const eventHandlers = {
        onTouchStart: () => {
          if (customActive) return
          refs.allowSelect.current = true
          refs.allowMouseUp.current = false
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (customActive) return
          refs.allowSelect.current = true
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (customActive) {
            childProps.onClick?.(e)
          } else {
            handleSelect(currentSelectableIndex)
          }
        },
        onMouseUp: () => {
          if (!refs.allowMouseUp.current || customActive) return

          // Native select-like behavior: if mouse was held from trigger and released on item, select it
          if (refs.isMouseDownFromTrigger.current) {
            refs.isMouseDownFromTrigger.current = false
            if (!isDisabled) {
              handleSelect(currentSelectableIndex)
            }
            return
          }

          if (refs.allowSelect.current) {
            handleSelect(currentSelectableIndex)
          }

          // Reset selection delay
          if (refs.selectTimeout.current) {
            clearTimeout(refs.selectTimeout.current)
          }
          refs.selectTimeout.current = setTimeout(() => {
            refs.allowSelect.current = true
          }, 100)
        },
      }

      return (
        <MenuContextItem
          key={option.value || `item-${index}`}
          value={option.value || ""}
          ref={(node: HTMLButtonElement | null) => registerItem(currentSelectableIndex, node)}
          selected={isSelected}
          disabled={isDisabled}
          size={sizeProp}
          customActive={customActive ? true : undefined}
          {...eventHandlers}
        >
          {option.children}
        </MenuContextItem>
      )
    })
  }, [
    options,
    currentSelectedIndex,
    sizeProp,
    refs.allowSelect,
    refs.allowMouseUp,
    refs.selectTimeout,
    handleSelect,
    registerItem,
  ])

  const enhancedTriggerElement = useMemo(() => {
    if (!triggerElement) return null
    return cloneElement(triggerElement, {
      ...triggerElement.props,
      active: isControlledOpen,
      size: sizeProp,
    })
  }, [triggerElement, isControlledOpen, sizeProp])

  // Cache Slot props to avoid unnecessary re-renders
  const handleTouchStart = useEventCallback(() => {
    setTouch(true)
  })

  const handleMouseDown = useEventCallback(() => {
    // Mark that mouse is being held down from trigger (for native select-like behavior)
    refs.isMouseDownFromTrigger.current = true
  })

  const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  })

  const slotProps = useMemo(() => {
    return {
      "aria-haspopup": "listbox" as const,
      "aria-expanded": isControlledOpen,
      "aria-controls": menuId,
      ...getReferenceProps({
        disabled,
        onTouchStart: handleTouchStart,
        onMouseDown: handleMouseDown,
        onPointerMove: handlePointerMove,
      }),
    }
  }, [
    isControlledOpen,
    menuId,
    getReferenceProps,
    disabled,
    handleTouchStart,
    handleMouseDown,
    handlePointerMove,
  ])

  // Error handling
  if (!triggerElement || !contentElement) {
    console.error("Select requires both Select.Trigger and Select.Content components as children")
    return null
  }

  return (
    <FloatingNode id={nodeId}>
      <Slot
        ref={floating.refs.setReference}
        {...slotProps}
      >
        {enhancedTriggerElement}
      </Slot>

      <FloatingPortal
        id={portalId}
        root={root}
      >
        {isControlledOpen && (
          <FloatingOverlay
            lockScroll={!touch}
            className={tcx("z-menu", focusManagerProps.modal ? "" : "pointer-events-none")}
            onMouseUp={() => {
              // Reset drag select state when mouse is released outside menu items
              refs.isMouseDownFromTrigger.current = false
            }}
          >
            <FloatingFocusManager
              context={floating.context}
              {...focusManagerProps}
            >
              <div
                style={{
                  opacity: fallback ? (floating.isPositioned ? 1 : 0) : undefined,
                  transitionDelay: fallback && floating.isPositioned ? "0.1s" : undefined,
                }}
              >
                <div
                  id={menuId}
                  ref={floating.refs.setFloating}
                  style={floating.floatingStyles}
                  className={className}
                >
                  <MenuContext.Provider value={menuContextValue}>
                    {cloneElement(contentElement, {
                      ref: refs.scroll,
                      matchTriggerWidth,
                      variant,
                      ...getFloatingProps({
                        ...scrollProps,
                        onContextMenu(e: React.MouseEvent) {
                          e.preventDefault()
                        },
                      }),
                      children: (
                        <FloatingList
                          elementsRef={refs.list}
                          labelsRef={refs.listContent}
                        >
                          {menuItems}
                        </FloatingList>
                      ),
                    })}
                  </MenuContext.Provider>

                  {/* Scroll arrows */}
                  {["up", "down"].map((dir) => (
                    <MenuScrollArrow
                      key={dir}
                      dir={dir as "up" | "down"}
                      scrollTop={scrollTop}
                      scrollRef={refs.scroll}
                      innerOffset={innerOffset}
                      isPositioned={floating.isPositioned}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                    />
                  ))}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </FloatingNode>
  )
})

const BaseSelect = memo(function Select(props: SelectProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <SelectComponent {...rest}>{children}</SelectComponent>
      </FloatingTree>
    )
  }

  return <SelectComponent {...props}>{children}</SelectComponent>
})

export const Select = Object.assign(BaseSelect, {
  Content: MenuContextContent,
  Divider: MenuDivider,
  Empty: MenuEmpty,
  Item: MenuContextItem,
  Label: MenuContextLabel,
  Trigger: MenuTrigger,
  Value: MenuValue,
}) as SelectComponentType

Select.displayName = "Select"
