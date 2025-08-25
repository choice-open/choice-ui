import type { HTMLProps, ReactNode } from "react"
import type { TextareaAutosizeProps } from "react-textarea-autosize"

export interface TextareaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange" | "size">,
    Pick<TextareaAutosizeProps, "minRows" | "maxRows"> {
  /** Whether to allow newline characters when pressing Enter. Default is true */
  allowNewline?: boolean
  children?: ReactNode
  className?: string
  focusSelection?: "all" | "end" | "none"
  /** Line height in pixels for calculating textarea height. Default is 16 */
  lineHeight?: number
  onChange?: (value: string) => void
  onIsEditingChange?: (isEditing: boolean) => void
  /** Padding in pixels (top/bottom) for calculating textarea height. Default is 4 (py-1) */
  padding?: number
  resize?: "auto" | "handle" | false
  selected?: boolean
  value?: string
  variant?: "default" | "dark" | "reset"
}

export interface TextareaContentProps extends Omit<TextareaAutosizeProps, "onChange"> {
  className?: string
  onChange?: (value: string) => void
  value?: string
}
