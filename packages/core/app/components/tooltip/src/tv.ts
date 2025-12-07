import { tcv } from "@choiceform/design-shared"

export const tooltipContentVariants = tcv({
  slots: {
    root: "rounded-md px-2 py-1",
    arrow: "translate-none",
  },
  variants: {
    variant: {
      default: {
        root: "bg-menu-background text-white shadow-md",
        arrow: "bg-menu-background",
      },
      light: {
        root: "border bg-white text-gray-800",
        arrow: "bg-white",
      },
    },
    placement: {
      top: {},
      right: {},
      bottom: {},
      left: {},
    },
  },
  compoundVariants: [
    {
      variant: "light",
      placement: "top",
      class: {
        arrow: "border-r border-b",
      },
    },
    {
      variant: "light",
      placement: "bottom",
      class: {
        arrow: "border-t border-l",
      },
    },
    {
      variant: "light",
      placement: "left",
      class: {
        arrow: "border-t border-r",
      },
    },
    {
      variant: "light",
      placement: "right",
      class: {
        arrow: "border-b border-l",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    placement: "top",
  },
})
