import { tcv } from "@choiceform/design-shared"

export const loaderVariants = tcv({
  slots: {
    root: "relative inline-flex items-center justify-center",
    track: "relative h-20 w-48 overflow-hidden",
    stageContainer: "absolute inset-0 flex items-center justify-center",
    stage: [
      "h-full w-48 transition-opacity duration-300",
      "flex shrink-0 flex-col items-center justify-center",
    ],
    iconContainer: "relative flex h-10 w-10 items-center justify-center",
    icon: "absolute inset-0 flex items-center justify-center text-gray-500",
    label: "text-default-foreground font-strong transition-opacity duration-300",
  },
  variants: {
    active: {
      true: {
        stage: "opacity-100",
      },
      false: {
        stage: "opacity-50",
      },
    },
  },
})
