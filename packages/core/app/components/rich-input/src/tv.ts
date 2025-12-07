import { tcv } from "@choiceform/design-shared"

export const richInputTv = tcv({
  slots: {
    root: "relative box-border outline-none flex flex-col",
    scrollArea: "flex min-h-0 flex-col",
    viewport: "flex flex-1 flex-col p-2",
    content: "flex w-full min-w-0 flex-1 flex-col",
    editable: "box-border outline-none min-h-full text-body-large",
  },
})

export const floatingMenuTv = tcv({
  base: ["grid z-sticky min-w-5", "bg-menu-background pointer-events-auto select-none"],
  variants: {
    type: {
      characters: "grid-cols-6 gap-1 p-1",
      url: "grid-cols-[1fr_auto] p-1",
      paragraph: "",
    },
    expanded: {
      true: "p-1 rounded-lg gap-1",
      false: "rounded-md",
    },
  },
  compoundVariants: [
    {
      type: "paragraph",
      expanded: true,
      className: "grid-cols-3",
    },
  ],
  defaultVariants: {
    type: "characters",
    expanded: false,
  },
})

export const buttonTv = tcv({
  base: "",
  variants: {
    variant: {
      icon: "size-5",
      removeUrl: "size-4 text-white/50 hover:text-white",
    },
    active: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "icon",
    active: false,
  },
})

// 编辑器内容样式
export const leafTv = tcv({
  slots: {
    element: "",
  },
  variants: {
    type: {
      strong: { element: "font-bold" },
      em: { element: "italic" },
      del: { element: "line-through" },
      u: { element: "underline" },
      code: { element: "rounded-md bg-tertiary-background px-1" },
      link: { element: "text-accent-foreground underline" },
    },
  },
})

export const elementTv = tcv({
  slots: {
    element: "",
    list: "m-0 p-0 pl-6",
    checkbox: "relative",
    checkboxIcon: "flex absolute top-0 -left-5.5 justify-center items-center w-5.5 h-5.5",
    checkboxInput:
      "absolute inset-0 appearance-none z-2 box-border m-0 outline-none p-0 min-w-5.5 min-h-5.5",
  },
  variants: {
    type: {
      paragraph: { element: "[&:not(:last-child)]:mb-2" },
      heading: { element: "[&:not(:last-child)]:mb-2 [&:not(:first-child)]:mt-4" },
      h1: { element: "text-heading-display" },
      h2: { element: "text-heading-large" },
      h3: { element: "text-heading-medium" },
      h4: { element: "text-heading-small" },
      h5: { element: "text-body-medium" },
      h6: { element: "text-body-small" },
      pre: {
        element: "block m-0 rounded-md bg-secondary-background font-mono whitespace-pre-wrap p-1",
      },
      blockquote: { element: "m-0 ml-[10px] border-l-2 p-0 pl-3 text-secondary-foreground" },
      list: { element: "m-0 p-0 pl-6 [&:not(:last-child)]:mb-1" },
      listItem: { element: "m-0 !pl-0" },

      check: { list: "list-none" },
      bulleted: { list: "[&_li]:list-disc" },
      numbered: { list: "list-decimal" },
    },
    checked: {
      true: { checkboxIcon: "text-accent-foreground" },
      false: { checkboxIcon: "text-secondary-foreground" },
    },
  },
  defaultVariants: {
    type: "paragraph",
    checked: false,
  },
})
