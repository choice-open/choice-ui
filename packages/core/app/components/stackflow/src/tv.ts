import { tcv } from "@choiceform/design-shared"

export const stackflowTv = tcv({
  slots: {
    root: [
      // Layout
      "relative flex flex-col",
      // Shape
      "overflow-hidden",
    ],
    prefix: [
      // Layout
      "relative z-2",
    ],
    content: [
      // Layout
      "relative flex-1",
      // Shape
      "overflow-hidden",
    ],
    item: [
      // Visibility
      "opacity-0",
    ],
    suffix: [
      // Layout
      "relative z-2",
    ],
  },
  variants: {
    active: {
      true: {
        item: "opacity-100",
      },
    },
  },
  defaultVariants: {
    active: false,
  },
})
