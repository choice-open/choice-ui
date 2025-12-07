import { tcv } from "@choiceform/design-shared"

export const mentionElementTv = tcv({
  base: [
    "inline-block",
    "align-baseline",
    "rounded-md",
    "text-body-medium",
    "mx-px px-1 py-0.25",
    "border",
  ],
  variants: {
    selected: {
      true: "border-selected-boundary text-accent-foreground",
      false: "",
    },
    variant: {
      default: "",
      light: "",
      dark: "",
      reset: "",
    },
  },
  compoundVariants: [
    {
      variant: "default",
      selected: false,
      class: "bg-default-background",
    },
    {
      variant: "light",
      selected: false,
      class: "border-gray-200 bg-white",
    },
    {
      variant: "dark",
      selected: false,
      class: "border-gray-600 bg-gray-900",
    },
  ],
  defaultVariants: {
    selected: false,
    variant: "default",
  },
})

export const contextInputHeaderTv = tcv({
  base: ["flex h-10 flex-shrink-0 items-center justify-between"],
  variants: {
    size: {
      default: "pr-1 pl-2",
      large: "pr-2 pl-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export const contextInputFooterTv = tcv({
  base: ["flex min-h-10 flex-shrink-0 items-center justify-between"],
  variants: {
    size: {
      default: "px-2",
      large: "px-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})
