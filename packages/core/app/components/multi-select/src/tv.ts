import { tcv } from "@choiceform/design-shared"

export const multiSelectTriggerTv = tcv({
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
        root: "bg-default-background text-disabled-foreground border-default-boundary",
        placeholder: "text-disabled-foreground",
        suffix: "text-disabled-foreground",
      },
    },
    open: {
      true: {},
      false: {},
    },
    hasValues: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      open: true,
      disabled: false,
      class: { root: "border-selected-boundary" },
    },
    {
      open: false,
      disabled: false,
      class: { root: "hover:border-default-boundary border-transparent" },
    },
  ],
  defaultVariants: {
    size: "default",
    open: false,
    disabled: false,
    hasValues: false,
  },
})
