import { tv } from "tailwind-variants"

export const propertiesPanelTv = tv({
  slots: {
    container: "properties-panel",
    triggerRef: "pointer-events-none absolute inset-y-0 left-0",
  },
  variants: {
    isEmpty: {
      true: "",
      false: { container: "pb-3" },
    },
  },
  defaultVariants: {
    isEmpty: false,
  },
})

export const propertiesPaneTitleTv = tv({
  slots: {
    container: "group flex h-10 min-w-0 items-center gap-2 px-2 select-none",
    wrapper: "flex h-6 min-w-0 flex-1 items-center",
    content: "-ml-2 flex min-w-0 flex-1 items-center font-medium",
    collapsibleWrapper:
      "invisible flex size-4 flex-none items-center justify-center group-hover:visible",
    titleWrapper: "flex min-w-0 flex-1 cursor-default items-center leading-8",
    title: "min-w-0 truncate",
    actionWrapper: "flex h-6 items-center gap-0.5",
  },
})

export const propertiesPanelRowTv = tv({
  slots: {
    container: "group rows",
    triggerRef: "pointer-events-none absolute inset-y-0 left-0",
  },
  variants: {
    type: {
      single: { container: "rows--single" },
      "two-columns": { container: "rows--two-columns" },
      "one-label-one-input": { container: "rows--one-label-one-input" },
      "one-label-one-input-one-icon": { container: "rows--one-label-one-input-one-icon" },
      "one-label-two-input": { container: "rows--one-label-two-input" },
      "one-icon-one-input": { container: "rows--one-icon-one-input" },
      "one-input-one-icon": { container: "rows--one-input-one-icon" },
      "one-input-two-icon": { container: "rows--one-input-two-icon" },
      "two-input-one-icon": { container: "rows--two-input-one-icon" },
      "two-input-two-icon": { container: "rows--two-input-two-icon" },
      "one-icon-one-input-two-icon": { container: "rows--one-icon-one-input-two-icon" },
      "two-input-one-icon-double-row": { container: "rows--two-input-one-icon-double-row" },
      "one-icon-one-input-two-icon-double-row": {
        container: "rows--one-icon-one-input-two-icon-double-row",
      },
    },
    triggerRef: {
      true: { container: "relative" },
      false: "",
    },
    active: {
      true: { container: "bg-secondary-background" },
      false: "",
    },
  },
  defaultVariants: {
    type: "single",
    triggerRef: false,
    active: false,
  },
})
