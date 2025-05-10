import { forwardRef } from "react"
import * as ScrollArea from "./scroll-area"
import { ScrollAreaProps, Viewport } from "./scroll-area"
import { tcx } from "~/utils"
import { ScrollTv } from "./tv"

export interface ScrollProps extends ScrollAreaProps {
  classNames?: {
    root?: string
    content?: string
    scrollbar?: string
    thumb?: string
    corner?: string
  }
  variant?: "auto" | "light" | "dark"
  scrollbarMode?: "default" | "large-y" | "large-t" | "large-b" | "large-x" | "large-l" | "large-r"
  orientation?: "vertical" | "horizontal" | "both"
}

const ScrollComponent = forwardRef<HTMLDivElement, ScrollProps>((props, ref) => {
  const {
    className,
    classNames,
    children,
    variant,
    scrollbarMode,
    orientation = "both",
    ...rest
  } = props

  const style = ScrollTv({
    variant,
    scrollbarMode,
  })

  return (
    <ScrollArea.Root
      ref={ref}
      className={tcx(style.root(), classNames?.root, className)}
      {...rest}
    >
      {children}

      {(orientation === "vertical" || orientation === "both") && (
        <ScrollArea.Scrollbar
          className={tcx(style.scrollbar({ orientation: "vertical" }), classNames?.scrollbar)}
          orientation="vertical"
        >
          <ScrollArea.Thumb className={tcx(style.thumb(), classNames?.thumb)} />
        </ScrollArea.Scrollbar>
      )}

      {(orientation === "horizontal" || orientation === "both") && (
        <ScrollArea.Scrollbar
          className={tcx(style.scrollbar({ orientation: "horizontal" }), classNames?.scrollbar)}
          orientation="horizontal"
        >
          <ScrollArea.Thumb className={tcx(style.thumb(), classNames?.thumb)} />
        </ScrollArea.Scrollbar>
      )}

      <ScrollArea.Corner className={tcx(style.corner(), classNames?.corner)} />
    </ScrollArea.Root>
  )
})

ScrollComponent.displayName = "Scroll"

export const Scroll = Object.assign(ScrollComponent, {
  Viewport: Viewport,
})
