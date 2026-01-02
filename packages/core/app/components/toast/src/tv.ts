import { tcv } from "@choice-ui/shared"

export const toastViewportTv = tcv({
  base: ["fixed z-modals flex flex-col outline-none"],
  variants: {
    expanded: {
      true: {},
      false: {},
    },
    layout: {
      default: "w-72 max-w-[calc(100vw-2rem)]",
      compact: "w-fit min-w-48 max-w-[calc(100vw-2rem)]",
    },
    position: {
      "top-left": "top-(--toast-offset) left-(--toast-offset) items-start",
      "top-center": "top-(--toast-offset) left-1/2 -translate-x-1/2 items-center",
      "top-right": "top-(--toast-offset) right-(--toast-offset) items-end",
      "bottom-left": "bottom-(--toast-offset) left-(--toast-offset) items-start",
      "bottom-center": "bottom-(--toast-offset) left-1/2 -translate-x-1/2 items-center",
      "bottom-right": "bottom-(--toast-offset) right-(--toast-offset) items-end",
    },
  },
  defaultVariants: {
    position: "bottom-right",
    expanded: false,
  },
})

export const toastRootTv = tcv({
  slots: {
    root: [
      "bg-(--toast-background-color) shadow-lg",
      "absolute pointer-events-auto",
      "flex",
      "select-none touch-none overflow-hidden",
    ],
    icon: [
      "shrink-0 self-center w-6 h-6 flex items-center justify-center",
      "transition-opacity duration-200",
    ],
    content: [
      "grid min-w-0 h-full items-center",
      "overflow-hidden",
      "transition-opacity duration-200",
      "opacity-100",
    ],
    actions: [
      "flex items-center justify-center truncate",
      "transition-opacity duration-200 pointer-events-auto self-stretch",
    ],
    button: "flex items-center justify-center pointer-events-auto px-2",
    title: "text-body-medium-strong min-w-0",
    description: "text-body-medium",

    progressTrack: "absolute overflow-hidden pointer-events-none",
    progressIndicator: "h-full origin-left",
  },
  variants: {
    position: {
      "top-left": {
        root: "left-0 top-0 origin-top",
      },
      "top-center": {
        root: "top-0 origin-top",
      },
      "top-right": {
        root: "right-0 top-0 origin-top",
      },
      "bottom-left": {
        root: "left-0 bottom-0 origin-bottom",
      },
      "bottom-center": {
        root: "bottom-0 origin-bottom",
      },
      "bottom-right": {
        root: "right-0 bottom-0 origin-bottom",
      },
    },
    hasDescription: {
      true: {
        icon: "row-span-2",
      },
    },
    hasActions: {
      true: {
        root: "grid-cols-[1fr_auto] grid",
      },
      false: {
        content: "pr-3",
      },
    },
    hasIcon: {
      true: {
        content: "pl-2 pr-2 grid-cols-[1.5rem_auto] gap-x-2",
      },
      false: {
        content: "pl-3 pr-2",
      },
    },
    expanded: {
      true: {
        icon: "opacity-100 pointer-events-auto",
        content: "opacity-100 pointer-events-auto",
        actions: "opacity-100 pointer-events-auto",
      },
    },
    behind: {
      true: {
        icon: "opacity-0 pointer-events-none",
        content: "opacity-0 pointer-events-none",
        actions: "opacity-0 pointer-events-none",
      },
    },

    layout: {
      default: {
        root: "left-0 right-0 w-full items-center transition-colors delay-100 duration-400 rounded-lg",
        content: "py-3 min-h-14 relative",
        title: "line-clamp-2",
        description: "line-clamp-3 opacity-70",
        actions: "border-l text-white grid",
        button: "w-full h-full [&+button]:border-t",
      },
      compact: {
        root: "w-fit h-10 overflow-hidden rounded-xl",
        content: "flex items-center h-10 min-w-fit",
        title: "truncate",
        actions: "flex items-center min-w-fit",
        button: "",
      },
    },
    variant: {
      default: {},
      accent: {},
      success: {},
      warning: {},
      error: {},
      assistive: {},
      reset: {},
    },
    type: {
      default: {},
      info: {},
      success: {},
      warning: {},
      error: {},
      loading: {},
    },
    buttonVariant: {
      action: {},
      cancel: {},
    },
  },
  compoundVariants: [
    // text color
    {
      variant: ["accent", "success", "default", "error", "assistive"],
      class: {
        root: "text-white",
      },
    },
    {
      variant: "warning",
      class: {
        root: "text-gray-900",
      },
    },
    // Type color
    {
      variant: "default",
      type: ["default", "loading"],
      class: {
        icon: "text-white",
        progressIndicator: "bg-white",
      },
    },
    {
      variant: "default",
      type: "info",
      class: {
        icon: "text-accent-foreground",
        progressIndicator: "bg-accent-foreground",
      },
    },
    {
      variant: "default",
      type: "success",
      class: {
        icon: "text-success-foreground",
        progressIndicator: "bg-success-foreground",
      },
    },
    {
      variant: "default",
      type: "warning",
      class: {
        icon: "text-warning-foreground",
        progressIndicator: "bg-warning-foreground",
      },
    },
    {
      variant: "default",
      type: "error",
      class: {
        icon: "text-danger-foreground",
        progressIndicator: "bg-danger-foreground",
      },
    },
    // button in layout
    {
      layout: "default",
      variant: "default",
      class: {
        actions: "border-menu-boundary",
        button: "border-menu-boundary",
      },
    },
    {
      layout: "default",
      variant: ["accent", "success", "warning", "error", "assistive"],
      class: {
        actions: "border-black/20",
        button: "border-black/20",
      },
    },
    {
      layout: "default",
      variant: ["accent", "success", "default", "error", "assistive"],
      class: {
        actions: "text-white",
        button: "hover:bg-white/10 active:bg-white/20",
      },
    },
    {
      layout: "default",
      variant: "warning",
      class: {
        actions: "text-gray-900",
        button: "hover:bg-black/10 active:bg-black/20",
      },
    },
    {
      buttonVariant: "action",
      layout: "compact",
      class: {
        button: "mr-2",
      },
    },
    {
      buttonVariant: "cancel",
      layout: "compact",
      class: {
        button: "size-10 flex items-center justify-center",
      },
    },
    {
      buttonVariant: "cancel",
      layout: "compact",
      variant: "default",
      class: {
        button: "border-menu-boundary border-l",
      },
    },
    {
      buttonVariant: "action",
      layout: "compact",
      class: {
        button: "px-2 h-6 rounded-md border border-transparent",
      },
    },
    {
      buttonVariant: "action",
      layout: "compact",
      variant: "default",
      class: {
        button: "border-menu-boundary",
      },
    },
    {
      buttonVariant: ["action", "cancel"],
      layout: "compact",
      variant: "default",
      class: {
        button: "hover:bg-white/10 active:bg-white/20",
      },
    },
    {
      buttonVariant: "action",
      layout: "compact",
      variant: ["accent", "success", "warning", "error", "assistive"],
      class: {
        button: "bg-black/30 hover:bg-black hover:text-white",
      },
    },
    {
      buttonVariant: "cancel",
      layout: "compact",
      variant: ["accent", "success", "warning", "error", "assistive"],
      class: {
        button: "border-black/10 hover:bg-black/10 active:bg-black/20 border-l",
      },
    },
    // progress track
    {
      layout: "default",
      class: {
        progressTrack: "bottom-1 inset-x-2 h-0.5 rounded-full",
      },
    },
    {
      layout: "compact",
      class: {
        progressTrack: "inset-0 rounded-xl -z-1",
      },
    },
    // progress indicator
    {
      layout: "default",
      variant: "default",
      class: {
        progressIndicator: "bg-white/20",
      },
    },
    {
      layout: "default",
      variant: "accent",
      class: {
        progressIndicator: "bg-blue-400/50",
      },
    },
    {
      layout: "default",
      variant: "success",
      class: {
        progressIndicator: "bg-green-400/50",
      },
    },
    {
      layout: "default",
      variant: "warning",
      class: {
        progressIndicator: "bg-black/20",
      },
    },
    {
      layout: "default",
      variant: "error",
      class: {
        progressIndicator: "bg-red-400/50",
      },
    },
    {
      layout: "default",
      variant: "assistive",
      class: {
        progressIndicator: "bg-pink-400/50",
      },
    },
    // compact layout with progress
    {
      layout: "compact",
      variant: "default",
      class: {
        progressIndicator: "bg-menu-background",
      },
    },
    {
      layout: "compact",
      variant: "accent",
      class: {
        progressIndicator: "bg-accent-background",
      },
    },
    {
      layout: "compact",
      variant: "success",
      class: {
        progressIndicator: "bg-success-background",
      },
    },
    {
      layout: "compact",
      variant: "warning",
      class: {
        progressIndicator: "bg-warning-background",
      },
    },
    {
      layout: "compact",
      variant: "error",
      class: {
        progressIndicator: "bg-danger-background",
      },
    },
    {
      layout: "compact",
      variant: "assistive",
      class: {
        progressIndicator: "bg-assistive-background",
      },
    },
  ],
  defaultVariants: {
    hasActions: false,
    type: "default",
    layout: "default",
    variant: "default",
    expanded: false,
    behind: false,
    position: "bottom-right",
  },
})
