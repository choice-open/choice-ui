import { tv } from "tailwind-variants"

export const buttonTv = tv({
  slots: {
    button: [
      "flex items-center justify-center gap-1",
      "leading-md tracking-md text-md",
      "min-w-0 rounded-md px-2",
      "border border-solid border-transparent",
      "cursor-default select-none",
    ],
    spinner: ["pointer-events-none h-full", "absolute inset-0", "grid place-content-center"],
    content: "invisible",
  },
  variants: {
    size: {
      default: { button: "h-6" },
      large: { button: "h-8" },
    },
    variant: {
      primary: {
        button: "bg-accent-background text-on-accent-foreground",
      },
      secondary: {
        button: "text-default-foreground bg-default-background border-default-boundary",
      },
      solid: {
        button: "bg-secondary-background text-default-foreground",
      },
      destructive: {
        button: "bg-danger-background text-on-accent-foreground",
      },
      "secondary-destruct": {
        button: "border-danger-foreground/40 text-danger-foreground",
      },
      inverse: {
        button: "bg-default-foreground text-default-background",
      },
      success: {
        button: "bg-success-background text-on-accent-foreground",
      },
      link: {
        button: "text-accent-foreground hover:bg-accent-background/10 bg-transparent",
      },
      "link-danger": {
        button: "text-danger-foreground hover:bg-danger-background/10 bg-transparent",
      },
      ghost: {
        button: "text-default-foreground hover:bg-secondary-background bg-transparent",
      },
    },
    active: {
      true: "",
      false: "",
    },
    disabled: {
      true: "",
      false: "",
    },
    loading: {
      true: {
        button: "relative",
      },
      false: "",
    },
    focused: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: ["primary", "destructive", "inverse", "success"],
      class: {
        button: "focus-visible:shadow-focus",
      },
    },
    {
      variant: ["primary", "destructive", "inverse", "success"],
      focused: true,
      class: {
        button: "shadow-focus",
      },
    },
    {
      variant: ["secondary", "solid", "secondary-destruct", "link", "link-danger", "ghost"],
      class: {
        button: "focus-visible:border-selected-boundary",
      },
    },
    {
      variant: ["secondary", "solid", "secondary-destruct", "link", "link-danger", "ghost"],
      focused: true,
      class: {
        button: "border-selected-boundary",
      },
    },
    // 禁用状态
    {
      variant: ["primary", "solid", "destructive", "inverse", "success"],
      disabled: true,
      class: {
        button: "bg-disabled-background text-disabled-foreground pointer-events-none",
      },
    },
    {
      variant: ["secondary", "secondary-destruct"],
      disabled: true,
      class: {
        button: "border-default-boundary text-disabled-foreground pointer-events-none",
      },
    },
    {
      variant: ["link", "link-danger", "ghost"],
      disabled: true,
      class: {
        button: [
          "text-disabled-foreground pointer-events-none",
          "data-[multi-element=true]:border-default-boundary",
        ],
      },
    },
    // 激活状态
    {
      active: true,
      variant: "primary",
      class: { button: "bg-accent-active-background" },
    },
    {
      active: true,
      variant: ["secondary", "secondary-destruct", "ghost"],
      class: { button: "bg-secondary-background" },
    },
    {
      active: true,
      variant: "solid",
      class: { button: "bg-secondary-active-background" },
    },
    {
      active: true,
      variant: "destructive",
      class: { button: "bg-danger-active-background" },
    },
    {
      active: true,
      variant: "inverse",
      class: { button: "bg-secondary-foreground text-default-background" },
    },
    {
      active: true,
      variant: "success",
      class: { button: "bg-success-active-background" },
    },
    {
      active: true,
      variant: "link",
      class: { button: "bg-accent-background/10" },
    },
    {
      active: true,
      variant: "link-danger",
      class: { button: "bg-danger-active-background/10" },
    },
    // 非禁用状态下的按压效果
    {
      disabled: false,
      loading: false,
      variant: "primary",
      class: { button: "active:bg-accent-active-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: ["secondary", "secondary-destruct", "ghost"],
      class: { button: "active:bg-secondary-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: "solid",
      class: { button: "active:bg-secondary-active-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: "destructive",
      class: { button: "active:bg-danger-active-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: "inverse",
      class: { button: "active:bg-secondary-foreground text-default-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: "success",
      class: { button: "active:bg-success-active-background" },
    },
    {
      disabled: false,
      loading: false,
      variant: "link",
      class: { button: "active:bg-accent-background/10" },
    },
    {
      disabled: false,
      loading: false,
      variant: "link-danger",
      class: { button: "active:bg-danger-active-background/10" },
    },
  ],
  defaultVariants: {
    size: "default",
    variant: "primary",
    active: false,
    disabled: false,
    loading: false,
    focused: false,
  },
})
