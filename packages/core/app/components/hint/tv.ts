import { tv } from "tailwind-variants"

export const hintVariants = tv({
  slots: {
    content: [
      "rounded-md",
      "flex",
      "bg-default-background",
      "text-default-foreground",
      "leading-md shadow-md",
      "max-w-xs",
    ],
    text: "my-1",
    trigger: [
      "inline-flex items-center justify-center",
      "h-6 w-6",
      "rounded-full",
      "text-default-foreground",
    ],
    icon: ["h-6 w-6", "flex shrink-0 items-center justify-center"],
  },
  variants: {
    placement: {
      "left-start": {
        content: "flex-row-reverse pl-2",
      },
      "right-start": {
        content: "flex-row pr-2",
      },
    },
    disabled: {
      true: {
        trigger: "text-disabled-foreground",
      },
    },
  },
  defaultVariants: {
    disabled: false,
    placement: "right-start",
  },
})
