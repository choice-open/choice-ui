import { tcv } from "@choiceform/design-shared"

export const progressBarTv = tcv({
  slots: {
    root: ["flex w-full max-w-full flex-col", "min-w-0 gap-2"],
    labelWrapper: "flex w-full items-center justify-between gap-1",
    label: "flex w-full items-center justify-between",
    value: "text-body-medium tabular-nums",
    track: "bg-secondary-background w-full overflow-hidden rounded-full",
    connects: [
      "h-full w-full rounded-[inherit] transition-transform duration-500 will-change-transform",
    ],
  },
  variants: {
    size: {
      small: { track: "h-1" },
      default: { track: "h-2" },
      large: { track: "h-4" },
    },
    variant: {
      accent: { connects: "bg-accent-background" },
      default: { connects: "bg-default-foreground" },
      "based-on-value": {},
      reset: {},
    },
    indeterminate: {
      true: { connects: "animate-indeterminate-bar" },
      false: {},
    },
    striped: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: "default",
    variant: "accent",
    indeterminate: false,
    striped: false,
  },
})

export const progressCircleTv = tcv({
  slots: {
    root: "relative inline-flex w-fit shrink-0 align-middle",
    svg: "text-accent-background block",
    track: "stroke-secondary-background",
    fill: "stroke-current transition-all duration-500 ease-in-out",
    value:
      "text-body-medium pointer-events-none absolute inset-0 grid place-items-center text-center",
  },
  variants: {
    variant: {
      accent: { svg: "text-accent-background" },
      default: { svg: "text-default-foreground" },
      "based-on-value": {},
      reset: {},
    },
  },
  defaultVariants: {
    variant: "accent",
  },
})
