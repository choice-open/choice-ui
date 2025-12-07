import { tcv } from "@choiceform/design-shared"

export const toolbarTv = tcv({
  slots: {
    root: "flex items-center gap-1",
    divider: "w-px h-4 bg-default-boundary mx-1",
  },
  variants: {
    visible: {
      true: {
        root: "visible",
      },
      false: {
        root: "invisible pointer-events-none",
      },
    },
  },
})
