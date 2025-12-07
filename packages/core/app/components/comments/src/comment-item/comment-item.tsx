import { Avatar } from "@choiceform/avatar"
import { Dropdown } from "@choiceform/dropdown"
import { IconButton } from "@choiceform/icon-button"
import { EllipsisSmall } from "@choiceform/icons-react"
import { Tooltip } from "@choiceform/tooltip"
import React, { forwardRef, memo, useCallback } from "react"
import { createEditor, Descendant } from "slate"
import { withHistory } from "slate-history"
import { Editable, RenderElementProps, Slate, withReact } from "slate-react"
import { renderLeaf } from "../comment-input/components"
import type { ItemDefaultText, Reaction, User } from "../types"
import { CommentItemReactions, EmptyReactionButton, renderElementWrapper } from "./components"
import { DateLocale, useFormattedDate } from "./hooks"
import { CommentItemTv } from "./tv"

export interface CommentItemProps {
  author: User
  className?: string
  created_at: Date
  defaultText?: ItemDefaultText
  handleOnDelete?: () => void
  handleOnEdit?: () => void
  handleOnImageClick?: (attachmentIndex?: number) => void
  handleOnReactionClick?: (reaction: GroupedReaction) => void
  handleOnReactionPopoverClick?: () => void
  locale?: DateLocale
  message_meta: Descendant[]
  reactionAnchorRef?: React.RefObject<HTMLButtonElement>
  reactions: Reaction[] | null
  reactionsPopoverIsOpen?: boolean
}

// Helper type for grouped reactions
interface GroupedReaction {
  count: number
  emoji: string
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
        })
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

          <Dropdown.Content>
            <Dropdown.Item onMouseUp={handleOnEdit}>{defaultText.EDIT}</Dropdown.Item>
            <Dropdown.Item onMouseUp={handleOnDelete}>{defaultText.DELETE}</Dropdown.Item>
          </Dropdown.Content>
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
