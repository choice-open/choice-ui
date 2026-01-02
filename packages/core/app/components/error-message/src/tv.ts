import { tcv } from "@choice-ui/shared"

export const errorMessageTv = tcv({
  base: "text-danger-foreground break-words whitespace-pre-wrap px-0.5",
  variants: {
    disabled: {
      true: "text-disabled-foreground",
    },
  },
  defaultVariants: {
    disabled: false,
  },
})
