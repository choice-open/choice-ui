import { tcx } from "@choice-ui/shared"
import React, { forwardRef, useCallback, useMemo } from "react"
import { useScrollAreaContext } from "../context/scroll-area-context"

export const ScrollAreaContent = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { setContent, orientation } = useScrollAreaContext()

    // Optimize ref setting
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

    // Dynamically set size classes based on orientation
    const sizeClasses = useMemo(() => {
      switch (orientation) {
        case "vertical":
          return "w-fit min-w-full" // Vertical scroll: width adapts to content, height can exceed
        case "horizontal":
          return "h-fit min-h-full" // Horizontal scroll: height adapts to content, width can exceed
        case "both":
          return "" // Dual scroll: both directions can exceed, no size limit
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
