import { tv } from "tailwind-variants"

export const CommentInputTv = tv({
  slots: {
    root: "relative flex flex-col rounded-lg text-default-foreground leading-md tracking-md text-lg",
    editor: "focus:outline-none pl-4 py-[7px] cursor-text",
    placeholder:
      "absolute left-4 right-10 top-2 text-secondary-foreground h-6 pointer-events-none flex items-center select-none text-md",
    footer: "pl-1 py-1 pr-2 flex items-center justify-between h-10 border-t",
    footerActions: "flex items-center gap-1 px-1",
    error: "text-secondary-foreground flex h-10 items-center",
  },
  variants: {
    variant: {
      default: {
        root: "bg-default-background shadow-xs",
      },
      solid: {
        root: "bg-secondary-background",
      },
    },
    typing: {
      true: {
        root: "",
        editor: "pr-4",
      },
      false: {
        root: "grid grid-cols-[1fr_auto]",
        editor: "pr-2",
        footer: "border-transparent",
      },
    },
  },
  compoundVariants: [],
  defaultVariants: { variant: "default", typing: false },
})

export const CommentInputMentionPopoverTv = tv({
  slots: {
    root: [
      "flex flex-col gap-0",
      "rounded-lg",
      "p-2",
      "bg-menu-background text-white shadow-lg",
      "overflow-y-auto overscroll-contain",
      "pointer-events-auto select-none",
      "min-w-[220px]",
      "relative",
    ],
  },
})
