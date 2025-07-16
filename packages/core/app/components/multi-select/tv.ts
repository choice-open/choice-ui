import { tv } from "tailwind-variants"

export const multiSelectTriggerTv = tv({
  slots: {
    root: ["bg-secondary-background relative flex w-full justify-between gap-1 rounded-lg border"],
    content: ["flex min-w-0 flex-1 items-center"],
    chips: ["flex min-w-0 flex-wrap items-center gap-1"],
    placeholder: ["text-secondary-foreground pointer-events-none px-1 select-none"],
    suffix: "flex items-center justify-center",
  },
  variants: {
    size: {
      default: {
        root: "min-h-6 px-1 py-0.75",
        content: "gap-1",
        suffix: "size-4",
      },
      large: {
        root: "min-h-8 px-1 py-0.75",
        content: "gap-1",
        suffix: "size-6",
      },
    },
    disabled: {
      true: {
        root: "bg-disabled-background text-disabled-foreground",
        placeholder: "text-fg-disabled",
        suffix: "text-disabled-foreground",
      },
    },
    open: {
      true: {
        root: "border-selected-boundary",
      },
      false: {
        root: "hover:border-default-boundary border-transparent",
      },
    },
    hasValues: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: "default",
    open: false,
    disabled: false,
    hasValues: false,
  },
})
