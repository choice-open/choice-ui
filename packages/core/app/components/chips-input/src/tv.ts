import { tcv } from "@choiceform/design-shared"

export const chipsInputTv = tcv({
  slots: {
    root: [
      "flex max-w-full min-w-0 flex-wrap",
      "bg-secondary-background rounded-md",
      "border border-solid border-transparent",
    ],
    input: [
      "max-w-full flex-1",
      "cursor-default appearance-none",
      "placeholder:text-secondary-foreground",
    ],
    nesting: ["flex flex-none items-center gap-2 px-1"],
    chip: "shadow-xxs border-none",
    closeButton: "",
    text: "",
  },
  variants: {
    size: {
      default: {
        root: "min-h-4 gap-1 p-1",
        closeButton: "h-4 w-4",
      },
      large: {
        root: "min-h-6",
        closeButton: "h-6 w-6",
      },
    },
    disabled: {
      true: {
        root: "text-disabled-foreground border-default-boundary bg-transparent",
        input: "text-disabled-foreground",
      },
      false: {
        root: "focus-within:border-selected-boundary hover:not-focus-within:border-default-boundary",
      },
    },
    hasValue: {
      true: {},
      false: {
        input: "pl-1",
      },
    },
  },
  defaultVariants: {
    size: "default",
    disabled: false,
    hasValue: false,
  },
})

export const chipTv = tcv({
  slots: {
    root: "max-w-full pr-0",
    closeButton: "",
    text: "max-w-full truncate",
  },
})
