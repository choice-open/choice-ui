import { tcv } from "@choiceform/design-shared"

export const propertiesPanelTv = tcv({
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

export const propertiesPaneTitleTv = tcv({
  slots: {
    container: "group flex h-10 min-w-0 items-center gap-2 px-2 select-none",
    wrapper: "flex h-6 min-w-0 flex-1 items-center",
    content: "-ml-2 flex min-w-0 flex-1 items-center font-strong",
    collapsibleWrapper:
      "invisible flex size-4 flex-none items-center justify-center group-hover:visible",
    titleWrapper: "flex min-w-0 flex-1 cursor-default items-center leading-8",
    title: "min-w-0 truncate",
    actionWrapper: "flex h-6 items-center gap-0.5",
  },
})

export const propertiesPanelRowTv = tcv({
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

export const panelSortableRowTv = tcv({
  slots: {
    root: "panel-sortable-row",
    handle: [
      "absolute inset-y-0 left-0 w-6 cursor-grab",
      "text-secondary-foreground flex items-center justify-center",
      "transition-opacity duration-150",
    ],
  },
  variants: {
    selected: {
      true: { root: "bg-selected-background" },
      false: "",
    },
    dragging: {
      true: { root: "children:pointer-events-none cursor-grabbing", handle: "pointer-events-none" },
      false: { handle: "pointer-events-auto" },
    },
    beingDragged: {
      true: { handle: "cursor-grabbing opacity-100" },
      false: { handle: "opacity-0 hover:opacity-100" },
    },
    singleItem: {
      true: { handle: "hidden" },
      false: "",
    },
  },
  defaultVariants: {
    selected: false,
    dragging: false,
    beingDragged: false,
    singleItem: false,
  },
})
