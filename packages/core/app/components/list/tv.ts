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
      "flex w-full flex-none items-center rounded-md",
      "leading-md tracking-md text-md text-left",
      "cursor-default",
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
      true: {},
      false: {},
    },
    hasSuffix: {
      true: {},
      false: {},
    },
    variant: {
      default: {},
      primary: {},
    },
    size: {
      default: {
        root: "h-6",
      },
      large: {
        root: "h-8",
      },
    },
    level: {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
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
    {
      size: "default",
      hasPrefix: false,
      class: { root: "pl-2" },
    },
    {
      size: "large",
      hasPrefix: false,
      class: { root: "pl-4" },
    },
    {
      size: "default",
      hasPrefix: true,
      class: { root: "gap-1 pl-1" },
    },
    {
      size: "large",
      hasPrefix: true,
      class: { root: "gap-1 pl-2" },
    },
    {
      size: "default",
      hasSuffix: false,
      class: { root: "pr-2" },
    },
    {
      size: "large",
      hasSuffix: false,
      class: { root: "pr-4" },
    },
    {
      size: "default",
      hasSuffix: true,
      class: { root: "gap-1 pr-1" },
    },
    {
      size: "large",
      hasSuffix: true,
      class: { root: "gap-1 pr-2" },
    },
    {
      size: "default",
      level: 1,
      class: { root: "pl-6" },
    },
    {
      size: "default",
      level: 2,
      class: { root: "pl-11" },
    },
    {
      size: "default",
      level: 3,
      class: { root: "pl-16" },
    },
    {
      size: "default",
      level: 4,
      class: { root: "pl-21" },
    },
    {
      size: "default",
      level: 5,
      class: { root: "pl-26" },
    },
    {
      size: "large",
      level: 1,
      class: { root: "pl-7" },
    },
    {
      size: "large",
      level: 2,
      class: { root: "pl-12" },
    },
    {
      size: "large",
      level: 3,
      class: { root: "pl-17" },
    },
    {
      size: "large",
      level: 4,
      class: { root: "pl-22" },
    },
    {
      size: "large",
      level: 5,
      class: { root: "pl-27" },
    },
  ],
  defaultVariants: {
    active: false,
    disabled: false,
    selected: false,
    hasPrefix: false,
    hasSuffix: false,
    variant: "default",
    size: "default",
    level: 0,
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
    size: {
      default: {},
      large: {},
    },
    level: {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
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
    {
      size: "default",
      level: 1,
      class: "before:left-2",
    },
    {
      size: "default",
      level: 2,
      class: "before:left-7",
    },
    {
      size: "default",
      level: 3,
      class: "before:left-12",
    },
    {
      size: "default",
      level: 4,
      class: "before:left-17",
    },
    {
      size: "default",
      level: 5,
      class: "before:left-22",
    },
    {
      size: "large",
      level: 1,
      class: "before:left-2.5",
    },
    {
      size: "large",
      level: 2,
      class: "before:left-7.5",
    },
    {
      size: "large",
      level: 3,
      class: "before:left-12.5",
    },
    {
      size: "large",
      level: 4,
      class: "before:left-17.5",
    },
    {
      size: "large",
      level: 5,
      class: "before:left-22.5",
    },
  ],
  defaultVariants: {
    showReferenceLine: false,
    level: 0,
    size: "default",
  },
})
