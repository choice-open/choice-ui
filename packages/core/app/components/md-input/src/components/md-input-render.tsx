import { tcx } from "@choiceform/design-shared"
import { MdRender, type MdRenderProps } from "@choiceform/md-render"
import { ScrollArea } from "@choiceform/scroll-area"
import { forwardRef, memo } from "react"
import { useMdInputContext } from "../context"
import { mdInputTv } from "../tv"

export interface MdInputRenderProps extends Omit<MdRenderProps, "content"> {
  className?: string
  contentRef?: React.RefObject<HTMLDivElement>
  scrollRef?: React.RefObject<HTMLDivElement>
}

export const MdInputRender = memo(
  forwardRef<HTMLDivElement, MdInputRenderProps>((props, ref) => {
    const { className, contentRef, scrollRef, ...rest } = props
    const { value, activeTab, disabled, readOnly, mentionItems, hasTabs } = useMdInputContext()

    const tv = mdInputTv({ disabled, readOnly, hasTabs })

    // 如果有 Tabs，根据 activeTab 判断可见性；如果没有 Tabs，始终可见
    if (hasTabs && activeTab !== "preview") {
      return null
    }

    return (
      <ScrollArea className={tcx(tv.render(), className)}>
        <ScrollArea.Viewport ref={scrollRef}>
          <ScrollArea.Content
            ref={contentRef}
            className="w-full min-w-0"
          >
            <MdRender
              ref={ref}
              {...rest}
              content={value}
              mentionItems={mentionItems}
              className="p-4"
            />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    )
  }),
)

MdInputRender.displayName = "MdInputRender"
