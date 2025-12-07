import { tcv } from "@choiceform/design-shared"

export const InputTv = tcv({
  base: ["min-w-0 rounded-md px-2", "cursor-default", "appearance-none"],

  variants: {
    variant: {
      default: ["bg-secondary-background", "placeholder:text-secondary-foreground"],
      light: ["bg-gray-100 text-gray-900", "placeholder:text-black/50"],
      dark: ["bg-gray-700 text-white", "placeholder:text-white/40"],
      reset: "",
    },
    selected: {
      true: "",
      false: "",
    },
    disabled: {
      true: "",
      false: "",
    },
    readOnly: {
      true: "",
      false: "",
    },
    size: {
      default: "h-6",
      large: "h-8",
    },
  },
  compoundVariants: [
    {
      variant: ["default", "light", "dark"],
      class: "border border-solid border-transparent",
    },
    {
      variant: "default",
      selected: true,
      disabled: false,
      class: [
        "bg-default-background",
        "not-focus-within:border-selected-boundary/50",
        "focus-within:border-selected-boundary",
      ],
    },
    {
      variant: "default",
      selected: false,
      disabled: false,
      class: "hover:not-focus-within:border-default-boundary",
    },
    {
      variant: "light",
      selected: false,
      disabled: false,
      class: ["hover:not-focus-within:border-gray-200"],
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      class: ["hover:not-focus-within:border-gray-600"],
    },
    {
      variant: ["default", "light", "dark"],
      selected: false,
      disabled: false,
      class: "focus-within:border-selected-boundary",
    },
    {
      variant: "default",
      disabled: true,
      class: "bg-secondary-background text-disabled-foreground",
    },
    {
      variant: "light",
      disabled: true,
      class: "bg-gray-100 text-black/30",
    },
    {
      variant: "dark",
      disabled: true,
      class: "bg-gray-700 text-white/40",
    },
  ],

  defaultVariants: {
    variant: "default",
    selected: false,
    disabled: false,
    readOnly: false,
  },
})
