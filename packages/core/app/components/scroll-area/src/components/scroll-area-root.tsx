import { tcx } from "@choiceform/design-shared"
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

    // 使用 React useId 生成 SSR 安全的唯一 ID
    const reactId = useId()
    const rootId = id || `scroll-area${reactId}`
    const viewportId = `scroll-viewport${reactId}`
    const scrollbarXId = `scroll-x${reactId}`
    const scrollbarYId = `scroll-y${reactId}`

    const { scrollState, isHovering, isScrolling, handleMouseEnter, handleMouseLeave } =
      useScrollStateAndVisibility(viewport)

    // 缓存静态配置，避免每次渲染重新创建
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

    // 缓存Context值，只在相关状态变化时才更新
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
        // 添加 ID 相关的值
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

    // 缓存TV配置
    const tvConfig = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation: orientation === "both" ? "vertical" : orientation,
          hoverBoundary,
        }),
      [variant, scrollbarMode, orientation, hoverBoundary],
    )

    // 缓存render prop的位置计算，只在scrollState变化时重新计算
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

    // 判断children是否是函数（render prop）
    const isRenderProp = typeof children === "function"

    // 如果是render prop，调用函数；否则直接使用children
    const renderedChildren = isRenderProp
      ? (children as ScrollAreaRenderProp)(scrollPosition)
      : children

    // 自动渲染滚动条组件
    const autoScrollbars = useMemo(() => {
      const scrollbars = []

      // 根据 orientation 自动添加对应的滚动条
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

      // 如果是双向滚动，添加 Corner
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
          className={tcx(tvConfig.root(), className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // WAI-ARIA 属性
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
