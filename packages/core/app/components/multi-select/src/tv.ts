import { tcv } from "@choice-ui/shared"

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

export const multiSelectTv = tcv({
  slots: {
    validationMessage:
      "bg-menu-background absolute top-[calc(100%+4px)] right-0 left-0 rounded-xl px-3 py-2 text-white",
  },
  variants: {
    variant: {
      default: {
        validationMessage: "bg-menu-background text-white",
      },
      light: {
        validationMessage: "bg-white text-gray-900",
      },
      reset: {},
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
