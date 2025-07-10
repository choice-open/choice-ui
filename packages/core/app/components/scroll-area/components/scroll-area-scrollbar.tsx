import React, { forwardRef, useCallback, useMemo } from "react"
import { tcx } from "../../../utils"
import { useHasOverflow, useScrollbarShouldShow } from "../hooks"
import { ScrollTv } from "../tv"
import type { ScrollbarProps } from "../types"
import { getScrollbarPositionStyle, handleScrollbarTrackClick } from "../utils"
import { useScrollAreaContext } from "./scroll-area-root"

export const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    const {
      viewport,
      scrollState,
      scrollbarMode,
      variant,
      type,
      isHovering,
      isScrolling,
      setScrollbarX,
      setScrollbarY,
      viewportId,
      scrollbarXId,
      scrollbarYId,
    } = useScrollAreaContext()

    // 使用优化的hooks
    const hasOverflow = useHasOverflow(scrollState, orientation)
    const shouldShow = useScrollbarShouldShow(type, hasOverflow, isScrolling, isHovering)

    // 缓存事件处理器
    const handleTrackClick = useCallback(
      (e: React.MouseEvent) => {
        if (!viewport) return
        if (e.target === e.currentTarget) {
          handleScrollbarTrackClick(e, viewport, scrollState, orientation)
        }
      },
      [viewport, scrollState, orientation],
    )

    // 缓存TV配置
    const tvConfig = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation,
        }),
      [variant, scrollbarMode, orientation],
    )

    // 优化ref设置
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (orientation === "vertical") {
          setScrollbarY(node)
        } else {
          setScrollbarX(node)
        }
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [orientation, setScrollbarX, setScrollbarY, ref],
    )

    if (!shouldShow) return null

    const scrollbarId = orientation === "vertical" ? scrollbarYId : scrollbarXId

    return (
      <div
        ref={setRef}
        id={scrollbarId}
        className={tcx(tvConfig.scrollbar(), className)}
        style={getScrollbarPositionStyle(orientation)}
        onClick={handleTrackClick}
        // WAI-ARIA 属性
        role="scrollbar"
        aria-controls={viewportId}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${orientation} scrollbar`}
        tabIndex={-1}
        {...props}
      />
    )
  },
)

ScrollAreaScrollbar.displayName = "ScrollArea.Scrollbar"
