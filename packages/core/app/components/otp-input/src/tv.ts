import { tcv } from "@choice-ui/shared"

export const otpInputTv = tcv({
  slots: {
    base: "relative flex items-center gap-2",
    input: "!absolute inset-0 w-full h-full opacity-0 cursor-text",
    group: "flex items-center gap-1.5",
    slot: [
      "relative flex items-center justify-center",
      "h-8 w-8",
      "rounded-md",
      "text-body-large",
      "border border-solid border-transparent",
    ],
    slotValue: "",
    caret: ["absolute inset-y-2 left-1/2 w-px -translate-x-1/2", "otp-input__caret"],
    separator: "text-secondary-foreground mx-1",
  },
  variants: {
    variant: {
      default: {
        slot: "bg-secondary-background",
        slotValue: "text-default-foreground",
        caret: "bg-default-foreground",
      },
      light: {
        slot: "bg-gray-100",
        slotValue: "text-gray-900",
        caret: "bg-gray-900",
      },
      dark: {
        slot: "bg-gray-700",
        slotValue: "text-white",
        caret: "bg-white",
      },
    },
    selected: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        slot: "cursor-not-allowed",
      },
      false: {},
    },
    isInvalid: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "default",
      selected: true,
      disabled: false,
      class: {
        slot: "bg-default-background border-selected-boundary",
      },
    },
    {
      variant: "default",
      selected: false,
      disabled: false,
      class: {
        slot: "hover:border-default-boundary",
      },
    },
    {
      variant: "light",
      selected: false,
      disabled: false,
      class: {
        slot: "hover:border-gray-200",
      },
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      class: {
        slot: "hover:border-gray-600",
      },
    },
    {
      variant: ["default", "light", "dark"],
      selected: true,
      disabled: false,
      class: {
        slot: "border-selected-boundary",
      },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        slot: "bg-secondary-background",
        slotValue: "text-disabled-foreground",
      },
    },
    {
      variant: "light",
      disabled: true,
      class: {
        slot: "bg-gray-100",
        slotValue: "text-black/30",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        slot: "bg-gray-700",
        slotValue: "text-white/40",
      },
    },
    {
      variant: "default",
      isInvalid: true,
      disabled: false,
      class: {
        slot: "border-danger-boundary",
      },
    },
    {
      variant: "light",
      isInvalid: true,
      disabled: false,
      class: {
        slot: "border-danger-boundary",
      },
    },
    {
      variant: "dark",
      isInvalid: true,
      disabled: false,
      class: {
        slot: "border-danger-boundary",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    selected: false,
    disabled: false,
    isInvalid: false,
  },
})
