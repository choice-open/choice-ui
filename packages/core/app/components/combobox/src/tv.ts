import { tcv } from "@choiceform/design-shared"

export const comboboxTriggerTv = tcv({
  slots: {
    root: "flex min-w-0 items-center rounded-md",
    input: "flex-1 cursor-default appearance-none bg-transparent px-2 outline-none",
    icon: "flex flex-none items-center justify-center rounded-sm",
    action: "",
  },
  variants: {
    size: {
      default: {
        root: "h-6",
        icon: "m-0.5 size-4.5",
      },
      large: {
        root: "h-8",
        icon: "m-1.25 size-5",
      },
    },
    selected: {
      true: "",
      false: "",
    },
    disabled: {
      true: {
        root: "",
        input: "",
      },
    },
    readOnly: {
      true: "",
      false: "",
    },
    open: {
      true: {},
    },
    noMatch: {
      true: {},
    },
    hasPrefix: {
      true: { root: "gap-0" },
      false: { root: "gap-1" },
    },
    hasSuffix: {
      true: { root: "gap-0" },
      false: { root: "gap-1" },
    },
    variant: {
      default: { root: "bg-secondary-background placeholder:text-secondary-foreground" },
      dark: { root: "bg-gray-700 text-white placeholder:text-white/40" },
      reset: {},
    },
  },
  compoundVariants: [
    {
      variant: ["default", "dark"],
      class: { root: "border border-solid border-transparent" },
    },
    {
      variant: "default",
      selected: true,
      disabled: false,
      class: {
        root: [
          "bg-default-background",
          "not-focus-within:border-selected-boundary/50",
          "focus-within:border-selected-boundary",
        ],
      },
    },
    {
      variant: "default",
      selected: false,
      disabled: false,
      class: { root: "hover:not-focus-within:border-default-boundary" },
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      class: { root: "hover:not-focus-within:border-gray-600" },
    },
    {
      variant: ["dark", "default"],
      selected: false,
      disabled: false,
      class: { root: "focus-within:border-selected-boundary" },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        root: "text-disabled-foreground border-secondary-background bg-secondary-background",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: { root: "bg-gray-700 text-white/40" },
    },
  ],
  defaultVariants: {
    size: "default",
    selected: false,
    disabled: false,
    open: false,
    hasPrefix: false,
    hasSuffix: false,
    variant: "default",
    noMatch: false,
  },
})
