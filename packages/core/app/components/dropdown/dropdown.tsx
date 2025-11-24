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
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
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
} from "../menus"
import { Slot } from "../slot"
import { tcx } from "~/utils"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface DropdownProps {
  /**
   * CoordinateMode, first item auto select
   * 坐标模式下，是否自动选中第一个选项
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
  readonly?: boolean
  root?: HTMLElement | null
  selection?: boolean
}

interface DropdownComponentType
  extends React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<HTMLDivElement>> {
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
 * Dropdown - 支持嵌套的下拉菜单组件
 *
 * 核心特性：
 * - 支持无限层级嵌套子菜单
 * - hover 和 click 交互支持
 * - 使用新的 MenuContext 统一组件
 * - 优化的性能和代码质量
 * - 完整的键盘导航支持
 * - 触摸设备兼容性
 * - 支持坐标定位模式（可替代 CoordinateMenu）
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
    readonly = false,
    selection = false,
    matchTriggerWidth = false,
    open: controlledOpen,
    onOpenChange,
    focusManagerProps = {
      returnFocus: false,
      modal: position ? false : true,
      ...(position && { disabled: true }), // 坐标模式下禁用焦点管理
    },
    root,
  } = props

  // References - 使用统一的 refs 管理
  const { scrollRef, elementsRef, labelsRef, selectTimeoutRef } = useMenuBaseRefs()

  // 状态管理
  const [isOpen, setIsOpen] = useState(false)
  const [hasFocusInside, setHasFocusInside] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [touch, setTouch] = useState(false)
  const [isMouseOverMenu, setIsMouseOverMenu] = useState(false)

  // 坐标模式检测
  const isCoordinateMode = position !== null && position !== undefined

  // 受控/非受控状态处理 - 坐标模式下强制使用受控模式
  const isControlledOpen = isCoordinateMode
    ? controlledOpen || false
    : controlledOpen === undefined
      ? isOpen
      : controlledOpen

  // 生成唯一 ID
  const baseId = useId()
  const menuId = `menu-${baseId}`

  // 上下文和 hooks
  const parent = useContext(MenuContext)

  // 处理开关状态变化（需要在 useMenuTree 之前定义）
  const handleOpenChange = useEventCallback((newOpen: boolean) => {
    if (!isCoordinateMode && controlledOpen === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  })

  // 使用统一的 tree 管理
  const { nodeId, item, isNested } = useMenuTree({
    disabledNested,
    handleOpenChange,
    isControlledOpen,
  })

  // 虚拟定位函数 - 用于坐标模式
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
      contextElement: document.body,
    })
  })

  // 使用 ref 避免重复设置虚拟位置
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  // Floating UI 配置 - 使用 useMemo 缓存 middleware 数组，避免每次渲染都创建新数组
  const middleware = useMemo(
    () => [
      offset({ mainAxis: isNested ? 10 : offsetDistance, alignmentAxis: isNested ? -4 : 0 }),
      flip(),
      shift(),
      size({
        padding: 4,
        apply({ elements, availableHeight, rects }) {
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

          // 如果需要匹配触发器宽度
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

  // 同步设置虚拟位置 - 坐标模式下使用
  useLayoutEffect(() => {
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

  // 坐标模式下，菜单打开时自动激活第一个选项（仅当鼠标不在菜单上时）
  useEffect(() => {
    if (isCoordinateMode && isControlledOpen && activeIndex === null && !isMouseOverMenu) {
      setActiveIndex(autoSelectFirstItem ? 0 : null)
    }
  }, [isCoordinateMode, isControlledOpen, activeIndex, isMouseOverMenu, autoSelectFirstItem])

  // 坐标模式下，菜单关闭时重置 activeIndex
  useEffect(() => {
    if (isCoordinateMode && !isControlledOpen) {
      setActiveIndex(null)
    }
  }, [isCoordinateMode, isControlledOpen])

  // 交互处理器配置
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
    enabled: !isCoordinateMode, // 坐标模式下禁用点击交互
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

  // Tree 事件处理已由 useMenuTree 统一管理

  // 确保滚动容器正确设置高度
  useMenuScrollHeight({
    isControlledOpen,
    isPositioned,
    scrollRef,
  })

  // 使用共享的滚动逻辑
  const { handleArrowScroll, handleArrowHide, scrollProps } = useMenuScroll({
    scrollRef,
    selectTimeoutRef,
    scrollTop,
    setScrollTop,
    touch,
    isSelect: false, // Dropdown 不是 Select
    fallback: false, // Dropdown 没有 fallback 机制
    setInnerOffset: undefined, // Dropdown 不使用 innerOffset
  })

  // 触摸处理
  const handleTouchStart = useEventCallback(() => {
    setTouch(true)
  })

  const handlePointerMove = useEventCallback(({ pointerType }: React.PointerEvent) => {
    if (pointerType !== "touch") {
      setTouch(false)
    }
  })

  // 处理鼠标进入菜单
  const handleMouseEnterMenu = useEventCallback(() => {
    if (isCoordinateMode) {
      setIsMouseOverMenu(true)
    }
  })

  // 处理鼠标离开菜单
  const handleMouseLeaveMenu = useEventCallback(() => {
    if (isCoordinateMode) {
      setIsMouseOverMenu(false)
    }
  })

  // 焦点处理
  const handleFocus = useEventCallback(() => {
    // 坐标模式下不执行嵌套焦点管理，避免干扰输入框焦点
    if (isCoordinateMode) {
      return
    }
    setHasFocusInside(false)
    parent?.setHasFocusInside(true)
  })

  // 创建关闭方法
  const handleClose = useEventCallback(() => {
    handleOpenChange(false)
  })

  // 处理子元素
  const { triggerElement, subTriggerElement, contentElement } = useMemo(() => {
    const childrenArray = Children.toArray(children)

    // 找到触发器元素
    const trigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuTrigger,
    ) as React.ReactElement | null

    const subTrigger = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextSubTrigger,
    ) as React.ReactElement | null

    // 找到内容包装元素
    const content = childrenArray.find(
      (child) => isValidElement(child) && child.type === MenuContextContent,
    ) as React.ReactElement | null

    return {
      triggerElement: trigger,
      subTriggerElement: subTrigger,
      contentElement: content,
    }
  }, [children])

  // 确保 contentElement 存在
  if (!contentElement && isControlledOpen) {
    console.error(
      "Dropdown requires a Dropdown.Content component as a child. Example: <Dropdown><Dropdown.Trigger>Trigger</Dropdown.Trigger><Dropdown.Content>{items}</Dropdown.Content></Dropdown>",
    )
  }

  // 创建 MenuContext 值
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

  return (
    <FloatingNode id={nodeId}>
      {!isCoordinateMode && (
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
                  })}
                >
                  <MenuContext.Provider value={contextValue}>
                    {contentElement &&
                      cloneElement(contentElement, {
                        ref: scrollRef,
                        matchTriggerWidth: matchTriggerWidth,
                        ...scrollProps,
                      })}
                  </MenuContext.Provider>

                  {/* 滚动箭头 */}
                  {["up", "down"].map((dir) => (
                    <MenuScrollArrow
                      key={dir}
                      dir={dir as "up" | "down"}
                      scrollTop={scrollTop}
                      scrollRef={scrollRef}
                      innerOffset={0} // Dropdown 不使用 innerOffset
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

// 基础 Dropdown 组件
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

// 导出带有静态属性的组件
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
