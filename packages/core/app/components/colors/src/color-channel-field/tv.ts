import { tcv } from "@choice-ui/shared"

export const ColorChannelInputTv = tcv({
  slots: {
    container: [
      "input-fill grid min-w-0 rounded-md",
      "hover:not-focus-within:before:border-default-boundary",
      "focus-within:before:border-selected-boundary",
    ],
    hexInput: "bg-secondary-background [grid-area:input-1]",
    numeric: "bg-secondary-background flex-none first:rounded-l-md last:rounded-r-md",
    numericInput: "pr-0 pl-1.25",
  },
  variants: {
    variant: {
      default: "",
      hex: "",
    },
    alpha: {
      true: { hexInput: "rounded-l-md" },
      false: { hexInput: "rounded-md" },
    },
  },
  compoundVariants: [
    {
      variant: "hex",
      alpha: true,
      className: { container: "input-fill--hex-and-alpha" },
    },
    {
      variant: "hex",
      alpha: false,
      className: { container: "input-fill--hex" },
    },
    {
      variant: "default",
      alpha: true,
      className: { container: "input-fill--rgb-and-alpha" },
    },
    {
      variant: "default",
      alpha: false,
      className: { container: "input-fill--rgb" },
    },
  ],
  defaultVariants: {
    variant: "default",
    alpha: true,
  },
})

export const ColorChannelFieldTv = tcv({
  slots: {
    container: "",
  },
  variants: {
    spaceDropdown: {
      false: {},
      true: {},
    },
    spacesAvailable: {
      true: {
        container: "grid gap-2",
      },
      false: {
        container: [
          "flex items-center justify-center select-none",
          "bg-secondary-background text-secondary-foreground h-6 rounded-md",
        ],
      },
    },
  },
  compoundVariants: [
    {
      spacesAvailable: true,
      spaceDropdown: true,
      className: { container: "grid-cols-[1fr_auto]" },
    },
  ],
  defaultVariants: {
    spaceDropdown: true,
  },
})
