import { tv } from "tailwind-variants"

export const VirtualizedGridTv = tv({
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
