import { tcv } from "@choice-ui/shared"

export const rangeTv = tcv({
  slots: {
    container: [
      "h-(--height) w-(--width)",
      "relative touch-none select-none",
      "bg-secondary-background shadow-inset-border rounded-full",
    ],
    connect: [
      "pointer-events-none absolute h-(--height)",
      "after:absolute",
      "after:content-['']",
      "after:rounded-full",
      "after:[background:inherit]",
      "after:h-[inherit]",
      "after:left-[calc(var(--height)/-2)]",
      "after:right-[calc(var(--height)/-2)]",
    ],
    thumbWrapper: ["absolute top-1/2 box-border origin-center z-2"],
    thumb: [
      "shadow-range-thumb border-2 border-white rounded-full size-(--thumb-size)",
      "bg-white absolute -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2",
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
        connect: "bg-disabled-background",
        thumb: "bg-secondary-background",
      },
      false: {
        connect: "bg-accent-background",
      },
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
