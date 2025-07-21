import React from "react"
import { RenderElementProps, useFocused, useSelected } from "slate-react"
import type { ContextInputProps, ContextMentionElement, MentionMatch } from "../types"
import { mentionElementTv } from "./tv"

interface MentionElementProps extends RenderElementProps {
  renderMention?: ContextInputProps["renderMention"]
  variant?: ContextInputProps["variant"]
}

export const MentionElement: React.FC<MentionElementProps> = ({
  attributes,
  children,
  element,
  renderMention,
  variant,
}) => {
  const selected = useSelected()
  const focused = useFocused()
  const mentionElement = element as unknown as ContextMentionElement

  const tv = mentionElementTv({ selected: selected && focused, variant })

  // 如果有自定义渲染函数，使用自定义渲染
  if (renderMention) {
    return (
      <span
        {...attributes}
        contentEditable={false}
      >
        {renderMention({
          item: {
            id: mentionElement.mentionId,
            type: mentionElement.mentionType,
            label: mentionElement.mentionLabel,
            metadata: mentionElement.mentionData,
          },
          startIndex: 0,
          endIndex: 0,
          text: mentionElement.mentionLabel,
        } as MentionMatch)}
        {children}
      </span>
    )
  }

  return (
    <span
      {...attributes}
      contentEditable={false}
      className={tv}
    >
      {children}@{mentionElement.mentionLabel}
    </span>
  )
}
