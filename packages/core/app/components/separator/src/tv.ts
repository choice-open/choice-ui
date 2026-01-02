import { tcv } from "@choice-ui/shared"

export const SeparatorTV = tcv({
  slots: {
    root: "flex items-center gap-2",
    separator: "shrink-0",
  },
  variants: {
    hasChildren: {
      true: {
        separator: "flex-1",
      },
      false: {},
    },
    orientation: {
      horizontal: { separator: "h-px" },
      vertical: { separator: "w-px" },
    },
    variant: {
      default: { separator: "bg-default-boundary" },
      light: { separator: "bg-gray-200" },
      dark: { separator: "bg-gray-800" },
      reset: { separator: "" },
    },
  },
  compoundVariants: [
    {
      hasChildren: true,
      orientation: "horizontal",
      class: { root: "flex-row" },
    },
    {
      hasChildren: true,
      orientation: "vertical",
      class: { root: "flex-col" },
    },
    {
      hasChildren: false,
      orientation: "horizontal",
      class: { separator: "w-full" },
    },
    {
      hasChildren: false,
      orientation: "vertical",
      class: { separator: "h-full" },
    },
  ],
  defaultVariants: {
    hasChildren: false,
    orientation: "horizontal",
    variant: "default",
  },
})
