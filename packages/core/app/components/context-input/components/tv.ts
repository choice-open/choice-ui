import { tv } from "tailwind-variants"

export const mentionElementTv = tv({
  base: [
    "inline-block",
    "align-baseline",
    "rounded-md",
    "leading-md tracking-md",
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

export const contextInputHeaderTv = tv({
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

export const contextInputFooterTv = tv({
  base: ["flex h-10 flex-shrink-0 items-center justify-between"],
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
