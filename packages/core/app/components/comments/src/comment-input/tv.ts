import { tcv } from "@choiceform/design-shared"

export const CommentInputTv = tcv({
  slots: {
    root: "text-default-foreground relative flex flex-col rounded-xl text-body-large",
    editor: "cursor-text py-[7px] pl-4 focus:outline-none",
    placeholder:
      "text-secondary-foreground text-body-medium pointer-events-none absolute top-2 right-10 left-4 flex h-6 items-center select-none",
    footer: "flex h-10 items-center justify-between border-t py-1 pr-2 pl-1",
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

export const CommentInputMentionPopoverTv = tcv({
  slots: {
    root: [
      "flex flex-col gap-0",
      "rounded-xl",
      "p-2",
      "bg-menu-background text-white shadow-lg",
      "overflow-y-auto overscroll-contain",
      "pointer-events-auto select-none",
      "min-w-[220px]",
      "relative",
    ],
  },
})
