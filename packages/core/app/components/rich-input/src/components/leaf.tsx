import { tcx } from "@choiceform/design-shared"
import { memo, ReactNode } from "react"
import { match } from "ts-pattern"
import { leafTv } from "../tv"
import type { LeafRenderProps } from "../types"

export const LeafRender = memo(function LeafRender({
  attributes,
  children,
  leaf,
}: LeafRenderProps) {
  const tv = leafTv()

  // Apply text formatting in a specific order using a reducer pattern
  const formats: Array<{
    key: "bold" | "italic" | "underlined" | "strikethrough" | "code"
    wrapper: (children: ReactNode) => ReactNode
  }> = [
    {
      key: "bold",
      wrapper: (content) => (
        <strong className={tcx(tv.element({ type: "strong" }))}>{content}</strong>
      ),
    },
    {
      key: "italic",
      wrapper: (content) => <em className={tcx(tv.element({ type: "em" }))}>{content}</em>,
    },
    {
      key: "underlined",
      wrapper: (content) => <u className={tcx(tv.element({ type: "u" }))}>{content}</u>,
    },
    {
      key: "strikethrough",
      wrapper: (content) => <s className={tcx(tv.element({ type: "del" }))}>{content}</s>,
    },
    {
      key: "code",
      wrapper: (content) => <code className={tcx(tv.element({ type: "code" }))}>{content}</code>,
    },
  ]

  // Apply all formats using reduce
  const formattedContent = formats.reduce((content, format) => {
    return match(leaf)
      .with({ [format.key]: true }, () => format.wrapper(content))
      .otherwise(() => content)
  }, children as ReactNode)

  // Handle link separately as it has additional logic
  const finalContent = match(leaf)
    .when(
      (l) => Boolean(l.link && l.link !== ""),
      () => (
        <a
          href={leaf.link}
          target="_blank"
          rel="noopener noreferrer"
          className={tcx(tv.element({ type: "link" }))}
        >
          {formattedContent}
        </a>
      ),
    )
    .otherwise(() => formattedContent)

  return <span {...attributes}>{finalContent}</span>
})
