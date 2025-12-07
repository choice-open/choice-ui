import { useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { flushSync } from "react-dom"

/**
 * 菜单滚动处理 Hook
 *
 * 处理菜单组件的滚动相关逻辑：
 * - 滚动位置管理
 * - 箭头滚动处理
 * - 滚动事件处理
 * - 触摸相关的滚动隐藏逻辑
 */

export interface MenuScrollConfig {
  /** Select 专用：fallback 模式 */
  fallback?: boolean
  /** 是否是 Select 类型（使用不同的滚动逻辑） */
  isSelect?: boolean
  /** 滚动容器引用 */
  scrollRef: React.RefObject<HTMLDivElement>
  /** 滚动位置状态 */
  scrollTop: number
  /** 定时器引用 */
  selectTimeoutRef: React.RefObject<ReturnType<typeof setTimeout> | undefined>
  /** Select 专用：设置内部偏移 */
  setInnerOffset?: (offset: number | ((prev: number) => number)) => void
  /** 设置滚动位置 */
  setScrollTop: (scrollTop: number) => void
  /** 触摸状态 */
  touch: boolean
}

export interface MenuScrollResult {
  /** 箭头隐藏处理器 */
  handleArrowHide: () => void
  /** 箭头滚动处理器 */
  handleArrowScroll: (amount: number) => void
  /** 滚动事件处理器 */
  handleScroll: (event: React.UIEvent) => void
  /** 滚动相关的属性对象（已缓存，避免每次渲染都创建新对象） */
  scrollProps: {
    onScroll: (event: React.UIEvent) => void
  }
}

export function useMenuScroll(config: MenuScrollConfig): MenuScrollResult {
  const {
    scrollRef,
    selectTimeoutRef,
    scrollTop,
    setScrollTop,
    touch,
    isSelect = false,
    setInnerOffset,
    fallback = false,
  } = config

  // 箭头滚动处理 - 使用 useEventCallback 确保引用稳定
  const handleArrowScroll = useEventCallback((amount: number) => {
    if (isSelect) {
      // Select 组件的滚动处理
      requestAnimationFrame(() => {
        if (fallback) {
          // fallback 模式：直接滚动容器
          if (scrollRef.current) {
            scrollRef.current.scrollTop -= amount
            flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
          }
        } else {
          // 正常模式：更新内部偏移
          if (setInnerOffset) {
            flushSync(() => setInnerOffset((value) => value - amount))
          }
        }
      })
    } else {
      // Dropdown 组件的滚动处理
      if (scrollRef.current) {
        scrollRef.current.scrollTop -= amount
        flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0))
      }
    }
  })

  // 箭头隐藏处理 - 触摸相关的逻辑
  const handleArrowHide = useEventCallback(() => {
    if (touch && selectTimeoutRef.current) {
      clearTimeout(selectTimeoutRef.current)
    }
  })

  // 滚动事件处理
  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const target = event.currentTarget
    flushSync(() => setScrollTop(target.scrollTop))
  })

  // 缓存滚动属性对象，避免每次渲染都创建新对象
  // 使用 useMemo 确保 handleScroll 引用变化时才重新创建
  const scrollProps = useMemo(
    () => ({
      onScroll: handleScroll,
    }),
    [handleScroll],
  )

  return {
    handleArrowScroll,
    handleArrowHide,
    handleScroll,
    scrollProps,
  }
}
