import { tcv } from "@choice-ui/shared"

export const ColorImagePaintTv = tcv({
  slots: {
    root: "flex flex-col pb-4",
    container: [
      "group/image-container mx-4",
      "relative grid aspect-square place-content-center overflow-hidden rounded-md",
      "before:absolute before:inset-0 before:z-1 before:border",
      "before:pointer-events-none before:rounded-md before:content-['']",
    ],
    buttonContainer: "absolute inset-0 grid place-content-center bg-black/40",
    button: "relative",
    imgContainer: "absolute inset-0 grid place-content-center overflow-hidden",
    image: "aspect-square h-full w-full object-contain",
    adjustContainer: "mx-4 mt-4 grid grid-cols-[1fr_auto] gap-x-2 gap-y-4",
    adjustLabel: "text-secondary-foreground truncate",
  },
  variants: {
    hasImage: {
      true: {
        container: "before:border-black/10 hover:before:border-transparent",
        buttonContainer: [
          "opacity-0 transition-opacity duration-300",
          "group-hover/image-container:opacity-100",
        ],
      },
      false: {
        container: "before:border-transparent",
      },
    },
  },
  defaultVariants: {
    hasImage: false,
  },
})

export const ColorImageToolbarTv = tcv({
  slots: {
    root: "grid h-12 grid-cols-2 items-center gap-2 pr-2 pl-4",
    right: "flex flex-1 items-center justify-end",
  },
})
