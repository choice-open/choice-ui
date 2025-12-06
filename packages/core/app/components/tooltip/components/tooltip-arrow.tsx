import { useMergeRefs } from "@floating-ui/react"
import { forwardRef, useMemo } from "react"
import { tcx } from "~/utils"
import { useTooltipState } from "../context/tooltip-context"
import { tooltipContentVariants } from "../tv"

interface TooltipArrowProps {
  className?: string
  variant?: "default" | "light"
}

// 常量提取
const ARROW_SIZE = 6
const STATIC_SIDE_MAP = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
} as const

type Side = keyof typeof STATIC_SIDE_MAP

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>(function TooltipArrow(
  { className, variant = "default" },
  propRef,
) {
  const state = useTooltipState()

  // 使用 useMergeRefs 合并 refs
  const ref = useMergeRefs([state.arrowRef, propRef])

  // 从 middlewareData 获取箭头位置数据
  const { x, y } = state.middlewareData.arrow || {}
  const placement = state.placement
  const side = placement.split("-")[0] as Side

  // 缓存计算结果
  const staticSide = useMemo(() => STATIC_SIDE_MAP[side], [side])

  // 箭头样式，按照官方示例
  const arrowStyles = useMemo(() => {
    const offset = `${-ARROW_SIZE / 2}px`

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      width: `${ARROW_SIZE}px`,
      height: `${ARROW_SIZE}px`,
      transform: "rotate(45deg)",
      // floating-ui 会自动计算正确的位置并避免圆角冲突
      top: y != null ? `${y}px` : undefined,
      left: x != null ? `${x}px` : undefined,
      right: undefined,
      bottom: undefined,
    }

    // 设置静态位置，让箭头伸出容器外
    switch (staticSide) {
      case "top":
        baseStyle.top = offset
        break
      case "right":
        baseStyle.right = offset
        break
      case "bottom":
        baseStyle.bottom = offset
        break
      case "left":
        baseStyle.left = offset
        break
    }

    return baseStyle
  }, [x, y, staticSide])

  // 缓存样式变体计算
  const tv = useMemo(() => tooltipContentVariants({ variant, placement: side }), [variant, side])

  return (
    <div
      ref={ref}
      style={arrowStyles}
      className={tcx(tv.arrow({ className }))}
      aria-hidden="true"
    />
  )
})
