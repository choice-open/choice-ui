import { tcv } from "@choice-ui/shared"

export const PicturePreviewTv = tcv({
  slots: {
    root: [
      "group/picture-preview relative flex flex-col overflow-hidden",
      "h-full w-full",
      "touch-none select-none",
    ],
    loading: [
      "text-secondary-foreground absolute inset-0 z-10 flex flex-col items-center justify-center gap-4",
    ],
    content: [
      "relative flex-1 overflow-hidden",
      "flex items-center justify-center",
      "bg-gray-100 dark:bg-gray-900",
      "[contain:layout_paint]",
    ],
    canvas: [
      "transform-gpu will-change-transform",
      "cursor-grab active:cursor-grabbing",
      "origin-center",
      "flex items-center justify-center",
    ],
    image: ["pointer-events-none", "block w-auto h-auto"],

    controlGroup: [
      "overflow-hidden",
      "absolute flex items-center",
      "bg-default-background",
      "rounded-md",
      "shadow-md",
    ],
  },
  variants: {
    isLoading: {
      true: {
        image: "opacity-0 scale-105 blur-sm transition-all duration-500 ease-out",
      },
      false: {
        image: "opacity-100 scale-100 blur-0 transition-all duration-500 ease-out",
      },
    },
    isError: {
      true: {
        image: "opacity-0",
      },
      false: {},
    },
    isMenuOpen: {
      true: {
        controlGroup: "opacity-100",
      },
      false: {},
    },
    controlPosition: {
      "top-left": {
        controlGroup: "top-2 left-2",
      },
      "top-right": {
        controlGroup: "top-2 right-2",
      },
      "bottom-left": {
        controlGroup: "bottom-2 left-2",
      },
      "bottom-right": {
        controlGroup: "bottom-2 right-2",
      },
    },
    controlShow: {
      always: {
        controlGroup: "",
      },
      hover: {
        controlGroup:
          "group-hover/picture-preview:opacity-100 opacity-0 transition-opacity duration-200",
      },
    },
  },
  defaultVariants: {
    isLoading: false,
    isError: false,
    isMenuOpen: false,
    controlPosition: "bottom-right",
  },
})
