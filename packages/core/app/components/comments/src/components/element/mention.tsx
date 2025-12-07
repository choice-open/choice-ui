import { Avatar } from "@choiceform/avatar"
import { Tooltip } from "@choiceform/tooltip"
import { memo, useEffect, useMemo } from "react"
import { Editor, Transforms } from "slate"
import { ReactEditor, RenderElementProps, useFocused, useSelected, useSlate } from "slate-react"
import type { MentionElement } from "../../comment-input/types"
import { CommentInputElementTv } from "./tv"

interface MentionProps extends Omit<RenderElementProps, "element" | "children"> {
  children?: React.ReactNode
  className?: string
  mentionElement: MentionElement
}

export const Mention = memo(function Mention(props: MentionProps) {
  const { mentionElement, children, attributes, className } = props
  const selected = useSelected()
  const focused = useFocused()
  const editor = useSlate()

  const styles = CommentInputElementTv()

  useEffect(() => {
    if (selected && focused) {
      const path = ReactEditor.findPath(editor, mentionElement)
      const after = Editor.after(editor, path)
      if (after) {
        Transforms.select(editor, after)
      }
    }
  }, [selected, focused, editor, mentionElement])

  const tooltipContent = useMemo(
    () => (
      <span className={styles.mentionTooltip()}>
        <span className={styles.mentionTooltipAvatar()}>
          <Avatar
            photo={mentionElement.user?.photo_url || undefined}
            name={mentionElement.user?.name}
          />
        </span>
        <span className={styles.mentionTooltipContent()}>
          <span>{mentionElement.user?.name}</span>
          {mentionElement.user?.email && (
            <span className={styles.mentionTooltipEmail()}>{mentionElement.user.email}</span>
          )}
        </span>
      </span>
    ),
    [styles, mentionElement.user?.photo_url, mentionElement.user?.name, mentionElement.user?.email],
  )

  return (
    <Tooltip
      placement="top"
      content={tooltipContent}
    >
      <span
        {...attributes}
        className={styles.mentionRoot({ className })}
      >
        <span
          contentEditable={false}
          data-mention="true"
        >
          @{mentionElement.user?.name}
        </span>
        {children}
      </span>
    </Tooltip>
  )
})
