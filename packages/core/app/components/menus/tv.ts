import { tv } from "tailwind-variants"

export const MenusTv = tv({
  base: [
    "relative flex flex-col",
    "z-menu rounded-lg",
    "h-full p-2",
    "bg-menu-background text-white shadow-lg",
    "scrollbar-hide overflow-y-auto overscroll-contain",
    "pointer-events-auto select-none",
  ],
  variants: {
    matchTriggerWidth: {
      true: "w-full",
      false: "min-w-36",
    },
  },
  defaultVariants: {
    matchTriggerWidth: false,
  },
})

export const MenuTriggerTv = tv({
  slots: {
    root: "justify-start text-left",
    icon: "flex size-6 flex-none items-center justify-center",
  },
  variants: {
    hasPrefix: {
      true: { root: "gap-0" },
      false: { root: "gap-1" },
    },
    hasSuffix: {
      true: { root: "gap-0" },
      false: { root: "gap-1" },
    },

    size: {
      default: {},
      large: {},
    },
    isEmpty: {
      true: { root: "text-secondary-foreground" },
      false: {},
    },
  },
  compoundVariants: [
    {
      size: "default",
      hasPrefix: true,
      class: { root: "pl-0" },
    },
    {
      size: "large",
      hasPrefix: true,
      class: { root: "pl-1" },
    },
    {
      size: "default",
      hasSuffix: true,
      class: { root: "pr-0" },
    },
    {
      size: "large",
      hasSuffix: true,
      class: { root: "pr-1" },
    },
  ],
  defaultVariants: {
    hasPrefix: false,
    hasSuffix: false,
    isEmpty: false,
    size: "default",
  },
})

export const MenuItemTv = tv({
  slots: {
    root: [
      "group/menu-item flex h-6 w-full flex-none items-center rounded-md",
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
        shortcut: "text-white/40",
      },
    },
    disabled: {
      true: {
        root: "opacity-50",
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
      highlight: {},
      danger: {},
      reste: {},
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
      class: {
        root: "bg-accent-background text-on-accent-foreground",
        shortcut: "text-white",
      },
    },
    {
      disabled: false,
      variant: "highlight",
      selected: true,
      active: false,
      class: {
        root: "bg-white/10",
      },
    },
    {
      disabled: false,
      variant: "danger",
      selected: true,
      active: false,
      class: {
        root: "bg-danger-background text-on-accent-foreground",
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

export const MenuDividerTv = tv({
  slots: {
    root: "flex h-4 w-full flex-none items-center",
    divider: "bg-menu-boundary h-px flex-1",
  },
})

export const MenuSearchEmptyTv = tv({
  slots: {
    root: "flex flex-col items-center justify-center gap-2 p-4 text-center",
    text: "text-white/50",
  },
})

export const MenuLabelTv = tv({
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

export const MenuButtonTv = tv({
  base: [
    "flex-none border-gray-700 bg-transparent text-white",
    "hover:bg-gray-700 active:bg-gray-800",
  ],
})

export const MenuScrollArrowTv = tv({
  base: [
    "absolute flex h-6 w-full items-center justify-center overflow-hidden",
    "z-menu border-white/10 bg-gray-900 text-white hover:bg-gray-800",
  ],
  variants: {
    dir: {
      up: "top-0 rounded-t-lg border-b",
      down: "bottom-0 rounded-b-lg border-t",
    },
    visible: {
      true: "visible",
      false: "hidden",
    },
  },
  defaultVariants: {
    visible: false,
    dir: "down",
  },
})

export const MenuCheckboxTv = tv({
  slots: {
    root: "flex size-4 flex-none items-center justify-center",
    checkbox: "flex size-4 flex-none items-center justify-center rounded-md border",
  },
  variants: {
    active: {
      true: {},
      false: {},
    },
    selected: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      active: false,
      selected: false,
      class: {
        checkbox: "border-white/10 bg-white/15",
      },
    },
    {
      active: false,
      selected: true,
      class: {
        checkbox: "bg-accent-background border-white/30",
      },
    },
    {
      active: true,
      selected: true,
      class: {
        checkbox: "border-black/20",
      },
    },
    {
      active: true,
      selected: false,
      class: {
        checkbox: "border-white/20",
      },
    },
  ],
  defaultVariants: {
    active: false,
    selected: false,
  },
})
