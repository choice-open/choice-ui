import { tcv } from "@choice-ui/shared"
import s from "./styles/style.module.css"

export const TextFieldTv = tcv({
  slots: {
    container: ["flex min-w-0 flex-col items-start gap-2"],
    root: [
      "group/text-field relative grid",
      "rounded-md",
      "focus-within:before:border-selected-boundary",
      "before:border-transparent",
      s.textField,
    ],
    input: "[grid-area:input]",
    prefix: "[grid-area:prefix]",
    suffix: "[grid-area:suffix]",
    description: "",
  },
  variants: {
    variant: {
      default: {},
      light: {},
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
        input: "placeholder:text-secondary-foreground",
      },
    },
    {
      variant: "light",
      disabled: false,
      class: {
        root: ["bg-gray-100 text-gray-900", "hover:not-focus-within:before:border-gray-200"],
        description: "text-black/50",
        input: "placeholder:text-black/50",
      },
    },
    {
      variant: "dark",
      disabled: false,
      class: {
        root: ["bg-gray-700 text-white", "hover:not-focus-within:before:border-gray-600"],
        description: "text-white/50",
        input: "placeholder:text-white/50",
      },
    },
    // Disabled
    {
      variant: "default",
      disabled: true,
      class: {
        root: "bg-secondary-background text-disabled-foreground",
        description: "text-disabled-foreground",
        input: "placeholder:text-disabled-foreground",
      },
    },
    {
      variant: "light",
      disabled: true,
      class: {
        root: "bg-gray-100 text-black/50",
        description: "text-black/50",
        input: "placeholder:text-black/30",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        root: "bg-gray-700 text-white/50",
        description: "text-white/50",
        input: "placeholder:text-white/30",
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
