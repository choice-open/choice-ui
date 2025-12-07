import { tcv } from "@choiceform/design-shared"

export const mdInputTv = tcv({
  slots: {
    root: "flex flex-col border border-default-border rounded-lg overflow-hidden bg-default-background",
    header:
      "flex items-center justify-between gap-4 px-2 py-2 border-b border-default-border bg-default-background",
    content: "flex-1 relative",
    textarea: "border-none rounded-none",
    render: "",
  },
  variants: {
    visible: {
      true: {
        textarea: "visible",
      },
      false: {
        textarea: "invisible pointer-events-none",
      },
    },
    disabled: {
      true: {
        root: "bg-secondary-background text-disabled-foreground",
        textarea: "",
      },
    },
    readOnly: {
      true: {
        root: "bg-default-background-subtle",
        textarea: "cursor-default",
      },
    },
    hasTabs: {
      true: {
        render: "absolute inset-0",
      },
      false: {
        render: "",
      },
    },
  },
})
