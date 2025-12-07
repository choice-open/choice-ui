import { tcv } from "@choiceform/design-shared"

export const toggleButtonTv = tcv({
  slots: {
    root: ["relative"],
    input: ["absolute inset-0 h-full w-full", "peer pointer-events-auto appearance-none opacity-0"],
    label: [
      "absolute inset-0 flex h-full w-full rounded-md",
      "items-center justify-center",
      "border border-solid border-transparent",
      "peer-focus-visible:border-selected-boundary",
    ],
  },
  variants: {
    variant: {
      default: {},
      secondary: {},
      highlight: {},
      reset: {},
    },
    size: {
      default: { root: "h-6 w-6" },
      large: { root: "h-8 w-8" },
    },
    checked: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        label: "text-secondary-foreground",
      },
      false: {},
    },
    active: {
      true: {},
      false: {},
    },
    focused: {
      true: { label: "border-selected-boundary" },
      false: {},
    },
    event: {
      click: {},
      mousedown: {},
    },
  },
  compoundVariants: [
    {
      variant: ["default", "highlight"],
      active: false,
      disabled: false,
      class: {
        label: "hover:bg-secondary-background",
      },
    },
    {
      variant: "default",
      active: false,
      event: "click",
      disabled: false,
      class: {
        label: "active:bg-tertiary-background",
      },
    },
    {
      variant: ["highlight", "secondary"],
      active: false,
      checked: false,
      disabled: false,
      event: "click",
      class: {
        label: "active:bg-tertiary-background",
      },
    },
    {
      variant: ["highlight", "secondary"],
      active: false,
      checked: true,
      disabled: false,
      event: "click",
      class: {
        label: "active:bg-accent-background/10",
      },
    },
    {
      variant: ["default", "highlight"],
      active: true,
      disabled: false,
      class: {
        label: "bg-tertiary-background",
      },
    },
    {
      variant: "secondary",
      checked: false,
      focused: false,
      disabled: false,
      class: {
        label: "border-default-boundary hover:bg-secondary-background",
      },
    },
    {
      variant: "secondary",
      active: true,
      disabled: false,
      checked: false,
      class: {
        label: "bg-secondary-background",
      },
    },
    {
      variant: ["highlight", "secondary"],
      active: true,
      disabled: false,
      checked: true,
      class: {
        label: "bg-accent-background/10 text-accent-foreground",
      },
    },
    {
      variant: ["highlight", "secondary"],
      checked: true,
      disabled: false,
      active: false,
      class: {
        label: "bg-accent-background/10 text-accent-foreground hover:bg-accent-background/5",
      },
    },
    {
      variant: ["highlight", "secondary"],
      checked: true,
      disabled: true,
      class: {
        label: "bg-tertiary-background",
      },
    },
  ],
  defaultVariants: {
    checked: false,
    disabled: false,
    variant: "default",
    size: "default",
    event: "click",
    active: false,
    focused: false,
  },
})
