import { tcv } from "@choice-ui/shared"

export const iconButtonTv = tcv({
  slots: {
    button: [
      "text-default-foreground",
      "flex-none",
      "rounded-md border border-solid border-transparent",
      "flex items-center justify-center",
      "cursor-default",
      "focus-visible:border-selected-boundary",
    ],
  },
  variants: {
    size: {
      default: { button: "h-6 w-6" },
      large: { button: "h-8 w-8" },
      reset: "",
    },
    variant: {
      default: {},
      secondary: { button: "bg-default-background border-default-boundary" },
      solid: { button: "bg-secondary-background text-default-foreground" },
      highlight: {},
      ghost: {},
      dark: { button: "text-white" },
      submit: {
        button: [
          "bg-[var(--theme-submit-btn-bg)] text-[var(--theme-submit-btn-text)]",
          "focus-visible:border-transparent",
        ],
      },
      reset: {},
    },
    active: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    focused: {
      true: { button: "border-selected-boundary" },
      false: {},
    },
    loading: {
      true: { button: "pointer-events-none" },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: ["default", "highlight"],
      active: false,
      disabled: false,
      class: { button: "hover:bg-secondary-background active:bg-tertiary-background" },
    },
    {
      variant: "default",
      active: true,
      disabled: false,
      class: { button: "bg-tertiary-background" },
    },
    {
      variant: "secondary",
      active: false,
      disabled: false,
      class: { button: "hover:bg-secondary-background active:bg-tertiary-background" },
    },
    {
      variant: "secondary",
      active: true,
      disabled: false,
      class: { button: "bg-secondary-background" },
    },
    {
      variant: "solid",
      active: false,
      disabled: false,
      class: {
        button: "hover:bg-tertiary-background active:bg-tertiary-background",
      },
    },
    {
      variant: "solid",
      active: true,
      disabled: false,
      class: { button: "bg-tertiary-background" },
    },
    {
      variant: "highlight",
      active: true,
      disabled: false,
      class: { button: "bg-accent-background/10 text-accent-background" },
    },
    {
      variant: "ghost",
      active: false,
      disabled: false,
      class: {
        button: [
          "text-default-foreground/50",
          "hover:text-default-foreground",
          "active:text-default-foreground",
        ],
      },
    },
    {
      variant: "ghost",
      active: true,
      disabled: false,
      class: { button: "text-default-foreground" },
    },
    {
      variant: "dark",
      active: false,
      disabled: false,
      class: { button: "hover:bg-gray-700 active:bg-gray-600" },
    },
    {
      variant: "dark",
      active: true,
      disabled: false,
      class: { button: "bg-gray-600" },
    },
    {
      variant: ["default", "secondary", "solid", "highlight", "ghost"],
      loading: true,
      class: { button: "text-secondary-foreground" },
    },
    {
      variant: ["default", "secondary", "solid", "highlight", "ghost"],
      disabled: true,
      class: { button: "text-secondary-foreground" },
    },
    {
      variant: "dark",
      loading: true,
      class: { button: "text-gray-200" },
    },
    {
      variant: "dark",
      disabled: true,
      class: { button: "text-gray-500" },
    },
    {
      variant: "submit",
      active: false,
      disabled: false,
      class: {
        button: ["focus-visible:shadow-focus", "hover:opacity-70", "active:opacity-70"],
      },
    },
    {
      variant: "submit",
      active: true,
      disabled: false,
      class: {
        button: "opacity-70",
      },
    },
    {
      variant: "submit",
      focused: true,
      class: {
        button: ["shadow-focus", "border-transparent"],
      },
    },
    {
      variant: "submit",
      loading: true,
      class: { button: "opacity-70" },
    },
    {
      variant: "submit",
      disabled: true,
      class: { button: "opacity-50" },
    },
  ],
  defaultVariants: {
    size: "default",
    variant: "default",
    active: false,
    disabled: false,
  },
})

export const iconButtonGroupTv = tcv({
  slots: {
    container: "grid grid-cols-(--columns) gap-x-px",
    button: ["flex-1", "rounded-none first:rounded-l-md last:rounded-r-md", "w-full min-w-6"],
  },
})
