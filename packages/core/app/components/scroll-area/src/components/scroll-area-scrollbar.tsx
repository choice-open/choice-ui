import { tcx } from "@choice-ui/shared"
import React, { forwardRef, useCallback, useMemo } from "react"
import { useScrollAreaContext } from "../context/scroll-area-context"
import { useHasOverflow, useScrollbarShouldShow } from "../hooks"
import { ScrollTv } from "../tv"
import type { ScrollbarProps } from "../types"
import { getScrollbarPositionStyle, handleScrollbarTrackClick } from "../utils"

export const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    const {
      viewport,
      scrollState,
      scrollbarMode,
      hoverBoundary,
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

    // Use optimized hooks
    const hasOverflow = useHasOverflow(scrollState, orientation)
    const shouldShow = useScrollbarShouldShow(type, hasOverflow, isScrolling, isHovering)

    // Calculate scroll position percentage
    const scrollPercentage = useMemo(() => {
      if (orientation === "vertical") {
        const maxScroll = scrollState.scrollHeight - scrollState.clientHeight
        return maxScroll > 0 ? Math.round((scrollState.scrollTop / maxScroll) * 100) : 0
      } else {
        const maxScroll = scrollState.scrollWidth - scrollState.clientWidth
        return maxScroll > 0 ? Math.round((scrollState.scrollLeft / maxScroll) * 100) : 0
      }
    }, [scrollState, orientation])

    // Cache event handlers
    const handleTrackClick = useCallback(
      (e: React.MouseEvent) => {
        if (!viewport) return
        if (e.target === e.currentTarget) {
          handleScrollbarTrackClick(e, viewport, scrollState, orientation)
        }
      },
      [viewport, scrollState, orientation],
    )

    // Cache TV configuration
    const tv = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation,
          hoverBoundary,
        }),
      [variant, scrollbarMode, orientation, hoverBoundary],
    )

    // Optimize ref setting
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
        className={tcx(tv.scrollbar(), className)}
        style={getScrollbarPositionStyle(orientation)}
        onClick={handleTrackClick}
        // WAI-ARIA attributes
        role="scrollbar"
        aria-controls={viewportId}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={scrollPercentage}
        aria-valuetext={`${scrollPercentage}% scrolled ${orientation}ly`}
        aria-label={`${orientation} scrollbar`}
        {...props}
      />
    )
  },
)

ScrollAreaScrollbar.displayName = "ScrollArea.Scrollbar"
