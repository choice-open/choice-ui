import { tcv } from "@choice-ui/shared"

export const ColorSliderTv = tcv({
  slots: {
    root: "relative touch-none rounded-full select-none",
    thumb: "absolute top-1/2 box-border origin-center rounded-full",
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
