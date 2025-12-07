import { tcv } from "@choiceform/design-shared"

export const dragDialogTv = tcv({
  slots: {
    overlay: "z-modals overflow-hidden",
    dialog: "",
    resizeWidthHandle: "absolute top-0 -right-1 h-full w-2 cursor-ew-resize",
    resizeHeightHandle: "absolute -bottom-1 left-0 h-2 w-full cursor-ns-resize",
    resizeCornerHandle: [
      "absolute -right-1 -bottom-1 size-6 cursor-nwse-resize",
      "hover:before:border-default-foreground",
      "before:absolute before:inset-2 before:rounded-br-full before:border-r-2 before:border-b-2 before:content-['']",
    ],
  },
  variants: {
    resizable: {
      true: {
        dialog: "resize-handle",
      },
      false: {
        overlay: "cursor-default",
      },
    },
    overlay: {
      true: {},
      false: {
        overlay: "pointer-events-none",
        dialog: "pointer-events-auto",
      },
    },
  },
  defaultVariants: {
    resizable: false,
    overlay: true,
  },
})
