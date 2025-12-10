import { tcv } from "@choice-ui/shared"

export const commandTv = tcv({
  slots: {
    root: "flex h-full w-full flex-col overflow-hidden",
    divider: "my-2 h-px",
  },
  variants: {
    variant: {
      default: {
        root: "bg-default-background text-default-foreground",
        divider: "bg-default-boundary",
      },
      dark: {
        root: "bg-menu-background text-white",
        divider: "bg-menu-boundary",
      },
    },
  },
})

export const commandInputTv = tcv({
  slots: {
    input: "m-2",
  },
  variants: {
    size: {
      default: {},
      large: {
        input: "leading-lg tracking-lg px-4 text-body-large",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export const commandListTv = tcv({
  slots: {
    root: "px-2 pb-2",
    content: "flex flex-col",
  },
})

export const commandGroupTv = tcv({
  slots: {
    root: "flex flex-col gap-1 not-first:mt-4",
    heading: "text-body-medium px-2",
  },
  variants: {
    variant: {
      default: {
        heading: "text-secondary-foreground",
      },
      dark: {
        heading: "text-white/50",
      },
    },
  },
})

export const commandItemTv = tcv({
  slots: {
    root: ["group/item relative flex items-center rounded-lg select-none", "focus:outline-none"],
    icon: "flex flex-shrink-0 items-center justify-center rounded-md",
    value: "flex-1 truncate",
    shortcut: "text-secondary-foreground",
  },
  variants: {
    variant: {
      default: {},
      dark: {
        root: "text-white",
      },
    },
    size: {
      default: {
        root: "text-body-medium min-h-8 p-1",
        icon: "h-6 min-w-6",
      },
      large: {
        root: "leading-lg tracking-lg min-h-10 p-2 text-body-large",
        icon: "h-6 min-w-6",
      },
    },
    hasPrefix: {
      true: "",
      false: "",
    },
    hasSuffix: {
      true: "",
      false: "",
    },
    selected: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        root: "pointer-events-none",
      },
    },
  },
  compoundVariants: [
    {
      hasPrefix: true,
      size: "default",
      class: {
        root: "gap-1 pl-1",
      },
    },
    {
      hasPrefix: false,
      size: "default",
      class: {
        root: "pl-2",
      },
    },
    {
      hasSuffix: true,
      size: "default",
      class: {
        root: "gap-1 pr-1",
      },
    },
    {
      hasSuffix: false,
      size: "default",
      class: {
        root: "pr-2",
      },
    },
    // large
    {
      hasPrefix: true,
      size: "large",
      class: {
        root: "gap-2 pl-2",
      },
    },
    {
      hasPrefix: false,
      size: "large",
      class: {
        root: "pl-4",
      },
    },
    {
      hasSuffix: true,
      size: "large",
      class: {
        root: "gap-2 pr-2",
      },
    },
    {
      hasSuffix: false,
      size: "large",
      class: {
        root: "pr-4",
      },
    },
    {
      variant: "default",
      selected: true,
      class: {
        root: "bg-secondary-background",
      },
    },
    {
      variant: "dark",
      selected: true,
      class: {
        root: "bg-gray-700",
      },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        root: "text-secondary-foreground",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        root: "text-white/50",
      },
    },
  ],
  defaultVariants: {
    size: "default",
    hasPrefix: false,
    hasSuffix: false,
    variant: "default",
  },
})

export const commandFooterTv = tcv({
  slots: {
    root: "flex h-10 items-center justify-between border-t px-2",
  },
  variants: {
    variant: {
      default: {
        root: "border-default-boundary",
      },
      dark: {
        root: "border-menu-boundary",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export const commandTabsTv = tcv({
  slots: {
    tabs: "mx-2 mb-2",
  },
})

export const commandEmptyTv = tcv({
  slots: {
    root: "py-6 text-center",
  },
  variants: {
    variant: {
      default: {
        root: "text-secondary-foreground",
      },
      dark: {
        root: "text-white/50",
      },
    },
  },
})

export const commandLoadingTv = tcv({
  slots: {
    root: "flex items-center justify-center py-6 text-center",
  },
})
