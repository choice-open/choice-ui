import React, { useMemo } from "react"
import { useFocused, useSelected } from "slate-react"
import type { ContextMentionElement, MentionMatch, MentionProps } from "../types"
import { mentionElementTv } from "./tv"

/**
 * 默认的 Mention 组件
 * 用户可以通过 ContextInput.Mention 自定义这个组件
 */
const MentionComponent = (props: MentionProps) => {
  const { attributes, children, element, renderMention, mentionPrefix = "@", variant } = props
  const selected = useSelected()
  const focused = useFocused()

  // 缓存 mentionElement 转换
  const mentionElement = useMemo(() => element as unknown as ContextMentionElement, [element])

  // 缓存样式计算
  const tv = useMemo(
    () => mentionElementTv({ selected: selected && focused, variant }),
    [selected, focused, variant],
  )

  // 缓存 MentionMatch 对象以避免重复创建
  const mentionMatch = useMemo(
    (): MentionMatch => ({
      item: {
        id: mentionElement.mentionId,
        type: mentionElement.mentionType,
        label: mentionElement.mentionLabel,
        metadata: mentionElement.mentionData,
      },
      startIndex: 0,
      endIndex: 0,
      text: mentionElement.mentionLabel,
    }),
    [
      mentionElement.mentionId,
      mentionElement.mentionType,
      mentionElement.mentionLabel,
      mentionElement.mentionData,
    ],
  )

  // 如果有自定义渲染函数，使用自定义渲染
  if (renderMention) {
    return (
      <span
        {...attributes}
        contentEditable={false}
      >
        {renderMention(mentionMatch)}
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
      {children}
      {mentionElement.mentionPrefix || mentionPrefix}
      {mentionElement.mentionLabel}
    </span>
  )
}

// 使用 React.memo 优化渲染性能，只在 props 真正变化时重新渲染
export const Mention = React.memo(MentionComponent, (prevProps, nextProps) => {
  // 自定义比较逻辑，确保深度比较 element 对象的相关属性
  const prevElement = prevProps.element as unknown as ContextMentionElement
  const nextElement = nextProps.element as unknown as ContextMentionElement

  return (
    prevProps.mentionPrefix === nextProps.mentionPrefix &&
    prevProps.variant === nextProps.variant &&
    prevProps.renderMention === nextProps.renderMention &&
    prevElement.mentionId === nextElement.mentionId &&
    prevElement.mentionType === nextElement.mentionType &&
    prevElement.mentionLabel === nextElement.mentionLabel &&
    prevElement.mentionPrefix === nextElement.mentionPrefix
  )
})

Mention.displayName = "Mention"
