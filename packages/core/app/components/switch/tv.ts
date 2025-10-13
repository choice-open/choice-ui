import { tcv } from "~/utils"

export const switchTv = tcv({
  slots: {
    root: ["relative flex items-center gap-2 flex-shrink-0", "select-none"],
    track: [
      "relative flex-shrink-0",
      "rounded-full",
      "border border-solid",
      "h-(--switch-height) w-(--switch-width)",
    ],
    thumb: [
      "absolute",
      "rounded-full",
      "h-(--thumb-height) w-(--thumb-width)",
      "top-(--thumb-margin) left-(--thumb-margin)",
    ],
    input: [
      "peer pointer-events-auto appearance-none",
      "absolute inset-0 cursor-default opacity-0",
    ],
  },
  variants: {
    size: {
      small: {},
      medium: {},
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
      true: {
        root: "text-secondary-foreground",
        track: "bg-disabled-background border-transparent",
        thumb: "bg-white",
      },
      false: {
        root: "text-default-foreground",
      },
    },
    focused: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    // Base states - 未选中
    {
      checked: false,
      disabled: false,
      focused: false,
      variant: ["default", "accent"],
      class: {
        track: "bg-tertiary-background border-transparent",
        thumb: "shadow-sm bg-white",
      },
    },
    {
      variant: "outline",
      checked: false,
      disabled: false,
      focused: false,
      class: {
        track: "border-default-foreground bg-transparent",
        thumb: "bg-default-foreground shadow-none",
      },
    },

    // Base states - 选中
    {
      variant: ["default", "outline"],
      checked: true,
      disabled: false,
      focused: false,
      class: {
        track: "bg-default-foreground border-transparent",
        thumb: "shadow-sm bg-default-background",
      },
    },
    {
      variant: "accent",
      checked: true,
      disabled: false,
      focused: false,
      class: {
        track: "bg-accent-background border-transparent",
        thumb: "shadow-sm bg-white",
      },
    },

    // Hover states - 未选中
    {
      variant: ["default", "accent"],
      checked: false,
      disabled: false,
      focused: false,
      class: {
        track: "hover:bg-tertiary-background",
      },
    },
    {
      variant: "outline",
      checked: false,
      disabled: false,
      focused: false,
      class: {
        track: "hover:bg-secondary-background",
      },
    },

    // Focused states - 未选中
    {
      focused: true,
      checked: false,
      disabled: false,
      variant: ["default", "accent"],
      class: {
        track: "bg-tertiary-background border-selected-boundary",
        thumb: "shadow-none bg-white",
      },
    },
    {
      focused: true,
      checked: false,
      disabled: false,
      variant: "outline",
      class: {
        track: "border-selected-boundary bg-transparent",
        thumb: "bg-default-foreground shadow-none",
      },
    },

    // Focused states - 选中
    {
      focused: true,
      checked: true,
      disabled: false,
      variant: ["default", "outline"],
      class: {
        track: "border-selected-boundary shadow-switch-focused",
        thumb: "shadow-border-white-inset bg-default-background",
      },
    },
    {
      focused: true,
      checked: true,
      disabled: false,
      variant: "accent",
      class: {
        track: "bg-accent-background border-selected-boundary shadow-checked-focused",
        thumb: "shadow-border-white-inset bg-white",
      },
    },

    // Focus-visible states (keyboard focus) - 未选中
    {
      focused: false,
      checked: false,
      disabled: false,
      variant: ["default", "accent", "outline"],
      class: {
        track: "peer-focus-visible:border-selected-boundary",
        thumb: "peer-focus-visible:shadow-none",
      },
    },

    // Focus-visible states (keyboard focus) - 选中
    {
      focused: false,
      checked: true,
      disabled: false,
      variant: ["default", "outline"],
      class: {
        track: [
          "peer-focus-visible:border-selected-boundary",
          "peer-focus-visible:shadow-switch-focused",
        ],
        thumb: "peer-focus-visible:shadow-border-white-inset",
      },
    },
    {
      focused: false,
      checked: true,
      disabled: false,
      variant: "accent",
      class: {
        track: [
          "peer-focus-visible:border-selected-boundary",
          "peer-focus-visible:shadow-checked-focused",
        ],
        thumb: "peer-focus-visible:shadow-border-white-inset",
      },
    },
  ],
  defaultVariants: {
    size: "medium",
    variant: "default",
    checked: false,
    disabled: false,
    focused: false,
  },
})
