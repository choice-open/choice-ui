import { tcv } from "@choiceform/design-shared"

export const VirtualizedGridTv = tcv({
  slots: {
    base: "box-border",
    grid: "grid",
    item: "min-w-0",
  },
  variants: {
    listMode: {
      true: {},
      false: {
        grid: "items-center justify-center",
      },
    },
  },
  defaultVariants: {
    listMode: false,
  },
})
