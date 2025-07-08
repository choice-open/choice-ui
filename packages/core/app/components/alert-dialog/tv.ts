import { tv } from "tailwind-variants"

// Alert Dialog 主容器样式
export const alertDialogTv = tv({
  slots: {
    overlay: ["z-modals fixed inset-0 grid place-items-center"],
    container: "max-w-none",
    content: "flex flex-col gap-4 px-4 py-2",
    header: "border-b-transparent",
    footer: "flex items-center justify-end gap-2 border-t-transparent",
  },
  variants: {
    variant: {
      default: {},
      danger: {
        container: "border-danger-boundary",
      },
      success: {
        container: "border-success-boundary",
      },
      warning: {
        container: "border-warning-boundary",
      },
    },
    size: {
      small: {
        container: "w-60",
      },
      default: {
        container: "w-80",
      },
      large: {
        container: "w-120",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
