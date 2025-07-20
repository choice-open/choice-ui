import { tv } from "tailwind-variants"

export const rangeTv = tv({
  slots: {
    container: [
      "h-(--height) w-(--width)",
      "relative touch-none select-none",
      "bg-secondary-background shadow-inset-border rounded-full",
    ],
    connect: [
      "pointer-events-none absolute",
      "after:absolute",
      "after:content-['']",
      "after:rounded-full",
      "after:bg-inherit",
      "after:h-[var(--height)]",
      "after:left-[calc(var(--height)/-2)]",
      "after:right-[calc(var(--height)/-2)]",
    ],
    thumb: [
      "absolute top-1/2 box-border origin-center rounded-full",
      "shadow-range-thumb border-2 border-white",
      "bg-white",
    ],
    dotContainer: "pointer-events-none absolute inset-0",
    dot: ["size-1 rounded-full", "absolute top-1/2", "-translate-x-1/2 -translate-y-1/2"],
    input: "absolute -inset-1 cursor-default opacity-0",
  },
  variants: {
    overStepValue: {
      true: {
        dot: "bg-black/20",
      },
      false: {
        dot: "bg-black/10",
      },
    },
    defaultStepValue: {
      true: {
        dot: "bg-black",
      },
    },
    hasStepOrDefault: {
      true: {},
      false: {},
    },
    currentDefaultValue: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        thumb: "bg-secondary-background",
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      defaultStepValue: true,
      overStepValue: true,
      class: {
        dot: "bg-black",
      },
    },
    {
      hasStepOrDefault: true,
      currentDefaultValue: true,
      disabled: false,
      class: {
        thumb: "bg-white",
      },
    },
    {
      hasStepOrDefault: true,
      currentDefaultValue: false,
      disabled: false,
      class: {
        thumb: "bg-accent-background",
      },
    },
  ],
  defaultVariants: {
    defaultStepValue: false,
    overStepValue: false,
    hasStepOrDefault: false,
    currentDefaultValue: false,
    disabled: false,
  },
})
