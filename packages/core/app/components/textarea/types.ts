import type { HTMLProps } from "react"
import type { TextareaAutosizeProps } from "react-textarea-autosize"

export interface TextareaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange" | "size">,
    Pick<TextareaAutosizeProps, "minRows" | "maxRows"> {
  className?: string
  onChange?: (value: string) => void
  onIsEditingChange?: (isEditing: boolean) => void
  resize?: "auto" | "handle" | false
  selected?: boolean
  value?: string
  variant?: "default" | "dark" | "reset"
}
