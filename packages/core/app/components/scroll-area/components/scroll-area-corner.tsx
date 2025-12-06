import React, { forwardRef, useMemo } from "react"
import { tcx } from "~/utils"
import { ScrollTv } from "../tv"
import { shouldShowCorner } from "../utils"
import { useScrollAreaContext } from "../context/scroll-area-context"

export const ScrollAreaCorner = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { scrollState, scrollbarMode, variant } = useScrollAreaContext()

    // 缓存TV配置
    const tvConfig = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation: "vertical",
        }),
      [variant, scrollbarMode],
    )

    // 缓存样式对象
    const cornerStyle = useMemo(
      () => ({
        position: "absolute" as const,
        bottom: 0,
        right: 0,
        width: "10px",
        height: "10px",
      }),
      [],
    )

    if (!shouldShowCorner(scrollState)) return null

    return (
      <div
        ref={ref}
        className={tcx(tvConfig.corner(), className)}
        style={cornerStyle}
        // WAI-ARIA 属性
        role="presentation"
        aria-hidden="true"
        {...props}
      />
    )
  },
)

ScrollAreaCorner.displayName = "ScrollArea.Corner"
