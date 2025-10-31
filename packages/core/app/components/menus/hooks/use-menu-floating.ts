import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useHover,
  safePolygon,
  inner,
  type Placement,
  type SideObject,
} from "@floating-ui/react"
import { useMemo } from "react"

/**
 * 菜单 FloatingUI 配置 Hook
 *
 * 为 Select 和 Dropdown 提供不同的 floating 配置：
 * - Select: 使用 inner 中间件 + 虚拟滚动
 * - Dropdown: 使用标准中间件 + 嵌套支持
 */

export interface MenuFloatingConfig {
  activeIndex: number | null
  // Select 专用配置
  /** 当前选中索引（Select 专用） */
  currentSelectedIndex?: number
  // 引用配置
  elementsRef: React.RefObject<Array<HTMLElement | null>>
  /** 是否为 fallback 模式（Select 专用） */
  fallback?: boolean
  /** 状态变化回调 */
  handleOpenChange: (open: boolean) => void
  /** 内部偏移（Select 专用） */
  innerOffset?: number
  /** 当前打开状态 */
  isControlledOpen: boolean
  /** 是否为嵌套模式（仅 Dropdown 使用） */
  isNested?: boolean
  labelsRef: React.RefObject<Array<string | null>>

  /** 是否匹配触发器宽度 */
  matchTriggerWidth?: boolean
  /** 节点 ID（仅 Dropdown 使用） */
  nodeId?: string
  /** 偏移距离 */
  offsetDistance?: number
  /** overflow 引用（Select 专用） */
  overflowRef?: React.RefObject<SideObject | null>
  /** 位置配置 */
  placement?: Placement
  scrollRef: React.RefObject<HTMLDivElement>

  setActiveIndex: (index: number | null) => void
  /** 设置 fallback（Select 专用） */
  setFallback?: (fallback: boolean) => void
  /** 设置内部偏移（Select 专用） */
  setInnerOffset?: (offset: number) => void
  /** 触摸状态 */
  touch?: boolean
  /** 组件类型 */
  type: "select" | "dropdown"
}

export interface MenuFloatingResult {
  /** floating 上下文和样式 */
  floating: ReturnType<typeof useFloating>
  /** hover 处理器（仅 Dropdown 使用） */
  hover?: ReturnType<typeof useHover>
  /** 交互处理器 */
  interactions: ReturnType<typeof useInteractions>
}

export function useMenuFloating(config: MenuFloatingConfig): MenuFloatingResult {
  const {
    type,
    isControlledOpen,
    handleOpenChange,
    placement = "bottom-start",
    matchTriggerWidth = false,
    isNested = false,
    offsetDistance = 4,
    touch = false,
    nodeId,
    currentSelectedIndex = 0,
    fallback = false,
    innerOffset = 0,
    setFallback,
    setInnerOffset,
    overflowRef,
    elementsRef,
    labelsRef,
    scrollRef,
    activeIndex,
    setActiveIndex,
  } = config

  // 根据组件类型配置中间件
  const middleware = useMemo(() => {
    if (type === "select") {
      // Select 组件：使用 inner 中间件
      return fallback
        ? [
            offset(8),
            touch ? shift({ crossAxis: true, padding: 16 }) : flip({ padding: 16 }),
            size({
              apply(args) {
                const { availableHeight } = args
                requestAnimationFrame(() => {
                  if (scrollRef.current) {
                    scrollRef.current.style.maxHeight = `${availableHeight}px`
                  }
                })
              },
              padding: 4,
            }),
          ]
        : [
            inner({
              listRef: elementsRef as React.MutableRefObject<Array<HTMLElement | null>>,
              overflowRef: overflowRef as React.MutableRefObject<SideObject | null>,
              scrollRef: scrollRef as React.MutableRefObject<HTMLDivElement | null>,
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
          ]
    } else {
      // Dropdown 组件：使用标准中间件
      return [
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
      ]
    }
  }, [
    type,
    fallback,
    touch,
    scrollRef,
    elementsRef,
    overflowRef,
    currentSelectedIndex,
    innerOffset,
    setFallback,
    placement,
    matchTriggerWidth,
    isNested,
    offsetDistance,
  ])

  // 配置 floating
  const floating = useFloating({
    nodeId,
    placement: isNested ? "right-start" : placement,
    open: isControlledOpen,
    onOpenChange: handleOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
    transform: type === "select" ? false : undefined,
  })

  // 配置 hover（总是调用，但根据类型启用/禁用）
  const hover = useHover(floating.context, {
    enabled: type === "dropdown" && isNested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true, requireIntent: false, buffer: 10 }),
  })

  // 配置 click
  const click = useClick(floating.context, {
    event: "mousedown",
    toggle: type === "dropdown" ? !isNested : true,
    ignoreMouse: type === "dropdown" ? isNested : false,
    stickIfOpen: false,
  })

  // 配置 dismiss
  const dismiss = useDismiss(floating.context, {
    bubbles: true,
    escapeKey: true,
  })

  // 配置 role
  const role = useRole(floating.context, {
    role: type === "select" ? "listbox" : "menu",
  })

  // 配置 listNavigation
  const listNavigation = useListNavigation(floating.context, {
    listRef: elementsRef as React.MutableRefObject<Array<HTMLElement | null>>,
    activeIndex,
    selectedIndex:
      type === "select" ? (currentSelectedIndex >= 0 ? currentSelectedIndex : 0) : undefined,
    nested: type === "dropdown" ? isNested : false,
    onNavigate: setActiveIndex,
    loop: type === "dropdown",
  })

  // 配置 typeahead
  const typeahead = useTypeahead(floating.context, {
    listRef: labelsRef as React.MutableRefObject<Array<string | null>>,
    onMatch:
      type === "select"
        ? isControlledOpen
          ? setActiveIndex
          : (index) => {
              if (index !== -1) setActiveIndex(index)
            }
        : isControlledOpen
          ? setActiveIndex
          : undefined,
    activeIndex,
  })

  // 组合交互处理器
  const interactionHandlers = useMemo(() => {
    const handlers = [click, dismiss, role, listNavigation, typeahead]

    // 只在相关类型时包含特定处理器
    if (type === "dropdown") {
      handlers.unshift(hover)
    }

    return handlers
  }, [type, click, dismiss, role, hover, listNavigation, typeahead])

  const interactions = useInteractions(interactionHandlers)

  return {
    floating,
    interactions,
    hover,
  }
}
