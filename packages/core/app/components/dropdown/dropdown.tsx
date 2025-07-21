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
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
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
  useMenuScroll,
} from "../menus"
import { Slot } from "../slot"
import { tcx } from "~/utils"

const PORTAL_ROOT_ID = "floating-menu-root"
const DEFAULT_OFFSET = 4

export interface DropdownProps {
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
const DropdownComponent = memo(
  forwardRef<HTMLDivElement, DropdownProps>(function DropdownComponent(props) {
    const {
      children,
      disabledNested = false,
      offset: offsetDistance = DEFAULT_OFFSET,
      placement = "bottom-start",
      portalId = PORTAL_ROOT_ID,
      position,
      selection = false,
      matchTriggerWidth = false,
      open: controlledOpen,
      onOpenChange,
      focusManagerProps = {
        returnFocus: false,
        modal: position ? false : true,
        ...(position && { disabled: true }), // 坐标模式下禁用焦点管理
      },
    } = props

    // References
    const scrollRef = useRef<HTMLDivElement>(null)
    const selectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
    const elementsRef = useRef<Array<HTMLButtonElement | null>>([])
    const labelsRef = useRef<Array<string | null>>([])

    // 状态管理
    const [isOpen, setIsOpen] = useState(false)
    const [hasFocusInside, setHasFocusInside] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [touch, setTouch] = useState(false)

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
    const tree = useFloatingTree()
    const nodeId = useFloatingNodeId()
    const parentId = useFloatingParentNodeId()
    const item = useListItem()
    const isNested = !disabledNested && parentId != null

    // 处理开关状态变化
    const handleOpenChange = useEventCallback((newOpen: boolean) => {
      if (!isCoordinateMode && controlledOpen === undefined) {
        setIsOpen(newOpen)
      }
      onOpenChange?.(newOpen)
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

    // Floating UI 配置  的定位策略
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

    // 坐标模式下，菜单打开时自动激活第一个选项
    useEffect(() => {
      if (isCoordinateMode && isControlledOpen && activeIndex === null) {
        setActiveIndex(0)
      }
    }, [isCoordinateMode, isControlledOpen, activeIndex])

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
      handleClose: safePolygon({ blockPointerEvents: true, buffer: 1 }),
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

    // Tree 事件处理
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

    // 发送菜单打开事件
    useEffect(() => {
      if (isControlledOpen && tree) {
        tree.events.emit("menuopen", { parentId, nodeId })
      }
    }, [tree, isControlledOpen, nodeId, parentId])

    // 使用共享的滚动逻辑
    const { handleArrowScroll, handleArrowHide, getScrollProps } = useMenuScroll({
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
        selection,
        close: handleClose,
      }),
      [activeIndex, getItemProps, handleClose, isControlledOpen, selection],
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
          <FloatingPortal id={portalId}>
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
                    {...getFloatingProps({
                      ...getScrollProps(),
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
  }),
)

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
