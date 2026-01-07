import { tcv } from "@choice-ui/shared"

export const ColorPickerContentTV = tcv({
  slots: {
    noAvailable: [
      "grid place-items-center",
      "bg-secondary-background text-secondary aspect-square rounded-b-xl select-none",
    ],
    paintsType: "flex h-10 items-center gap-1 border-b px-2",
  },
})
