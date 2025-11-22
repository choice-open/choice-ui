import { ScrollArea, tcx } from "@choiceform/design-system"
import { tcv } from "@choiceform/design-system"
import type { CodeBlockContentProps } from "../types"
import { CodeBlockCode } from "./code-block-code"

const codeBlockTv = tcv({
  slots: {
    code: "overflow-hidden",
    content: "flex w-fit flex-col overflow-clip p-4",
  },
})

export function CodeBlockContent(props: CodeBlockContentProps) {
  const { code, className, codeBlock, withScrollArea = true } = props

  if (!codeBlock) return null
  const { language, isExpanded, codeExpanded, scrollRef, contentRef, lineCount, lineThreshold } =
    codeBlock

  if (!isExpanded) {
    return null
  }

  const tv = codeBlockTv()

  // 根据 lineThreshold 决定是否需要限制高度
  const shouldLimitHeight = lineCount > lineThreshold && !codeExpanded

  return withScrollArea ? (
    <ScrollArea
      orientation="both"
      className={tcx(tv.code(), className)}
      hoverBoundary="none"
    >
      <ScrollArea.Viewport
        ref={scrollRef}
        style={{
          maxHeight: shouldLimitHeight ? `${lineThreshold * 14 + 32}px` : "none",
        }}
      >
        <ScrollArea.Content
          ref={contentRef}
          className={tv.content()}
        >
          <CodeBlockCode
            code={code}
            language={language}
          />
        </ScrollArea.Content>
      </ScrollArea.Viewport>
    </ScrollArea>
  ) : (
    <div className={tcx(tv.content(), className)}>
      <CodeBlockCode
        code={code}
        language={language}
      />
    </div>
  )
}
