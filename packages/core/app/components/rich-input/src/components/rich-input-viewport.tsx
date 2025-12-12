import { ScrollArea } from "@choice-ui/scroll-area"
import { forwardRef, useMemo } from "react"
import { useRichInputContext } from "../context"
import { richInputTv } from "../tv"
import { RichInputViewportProps } from "../types"

/**
 * RichInput.Viewport - Rich text input viewport container
 * Uses ScrollArea for scrolling functionality
 */
export const RichInputViewport = forwardRef<HTMLDivElement, RichInputViewportProps>(
  ({ className, children }, ref) => {
    const context = useRichInputContext()
    const tv = useMemo(() => richInputTv(), [])

    return (
      <ScrollArea.Viewport
        ref={ref || context.viewportRef}
        className={tv.viewport({ className })}
      >
        <ScrollArea.Content className={tv.content()}>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
    )
  },
)

RichInputViewport.displayName = "RichInput.Viewport"

export default RichInputViewport
