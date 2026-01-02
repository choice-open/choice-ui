import { tcv } from "@choice-ui/shared"

export const descriptionTv = tcv({
  base: "text-secondary-foreground px-0.5 break-words whitespace-pre-wrap",
  variants: {
    disabled: {
      true: "text-disabled-foreground",
    },
  },

  defaultVariants: {
    disabled: false,
  },
})
