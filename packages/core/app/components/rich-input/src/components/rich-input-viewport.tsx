import { ScrollArea } from "@choiceform/scroll-area"
import { forwardRef, useMemo } from "react"
import { useRichInputContext } from "../context"
import { richInputTv } from "../tv"
import { RichInputViewportProps } from "../types"

/**
 * RichInput.Viewport - 富文本输入的视口容器
 * 使用 ScrollArea 提供滚动功能
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
