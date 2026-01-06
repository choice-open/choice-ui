import { tcv } from "@choice-ui/shared"

export const skeletonTv = tcv({
  slots: {
    // transition always exists, ensure there is a transition effect when loading state changes
    root: ["transition-all", "duration-200", "ease-in-out"],
  },
  variants: {
    loading: {
      true: {
        root: ["skeleton", "animate-pulse"],
      },
      false: {},
    },
    hasChildren: {
      true: {},
      false: { root: "block" },
    },
  },
  defaultVariants: {
    hasChildren: true,
  },
})
