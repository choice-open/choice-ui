import { tv } from "tailwind-variants"

export const CommentInputElementTv = tv({
  slots: {
    attachmentsRoot: "my-2",
    attachmentsWrapper: "",
    attachmentRoot: "group/image relative flex flex-col cursor-default",
    AttachmentWrapper: [
      "group-hover/image:border-default-boundary-foreground/20 border-default-boundary-foreground/10",
      "relative overflow-hidden rounded-md border",
    ],
    attachmentImage: "h-full w-full object-cover opacity-100 group-hover/image:opacity-90",
    attachmentRemoveButton: [
      "absolute -top-1 -right-1",
      "h-4 w-4 rounded-full",
      "bg-default-foreground text-default-background shadow-range-thumb",
      "opacity-0 group-hover/image:opacity-100 delay-100",
    ],
    mentionRoot: "text-accent-foreground mr-0.5 font-medium",
    mentionTooltip: "grid grid-cols-[auto_1fr] gap-2 items-center py-1",
    mentionTooltipAvatar: "flex items-center justify-center",
    mentionTooltipContent: "flex flex-col",
    mentionTooltipEmail: "text-white/50",
  },
  variants: {
    attachmentsMode: {
      comment: {
        attachmentsWrapper: "grid gap-2",
        attachmentRoot: "w-full h-full",
        AttachmentWrapper: "w-full h-full",
      },
      edit: {
        attachmentsWrapper: "flex flex-wrap gap-2",
        AttachmentWrapper: "h-16 w-16",
      },
    },
    multipleAttachments: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      attachmentsMode: "comment",
      multipleAttachments: true,
      class: {
        attachmentsWrapper: "grid-cols-[repeat(auto-fill,minmax(calc(50%-0.25rem),1fr))]",
        attachmentRoot: "aspect-square",
      },
    },
  ],
  defaultVariants: {
    attachmentsMode: "comment",
  },
})
