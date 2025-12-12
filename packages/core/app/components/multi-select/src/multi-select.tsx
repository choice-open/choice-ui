import { ChipProps } from "@choice-ui/chip"
import { Slot } from "@choice-ui/slot"
import { tcx } from "@choice-ui/shared"
import {
  MenuContext,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuDivider,
  MenuScrollArrow,
  MenuValue,
  useMenuBaseRefs,
  useMenuScroll,
  useMenuScrollHeight,
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
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
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
  forwardRef,
  isValidElement,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { MultiSelectTrigger } from "./components"
import { useMultiSelectSelection, useMultiSelectState } from "./hooks"
import { extractItemElements, filterSelectableOptions, processOptions } from "./utils"
import { multiSelectTv } from "./tv"

const PORTAL_ROOT_ID = "floating-menu-root"

export interface MultiSelectProps {
  children?: React.ReactNode
  chipVariant?: ChipProps["variant"]
  className?: string
  closeOnSelect?: boolean
  disabled?: boolean
  focusManagerProps?: FloatingFocusManagerProps
  getDisplayValue?: (value: string) => string
  i18n?: {
    maxSelectionMessage?: (maxSelection: number) => string
    minSelectionMessage?: (minSelection: number) => string
  }
  matchTriggerWidth?: boolean
  maxChips?: number
  maxSelection?: number
  minSelection?: number
  onChange?: (values: string[]) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placeholder?: string
  placement?: Placement
  portalId?: string
  readOnly?: boolean
  renderChip?: (props: {
    disabled?: boolean
    displayValue: string
    index: number
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
    value: string
  }) => React.ReactNode
  root?: HTMLElement | null
  showValidationMessage?: boolean
  size?: "default" | "large"
  values?: string[]
  variant?: "default" | "light" | "reset"
}

interface MultiSelectComponentType extends React.ForwardRefExoticComponent<
  MultiSelectProps & React.RefAttributes<HTMLDivElement>
> {
  Content: typeof MenuContextContent
  Divider: typeof MenuDivider
  Item: typeof MenuContextItem
  Label: typeof MenuContextLabel
  Trigger: typeof MultiSelectTrigger
  Value: typeof MenuValue
}

/**
 * MultiSelect - Multi-select component with standard dropdown positioning
 *
 * Core features:
 * - Uses Dropdown positioning logic
 * - Supports max/min selection limits
 * - Supports multi-select state management
 * - Supports exclusive options (group mutual exclusion, global exclusion)
 * - Controls whether to close menu after selection (closeOnSelect)
 * - Trigger is not a button to avoid nesting issues
 */
const MultiSelectComponent = memo(
  forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelectComponent(props, ref) {
    const {
      className,
      closeOnSelect = false,
      getDisplayValue,
      i18n,
      matchTriggerWidth = false,
      maxChips,
      maxSelection,
      minSelection,
      placeholder,
      renderChip,
      showValidationMessage = true,
      values = [],
      onChange,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      portalId = PORTAL_ROOT_ID,
      placement = "bottom-start",
      readOnly = false,
      children,
      size: sizeProp = "default",
      chipVariant = "default",
      focusManagerProps = {
        returnFocus: false,
        modal: true,
      },
      root,
      variant = "default",
    } = props

    const tv = multiSelectTv()

    // Extract children elements
    const [itemElements, triggerElement, contentElement] = useMemo(() => {
      if (!children) return [[], null, null]

      const childrenArray = Children.toArray(children)

      // Find MultiSelectTrigger element
      const trigger = childrenArray.find(
        (child) => isValidElement(child) && child.type === MultiSelectTrigger,
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
      const items = extractItemElements(contentChildren)
      return [items, trigger, content]
    }, [children])

    // Extract option data from MenuContextItem elements
    const options = useMemo(() => processOptions(itemElements), [itemElements])

    // Create array containing only selectable items (excluding divider and label)
    const selectableOptions = useMemo(() => filterSelectableOptions(options), [options])

    // References
    const {
      scrollRef,
      elementsRef: listRef,
      labelsRef: listContentRef,
      selectTimeoutRef,
    } = useMenuBaseRefs()
    const allowSelectRef = useRef(false)

    // State management
    const {
      open,
      setOpen,
      touch,
      setTouch,
      scrollTop,
      setScrollTop,
      activeIndex,
      setActiveIndex,
      validationMessage,
      setValidationMessage,
      isControlledOpen,
    } = useMultiSelectState({ controlledOpen, onOpenChange })

    // Generate unique ID
    const baseId = useId()
    const menuId = `menu-${baseId}`
    const nodeId = useFloatingNodeId()
    const tree = useFloatingTree()
    const parentId = useFloatingParentNodeId()

    // Handle open state change
    const handleOpenChange = useEventCallback((newOpen: boolean) => {
      // Don't allow opening menu when component is disabled
      if (disabled && newOpen) {
        return
      }

      if (controlledOpen === undefined) {
        setOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    })

    // Floating UI configuration - memoize middleware array to avoid recreating on each render
    const middleware = useMemo(
      () => [
        offset(8),
        flip(),
        shift(),
        size({
          padding: 4,
          apply(args) {
            const { elements, availableHeight, rects } = args
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

            if (matchTriggerWidth) {
              elements.floating.style.width = `${rects.reference.width}px`
            }
          },
        }),
      ],
      [matchTriggerWidth, scrollRef],
    )

    const { refs, floatingStyles, context, isPositioned } = useFloating({
      nodeId,
      open: isControlledOpen,
      onOpenChange: handleOpenChange,
      placement,
      middleware,
      whileElementsMounted: autoUpdate,
    })

    // Interaction handlers configuration
    const click = useClick(context, {
      event: "click",
      stickIfOpen: false,
    })

    const dismiss = useDismiss(context, {
      bubbles: true,
      escapeKey: true,
    })

    const role = useRole(context, { role: "listbox" })

    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
    })

    const typeahead = useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    })

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      click,
      dismiss,
      role,
      listNavigation,
      typeahead,
    ])

    // Effect when menu opens
    useEffect(() => {
      if (isControlledOpen) {
        selectTimeoutRef.current = setTimeout(() => {
          allowSelectRef.current = true
        }, 300)

        return () => {
          if (selectTimeoutRef.current) {
            clearTimeout(selectTimeoutRef.current)
          }
        }
      } else {
        allowSelectRef.current = false
      }
    }, [isControlledOpen, selectTimeoutRef])

    // Use shared scroll logic
    const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
      scrollRef,
      selectTimeoutRef,
      scrollTop,
      setScrollTop,
      touch,
      isSelect: false, // Use dropdown scroll logic
      fallback: false,
    })

    // Selection logic
    const { handleSelect: baseHandleSelect, handleRemove: baseHandleRemove } =
      useMultiSelectSelection({
        values,
        onChange,
        selectableOptions,
        maxSelection,
        minSelection,
        closeOnSelect,
        i18n,
        setValidationMessage,
        handleOpenChange,
      })

    // Handle selection - add allow select check
    const handleSelect = useEventCallback((index: number) => {
      if (readOnly) return

      if (allowSelectRef.current) {
        baseHandleSelect(index)
      }
    })

    // Handle remove - add readOnly check
    const handleRemove = useEventCallback((value: string) => {
      if (readOnly) return
      baseHandleRemove(value)
    })

    // Tree event handling
    useEffect(() => {
      if (!tree) return

      const handleTreeClick = () => {
        // Close menu based on closeOnSelect
        if (closeOnSelect) {
          handleOpenChange(false)
        }
      }

      const handleSubMenuOpen = (event: { nodeId: string; parentId: string }) => {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          handleOpenChange(false)
        }
      }

      tree.events.on("click", handleTreeClick)
      tree.events.on("menuopen", handleSubMenuOpen)

      return () => {
        tree.events.off("click", handleTreeClick)
        tree.events.off("menuopen", handleSubMenuOpen)
      }
    }, [tree, nodeId, parentId, handleOpenChange, closeOnSelect])

    // Emit menu open event
    useEffect(() => {
      if (isControlledOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId })
      }
    }, [tree, isControlledOpen, nodeId, parentId])

    // Ensure scroll container has correct height
    useMenuScrollHeight({
      isControlledOpen,
      isPositioned,
      scrollRef,
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
        selection: true,
        readOnly,
        variant,
        close: () => handleOpenChange(false),
      }),
      [
        activeIndex,
        setActiveIndex,
        getItemProps,
        isControlledOpen,
        readOnly,
        handleOpenChange,
        variant,
      ],
    )

    // Register list item
    const registerItem = useEventCallback((index: number, node: HTMLElement | null) => {
      listRef.current[index] = node
      const option = selectableOptions[index]
      listContentRef.current[index] = option ? option.value || null : null
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

        // Option item
        const currentSelectableIndex = selectableIndex
        selectableIndex++ // Increment selectable item index

        const isSelected = values.includes(option.value || "")
        const isDisabled = !!option.disabled

        // Check if custom onClick exists
        const childProps = option.element?.props as MenuContextItemProps
        const customActive = childProps?.onClick

        // Event handlers
        const eventHandlers = {
          onTouchStart: () => {
            if (customActive) return
            allowSelectRef.current = true
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (customActive) return
            allowSelectRef.current = true
          },
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            if (customActive) {
              childProps.onClick?.(e)
            } else {
              handleSelect(currentSelectableIndex)
            }
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
    }, [options, values, sizeProp, handleSelect, registerItem])

    // Enhance trigger element
    const valueDisabledMap = useMemo(() => {
      const map: Record<string, boolean> = {}
      values.forEach((v) => {
        const found = options.find((opt) => opt.value === v)
        map[v] = !!found?.disabled
      })
      return map
    }, [values, options])

    const enhancedTriggerElement = useMemo(() => {
      if (!triggerElement) return null

      return cloneElement(triggerElement, {
        ...triggerElement.props,
        values,
        onRemove: handleRemove,
        size: sizeProp,
        disabled,
        readOnly,
        open: isControlledOpen,
        getDisplayValue,
        maxChips,
        placeholder,
        renderChip,
        variant: chipVariant,
        valueDisabledMap,
      })
    }, [
      triggerElement,
      values,
      handleRemove,
      sizeProp,
      disabled,
      readOnly,
      isControlledOpen,
      getDisplayValue,
      maxChips,
      placeholder,
      renderChip,
      chipVariant,
      valueDisabledMap,
    ])

    // Error handling
    if (!triggerElement || !contentElement) {
      console.error(
        "MultiSelect requires both MultiSelect.Trigger and MultiSelect.Content components as children",
      )
      return null
    }

    return (
      <FloatingNode id={nodeId}>
        <Slot
          ref={refs.setReference}
          {...getReferenceProps({
            disabled,
            onTouchStart() {
              setTouch(true)
            },
            onPointerMove({ pointerType }: React.PointerEvent) {
              if (pointerType !== "touch") {
                setTouch(false)
              }
            },
          })}
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
            >
              <FloatingFocusManager
                context={context}
                {...focusManagerProps}
              >
                <div
                  style={{
                    opacity: isPositioned ? 1 : 0,
                  }}
                >
                  <div
                    id={menuId}
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={className}
                    {...getFloatingProps({
                      onContextMenu(e: React.MouseEvent) {
                        e.preventDefault()
                      },
                    })}
                  >
                    <MenuContext.Provider value={menuContextValue}>
                      {cloneElement(contentElement, {
                        ref: scrollRef,
                        matchTriggerWidth,
                        variant,
                        ...scrollProps,
                        children: (
                          <FloatingList
                            elementsRef={listRef}
                            labelsRef={listContentRef}
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
                        scrollRef={scrollRef}
                        innerOffset={0}
                        isPositioned={isPositioned}
                        onScroll={handleArrowScroll}
                        onHide={handleArrowHide}
                      />
                    ))}
                    {showValidationMessage && validationMessage && (
                      <div className={tv.validationMessage({ variant })}>{validationMessage}</div>
                    )}
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </FloatingNode>
    )
  }),
)

const BaseMultiSelect = memo(function MultiSelect(props: MultiSelectProps) {
  const { children, ...rest } = props
  const parentId = useFloatingParentNodeId()

  if (parentId === null) {
    return (
      <FloatingTree>
        <MultiSelectComponent {...rest}>{children}</MultiSelectComponent>
      </FloatingTree>
    )
  }

  return <MultiSelectComponent {...props}>{children}</MultiSelectComponent>
})

export const MultiSelect = Object.assign(BaseMultiSelect, {
  Item: MenuContextItem,
  Trigger: MultiSelectTrigger,
  Divider: MenuDivider,
  Label: MenuContextLabel,
  Content: MenuContextContent,
  Value: MenuValue,
}) as MultiSelectComponentType

MultiSelect.displayName = "MultiSelect"
