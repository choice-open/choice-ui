import { tcv } from "@choice-ui/shared"

export const ColorSolidPaintTv = tcv({
  slots: {
    sliderContainer: "grid items-center gap-2 p-4",
    nativePicker: "",
    channelField: "px-4",
  },
  variants: {
    presets: {
      true: {
        channelField: "pb-4",
      },
      false: {},
    },
    alpha: {
      true: {
        sliderContainer: "",
        nativePicker: "col-start-2 row-span-2 row-start-1 p-2",
      },
      false: {
        sliderContainer: "",
      },
    },
    nativePicker: {
      true: {
        sliderContainer: "grid-cols-[1fr_auto]",
      },
      false: {},
    },
  },
  defaultVariants: {
    alpha: true,
    presets: true,
    nativePicker: true,
  },
})
