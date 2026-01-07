import { tcv } from "@choice-ui/shared"

export const ColorPickerPopoverTV = tcv({
  slots: {
    popoverContainer: "",
    paintsType: "flex h-10 items-center gap-1 border-b px-2",
  },
  variants: {
    presets: {
      true: {
        popoverContainer: "p-0",
      },
      false: {
        popoverContainer: "pt-0 pb-3",
      },
    },
  },
})
