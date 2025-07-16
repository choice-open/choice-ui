import { tv } from "tailwind-variants"

export const chipTv = tv({
  slots: {
    root: [
      "inline-flex min-w-0 items-center rounded-md",
      "border border-solid border-transparent",
      "cursor-default select-none",
    ],
    text: "truncate",
    closeButton: "pointer-events-auto",
    prefix: "",
    suffix: "",
  },
  variants: {
    size: {
      default: {
        root: "h-4",
      },
      medium: {
        root: "h-6",
      },
    },
    variant: {
      default: {
        root: "",
      },
      accent: {
        root: "",
      },
      success: {
        root: "",
      },
      rest: {
        root: "",
      },
    },
    prefix: {
      true: {
        root: "",
      },
      false: {
        root: "",
      },
    },
    suffix: {
      true: {
        root: "",
      },
      false: {
        root: "",
      },
    },
    selected: {
      true: {
        root: "",
      },
      false: {
        root: "",
      },
    },
    disabled: {
      true: {
        root: "border-default-boundary bg-default-background text-secondary-foreground",
      },
      false: {
        root: "",
      },
    },
  },
  compoundVariants: [
    {
      prefix: false,
      suffix: false,
      size: "default",
      class: { root: "px-1" },
    },
    {
      prefix: false,
      suffix: false,
      size: "medium",
      class: { root: "px-2" },
    },
    {
      prefix: true,
      suffix: false,
      size: "default",
      class: { root: "pr-1" },
    },
    {
      prefix: true,
      suffix: false,
      size: "medium",
      class: { root: "pr-2" },
    },
    {
      prefix: false,
      suffix: true,
      size: "default",
      class: { root: "pl-1" },
    },
    {
      prefix: false,
      suffix: true,
      size: "medium",
      class: { root: "pl-2" },
    },
    {
      selected: false,
      disabled: false,
      variant: "default",
      class: {
        root: "border-default-boundary bg-default-background hover:bg-secondary-background",
        closeButton: "text-default-foreground/60 hover:text-default-foreground",
      },
    },
    {
      selected: true,
      disabled: false,
      variant: "default",
      class: {
        root: "border-selected-boundary text-accent-foreground hover:bg-selected-background",
        closeButton: "text-accent-foreground/60 hover:text-accent-foreground",
      },
    },
    {
      disabled: false,
      variant: "accent",
      class: {
        root: "border-selected-boundary text-accent-foreground",
        closeButton: "text-accent-foreground/60 hover:text-accent-foreground",
      },
    },
    {
      disabled: false,
      variant: "success",
      class: {
        root: "border-success-foreground/40 text-success-foreground",
        closeButton: "text-success-foreground/60 hover:text-success-foreground",
      },
    },
  ],
  compoundSlots: [
    {
      slots: ["prefix", "suffix", "closeButton"],
      size: "default",
      class: "h-4 w-4",
    },
    {
      slots: ["prefix", "suffix", "closeButton"],
      size: "medium",
      class: "h-6 w-6",
    },
    {
      slots: ["prefix", "suffix"],
      class: "flex items-center justify-center",
    },
  ],
  defaultVariants: {
    size: "default",
    variant: "default",
    prefix: false,
    suffix: false,
    selected: false,
    disabled: false,
  },
})
