import React, { forwardRef, useCallback, useMemo } from "react"
import { tcx } from "~/utils"
import { useScrollAreaContext } from "../context/scroll-area-context"

export const ScrollAreaContent = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { setContent, orientation } = useScrollAreaContext()

    // 优化ref设置
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        setContent(node)
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [setContent, ref],
    )

    // 根据 orientation 动态设置尺寸类名
    const sizeClasses = useMemo(() => {
      switch (orientation) {
        case "vertical":
          return "w-fit min-w-full" // 垂直滚动：宽度适应内容，高度可以超出
        case "horizontal":
          return "h-fit min-h-full" // 水平滚动：高度适应内容，宽度可以超出
        case "both":
          return "" // 双向滚动：两个方向都可以超出，不限制尺寸
        default:
          return "w-fit min-w-full"
      }
    }, [orientation])

    return (
      <div
        ref={setRef}
        className={tcx(sizeClasses, className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ScrollAreaContent.displayName = "ScrollArea.Content"
