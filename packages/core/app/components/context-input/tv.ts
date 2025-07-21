import { tv } from "tailwind-variants"

export const contextInputTv = tv({
  slots: {
    container: [
      "group/context-input leading-md tracking-md text-md flex min-w-0 flex-col overflow-hidden",
    ],
    scrollArea: ["flex min-h-0 flex-col"],
    viewport: ["flex flex-1 flex-col"],
    scrollContainer: ["flex w-full min-w-0 flex-1 flex-col"],
    editor: ["flex-1"],
    placeholder: ["pointer-events-none absolute"],
    loading: "",
  },
  variants: {
    size: {
      default: {
        container: "rounded-lg",
        placeholder: "left-2",
      },
      large: {
        container: "rounded-xl",
        placeholder: "left-3",
      },
    },
    hasHeader: {
      true: {},
      false: {},
    },
    hasFooter: {
      true: {},
      false: {},
    },
    variant: {
      default: {
        container: ["placeholder:text-secondary-foreground"],
      },
      dark: {
        container: ["placeholder:text-white/40"],
      },
      reset: {
        container: "",
      },
    },
    selected: {
      true: {},
    },
    disabled: {
      true: {
        placeholder: "text-disabled-foreground",
      },
      false: {
        placeholder: "text-secondary-foreground",
      },
    },
  },
  compoundVariants: [
    {
      hasHeader: true,
      hasFooter: false,
      class: {
        scrollArea: "h-[calc(100%-2.5rem)]",
      },
    },
    {
      hasHeader: false,
      hasFooter: true,
      class: {
        scrollArea: "h-[calc(100%-2.5rem)]",
      },
    },
    {
      hasHeader: true,
      hasFooter: true,
      class: {
        scrollArea: "h-[calc(100%-5rem)]",
      },
    },
    {
      size: "default",
      hasHeader: true,
      class: {
        editor: "px-2 pt-1 pb-2",
        placeholder: "top-1",
      },
    },
    {
      size: "default",
      hasHeader: false,
      class: {
        editor: "p-2",
        placeholder: "top-2.5",
      },
    },
    {
      size: "large",
      hasHeader: true,
      class: {
        editor: "px-3 pt-2 pb-3",
        placeholder: "top-2",
      },
    },
    {
      size: "large",
      hasHeader: false,
      class: {
        editor: "p-3",
        placeholder: "top-3",
      },
    },
    {
      variant: ["default", "dark"],
      class: {
        container: "border border-solid",
      },
    },
    {
      size: "large",
      disabled: false,
      class: {
        container: "focus-within:shadow-xxs focus-within:border-secondary-secondary-background",
      },
    },
    {
      variant: "default",
      selected: true,
      disabled: false,
      size: "default",
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
      size: "default",
      class: {
        container:
          "hover:not-focus-within:border-default-boundary bg-secondary-background focus-within:bg-default-background",
        placeholder: "text-secondary-foreground",
      },
    },
    {
      variant: "dark",
      selected: false,
      disabled: false,
      size: "default",
      class: {
        container:
          "bg-gray-700 text-white focus-within:bg-gray-900 hover:not-focus-within:border-gray-600",
        placeholder: "text-white/40",
      },
    },
    {
      variant: ["dark", "default"],
      selected: false,
      disabled: false,
      size: "default",
      class: {
        container: "focus-within:border-selected-boundary border-transparent",
      },
    },
    {
      variant: "default",
      disabled: true,
      class: {
        container: "text-disabled-foreground border-secondary-background bg-secondary-background",
      },
    },
    {
      variant: "dark",
      disabled: true,
      class: {
        container: "bg-gray-700 text-white/40",
      },
    },
  ],
  defaultVariants: {
    disabled: false,
    variant: "default",
    hasHeader: false,
    hasFooter: false,
    size: "default",
  },
})
