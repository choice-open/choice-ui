import { tcv } from "@choiceform/design-shared"

export const BadgeTV = tcv({
  slots: {
    root: [
      "h-4 rounded-md",
      "inline-flex items-center",
      "text-body-medium",
      "border border-solid border-transparent",
      "cursor-default select-none",
    ],
    icon: "flex items-center justify-center",
  },
  variants: {
    variant: {
      default: "",
      brand: "",
      inverted: "",
      component: "",
      success: "",
      warning: "",
      error: "",
    },
    strong: {
      true: "",
      false: "",
    },
    multiElement: {
      true: { root: "pr-1" },
      false: { root: "px-1" },
    },
  },
  compoundVariants: [
    {
      variant: "default",
      class: { root: "border-default-boundary bg-default-background" },
    },
    {
      variant: "brand",
      strong: true,
      class: { root: "bg-accent-background text-on-accent-foreground" },
    },
    {
      variant: "brand",
      strong: false,
      class: { root: "border-selected-boundary text-accent-foreground" },
    },
    {
      variant: "inverted",
      strong: true,
      class: { root: "bg-default-foreground text-default-background" },
    },
    {
      variant: "inverted",
      strong: false,
      class: { root: "border-default-boundary text-default-foreground" },
    },
    {
      variant: "component",
      strong: true,
      class: { root: "bg-component-background text-on-accent-foreground" },
    },
    {
      variant: "component",
      strong: false,
      class: { root: "border-component-foreground/40 text-component-foreground" },
    },
    {
      variant: "success",
      strong: true,
      class: { root: "bg-success-background text-on-accent-foreground" },
    },
    {
      variant: "success",
      strong: false,
      class: { root: "border-success-foreground/40 text-success-foreground" },
    },
    {
      variant: "warning",
      strong: true,
      class: { root: "bg-warning-background text-gray-900" },
    },
    {
      variant: "warning",
      strong: false,
      class: { root: "border-warning-foreground/40 text-warning-foreground" },
    },
    {
      variant: "error",
      strong: true,
      class: { root: "bg-danger-background text-on-accent-foreground" },
    },
    {
      variant: "error",
      strong: false,
      class: { root: "border-danger-foreground/40 text-danger-foreground" },
    },
    {
      strong: false,
      class: { root: "bg-default-background" },
    },
  ],
  defaultVariants: {
    variant: "default",
    strong: false,
  },
})
