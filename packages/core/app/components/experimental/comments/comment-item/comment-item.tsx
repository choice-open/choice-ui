import { EllipsisSmall } from "@choiceform/icons-react"
import React, { forwardRef, memo, useCallback } from "react"
import { createEditor, Descendant } from "slate"
import { withHistory } from "slate-history"
import { Editable, RenderElementProps, Slate, withReact } from "slate-react"
import { Avatar } from "~/components/avatar"
import { Dropdown } from "../../../dropdown"
import { IconButton } from "../../../icon-button"
import { Tooltip } from "../../../tooltip"
import { renderLeaf } from "../comment-input/components"
import type { ItemDefaultText, Reaction, User } from "../types"
import { CommentItemReactions, EmptyReactionButton, renderElementWrapper } from "./components"
import { DateLocale, useFormattedDate } from "./hooks"
import { CommentItemTv } from "./tv"

export interface CommentItemProps {
  className?: string
  author: User
  created_at: Date
  message_meta: Descendant[]
  locale?: DateLocale
  handleOnImageClick?: (attachmentIndex?: number) => void
  handleOnEdit?: () => void
  handleOnDelete?: () => void
  reactionsPopoverIsOpen?: boolean
  handleOnReactionPopoverClick?: () => void
  handleOnReactionClick?: (reaction: GroupedReaction) => void
  reactionAnchorRef?: React.RefObject<HTMLButtonElement>
  reactions: Reaction[] | null
  defaultText?: ItemDefaultText
}

// Helper type for grouped reactions
interface GroupedReaction {
  emoji: string
  count: number
  users: User[]
}

export const CommentItem = memo(
  forwardRef<HTMLDivElement, CommentItemProps>((props, ref) => {
    const {
      className,
      author,
      created_at,
      message_meta,
      locale = "en-us",
      handleOnImageClick,
      handleOnEdit,
      handleOnDelete,
      reactionsPopoverIsOpen,
      handleOnReactionPopoverClick,
      handleOnReactionClick,
      reactionAnchorRef,
      reactions = [],
      defaultText = {
        ACTIONS: "Comment actions",
        EDIT: "Edit...",
        DELETE: "Delete comment",
        ADD_REACTIONS: "Add reaction",
      },
    } = props

    const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])
    const styles = CommentItemTv({})

    const { relative: relativeDate, full: fullDate } = useFormattedDate(created_at, locale)

    const renderElementWithCallbacks = useCallback(
      (props: RenderElementProps) => {
        return renderElementWrapper({
          ...props,
          handleOnImageClick,
        } as any)
      },
      [handleOnImageClick],
    )

    return (
      <div className={styles.root({ className })}>
        <Avatar
          photo={author.photo_url || undefined}
          name={author.name}
        />

        <div className={styles.meta()}>
          <span className={styles.name()}>{author.name}</span>
          <Tooltip
            content={fullDate}
            placement="bottom"
          >
            <span className={styles.date()}>{relativeDate}</span>
          </Tooltip>
        </div>

        <Dropdown placement="bottom">
          <Dropdown.Trigger
            asChild
            className={styles.actionMenu()}
          >
            <IconButton tooltip={{ content: defaultText.ACTIONS }}>
              <EllipsisSmall />
            </IconButton>
          </Dropdown.Trigger>

          <Dropdown.Item onMouseUp={handleOnEdit}>{defaultText.DELETE}</Dropdown.Item>
          <Dropdown.Item onMouseUp={handleOnDelete}>{defaultText.DELETE}</Dropdown.Item>
        </Dropdown>

        {reactions === null ? (
          <EmptyReactionButton
            reactionsPopoverIsOpen={reactionsPopoverIsOpen}
            reactionAnchorRef={reactionAnchorRef}
            handleOnReactionPopoverClick={handleOnReactionPopoverClick}
            defaultText={{ ADD_REACTIONS: defaultText.ADD_REACTIONS }}
          />
        ) : null}

        <div className={styles.content()}>
          <Slate
            editor={editor}
            initialValue={message_meta}
          >
            <Editable
              readOnly
              renderElement={renderElementWithCallbacks}
              renderLeaf={renderLeaf}
            />
          </Slate>
        </div>

        {reactions && reactions.length > 0 && (
          <CommentItemReactions
            reactions={reactions}
            reactionAnchorRef={reactionAnchorRef}
            reactionsPopoverIsOpen={reactionsPopoverIsOpen}
            handleOnReactionPopoverClick={handleOnReactionPopoverClick}
            handleOnReactionClick={handleOnReactionClick}
            defaultText={{ ADD_REACTIONS: defaultText.ADD_REACTIONS }}
          />
        )}
      </div>
    )
  }),
)

CommentItem.displayName = "CommentItem"
