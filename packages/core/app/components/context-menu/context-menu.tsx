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
import {
  MenuButton,
  MenuContextContent,
  MenuContextItem,
  MenuContextLabel,
  MenuContextSubTrigger,
  MenuContext,
  MenuDivider,
  MenuInput,
  MenuScrollArrow,
  MenuSearch,
  MenuValue,
  useMenuBaseRefs,
  useMenuScroll,
  useMenuScrollHeight,
  useMenuTree,
} from "../menus"

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
  readonly?: boolean
  root?: HTMLElement | null
  selection?: boolean
  triggerRef?: React.RefObject<HTMLElement>
}

interface ContextMenuTriggerProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

interface ContextMenuComponentProps
  extends React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<HTMLDivElement>> {
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

// ContextMenu Target component
const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({ children, ...props }) => {
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
    disabledNested = false,
    offset: offsetDistance = DEFAULT_OFFSET,
    placement = "bottom-start",
    portalId = PORTAL_ROOT_ID,
    readonly = false,
    selection = false,
    open: controlledOpen,
    onOpenChange,
    triggerRef,
    focusManagerProps = {
      returnFocus: false,
      modal: false,
    },
    root,
    ...rest
  } = props

  // References - 使用统一的 refs 管理
  const { scrollRef, elementsRef, labelsRef, selectTimeoutRef } = useMenuBaseRefs()
  const allowMouseUpCloseRef = useRef(false)

  // 状态管理 - 参考 dropdown.tsx
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)

  // 受控/非受控状态处理
  const isControlledOpen = controlledOpen === undefined ? isOpen : controlledOpen

  // 生成唯一 ID
  const baseId = useId()
  const menuId = `context-menu-${baseId}`

  // 处理开关状态变化（需要在 useMenuTree 之前定义）
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (disabled && newOpen) {
      return
    }

    if (controlledOpen === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // 使用统一的 tree 管理
  const { tree, nodeId, parentId, item, isNested } = useMenuTree({
    disabledNested,
    handleOpenChange,
    isControlledOpen,
  })

  // Floating UI 配置 - 参考 dropdown.tsx，但适配 ContextMenu 的特殊需求
  // 使用 useMemo 缓存 middleware 数组，避免每次渲染都创建新数组
  const middleware = useMemo(
    () => [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply(args) {
          const { elements, availableHeight } = args
          // 使用 scrollHeight 获取内容的实际高度，而不是 clientHeight
          // scrollHeight 会随着内容变化自动更新，而 clientHeight 可能被 maxHeight 限制
          const contentHeight = scrollRef.current?.scrollHeight || elements.floating.scrollHeight

          // 根据内容实际高度和可用空间计算合适的高度
          const maxHeight = Math.min(contentHeight, availableHeight)

          Object.assign(elements.floating.style, {
            maxHeight: `${maxHeight}px`,
            display: "flex",
            flexDirection: "column",
          })
          // 确保 MenusBase (通过 scrollRef) 能够正确继承高度并滚动
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

  // 交互处理器配置 - 参考 dropdown.tsx
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

  // ContextMenu 特有的右键菜单处理
  const handleContextMenu = useEventCallback((e: MouseEvent) => {
    e.preventDefault()

    if (disabled) {
      return
    }

    // 设置虚拟位置引用 - 基于鼠标位置
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

    // 处理鼠标抬起关闭行为
    allowMouseUpCloseRef.current = false
    const timeout = setTimeout(() => {
      allowMouseUpCloseRef.current = true
    }, 200)

    return () => clearTimeout(timeout)
  })

  // Tree 事件处理已由 useMenuTree 统一管理

  // 确保滚动容器正确设置高度
  useMenuScrollHeight({
    isControlledOpen,
    isPositioned,
    scrollRef,
  })

  // 处理鼠标抬起关闭
  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      if (allowMouseUpCloseRef.current) {
        const target = event.target as Node
        // 检查是否点击在任何浮动菜单内部
        const menuElements = document.querySelectorAll('[role="menu"]')
        for (const menuElement of menuElements) {
          if (menuElement.contains(target)) {
            return // 如果点击在菜单内部，不关闭
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

  // Handle triggerRef support
  useEffect(() => {
    const element = triggerRef?.current
    if (!element) return

    // Set the floating reference to the triggerRef element
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
  }, [triggerRef, refs, handleContextMenu, disabled])

  // 使用共享的滚动逻辑 - 参考 dropdown.tsx
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

  // 触摸处理 - 参考 dropdown.tsx
  const handleTouchStart = useEventCallback(() => {
    setTouch(true)
  })

  const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  })

  // 焦点处理
  const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setHasFocusInside(false)
  })

  // 创建关闭方法
  const handleClose = useEventCallback(() => {
    handleOpenChange(false)
  })

  // 处理子元素 - 参考 dropdown.tsx
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

  // 确保 contentElement 存在
  if (!contentElement && isControlledOpen) {
    console.error(
      "ContextMenu requires a ContextMenu.Content component as a child. Example: <ContextMenu><ContextMenu.Target>Target</ContextMenu.Target><ContextMenu.Content>{items}</ContextMenu.Content></ContextMenu>",
    )
  }

  // 创建 MenuContext 值 - 参考 dropdown.tsx
  const contextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      getItemProps,
      setHasFocusInside,
      isOpen: isControlledOpen,
      readonly,
      selection,
      close: handleClose,
    }),
    [activeIndex, getItemProps, handleClose, isControlledOpen, readonly, selection],
  )

  // 创建 ContextMenu 上下文值
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
        {/* Render target for root level, SubTrigger for nested, but skip target if triggerRef is provided */}
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
          : !triggerRef && targetElement}

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
                          ...scrollProps,
                          ...rest,
                        })}
                    </MenuContext.Provider>

                    {/* 滚动箭头 */}
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
