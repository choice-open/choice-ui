import { tcv } from "@choice-ui/shared"

export const fillInputTv = tcv({
  slots: {
    root: [
      // Layout
      "h-6 min-w-0 flex-1 shrink-0 items-center",
      // Container
      "input-fill",
      // State
      "group",
    ],
    wrapper: [
      // Layout
      "flex min-h-6 min-w-0 items-center",
      // Position
      "[grid-area:input-1]",
      // Spacing
      "h-full pl-2",
    ],
    swatch: "flex-none",
    content: [
      // Layout
      "flex h-6 min-w-0 flex-1 items-center",
      // Spacing
      "px-2",
      // Interaction
      "cursor-default",
    ],
    alpha: [
      // Layout
      "min-w-0 flex-1",
      // Position
      "[grid-area:input-2]",
    ],
    hex: "flex-1",
    label: "flex-1 truncate select-none",
  },
  variants: {
    // 输入类型
    type: {
      SOLID: {},
      GRADIENT: {},
      IMAGE: {},
      VARIABLE: {},
    },
    // Alpha 输入是否禁用
    alpha: {
      false: {
        root: "input-fill--hex",
        wrapper: "rounded-md",
      },
      true: {
        root: "input-fill--hex-and-alpha",
        wrapper: "rounded-l-md",
      },
    },
    // 选中状态
    selected: {
      true: {},
      false: {},
    },
    // 激活状态
    active: {
      true: {},
      false: {},
    },
    // 禁用状态
    disabled: {
      true: {
        content: "text-disabled-foreground",
      },
      false: {},
    },
    empty: {
      true: {
        label: "text-secondary-foreground",
      },
      false: {},
    },
    // 变体类型
    variantType: {
      VARIABLE: {
        swatch: "rounded-sm",
      },
      STYLE: {
        swatch: "rounded-full",
      },
    },
  },
  compoundVariants: [
    // 基础类型（SOLID、GRADIENT、IMAGE）的状态样式
    {
      type: ["SOLID", "GRADIENT", "IMAGE"],
      selected: true,
      class: {
        root: [
          // Focus
          "focus-within:before:border-selected-boundary",
          // Hover
          "not-focus-within:before:border-selected-boundary/50",
        ],
        wrapper: "bg-body",
        alpha: "bg-body",
      },
    },
    {
      type: ["SOLID", "GRADIENT", "IMAGE"],
      selected: false,
      class: {
        root: [
          "focus-within:before:border-selected-boundary",
          "hover:not-focus-within:before:border-default-boundary",
        ],
      },
    },
    {
      type: ["SOLID", "GRADIENT", "IMAGE"],
      selected: false,
      active: true,
      class: {
        wrapper: "bg-tertiary-background",
      },
    },
    {
      type: ["SOLID", "GRADIENT", "IMAGE"],
      selected: false,
      active: false,
      class: {
        wrapper: "bg-secondary-background",
      },
    },
    // 变量类型的状态样式
    {
      type: "VARIABLE",
      selected: false,
      active: false,
      class: {
        root: [
          // Focus
          "before:border-default-boundary",
          // Hover
          "hover:not-focus-within:before:border-default-boundary",
        ],
        wrapper: "group-hover:bg-secondary-background",
      },
    },
    {
      type: "VARIABLE",
      selected: false,
      active: true,
      class: {
        wrapper: "bg-tertiary-background",
      },
    },
    {
      type: "VARIABLE",
      selected: true,
      active: false,
      class: {
        root: "before:border-selected-boundary/50",
        wrapper: "bg-default-background",
      },
    },
  ],
  defaultVariants: {
    alpha: true,
    selected: false,
    active: false,
    variantType: "VARIABLE",
    empty: false,
    disabled: false,
  },
})

export const alphaInputTv = tcv({
  slots: {
    root: "flex-none first:rounded-l-md last:rounded-r-md",
    input: "pr-0 pl-1.5",
    suffix: "w-fit pr-1",
  },
  variants: {
    disabled: {
      true: {
        input: "text-disabled-foreground",
        suffix: "text-disabled-foreground",
      },
      false: {},
    },
    active: {
      true: {
        root: "bg-tertiary-background",
      },
      false: {
        root: "bg-secondary-background",
      },
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
  },
})
