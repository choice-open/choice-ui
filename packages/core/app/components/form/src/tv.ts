import { tcv } from "@choiceform/design-shared"

export const FormTv = tcv({
  slots: {
    field: ["flex min-w-0 flex-col gap-2"],
    error: [
      "text-body-medium",
      "px-0.5",
      "break-words whitespace-pre-wrap",
      "text-danger-foreground",
    ],
    description: [
      "text-body-medium",
      "px-0.5",
      "break-words whitespace-pre-wrap",
      "text-secondary-foreground",
    ],
  },
})
