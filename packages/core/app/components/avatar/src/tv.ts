import { tcv } from "@choiceform/design-shared"

export const avatarTv = tcv({
  slots: {
    root: ["rounded-full", "relative flex shrink-0 items-center justify-center align-middle"],
    image: [
      "overflow-hidden",
      "absolute inset-0 h-full w-full rounded-[inherit]",
      "pointer-events-none object-cover",
    ],
  },
  variants: {
    size: {
      small: {
        root: "h-4 w-4",
      },
      medium: {
        root: "h-6 w-6",
      },
      large: {
        root: "h-8 w-8",
      },
    },
    states: {
      default: {},
      dash: {},
      design: {},
      spotlight: {},
    },
    isLoading: {
      true: {
        root: "animate-pulse",
      },
    },
  },
  compoundVariants: [
    {
      states: ["dash", "design", "spotlight"],
      class: {
        root: "before:absolute",
      },
    },
    {
      states: ["dash"],
      class: {
        root: "before:inset-x-1 before:-top-1 before:h-0.5 before:rounded-full before:bg-yellow-600",
      },
    },
    {
      states: ["design", "spotlight"],
      class: {
        root: "before:-inset-1 before:rounded-full before:border-2 before:border-yellow-600",
      },
    },
    {
      states: ["spotlight"],
      class: {
        root: "before:border-dashed",
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    states: "default",
  },
})
