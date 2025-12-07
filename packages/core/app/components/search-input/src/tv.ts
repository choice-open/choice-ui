import { tcv } from "@choiceform/design-shared"

export const searchInputTv = tcv({
  slots: {
    icon: "",
    action: "",
  },
  variants: {
    variant: {
      default: {},
      light: {},
      dark: {},
      reset: {},
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      disabled: false,
      variant: "default",
      class: {
        icon: [
          "text-secondary-foreground",
          "group-hover/text-field:text-default-foreground",
          "group-focus-within/text-field:text-default-foreground",
        ],
      },
    },
    {
      disabled: false,
      variant: "light",
      class: {
        icon: [
          "text-black/50",
          "group-hover/text-field:text-gray-900",
          "group-focus-within/text-field:text-gray-900",
        ],
        action: "text-black/50 hover:text-gray-900",
      },
    },
    {
      disabled: false,
      variant: "dark",
      class: {
        icon: [
          "text-white/50",
          "group-hover/text-field:text-white",
          "group-focus-within/text-field:text-white",
        ],
        action: "text-white/50 hover:text-white",
      },
    },
    // Disabled
    {
      disabled: true,
      variant: "default",
      class: {
        icon: "text-disabled-foreground",
        action: "text-disabled-foreground",
      },
    },
    {
      disabled: true,
      variant: "light",
      class: {
        icon: "text-black/50",
        action: "text-black/50",
      },
    },
    {
      disabled: true,
      variant: "dark",
      class: {
        icon: "text-white/50",
        action: "text-white/50",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    disabled: false,
  },
})
