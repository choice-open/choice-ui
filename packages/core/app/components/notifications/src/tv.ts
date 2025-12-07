import { tcv } from "@choiceform/design-shared"

export const NotificationsTv = tcv({
  slots: {
    root: ["grid", "bg-menu-background h-14 w-72 overflow-hidden rounded-md text-white shadow-lg"],
    content: "grid items-center gap-1 px-2 py-3",
    icon: "flex h-6 w-6 items-center justify-center",
    text: "line-clamp-2",
    actions: "border-l-menu-boundary divide-menu-boundary grid grid-flow-row divide-y border-l",
    button: [
      "flex items-center justify-center truncate rounded-none px-2",
      "hover:bg-white/5 active:bg-white/10",
    ],
  },
  variants: {
    actions: {
      true: {
        root: "grid-cols-[1fr_72px]",
      },
      false: {
        root: "",
      },
    },
    icon: {
      true: {
        content: "grid-cols-[1.5rem_auto]",
      },
    },
  },
  defaultVariants: {
    actions: false,
    icon: false,
  },
})
