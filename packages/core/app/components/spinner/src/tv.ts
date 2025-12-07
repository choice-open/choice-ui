import { tcv } from "@choiceform/design-shared"

export const SpinnerSpinVariant = tcv({
  slots: {
    base: "relative inline-flex flex-col items-center justify-center gap-2",
    container: "relative h-(--container) w-(--container) animate-spin",
    shape: [
      "transform-gpu will-change-transform",
      "absolute block h-(--shape) w-(--shape) rounded-full bg-current",
      "nth-of-type-1:animate-spinner-spin-shape1 nth-of-type-1:left-0 nth-of-type-1:opacity-25",
      "nth-of-type-2:animate-spinner-spin-shape2 nth-of-type-2:right-0 nth-of-type-2:opacity-50",
      "nth-of-type-3:animate-spinner-spin-shape3 nth-of-type-3:bottom-0 nth-of-type-3:opacity-75",
      "nth-of-type-4:animate-spinner-spin-shape4 nth-of-type-4:right-0 nth-of-type-4:bottom-0 nth-of-type-4:opacity-100",
    ],
    label: "",
  },
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    variant: {
      default: "text-current",
      primary: "text-accent-foreground",
    },
  },
  defaultVariants: {
    size: "medium",
    variant: "default",
  },
})

export const SpinnerBounceVariant = tcv({
  slots: {
    base: "relative inline-flex flex-col items-center justify-center gap-2",
    container: [
      "flex shrink-0 items-center justify-center text-center text-current",
      "w-(--container)",
    ],
    shape: [
      "h-(--shape) w-(--shape) shrink-0 origin-center rounded-full bg-current",
      "nth-of-type-1:animate-spinner-bounce-left",
      "nth-of-type-2:animate-spinner-bounce-right",
    ],
    label: "",
  },
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    variant: {
      default: {
        shape: "text-current",
      },
      primary: {
        shape: "text-accent-foreground",
      },
    },
  },
  defaultVariants: {
    size: "medium",
    variant: "default",
  },
})
