import { tcv } from "@choice-ui/shared"

export const ColorSliderTv = tcv({
  slots: {
    root: "relative touch-none rounded-full select-none",
    thumbWrapper: "absolute top-1/2 box-border origin-center",
    thumb:
      "rounded-full absolute -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 w-[calc(var(--thumb-size)-2px)] h-[calc(var(--thumb-size)-2px)]",
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
