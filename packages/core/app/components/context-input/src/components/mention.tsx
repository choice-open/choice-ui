import React, { useMemo } from "react"
import { useFocused, useSelected } from "slate-react"
import type { ContextMentionElement, MentionMatch, MentionProps } from "../types"
import { mentionElementTv } from "./tv"

/**
 * Default Mention component
 * Users can customize this component via ContextInput.Mention
 */
const MentionComponent = (props: MentionProps) => {
  const { attributes, children, element, renderMention, mentionPrefix = "@", variant } = props
  const selected = useSelected()
  const focused = useFocused()

  // Cache mentionElement conversion
  const mentionElement = useMemo(() => element as unknown as ContextMentionElement, [element])

  // Cache style calculations
  const tv = useMemo(
    () => mentionElementTv({ selected: selected && focused, variant }),
    [selected, focused, variant],
  )

  // Cache MentionMatch object to avoid repeated creation
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

  // If custom render function exists, use custom rendering
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

// Use React.memo to optimize render performance, only re-render when props actually change
export const Mention = React.memo(MentionComponent, (prevProps, nextProps) => {
  // Custom comparison logic to ensure deep comparison of element object's relevant properties
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
