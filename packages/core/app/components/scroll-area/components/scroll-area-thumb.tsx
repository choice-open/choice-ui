import React, { forwardRef, useCallback, useMemo } from "react"
import { tcx } from "~/utils"
import { useThumbDrag, useThumbStyle } from "../hooks"
import { ScrollTv } from "../tv"
import type { ThumbProps } from "../types"
import { useScrollAreaContext } from "../context/scroll-area-context"

export const ScrollAreaThumb = forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    const { viewport, scrollState, scrollbarMode, variant, setThumbX, setThumbY } =
      useScrollAreaContext()

    // 使用优化的hooks
    const { handleMouseDown } = useThumbDrag(viewport, scrollState, orientation)
    const thumbStyle = useThumbStyle(scrollState, orientation)

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
          setThumbY(node)
        } else {
          setThumbX(node)
        }
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [orientation, setThumbX, setThumbY, ref],
    )

    return (
      <div
        ref={setRef}
        className={tcx(tvConfig.thumb(), className)}
        style={thumbStyle}
        onMouseDown={handleMouseDown}
        // WAI-ARIA 属性
        role="button"
        aria-label={`${orientation} scroll thumb`}
        aria-hidden="true"
        {...props}
      />
    )
  },
)

ScrollAreaThumb.displayName = "ScrollArea.Thumb"
