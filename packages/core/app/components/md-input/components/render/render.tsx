import { forwardRef, memo, useMemo } from "react"
import { ScrollArea } from "~/components/scroll-area"
import { tcx } from "~/utils"
import type { MentionItemProps, MentionRenderProps } from "../../types"
import { MarkdownBlock } from "./markdown-block"
import { createMarkdownComponents } from "./markdown-components"
import { mdTv } from "./tv"

interface RenderProps {
  allowedPrefixes?: string[]
  className?: string
  content: string
  contentRef?: React.RefObject<HTMLDivElement>
  mentionItems?: MentionItemProps[]
  mentionRenderComponent?: React.ComponentType<MentionRenderProps>
  scrollRef?: React.RefObject<HTMLDivElement>
  theme?: "light" | "dark"
  withScrollArea?: boolean
}

const tv = mdTv()

export const Render = memo(
  forwardRef<HTMLDivElement, RenderProps>(function Render(props, ref) {
    const {
      content,
      className,
      mentionRenderComponent,
      mentionItems,
      allowedPrefixes,
      theme = "light",
      withScrollArea = true,
      contentRef,
      scrollRef,
    } = props
    const components = useMemo(
      () => createMarkdownComponents(tv, mentionRenderComponent, mentionItems, theme),
      [mentionRenderComponent, mentionItems, theme],
    )

    const defaultPrefixes = useMemo(
      () => ["https://", "http://", "#", "mailto:", "data:image/"],
      [],
    )

    const finalPrefixes = useMemo(
      () => allowedPrefixes || defaultPrefixes,
      [allowedPrefixes, defaultPrefixes],
    )

    return withScrollArea ? (
      <ScrollArea className={className}>
        <ScrollArea.Viewport ref={scrollRef}>
          <ScrollArea.Content ref={contentRef}>
            <div
              ref={ref}
              className={tv.root()}
            >
              <MarkdownBlock
                content={content}
                components={components}
                allowedLinkPrefixes={finalPrefixes}
                allowedImagePrefixes={finalPrefixes}
              />
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>
    ) : (
      <div
        ref={ref}
        className={tcx(tv.root(), className)}
      >
        <MarkdownBlock
          content={content}
          components={components}
          allowedLinkPrefixes={finalPrefixes}
          allowedImagePrefixes={finalPrefixes}
        />
      </div>
    )
  }),
)
