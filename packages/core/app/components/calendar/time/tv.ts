import { tv } from "tailwind-variants"

export const TimePickerTv = tv({
  slots: {
    dualColumn: "grid grid-cols-[1fr_1px_1fr] overflow-hidden rounded-lg shadow-lg",
    column: "min-w-0 rounded-none shadow-none",
    separator: "bg-menu-boundary h-full w-px",
  },
})
