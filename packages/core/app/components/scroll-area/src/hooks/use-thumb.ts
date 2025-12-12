import { useCallback, useRef, useMemo, useEffect } from "react"
import type { ScrollState } from "../types"

/**
 * Cached thumb style calculation hook
 */
export function useThumbStyle(scrollState: ScrollState, orientation: "vertical" | "horizontal") {
  return useMemo(() => {
    if (orientation === "vertical") {
      // 🔧 Add stricter checks to ensure values are valid
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
      // 🔧 Add stricter checks to ensure values are valid
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
 * 🚀 High-performance thumb drag hook - optimize drag responsiveness and performance
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

  // 🚀 Performance optimization: cache drag calculation parameters, avoid duplicate calculations
  const dragContextRef = useRef<{
    scrollableRange: number
    scrollbarRange: number
    scrollbarRect: DOMRect
  } | null>(null)

  // Ensure event listeners are cleaned up when the component unmounts
  useEffect(() => {
    return () => {
      // Clean up drag state
      isDragging.current = false

      // Clean up RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = undefined
      }

      // Clean up event listeners
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!viewport) return

      // 🔧 Get scrollbar element
      const target = e.currentTarget as HTMLElement
      const scrollbar = target.closest('[role="scrollbar"]') as HTMLElement
      if (!scrollbar) return

      // 🚀 Performance optimization: pre-calculate drag context, avoid duplicate calculations in mousemove
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

      // 🚀 Performance optimization: pre-calculate conversion ratio, avoid duplicate division operations in mousemove
      const scrollRatio = scrollableRange / scrollbarRange

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !viewport || !dragContextRef.current) return

        // Use RAF throttling, ensure drag is smooth and does not block UI
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }

        rafId.current = requestAnimationFrame(() => {
          const currentPos = orientation === "vertical" ? e.clientY : e.clientX
          const delta = currentPos - startPos.current

          // 🚀 Performance optimization: use pre-calculated ratio, avoid duplicate division operations
          const scrollDelta = delta * scrollRatio
          const newScrollValue = Math.max(
            0,
            Math.min(startScroll.current + scrollDelta, dragContextRef.current!.scrollableRange),
          )

          // 🚀 Performance optimization: reduce DOM operations, directly set scroll value for corresponding direction
          if (orientation === "vertical") {
            viewport.scrollTop = newScrollValue
          } else {
            viewport.scrollLeft = newScrollValue
          }
        })
      }

      const handleMouseUp = () => {
        isDragging.current = false
        // 🚀 Performance optimization: clean up drag context
        dragContextRef.current = null
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        cleanupRef.current = null
      }

      // Create cleanup function
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
