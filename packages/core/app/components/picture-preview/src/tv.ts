import { tcv } from "@choiceform/design-shared"

export const PicturePreviewTv = tcv({
  slots: {
    root: ["relative flex flex-col overflow-hidden", "h-full w-full", "touch-none select-none"],
    loading: [
      "text-secondary-foreground absolute inset-0 z-10 flex flex-col items-center justify-center gap-4",
    ],
    content: [
      "relative flex-1 overflow-hidden",
      "flex items-center justify-center",
      "bg-gray-100 dark:bg-gray-900",
    ],
    canvas: [
      "relative h-full w-full",
      "transform-gpu will-change-transform",
      "cursor-grab active:cursor-grabbing",
    ],
    image: ["pointer-events-none", "h-full w-full object-contain"],

    controlGroup: [
      "overflow-hidden",
      "absolute right-2 bottom-2 flex items-center",
      "bg-default-background",
      "rounded-md",
      "shadow-md",
    ],
  },
  variants: {
    isLoading: {
      true: {
        image: "opacity-0 transition-opacity duration-300",
      },
      false: {},
    },
    isError: {
      true: {
        image: "opacity-0 transition-opacity duration-300",
      },
      false: {},
    },
  },
  defaultVariants: {
    isLoading: false,
    isError: false,
  },
})
