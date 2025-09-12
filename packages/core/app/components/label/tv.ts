import { tcv } from "~/utils"

export const labelTv = tcv({
  slots: {
    root: "text-body-medium cursor-default self-start px-0.5",
    content: "font-strong",
    required: "",
    description: "ml-1",
    action: "relative ml-1 inline-flex align-middle",
  },
  variants: {
    disabled: {
      true: {},
    },
    variant: {
      default: {},
      light: {},
      dark: {},
      reset: {},
    },
  },
  compoundVariants: [
    {
      variant: "default",
      disabled: true,
      class: {
        root: "text-disabled-foreground",
      },
    },
    {
      variant: "light",
      disabled: true,
      class: {
        root: "text-black/50",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        root: "text-white/50",
      },
    },
    {
      variant: "default",
      disabled: false,
      class: {
        root: "text-default-foreground",
        required: "text-accent-foreground",
        description: "text-secondary-foreground",
      },
    },
    {
      variant: "light",
      disabled: false,
      class: {
        root: "text-gray-900",
        required: "text-blue-500",
        description: "text-black/50",
      },
    },
    {
      variant: "dark",
      disabled: false,
      class: {
        root: "text-white",
        required: "text-blue-400",
        description: "text-white/50",
      },
    },
  ],
  defaultVariants: {
    disabled: false,
    variant: "default",
  },
})
