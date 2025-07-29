import { tv } from "tailwind-variants"

export const tabsTv = tv({
  slots: {
    root: [
      // Layout
      "flex gap-1",
      // Typography
      "select-none",
    ],
    tab: [
      // Layout
      "relative grid h-6 items-center gap-1",
      // Shape
      "tracking-md leading-md rounded-md",
      // Spacing
      "border border-solid border-transparent px-2",
      // Typography
      "cursor-default",
      // Focus
      "focus-visible:border-selected-boundary",
    ],
    label: [
      // Layout
      "col-start-1 row-start-1",
      // Typography
      "tracking-md",
      // Visibility
      "aria-hidden:invisible aria-hidden:font-medium",
    ],
  },
  variants: {
    variant: {
      default: {},
      dark: {},
    },
    active: {
      true: {
        tab: "",
      },
      false: {
        tab: "",
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
        tab: "bg-secondary-background text-default-foreground font-medium",
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
        tab: "bg-gray-700 font-medium text-white",
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
