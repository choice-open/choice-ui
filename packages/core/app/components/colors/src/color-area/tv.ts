import { tcv } from "@choice-ui/shared"

export const ColorAreaTv = tcv({
  slots: {
    root: "relative touch-none select-none",
    thumbWrapper: "pointer-events-none relative z-2 box-border flex items-center justify-center",
    thumb: "absolute origin-center rounded-full",
    thumbInput: "absolute inset-0 cursor-default opacity-0",
  },
  variants: {
    disabled: {
      true: {
        root: "saturate-0",
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
})
