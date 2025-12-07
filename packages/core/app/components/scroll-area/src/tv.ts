import { tcv } from "@choiceform/design-shared"

export const ScrollTv = tcv({
  slots: {
    root: "relative h-full min-h-0 overflow-hidden",
    scrollbar: ["flex touch-none select-none", "transition-colors duration-[100ms] ease-out"],
    thumb: [
      "relative rounded-md",
      "z-5 before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-5 before:w-full before:min-w-5",
      "before:-translate-x-1/2 before:-translate-y-1/2",
      "backdrop-blur-xs",
    ],
    corner: "min-h-0 overflow-hidden",
  },
  variants: {
    orientation: {
      vertical: {
        scrollbar: "w-2.5 border-l border-transparent",
        thumb: "w-1.25",
      },
      horizontal: {
        scrollbar: "h-2.5 border-t border-transparent",
        thumb: "h-1.25",
      },
    },
    variant: {
      default: {
        thumb: "bg-default-foreground/10 hover:bg-default-foreground/20",
      },
      light: {
        thumb: "bg-black/10 hover:bg-black/20",
      },
      dark: {
        thumb: "bg-white/20 hover:bg-white/30",
      },
    },
    scrollbarMode: {
      default: {
        scrollbar: "p-0.5",
      },
      "large-y": {},
      "large-t": {},
      "large-b": {},
      "large-x": {},
      "large-l": {},
      "large-r": {},
    },
    hoverBoundary: {
      none: {},
      hover: {},
    },
  },
  compoundVariants: [
    // hoverBoundary: "hover"
    {
      orientation: "vertical",
      hoverBoundary: "hover",
      variant: "default",
      class: {
        scrollbar: "hover:border-l-default-boundary",
      },
    },
    {
      orientation: "horizontal",
      hoverBoundary: "hover",
      variant: "default",
      class: {
        scrollbar: "hover:border-t-default-boundary",
      },
    },
    {
      orientation: "vertical",
      hoverBoundary: "hover",
      variant: "light",
      class: {
        scrollbar: "hover:border-l-gray-200",
      },
    },
    {
      orientation: "horizontal",
      hoverBoundary: "hover",
      variant: "light",
      class: {
        scrollbar: "hover:border-t-gray-200",
      },
    },
    {
      orientation: "vertical",
      hoverBoundary: "hover",
      variant: "dark",
      class: {
        scrollbar: "hover:border-l-gray-600",
      },
    },
    {
      orientation: "horizontal",
      hoverBoundary: "hover",
      variant: "dark",
      class: {
        scrollbar: "hover:border-t-gray-600",
      },
    },
    {
      orientation: "vertical",
      scrollbarMode: "large-y",
      class: {
        scrollbar: "px-0.5 py-2",
      },
    },
    {
      orientation: "vertical",
      scrollbarMode: "large-t",
      class: {
        scrollbar: "px-0.5 pt-2",
      },
    },
    {
      orientation: "vertical",
      scrollbarMode: "large-b",
      class: {
        scrollbar: "px-0.5 pb-2",
      },
    },
    {
      orientation: "horizontal",
      scrollbarMode: "large-x",
      class: {
        scrollbar: "px-2 py-0.5",
      },
    },
    {
      orientation: "horizontal",
      scrollbarMode: "large-l",
      class: {
        scrollbar: "py-0.5 pl-2",
      },
    },
    {
      orientation: "horizontal",
      scrollbarMode: "large-r",
      class: {
        scrollbar: "py-0.5 pr-2",
      },
    },
    {
      hoverBoundary: "hover",
      variant: "default",
      class: {
        scrollbar: "hover:bg-default-background",
      },
    },
    {
      hoverBoundary: "hover",
      variant: "light",
      class: {
        scrollbar: "hover:bg-white",
      },
    },
    {
      hoverBoundary: "hover",
      variant: "dark",
      class: {
        scrollbar: "hover:bg-menu-background",
      },
    },
  ],
  defaultVariants: {
    hoverBoundary: "hover",
    orientation: "vertical",
    variant: "default",
    scrollbarMode: "default",
  },
})
