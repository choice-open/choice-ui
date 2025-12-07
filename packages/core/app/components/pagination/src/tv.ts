import { tcv } from "@choiceform/design-shared"

export const paginationTv = tcv({
  slots: {
    root: ["flex items-center gap-3 select-none", "text-secondary-foreground"],
    navigation: ["flex items-center gap-1"],
    pages: ["flex items-center gap-1"],
    button: ["transition-colors"],
    pageButton: "min-w-6 px-0",
    ellipsis: ["flex items-center justify-center", "px-2 text-secondary-foreground"],
  },
  variants: {
    active: {
      true: {},
    },
  },
})

export const paginationSpinnerTv = tcv({
  slots: {
    spinner: ["flex items-center gap-0.5 text-body-medium"],
    button: ["p-1 disabled:bg-secondary-background"],
    inputWrapper: [
      "flex items-center justify-center gap-1",
      "bg-secondary-background h-6 px-2 relative cursor-text min-w-14",
      "border border-transparent focus-within:border-selected-boundary",
    ],
    input: [
      "absolute inset-0 appearance-none",
      "w-full bg-secondary-background text-default-foreground text-center outline-none",
    ],
    currentPage: ["text-default-foreground"],
    label: ["text-secondary-foreground"],
  },
  variants: {
    position: {
      left: {
        button: "rounded-r-none",
      },
      right: {
        button: "rounded-l-none",
      },
    },
  },
})
