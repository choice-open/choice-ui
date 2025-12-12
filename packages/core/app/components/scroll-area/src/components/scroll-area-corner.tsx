import { tcx } from "@choice-ui/shared"
import React, { forwardRef, useMemo } from "react"
import { useScrollAreaContext } from "../context/scroll-area-context"
import { ScrollTv } from "../tv"
import { shouldShowCorner } from "../utils"

export const ScrollAreaCorner = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { scrollState, scrollbarMode, variant } = useScrollAreaContext()

    // Cache TV configuration
    const tv = useMemo(
      () =>
        ScrollTv({
          variant,
          scrollbarMode,
          orientation: "vertical",
        }),
      [variant, scrollbarMode],
    )

    // Cache style object
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
        className={tcx(tv.corner(), className)}
        style={cornerStyle}
        // WAI-ARIA attributes
        role="presentation"
        aria-hidden="true"
        {...props}
      />
    )
  },
)

ScrollAreaCorner.displayName = "ScrollArea.Corner"
