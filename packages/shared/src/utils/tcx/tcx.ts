import cx from "classnames"
import { extendTailwindMerge } from "tailwind-merge"
import type { TV as TVType } from "tailwind-variants"
import { createTV } from "tailwind-variants"

const twMergeConfig = {
  extend: {
    classGroups: {
      // Ensure custom typography tokens are treated as font-size, not text color
      "font-size": [
        {
          text: [
            "body-large",
            "body-large-strong",
            "body-medium",
            "body-medium-strong",
            "body-small",
            "body-small-strong",
            "heading-display",
            "heading-large",
            "heading-medium",
            "heading-small",
          ],
        },
      ],
    },
  },
}

// classnames and tailwind-merge
const twm = extendTailwindMerge({
  ...twMergeConfig,
})

export const tcx = (...args: cx.ArgumentArray) => {
  return twm(cx(args))
}

// Create a properly typed wrapper
const tv = createTV({
  twMergeConfig,
})

// Export with explicit type to help TypeScript
export const tcv: TVType = tv as TVType

// Re-export types
export type { TV, TVReturnType, VariantProps } from "tailwind-variants"
