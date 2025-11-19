import { forwardRef, memo } from "react"
import { Render } from "./render"
import { useMdInputContext } from "../context"
import { mdInputTv } from "../tv"
import { tcx } from "~/utils"

export interface MdInputRenderProps {
  className?: string
  contentRef?: React.RefObject<HTMLDivElement>
  scrollRef?: React.RefObject<HTMLDivElement>
  withScrollArea?: boolean
}

export const MdInputRender = memo(
  forwardRef<HTMLDivElement, MdInputRenderProps>((props, ref) => {
    const { className, withScrollArea = true, contentRef, scrollRef } = props
    const {
      value,
      activeTab,
      disabled,
      readOnly,
      mentionRenderComponent,
      mentionItems,
      allowedPrefixes,
      theme,
      hasTabs,
    } = useMdInputContext()
    const tv = mdInputTv({ disabled, readOnly, hasTabs })

    // 如果有 Tabs，根据 activeTab 判断可见性；如果没有 Tabs，始终可见
    if (hasTabs && activeTab !== "preview") {
      return null
    }

    return (
      <Render
        ref={ref}
        content={value}
        className={tcx(tv.render(), className)}
        mentionRenderComponent={mentionRenderComponent}
        mentionItems={mentionItems}
        allowedPrefixes={allowedPrefixes}
        theme={theme}
        withScrollArea={withScrollArea}
        contentRef={contentRef}
        scrollRef={scrollRef}
      />
    )
  }),
)

MdInputRender.displayName = "MdInputRender"
