import { tcv } from "@choice-ui/shared"
import s from "./styles/style.module.css"

export const NumericInputTv = tcv({
  slots: {
    container: ["group/input grid before:border-transparent", s.input],
    input: ["peer", "w-full", "cursor-default appearance-none truncate"],
    tooltip: "col-span-3 col-start-1 row-start-1",
  },
  variants: {
    variant: {
      default: {
        input: "bg-secondary-background placeholder:text-secondary-foreground",
      },
      light: {
        input: "bg-gray-100 text-gray-900 placeholder:text-black/50",
      },
      dark: {
        input: "bg-gray-700 text-white placeholder:text-white/50",
      },
      reset: {},
    },
    size: {
      default: {
        container: ["h-6", s.default],
        input: "h-6",
        tooltip: "h-6",
      },
      large: {
        container: ["h-8", s.large],
        input: "h-8",
        tooltip: "h-8",
      },
    },
    prefixElement: {
      true: {},
      false: {},
    },
    suffixElement: {
      true: {},
      false: {},
    },
    variableValue: {
      true: {},
      false: {},
    },
    selected: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    focused: {
      true: {},
      false: {},
    },
  },
  compoundSlots: [
    // 基础输入框样式
    {
      slots: ["input"],
      variableValue: false,
      prefixElement: false,
      class: "px-2",
    },
    // 无前缀时的圆角
    {
      slots: ["input"],
      variableValue: false,
      prefixElement: false,
      class: "rounded-l-md",
    },
    // 无后缀时的圆角
    {
      slots: ["input"],
      suffixElement: false,
      class: "rounded-r-md",
    },
  ],
  compoundVariants: [
    // 默认变体的状态样式
    {
      variant: ["default", "light", "dark"],
      selected: true,
      class: {
        container: ["before:border-selected-boundary/50"],
      },
    },
    {
      variant: "default",
      selected: false,
      disabled: false,
      class: {
        container: [
          "focus-within:before:border-selected-boundary",
          "not-focus-within:hover:before:border-default-boundary",
        ],
      },
    },
    // Themes
    {
      variant: "light",
      selected: false,
      disabled: false,
      class: {
        container: [
          "focus-within:before:border-selected-boundary",
          "not-focus-within:hover:before:border-gray-200",
        ],
      },
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      class: {
        container: [
          "focus-within:before:border-selected-boundary",
          "not-focus-within:hover:before:border-gray-600",
        ],
      },
    },
    // 禁用
    {
      disabled: true,
      variant: "default",
      class: {
        input: "disabled:text-disabled-foreground disabled:bg-secondary-background",
      },
    },
    {
      disabled: true,
      variant: "light",
      class: {
        input: "disabled:bg-gray-100 disabled:text-black/30",
      },
    },
    {
      disabled: true,
      variant: "dark",
      class: {
        input: "disabled:bg-gray-700 disabled:text-white/50",
      },
    },
    {
      focused: true,
      variant: ["default", "light", "dark"],
      class: {
        container: "before:border-selected-boundary",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    selected: false,
    disabled: false,
    focused: false,
  },
})

export const NumericInputMenuTriggerTv = tcv({
  base: "flex-none rounded-l-none rounded-r-md [grid-area:action]",
  variants: {
    disabled: {
      true: "",
    },
    size: {
      default: "",
      large: "",
    },
    type: {
      menu: "",
      action: "",
    },
    variant: {
      default: "",
      light: "",
      dark: "",
      reset: "",
    },
  },
  compoundVariants: [
    {
      disabled: false,
      variant: "default",
      type: "action",
      class: "bg-secondary-background",
    },
    {
      disabled: false,
      variant: "light",
      class: "bg-gray-100 text-black/50",
    },
    {
      disabled: false,
      variant: "dark",
      class: "bg-gray-700 text-white/50",
    },
    // Disabled
    {
      disabled: true,
      variant: "default",
      class: "bg-secondary-background text-disabled-foreground",
    },
    {
      disabled: true,
      variant: "light",
      class: "bg-gray-100 text-black/30",
    },
    {
      disabled: true,
      variant: "dark",
      class: "bg-gray-700 text-white/50",
    },
  ],
  defaultVariants: {
    disabled: false,
    size: "default",
    type: "menu",
    variant: "default",
  },
})

export const NumericInputVariableTv = tcv({
  slots: {
    root: "flex flex-1 items-center pr-1 [grid-area:variable]",
    chip: "z-2 select-none",
  },
  variants: {
    prefixElement: {
      true: {},
      false: {
        root: "rounded-l-md pl-1",
      },
    },
    variant: {
      default: {},
      light: {},
      dark: {},
      reset: {},
    },
    disabled: {
      true: {
        root: "pointer-events-none",
      },
      false: {},
    },
    selected: {
      true: {
        root: "pointer-events-none",
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      disabled: false,
      variant: "default",
      class: {
        root: "bg-secondary-background",
        chip: [
          "group-focus-within/input:border-selected-boundary",
          "group-focus-within/input:bg-selected-background",
        ],
      },
    },
    {
      disabled: false,
      variant: "light",
      class: {
        root: "bg-gray-100 text-black/50",
        chip: [
          "border-gray-200 bg-white text-gray-900 hover:bg-gray-100",
          "group-focus-within/input:border-selected-boundary",
          "group-focus-within/input:bg-blue-200",
        ],
      },
    },
    {
      disabled: false,
      variant: "dark",
      class: {
        root: "bg-gray-700 text-white/50",
        chip: [
          "border-gray-600 bg-gray-800 text-white hover:bg-gray-700",
          "group-focus-within/input:border-selected-boundary",
          "group-focus-within/input:bg-blue-700",
        ],
      },
    },
    {
      disabled: true,
      variant: "default",
      class: {
        root: "bg-secondary-background",
        chip: "text-disabled-foreground bg-secondary-background",
      },
    },
    {
      disabled: true,
      variant: "light",
      class: {
        root: "bg-gray-100",
        chip: "border-gray-200 bg-gray-100 text-black/30",
      },
    },
    {
      disabled: true,
      variant: "dark",
      class: {
        root: "bg-gray-700",
        chip: "border-gray-600 bg-gray-700 text-gray-400",
      },
    },
  ],
  defaultVariants: {
    prefixElement: false,
    variant: "default",
    disabled: false,
    selected: false,
  },
})

export const NumericInputElementTv = tcv({
  base: ["select-none", "z-2", "flex flex-none items-center justify-center"],
  variants: {
    type: {
      handler: "select-none",
      action: "",
      menu: "",
    },
    position: {
      prefix: "rounded-l-md",
      suffix: "rounded-r-md",
    },
    size: {
      default: "h-6 w-6",
      large: "h-8 w-8",
    },
    disabled: {
      true: "text-disabled-foreground",
      false: "text-secondary-foreground",
    },
    variant: {
      default: "",
      light: "",
      dark: "",
      reset: "",
    },
  },
  compoundVariants: [
    {
      type: "handler",
      position: "prefix",
      class: "[grid-area:prefix-handler]",
    },
    {
      type: "handler",
      position: "suffix",
      class: "[grid-area:suffix-handler]",
    },

    {
      type: "action",
      position: "prefix",
      class: "[grid-area:prefix-handler]",
    },
    {
      type: "action",
      position: "suffix",
      class: "[grid-area:action]",
    },

    {
      type: "menu",
      position: "prefix",
      class: "[grid-area:prefix-handler]",
    },
    {
      type: "menu",
      position: "suffix",
      class: "ml-px [grid-area:action]",
    },

    {
      type: "handler",
      disabled: false,
      class: "cursor-ew-resize",
    },
    {
      disabled: false,
      variant: "default",
      class: "bg-secondary-background",
    },
    {
      disabled: false,
      variant: "light",
      class: "bg-gray-100 text-black/50",
    },
    {
      disabled: false,
      variant: "dark",
      class: "bg-gray-700 text-white/50",
    },
    {
      disabled: true,
      variant: "default",
      class: "bg-secondary-background text-disabled-foreground",
    },
    {
      disabled: true,
      variant: "light",
      class: "bg-gray-100 text-black/30",
    },
    {
      disabled: true,
      variant: "dark",
      class: "bg-gray-700 text-white/30",
    },
  ],
  defaultVariants: {
    disabled: false,
    variant: "default",
    size: "default",
  },
})

export const NumericInputMenuActionPromptTv = tcv({
  base: [
    "[grid-area:action]",
    "pr-2",
    "flex items-center justify-center",
    "rounded-r-md",
    "pointer-events-none z-3",
  ],
  variants: {
    size: {
      default: "w-6",
      large: "w-8",
    },
    disabled: {
      true: "text-secondary-foreground bg-default-background",
      false: "bg-secondary-background group-focus-within/input:hidden group-hover/input:hidden",
    },
  },
  defaultVariants: {
    disabled: false,
    size: "default",
  },
})
