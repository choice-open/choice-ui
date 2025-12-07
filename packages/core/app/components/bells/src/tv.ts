import { tcv } from "@choiceform/design-shared"

export const BellsTv = tcv({
  slots: {
    root: ["relative flex", "h-10 max-w-80 overflow-hidden rounded-xl shadow-lg"],
    content: "relative flex min-w-0 items-center gap-1 px-2",
    icon: "flex h-6 w-6 flex-none items-center justify-center",
    text: "truncate",
    close: "grid size-10 flex-none place-content-center border-l",
    button: [
      "size-6 rounded-md",
      "flex items-center justify-center px-2",
      "hover:bg-white/5 active:bg-white/10",
    ],
    progress: "pointer-events-none absolute inset-0 bg-white/10 will-change-transform",
  },
  variants: {
    action: {
      true: {
        close: "border-l-transparent",
      },
      false: {
        close: "border-l-menu-boundary",
      },
    },
    close: {
      true: {},
      false: {},
    },
    variant: {
      default: {
        root: "bg-menu-background text-white",
        progress: "bg-white/20",
      },
      accent: {
        root: "bg-accent-background text-white",
        progress: "bg-blue-400/40",
      },
      success: {
        root: "bg-success-background text-white",
        progress: "bg-green-400/40",
      },
      warning: {
        root: "bg-warning-background text-gray-900",
        button: "text-gray-900 hover:bg-black/10",
        progress: "bg-yellow-400",
      },
      danger: {
        root: "bg-danger-background text-white",
        progress: "bg-red-400/40",
      },
      assistive: {
        root: "bg-assistive-background text-white",
        progress: "bg-pink-400/40",
      },
      reset: {},
    },
  },
  compoundVariants: [
    {
      action: true,
      close: true,
      class: {
        content: "pr-0",
      },
    },
    {
      variant: ["default", "accent", "success", "danger", "assistive"],
      class: {
        button: "text-white hover:bg-white/10",
      },
    },
  ],
  defaultVariants: {
    action: false,
    close: false,
    variant: "default",
  },
})
