import { tcv } from "@choice-ui/shared"

export const propertiesPanelTv = tcv({
  slots: {
    container: "relative flex min-w-0 flex-col not-last:border-b",
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
    container: "group grid min-w-0 items-center pr-2 pl-4",
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
      "one-icon-one-input-one-icon": { container: "rows--one-icon-one-input-one-icon" },
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

export const panelLabelTv = tcv({
  base: "[grid-area:label]",
  variants: {
    showLabels: {
      true: ["text-secondary-foreground", "rows--label"],
      false: "sr-only",
    },
  },
  defaultVariants: {
    showLabels: false,
  },
})

export const panelPreviewerTv = tcv({
  base: "bg-secondary-background text-secondary-foreground relative mx-4 my-2 flex h-32 flex-col items-center justify-center rounded-xl",
})

export const panelRowLabelTv = tcv({
  base: "text-secondary-foreground cursor-default truncate select-none [grid-area:label]",
})

export const panelRowManyIconTv = tcv({
  slots: {
    container:
      "group text-body-medium flex h-8 min-w-0 items-center justify-between gap-x-2 pr-2 pl-4 select-none",
    iconWrapper:
      "text-secondary-foreground group-hover:text-default-foreground flex h-6 min-w-6 flex-none gap-x-1",
  },
})

export const panelSortableContainerTv = tcv({
  slots: {
    container: "relative flex flex-col",
    rowContainer: "panel-sortable-row group/sortable-row relative",
  },
})
