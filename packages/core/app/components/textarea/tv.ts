import { tv } from "tailwind-variants"

export const TextareaTv = tv({
  slots: {
    container: "relative rounded-md border border-transparent",
    textarea: [
      "w-full min-w-0",
      "px-2 py-1",
      "leading-md tracking-md text-md",
      "cursor-text",
      "bg-transparent",
      "placeholder:text-secondary-foreground",
      "resize-none appearance-none",
      "focus:outline-none",
      "overflow-hidden",
    ],
    viewport: "h-full w-full",
    resizeHandle: [
      "absolute right-0 bottom-0 cursor-ns-resize",
      "flex size-6 items-center justify-center",
      "select-none",
    ],
  },

  variants: {
    variant: {
      default: {
        container: "bg-secondary-background",
        textarea: "text-default-foreground",
      },
      dark: {
        container: "bg-gray-700",
        textarea: "text-white placeholder:text-white/40",
      },
      reset: {},
    },
    resize: {
      auto: {},
      handle: {
        textarea: "min-h-[inherit] pr-6",
      },
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
    readOnly: {
      true: {
        textarea: "cursor-default",
      },
      false: {},
    },
    isDragging: {
      true: {
        container: "border-selected-boundary border-dashed",
        textarea: "pointer-events-none",
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: "default",
      selected: true,
      disabled: false,
      class: {
        container: [
          "bg-default-background",
          "not-focus-within:border-selected-boundary/50",
          "focus-within:border-selected-boundary",
        ],
      },
    },
    {
      variant: "default",
      selected: false,
      disabled: false,
      isDragging: false,
      class: {
        container: "hover:not-focus-within:border-default-boundary",
      },
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      isDragging: false,
      class: {
        container: ["hover:not-focus-within:border-gray-600"],
      },
    },
    {
      variant: ["dark", "default"],
      selected: false,
      disabled: false,
      class: {
        container: "focus-within:border-selected-boundary",
      },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        container: "border-secondary-background bg-secondary-background",
        textarea: "text-disabled-foreground",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        container: "bg-gray-700",
        textarea: "text-white/40",
      },
    },
  ],

  defaultVariants: {
    variant: "default",
    selected: false,
    disabled: false,
    readOnly: false,
    resize: "auto",
  },
})
