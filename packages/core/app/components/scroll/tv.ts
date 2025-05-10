import { tv } from "tailwind-variants"

export const ScrollTv = tv({
  slots: {
    root: "h-full min-h-0 overflow-hidden",
    scrollbar: [
      "z-scroll",
      "flex touch-none select-none",
      "transition-colors duration-[100ms] ease-out",
    ],
    thumb: [
      "relative flex-1 rounded",
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
      },
      horizontal: {
        scrollbar: "h-2.5 border-t border-transparent",
      },
    },
    variant: {
      auto: {
        scrollbar: "hover:bg-default-background",
        thumb: "bg-default-foreground/10 hover:bg-default-foreground/20",
      },
      light: {
        scrollbar: "hover:bg-white",
        thumb: "bg-black/10 hover:bg-black/20",
      },
      dark: {
        scrollbar: "hover:bg-menu-background",
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
  },
  compoundVariants: [
    {
      orientation: "vertical",
      variant: "auto",
      class: {
        scrollbar: "hover:border-l-default-boundary",
      },
    },
    {
      orientation: "horizontal",
      variant: "auto",
      class: {
        scrollbar: "hover:border-t-default-boundary",
      },
    },
    {
      orientation: "vertical",
      variant: "light",
      class: {
        scrollbar: "hover:border-l-gray-200",
      },
    },
    {
      orientation: "horizontal",
      variant: "light",
      class: {
        scrollbar: "hover:border-t-gray-200",
      },
    },
    {
      orientation: "vertical",
      variant: "dark",
      class: {
        scrollbar: "hover:border-l-gray-600",
      },
    },
    {
      orientation: "horizontal",
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
  ],
  defaultVariants: {
    orientation: "vertical",
    variant: "auto",
    scrollbarMode: "default",
  },
})
