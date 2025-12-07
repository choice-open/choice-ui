import { tcv } from "@choiceform/design-shared"

export const skeletonTv = tcv({
  slots: {
    root: ["will-change-opacity", "animate-pulse"],
  },
  variants: {
    hasChildren: {
      true: {},
      false: {},
    },
    loading: {
      true: {
        root: ["skeleton"],
      },
      false: {},
    },
  },
})
