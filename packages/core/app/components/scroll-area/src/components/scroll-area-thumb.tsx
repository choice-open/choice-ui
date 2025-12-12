import { tcx } from "@choice-ui/shared"
import { forwardRef, useCallback, useMemo } from "react"
import { useScrollAreaContext } from "../context/scroll-area-context"
import { useThumbDrag, useThumbStyle } from "../hooks"
import { ScrollTv } from "../tv"
import type { ThumbProps } from "../types"

export const ScrollAreaThumb = forwardRef<HTMLDivElement, ThumbProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    const { viewport, scrollState, scrollbarMode, variant, setThumbX, setThumbY } =
      useScrollAreaContext()

    // Use optimized hooks
    const { handleMouseDown } = useThumbDrag(viewport, scrollState, orientation)
    const thumbStyle = useThumbStyle(scrollState, orientation)

    // Cache TV configuration
    const tv = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation,
        }),
      [variant, scrollbarMode, orientation],
    )

    // Optimize ref setting
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
        className={tcx(tv.thumb(), className)}
        style={thumbStyle}
        onMouseDown={handleMouseDown}
        // WAI-ARIA attributes
        role="button"
        aria-label={`${orientation} scroll thumb`}
        aria-hidden="true"
        {...props}
      />
    )
  },
)

ScrollAreaThumb.displayName = "ScrollArea.Thumb"
