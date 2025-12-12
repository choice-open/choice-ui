import { tcx } from "@choice-ui/shared"
import { forwardRef, useId, useMemo, useState } from "react"
import { ScrollAreaContext } from "../context/scroll-area-context"
import { useScrollStateAndVisibility } from "../hooks"
import { ScrollTv } from "../tv"
import type {
  ScrollAreaContextType,
  ScrollAreaProps,
  ScrollAreaRenderProp,
  ScrollPosition,
} from "../types"
import { ScrollAreaCorner } from "./scroll-area-corner"
import { ScrollAreaScrollbar } from "./scroll-area-scrollbar"
import { ScrollAreaThumb } from "./scroll-area-thumb"

export const ScrollAreaRoot = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation = "vertical",
      scrollbarMode = "default",
      hoverBoundary = "hover",
      variant = "default",
      type = "hover",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const [content, setContent] = useState<HTMLDivElement | null>(null)
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null)
    const [scrollbarX, setScrollbarX] = useState<HTMLDivElement | null>(null)
    const [scrollbarY, setScrollbarY] = useState<HTMLDivElement | null>(null)
    const [thumbX, setThumbX] = useState<HTMLDivElement | null>(null)
    const [thumbY, setThumbY] = useState<HTMLDivElement | null>(null)

    // Use React useId to generate SSR-safe unique ID
    const reactId = useId()
    const rootId = id || `scroll-area${reactId}`
    const viewportId = `scroll-viewport${reactId}`
    const scrollbarXId = `scroll-x${reactId}`
    const scrollbarYId = `scroll-y${reactId}`

    const { scrollState, isHovering, isScrolling, handleMouseEnter, handleMouseLeave } =
      useScrollStateAndVisibility(viewport)

    // Cache static configuration, avoid recreating on each render
    const staticConfig = useMemo(
      () => ({
        orientation,
        scrollbarMode,
        hoverBoundary,
        variant,
        type,
      }),
      [orientation, scrollbarMode, hoverBoundary, variant, type],
    )

    // Cache Context values, only update when related states change
    const contextValue: ScrollAreaContextType = useMemo(
      () => ({
        content,
        orientation: staticConfig.orientation,
        scrollState,
        scrollbarMode: staticConfig.scrollbarMode,
        hoverBoundary: staticConfig.hoverBoundary,
        scrollbarX,
        scrollbarY,
        setContent,
        setScrollbarX,
        setScrollbarY,
        setThumbX,
        setThumbY,
        setViewport,
        thumbX,
        thumbY,
        variant: staticConfig.variant,
        viewport,
        type: staticConfig.type,
        isHovering,
        isScrolling,
        // Add ID-related values
        rootId,
        viewportId,
        scrollbarXId,
        scrollbarYId,
      }),
      [
        content,
        scrollState,
        scrollbarX,
        scrollbarY,
        thumbX,
        thumbY,
        viewport,
        isHovering,
        isScrolling,
        staticConfig,
        rootId,
        viewportId,
        scrollbarXId,
        scrollbarYId,
      ],
    )

    // Cache TV configuration
    const tv = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation: orientation === "both" ? "vertical" : orientation,
          hoverBoundary,
        }),
      [variant, scrollbarMode, orientation, hoverBoundary],
    )

    // Cache render prop position calculation, only recalculate when scrollState changes
    const scrollPosition = useMemo<ScrollPosition>(() => {
      const maxScrollTop = Math.max(0, scrollState.scrollHeight - scrollState.clientHeight)
      const maxScrollLeft = Math.max(0, scrollState.scrollWidth - scrollState.clientWidth)

      return {
        top: maxScrollTop > 0 ? scrollState.scrollTop / maxScrollTop : 0,
        left: maxScrollLeft > 0 ? scrollState.scrollLeft / maxScrollLeft : 0,
      }
    }, [
      scrollState.scrollTop,
      scrollState.scrollLeft,
      scrollState.scrollHeight,
      scrollState.clientHeight,
      scrollState.scrollWidth,
      scrollState.clientWidth,
    ])

    // Check if children is a function (render prop)
    const isRenderProp = typeof children === "function"

    // If it is a render prop, call the function; otherwise, use children directly
    const renderedChildren = isRenderProp
      ? (children as ScrollAreaRenderProp)(scrollPosition)
      : children

    // Automatically render scrollbar components
    const autoScrollbars = useMemo(() => {
      const scrollbars = []

      // Automatically add the corresponding scrollbar based on orientation
      if (orientation === "vertical" || orientation === "both") {
        scrollbars.push(
          <ScrollAreaScrollbar
            key="vertical"
            orientation="vertical"
          >
            <ScrollAreaThumb orientation="vertical" />
          </ScrollAreaScrollbar>,
        )
      }

      if (orientation === "horizontal" || orientation === "both") {
        scrollbars.push(
          <ScrollAreaScrollbar
            key="horizontal"
            orientation="horizontal"
          >
            <ScrollAreaThumb orientation="horizontal" />
          </ScrollAreaScrollbar>,
        )
      }

      // If it is dual scroll, add Corner
      if (orientation === "both") {
        scrollbars.push(<ScrollAreaCorner key="corner" />)
      }

      return scrollbars
    }, [orientation])

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={rootId}
          className={tcx(tv.root(), className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // WAI-ARIA attributes
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...props}
        >
          {renderedChildren}
          {autoScrollbars}
        </div>
      </ScrollAreaContext.Provider>
    )
  },
)

ScrollAreaRoot.displayName = "ScrollArea.Root"
