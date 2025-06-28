import { DeleteReaction } from "@choiceform/icons-react"
import React, { memo, useMemo } from "react"
import { IconButton } from "~/components/icon-button"
import { Tooltip } from "~/components/tooltip"
import type { Reaction, User } from "../../types"
import { CommentItemReactionsTv } from "../tv"

interface GroupedReaction {
  count: number
  emoji: string
  users: User[]
}

interface CommentItemReactionsProps {
  defaultText: {
    ADD_REACTIONS: string
  }
  handleOnReactionClick?: (reaction: GroupedReaction) => void
  handleOnReactionPopoverClick?: () => void
  reactionAnchorRef?: React.RefObject<HTMLButtonElement>
  reactions: Reaction[]
  reactionsPopoverIsOpen?: boolean
}

export const CommentItemReactions = React.memo(function CommentItemReactions(
  props: CommentItemReactionsProps,
) {
  const {
    reactions,
    reactionsPopoverIsOpen,
    handleOnReactionPopoverClick,
    reactionAnchorRef,
    handleOnReactionClick,
    defaultText,
  } = props

  const styles = CommentItemReactionsTv({ reactionsPopoverIsOpen })
  // Group identical emoji reactions
  const groupedReactions = useMemo(() => {
    const groups = new Map<string, GroupedReaction>()

    // Process each reaction
    reactions.forEach((reaction) => {
      const existing = groups.get(reaction.emoji)

      if (existing) {
        // Add user to existing emoji group if not already included
        if (!existing.users.some((u) => u.id === reaction.user.id)) {
          existing.users.push(reaction.user)
          existing.count += 1
        }
      } else {
        // Create new group for this emoji
        groups.set(reaction.emoji, {
          emoji: reaction.emoji,
          count: 1,
          users: [reaction.user],
        })
      }
    })

    // Convert map to array
    return Array.from(groups.values())
  }, [reactions])

  if (reactions.length === 0) {
    return null
  }

  return (
    <div className={styles.reactions()}>
      {groupedReactions.map((reaction) => (
        <Tooltip
          key={reaction.emoji}
          placement="bottom"
          content={
            <div className={styles.reactionTooltip()}>
              <div className={styles.reactionEmoji()}>{reaction.emoji}</div>
              <div className={styles.reactionUsers()}>
                {reaction.users.map((user) => (
                  <span
                    key={user.id}
                    className={styles.reactionUser()}
                  >
                    {user.name}
                  </span>
                ))}
              </div>
            </div>
          }
        >
          <button
            className={styles.reactionButton()}
            onClick={() => handleOnReactionClick?.(reaction)}
          >
            {reaction.emoji}
            <span className={styles.reactionCount()}>{reaction.count}</span>
          </button>
        </Tooltip>
      ))}
      <IconButton
        ref={reactionAnchorRef}
        active={reactionsPopoverIsOpen}
        className={styles.reactionMenu({ position: "bottom" })}
        onClick={handleOnReactionPopoverClick}
        tooltip={{ content: defaultText.ADD_REACTIONS }}
      >
        <DeleteReaction />
      </IconButton>
    </div>
  )
})

CommentItemReactions.displayName = "CommentItemReactions"

// Reaction button that appears when there are no reactions yet
export const EmptyReactionButton = memo(function EmptyReactionButton(
  props: Pick<
    CommentItemReactionsProps,
    "reactionsPopoverIsOpen" | "handleOnReactionPopoverClick" | "reactionAnchorRef" | "defaultText"
  >,
) {
  const { reactionsPopoverIsOpen, handleOnReactionPopoverClick, reactionAnchorRef, defaultText } =
    props

  const styles = CommentItemReactionsTv({ reactionsPopoverIsOpen })

  return (
    <IconButton
      ref={reactionAnchorRef}
      active={reactionsPopoverIsOpen}
      className={styles.reactionMenu({ position: "top" })}
      onClick={handleOnReactionPopoverClick}
      tooltip={{ content: defaultText.ADD_REACTIONS }}
    >
      <DeleteReaction />
    </IconButton>
  )
})

EmptyReactionButton.displayName = "EmptyReactionButton"
