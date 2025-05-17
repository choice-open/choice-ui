import { tv } from "tailwind-variants"

export const ListTv = tv({
  base: [
    "relative flex flex-col",
    "p-2",
    "scrollbar-hide overflow-y-auto overscroll-contain",
    "pointer-events-auto select-none",
  ],
})

export const ListItemTv = tv({
  slots: {
    root: [
      "group/list-item relative",
      "flex h-6 w-full flex-none items-center rounded-md",
      "leading-md tracking-md text-md text-left",
      "cursor-default",
      "group-data-[level=1]/list:pl-6",
      "group-data-[level=2]/list:pl-11",
      "group-data-[level=3]/list:pl-16",
      "group-data-[level=4]/list:pl-21",
      "group-data-[level=5]/list:pl-26",
    ],
    shortcut: "",
    icon: "flex h-4 min-w-4 flex-none items-center justify-center",
  },
  variants: {
    active: {
      true: {},
      false: {
        root: "bg-transparent",
        shortcut: "text-secondary-foreground",
      },
    },
    disabled: {
      true: {
        root: "text-disabled-foreground",
      },
      false: {},
    },
    selected: {
      true: {},
      false: {},
    },
    hasPrefix: {
      true: { root: "gap-1 pl-1" },
      false: { root: "pl-2" },
    },
    hasSuffix: {
      true: { root: "gap-1 pr-1" },
      false: { root: "pr-2" },
    },
    variant: {
      default: {},
      primary: {},
    },
  },
  compoundVariants: [
    {
      hasPrefix: false,
      hasSuffix: false,
      class: {
        root: "gap-2",
      },
    },
    {
      disabled: false,
      active: true,
      variant: "default",
      class: {
        root: "bg-secondary-background",
        shortcut: "text-default-foreground",
      },
    },
    {
      disabled: false,
      active: true,
      variant: "primary",
      class: {
        root: "bg-selected-background",
        shortcut: "text-default-foreground",
      },
    },
  ],
  defaultVariants: {
    active: false,
    disabled: false,
    selected: false,
    hasPrefix: false,
    hasSuffix: false,
    variant: "default",
  },
})

export const ListLabelTv = tv({
  base: "flex h-6 w-full flex-none items-center gap-2 opacity-50",
  variants: {
    selection: {
      true: "pr-2 pl-6",
      false: "px-2",
    },
  },
  defaultVariants: {
    selection: false,
  },
})

export const ListDividerTv = tv({
  slots: {
    root: "flex h-4 w-full flex-none items-center",
    divider: "bg-default-boundary h-px flex-1",
  },
  defaultVariants: {},
})

export const ListContentTv = tv({
  base: "group/list flex flex-col gap-1",
  variants: {
    showReferenceLine: {
      true: "",
      false: "",
    },
    level: {
      0: "",
      1: "before:left-2.5",
      2: "before:left-7.5",
      3: "before:left-12.5",
      4: "before:left-17.5",
      5: "before:left-22.5",
    },
  },
  compoundVariants: [
    {
      showReferenceLine: true,
      level: [1, 2, 3, 4, 5],
      class: [
        "relative",
        "before:absolute before:inset-y-0 before:z-1 before:w-px before:content-['']",
        "group-hover/list:before:bg-default-boundary",
      ],
    },
  ],
  defaultVariants: {
    showReferenceLine: false,
    level: 0,
  },
})
