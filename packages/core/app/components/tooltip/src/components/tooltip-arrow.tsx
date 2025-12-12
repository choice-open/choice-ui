import { tcx } from "@choice-ui/shared"
import { useMergeRefs } from "@floating-ui/react"
import { forwardRef, useMemo } from "react"
import { useTooltipState } from "../context/tooltip-context"
import type { TooltipArrowProps } from "../types"
import { tooltipContentVariants } from "../tv"

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

  // Use useMergeRefs to merge refs
  const ref = useMergeRefs([state.arrowRef, propRef])

  // Get arrow position data from middlewareData
  const { x, y } = state.middlewareData.arrow || {}
  const placement = state.placement
  const side = placement.split("-")[0] as Side

  // Cache calculation results
  const staticSide = useMemo(() => STATIC_SIDE_MAP[side], [side])

  // Arrow style, according to the official example
  const arrowStyles = useMemo(() => {
    const offset = `${-ARROW_SIZE / 2}px`

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      width: `${ARROW_SIZE}px`,
      height: `${ARROW_SIZE}px`,
      transform: "rotate(45deg)",
      // floating-ui will automatically calculate the correct position and avoid corner conflicts
      top: y != null ? `${y}px` : undefined,
      left: x != null ? `${x}px` : undefined,
      right: undefined,
      bottom: undefined,
    }

    // Set static position, so the arrow protrudes from the container
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

  // Cache style variant calculation
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
