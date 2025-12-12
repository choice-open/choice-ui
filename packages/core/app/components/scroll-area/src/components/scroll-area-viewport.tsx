import { tcx } from "@choice-ui/shared"
import React, { forwardRef, useCallback, useMemo } from "react"
import { useScrollAreaContext } from "../context/scroll-area-context"

export const ScrollAreaViewport = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { setViewport, orientation, viewportId } = useScrollAreaContext()

    // Cache scroll class name
    const scrollClass = useMemo(() => {
      switch (orientation) {
        case "horizontal":
          return "overflow-x-auto overflow-y-hidden"
        case "both":
          return "overflow-auto"
        default:
          return "overflow-y-auto overflow-x-hidden"
      }
    }, [orientation])

    // Optimize ref setting, avoid function recreation
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        setViewport(node)
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [setViewport, ref],
    )

    return (
      <div
        ref={setRef}
        id={viewportId}
        className={tcx("scrollbar-hide h-full w-full", scrollClass, className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ScrollAreaViewport.displayName = "ScrollArea.Viewport"
