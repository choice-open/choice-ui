import { tcv } from "~/utils"

export const tabsTv = tcv({
  slots: {
    root: ["flex gap-1 select-none"],
    tab: [
      "relative grid h-6 items-center gap-1",
      "rounded-md",
      "border border-solid border-transparent px-2",
      "cursor-default",
      "focus-visible:border-selected-boundary",
    ],
    label: ["col-start-1 row-start-1", "aria-hidden:font-heavy aria-hidden:invisible"],
  },
  variants: {
    variant: {
      default: {},
      light: {},
      dark: {},
      reset: {},
    },
    active: {
      true: {
        tab: "text-body-medium-strong",
      },
      false: {
        tab: "text-body-medium",
      },
    },
    disabled: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "default",
      active: false,
      class: {
        tab: "text-secondary-foreground",
      },
    },
    {
      variant: "default",
      active: true,
      class: {
        tab: "bg-secondary-background text-default-foreground",
      },
    },
    {
      variant: "default",
      disabled: false,
      class: {
        tab: "hover:bg-secondary-background hover:text-default-foreground",
      },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        tab: "text-secondary-foreground",
      },
    },
    // Light
    {
      variant: "light",
      active: false,
      class: {
        tab: "text-black/50",
      },
    },
    {
      variant: "light",
      active: true,
      class: {
        tab: "bg-gray-100 font-strong text-gray-900",
      },
    },
    {
      variant: "light",
      disabled: false,
      class: {
        tab: "hover:bg-gray-100 hover:text-gray-900",
      },
    },
    {
      variant: "light",
      disabled: true,
      class: {
        tab: "text-black/50",
      },
    },
    // Dark
    {
      variant: "dark",
      active: false,
      class: {
        tab: "text-white/50",
      },
    },
    {
      variant: "dark",
      active: true,
      class: {
        tab: "bg-gray-700 font-strong text-white",
      },
    },
    {
      variant: "dark",
      disabled: false,
      class: {
        tab: "hover:bg-gray-700 hover:text-white",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        tab: "text-white/50",
      },
    },
  ],
  defaultVariants: {
    active: false,
    disabled: false,
    variant: "default",
  },
})
