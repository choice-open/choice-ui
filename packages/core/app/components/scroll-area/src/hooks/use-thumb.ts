import { useCallback, useRef, useMemo, useEffect } from "react"
import type { ScrollState } from "../types"

/**
 * 缓存的 thumb 样式计算 hook
 */
export function useThumbStyle(scrollState: ScrollState, orientation: "vertical" | "horizontal") {
  return useMemo(() => {
    if (orientation === "vertical") {
      // 🔧 添加更严格的验证，确保数值有效
      const hasValidDimensions =
        scrollState.scrollHeight > 0 &&
        scrollState.clientHeight > 0 &&
        Number.isFinite(scrollState.scrollHeight) &&
        Number.isFinite(scrollState.clientHeight) &&
        Number.isFinite(scrollState.scrollTop)

      if (!hasValidDimensions || scrollState.scrollHeight <= scrollState.clientHeight + 1) {
        return { height: "0%", top: "0%" }
      }

      const scrollableHeight = scrollState.scrollHeight - scrollState.clientHeight
      const scrollRatio = Math.max(0, Math.min(1, scrollState.scrollTop / scrollableHeight))
      const thumbHeight = Math.max(10, (scrollState.clientHeight / scrollState.scrollHeight) * 100)
      const thumbTop = scrollRatio * (100 - thumbHeight)

      return {
        height: `${thumbHeight}%`,
        top: `${Math.max(0, Math.min(thumbTop, 100 - thumbHeight))}%`,
      }
    } else {
      // 🔧 添加更严格的验证，确保数值有效
      const hasValidDimensions =
        scrollState.scrollWidth > 0 &&
        scrollState.clientWidth > 0 &&
        Number.isFinite(scrollState.scrollWidth) &&
        Number.isFinite(scrollState.clientWidth) &&
        Number.isFinite(scrollState.scrollLeft)

      if (!hasValidDimensions || scrollState.scrollWidth <= scrollState.clientWidth + 1) {
        return { width: "0%", left: "0%" }
      }

      const scrollableWidth = scrollState.scrollWidth - scrollState.clientWidth
      const scrollRatio = Math.max(0, Math.min(1, scrollState.scrollLeft / scrollableWidth))
      const thumbWidth = Math.max(10, (scrollState.clientWidth / scrollState.scrollWidth) * 100)
      const thumbLeft = scrollRatio * (100 - thumbWidth)

      return {
        width: `${thumbWidth}%`,
        left: `${Math.max(0, Math.min(thumbLeft, 100 - thumbWidth))}%`,
      }
    }
  }, [
    scrollState.scrollLeft,
    scrollState.scrollTop,
    scrollState.scrollWidth,
    scrollState.scrollHeight,
    scrollState.clientWidth,
    scrollState.clientHeight,
    orientation,
  ])
}

/**
 * 🚀 高性能 thumb 拖拽 hook - 优化拖拽响应性和性能
 */
export function useThumbDrag(
  viewport: HTMLDivElement | null,
  scrollState: ScrollState,
  orientation: "vertical" | "horizontal",
) {
  const isDragging = useRef(false)
  const startPos = useRef(0)
  const startScroll = useRef(0)
  const rafId = useRef<number>()
  const cleanupRef = useRef<(() => void) | null>(null)

  // 🚀 性能优化：缓存拖拽计算参数，避免重复计算
  const dragContextRef = useRef<{
    scrollableRange: number
    scrollbarRange: number
    scrollbarRect: DOMRect
  } | null>(null)

  // 确保组件卸载时清理事件监听器
  useEffect(() => {
    return () => {
      // 清理拖拽状态
      isDragging.current = false

      // 清理RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = undefined
      }

      // 清理事件监听器
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!viewport) return

      // 🔧 获取scrollbar元素
      const target = e.currentTarget as HTMLElement
      const scrollbar = target.closest('[role="scrollbar"]') as HTMLElement
      if (!scrollbar) return

      // 🚀 性能优化：预计算拖拽上下文，避免在mousemove中重复计算
      const scrollbarRect = scrollbar.getBoundingClientRect()
      const scrollableRange =
        orientation === "vertical"
          ? Math.max(0, scrollState.scrollHeight - scrollState.clientHeight)
          : Math.max(0, scrollState.scrollWidth - scrollState.clientWidth)
      const scrollbarRange = orientation === "vertical" ? scrollbarRect.height : scrollbarRect.width

      if (scrollableRange <= 0 || scrollbarRange <= 0) return

      dragContextRef.current = {
        scrollbarRect,
        scrollableRange,
        scrollbarRange,
      }

      isDragging.current = true
      startPos.current = orientation === "vertical" ? e.clientY : e.clientX
      startScroll.current =
        orientation === "vertical" ? scrollState.scrollTop : scrollState.scrollLeft

      // 🚀 性能优化：预计算转换比例，避免在每次mousemove中除法运算
      const scrollRatio = scrollableRange / scrollbarRange

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !viewport || !dragContextRef.current) return

        // 使用RAF节流，确保拖拽流畅且不阻塞UI
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }

        rafId.current = requestAnimationFrame(() => {
          const currentPos = orientation === "vertical" ? e.clientY : e.clientX
          const delta = currentPos - startPos.current

          // 🚀 性能优化：使用预计算的比例，避免重复除法运算
          const scrollDelta = delta * scrollRatio
          const newScrollValue = Math.max(
            0,
            Math.min(startScroll.current + scrollDelta, dragContextRef.current!.scrollableRange),
          )

          // 🚀 性能优化：减少DOM操作，直接设置对应方向的scroll值
          if (orientation === "vertical") {
            viewport.scrollTop = newScrollValue
          } else {
            viewport.scrollLeft = newScrollValue
          }
        })
      }

      const handleMouseUp = () => {
        isDragging.current = false
        // 🚀 性能优化：清理拖拽上下文
        dragContextRef.current = null
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        cleanupRef.current = null
      }

      // 创建清理函数
      const cleanup = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      cleanupRef.current = cleanup

      document.addEventListener("mousemove", handleMouseMove, { passive: true })
      document.addEventListener("mouseup", handleMouseUp, { passive: true })

      e.preventDefault()
    },
    [viewport, orientation, scrollState],
  )

  return {
    isDragging: isDragging.current,
    handleMouseDown,
  }
}
