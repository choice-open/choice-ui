import { tcv } from "@choiceform/design-shared"

export const radioTv = tcv({
  slots: {
    root: "flex items-center select-none",
    box: ["relative flex size-4 items-center justify-center", "border border-solid"],
    input: "peer pointer-events-auto absolute inset-0 appearance-none opacity-0",
    label: "pl-2",
  },
  variants: {
    type: {
      checkbox: {
        box: "rounded-md",
      },
      radio: {
        box: "rounded-full",
      },
    },
    variant: {
      default: {},
      accent: {},
      outline: {},
    },
    checked: {
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
  compoundVariants: [
    // 未选中状态
    {
      variant: ["default", "accent"],
      checked: false,
      disabled: false,
      focused: false,
      class: {
        box: "bg-secondary-background border-default-boundary",
      },
    },
    {
      variant: "outline",
      checked: false,
      disabled: false,
      focused: false,
      class: {
        box: ["border-default-foreground", "peer-focus-visible:border-selected-boundary"],
      },
    },
    // 选中状态 - default
    {
      variant: "default",
      checked: true,
      disabled: false,
      focused: false,
      class: {
        box: [
          "bg-secondary-background border-default-boundary",
          "peer-focus-visible:border-selected-strong-boundary",
        ],
      },
    },
    // 选中状态 - accent & outline
    {
      variant: ["accent", "outline"],
      checked: true,
      disabled: false,
      focused: false,
      class: {
        box: [
          "bg-accent-background border-selected-strong-boundary text-on-accent-foreground",
          "peer-focus-visible:border-selected-strong-boundary",
          "peer-focus-visible:text-on-accent-foreground",
          "peer-focus-visible:shadow-checked-focused",
        ],
      },
    },
    {
      variant: ["default", "accent", "outline"],
      checked: false,
      disabled: false,
      focused: true,
      class: {
        box: "border-selected-boundary",
      },
    },
    {
      variant: "default",
      checked: true,
      disabled: false,
      focused: true,
      class: {
        box: "border-selected-strong-boundary",
      },
    },
    {
      variant: ["accent", "outline"],
      checked: true,
      disabled: false,
      focused: true,
      class: {
        box: "text-on-accent-foreground border-selected-strong-boundary shadow-checked-focused",
      },
    },
    {
      variant: ["accent", "outline", "default"],
      disabled: true,
      class: {
        root: "text-default-background",
        box: "border-disabled-background bg-disabled-background",
        label: "text-disabled-foreground",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    checked: false,
    disabled: false,
    focused: false,
  },
})
