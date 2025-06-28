import { tv } from "tailwind-variants"

export const CommentItemTv = tv({
  slots: {
    root: "comment__item group/comment-item items-center px-4 py-1 text-lg",
    avatar: "mr-3 flex-shrink-0 [grid-area:avatar]",
    meta: "flex cursor-default gap-1 leading-5 [grid-area:meta] select-none",
    name: "tracking-lg font-medium",
    date: "text-secondary-foreground",
    actionMenu: "[grid-area:action]",
    content: "flex flex-col [grid-area:content]",
  },
})

export const CommentItemReactionsTv = tv({
  slots: {
    reactionMenu: "[grid-area:reaction]",
    reactions: "mt-2 flex flex-wrap items-center gap-2 text-xl [grid-area:reactions]",
    reactionTooltip: "flex flex-col items-center gap-2 py-1",
    reactionEmoji: "flex size-6 items-center justify-center rounded-md bg-white text-xl",
    reactionUsers: "flex flex-col text-center",
    reactionUser: "text-md whitespace-nowrap",
    reactionButton: [
      "flex h-8 items-center justify-center gap-1 rounded-md px-2",
      "border-selected-boundary border",
      "hover:bg-selected hover:text-on-accent-foreground",
    ],
    reactionCount: "text-md",
  },
  variants: {
    position: {
      top: {
        reactionMenu: "self-start",
      },
      bottom: {
        reactionMenu: "self-center",
      },
    },
    reactionsPopoverIsOpen: {
      true: {
        reactionMenu: "visible",
      },
      false: {
        reactionMenu: "invisible group-hover/comment-item:visible",
      },
    },
  },
  defaultVariants: {
    position: "top",
    reactionsPopoverIsOpen: false,
  },
})
