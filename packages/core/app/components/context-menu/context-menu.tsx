import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  Placement,
  useFloatingParentNodeId,
} from "@floating-ui/react"
import React, {
  cloneElement,
  HTMLProps,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react"
import {
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSubTrigger,
} from "../dropdown/components"
import { DropdownContext, DropdownSelectionContext } from "../dropdown/dropdown-context"
import {
  MenuButton,
  MenuDivider,
  MenuInput,
  MenuScrollArrow,
  MenuSearch,
  MenuValue,
} from "../menus"
import { useContextMenu } from "./hooks"

const PORTAL_ROOT_ID = "floating-menu-root"

export interface ContextMenuProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  disabled?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  portalId?: string
  selection?: boolean
  triggerRef?: React.RefObject<HTMLElement>
}

interface ContextMenuTargetProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

interface ContextMenuComponentProps
  extends React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<HTMLDivElement>> {
  Button: typeof MenuButton
  Content: typeof DropdownContent
  Divider: typeof MenuDivider
  Input: typeof MenuInput
  Item: typeof DropdownItem
  Label: typeof DropdownLabel
  Search: typeof MenuSearch
  SubTrigger: typeof DropdownSubTrigger
  Target: React.FC<ContextMenuTargetProps>
  Value: typeof MenuValue
}

// Context for ContextMenu
interface ContextMenuContextType {
  disabled: boolean
  handleContextMenu: (e: MouseEvent) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextType | null>(null)

// ContextMenu Target component
const ContextMenuTarget: React.FC<ContextMenuTargetProps> = ({ children, ...props }) => {
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
}

const ContextMenuComponent = memo(function ContextMenuComponent(props: ContextMenuProps) {
  const {
    children,
    disabled = false,
    offset,
    placement,
    portalId = PORTAL_ROOT_ID,
    selection,
    open,
    onOpenChange,
    triggerRef,
    ...rest
  } = props

  // Use the custom hook for all logic
  const {
    isControlledOpen,
    scrollTop,
    isPositioned,
    isNested,
    scrollRef,
    elementsRef,
    labelsRef,
    menuId,
    nodeId,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    dropdownContextValue,
    contextMenuContextValue,
    handleArrowScroll,
    handleArrowHide,
    handleTouchStart,
    handlePointerMove,
    handleScroll,
  } = useContextMenu({
    disabled,
    offset,
    placement,
    selection,
    open,
    onOpenChange,
  })

  // Handle triggerRef support - Combined effect for better performance
  useEffect(() => {
    const element = triggerRef?.current
    if (!element || !contextMenuContextValue) return

    // Set the floating reference to the triggerRef element
    refs.setReference(element)

    // Add contextmenu event listener
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      // Don't handle context menu if disabled
      if (contextMenuContextValue.disabled) {
        return
      }
      contextMenuContextValue.handleContextMenu(e)
    }

    // Set disabled attribute for styling
    if (contextMenuContextValue.disabled) {
      element.setAttribute("data-context-menu-disabled", "")
    } else {
      element.removeAttribute("data-context-menu-disabled")
    }

    element.addEventListener("contextmenu", handleContextMenu)

    return () => {
      element.removeEventListener("contextmenu", handleContextMenu)
      element.removeAttribute("data-context-menu-disabled")
    }
  }, [triggerRef, refs, contextMenuContextValue])

  // Process children to find target, subtrigger and content
  const { targetElement, subTriggerElement, contentElement } = useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    const target = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === ContextMenuTarget,
    ) as React.ReactElement | null

    const subTrigger = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === DropdownSubTrigger,
    ) as React.ReactElement | null

    // Find content element - specifically look for DropdownContent
    const content = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === DropdownContent,
    ) as React.ReactElement | null

    return {
      targetElement: target,
      subTriggerElement: subTrigger,
      contentElement: content,
    }
  }, [children])

  return (
    <FloatingNode id={nodeId}>
      <ContextMenuContext.Provider value={contextMenuContextValue}>
        {/* Render target for root level, SubTrigger for nested, but skip target if triggerRef is provided */}
        {isNested
          ? subTriggerElement && (
              <div
                ref={refs.setReference}
                {...getReferenceProps(
                  dropdownContextValue.getItemProps({
                    role: "menuitem",
                  }),
                )}
              >
                {cloneElement(subTriggerElement, { active: isControlledOpen })}
              </div>
            )
          : !triggerRef && targetElement}

        <DropdownContext.Provider value={dropdownContextValue}>
          <DropdownSelectionContext.Provider value={selection || false}>
            <FloatingList
              elementsRef={elementsRef}
              labelsRef={labelsRef}
            >
              <FloatingPortal id={portalId}>
                {isControlledOpen && (
                  <FloatingOverlay
                    lockScroll={true}
                    className="z-menu"
                  >
                    <FloatingFocusManager
                      context={context}
                      modal={false}
                      initialFocus={0}
                      returnFocus={false}
                    >
                      <div
                        id={menuId}
                        style={floatingStyles}
                        ref={refs.setFloating}
                        onTouchStart={handleTouchStart}
                        onPointerMove={handlePointerMove}
                        {...getFloatingProps({
                          onContextMenu(e) {
                            e.preventDefault()
                          },
                        })}
                      >
                        {contentElement &&
                          (typeof contentElement.type === "function" ? (
                            // If it's a function component, render directly with props
                            <contentElement.type
                              {...contentElement.props}
                              ref={scrollRef}
                              onScroll={handleScroll}
                              {...rest}
                            />
                          ) : (
                            // If it's a regular element, use cloneElement
                            cloneElement(contentElement, {
                              ref: scrollRef,
                              onScroll: handleScroll,
                              ...rest,
                            })
                          ))}

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
  Target: ContextMenuTarget,
  Item: DropdownItem,
  SubTrigger: DropdownSubTrigger,
  Divider: MenuDivider,
  Label: DropdownLabel,
  Search: MenuSearch,
  Button: MenuButton,
  Input: MenuInput,
  Content: DropdownContent,
  Value: MenuValue,
}) as unknown as ContextMenuComponentProps
