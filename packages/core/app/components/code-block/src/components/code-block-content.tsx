import { tcv, tcx } from "@choice-ui/shared"
import { ScrollArea } from "@choice-ui/scroll-area"
import { memo } from "react"
import type { CodeBlockContentProps } from "../types"
import { CodeBlockCode } from "./code-block-code"

/** Pixels per line for height calculation */
const LINE_HEIGHT_PX = 16
/** Padding offset for height calculation */
const HEIGHT_PADDING_PX = 32 + 40

const codeBlockTv = tcv({
  slots: {
    code: "overflow-hidden min-h-0 flex-1",
    content: "flex w-fit flex-col overflow-clip p-[inherit]",
  },
})

export const CodeBlockContent = memo(function CodeBlockContent(props: CodeBlockContentProps) {
  const { className, codeBlock, withScrollArea = true, children } = props

  if (!codeBlock) return null

  const { language, isExpanded, codeExpanded, scrollRef, contentRef, lineCount, lineThreshold } =
    codeBlock

  if (!isExpanded) {
    return null
  }

  // Ensure code is a string
  if (typeof children !== "string") {
    return null
  }

  const tv = codeBlockTv()

  // 根据 lineThreshold 决定是否需要限制高度
  const shouldLimitHeight = lineThreshold && lineCount > lineThreshold && !codeExpanded

  return (
    <>
      {withScrollArea ? (
        <ScrollArea
          orientation="both"
          hoverBoundary="none"
          className={tcx(tv.code(), className)}
          variant={codeBlock.variant}
        >
          <ScrollArea.Viewport
            ref={scrollRef}
            style={{
              maxHeight: shouldLimitHeight
                ? `${lineThreshold * LINE_HEIGHT_PX + HEIGHT_PADDING_PX}px`
                : "none",
            }}
          >
            <ScrollArea.Content
              ref={contentRef}
              className={tv.content()}
            >
              <CodeBlockCode
                language={language}
                codeBlock={codeBlock}
              >
                {children}
              </CodeBlockCode>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      ) : (
        <div className={tcx(tv.content(), className)}>
          <CodeBlockCode
            language={language}
            codeBlock={codeBlock}
          >
            {children}
          </CodeBlockCode>
        </div>
      )}
    </>
  )
})
