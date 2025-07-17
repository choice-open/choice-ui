import { tv } from "tailwind-variants"

export const TextFieldTv = tv({
  slots: {
    container: ["flex min-w-0 flex-col items-start gap-2"],
    root: [
      "group/text-field relative grid",
      "rounded-md",
      "focus-within:before:border-selected-boundary",
      "before:border-transparent",
      "fields__text-field",
    ],
    input: ["[grid-area:input]"],
    prefix: ["[grid-area:prefix]"],
    suffix: ["[grid-area:suffix]"],
    description: [
      "leading-md tracking-md mt-1",
      "px-0.5",
      "break-words whitespace-pre-wrap",
      "text-secondary-foreground",
    ],
  },
  variants: {
    variant: {
      default: {},
      dark: {},
      reset: {},
    },
    size: {
      default: {
        root: "h-6",
        prefix: "h-6 min-w-6",
        suffix: "h-6 min-w-6",
      },
      large: {
        root: "h-8",
        prefix: "h-8 min-w-8",
        suffix: "h-8 min-w-8",
      },
    },
    hasPrefix: {
      true: {
        input: "pl-0",
      },
      false: {},
    },
    hasSuffix: {
      true: {
        input: "pr-0",
      },
      false: {},
    },
    disabled: {
      true: {
        root: "bg-secondary-background",
        input: "text-disabled-foreground",
        description: "text-disabled-foreground",
      },
      false: {},
    },
    selected: {
      true: {
        root: "before:border-selected-boundary",
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "default",
      disabled: false,
      class: {
        root: ["bg-secondary-background", "hover:not-focus-within:before:border-default-boundary"],
      },
    },
    {
      variant: "dark",
      disabled: false,
      class: {
        root: ["bg-gray-700 text-white", "hover:not-focus-within:before:border-gray-600"],
        description: "text-white/40",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        root: "bg-gray-700 text-white/40",
        description: "text-white/40",
      },
    },
  ],
  compoundSlots: [
    {
      slots: ["prefix", "suffix"],
      class: "flex items-center justify-center",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    hasPrefix: false,
    hasSuffix: false,
    disabled: false,
    selected: false,
  },
})
