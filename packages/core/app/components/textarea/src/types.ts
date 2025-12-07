import type { HTMLProps, ReactNode, TextareaHTMLAttributes } from "react"

export interface TextareaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "value" | "onChange" | "size"> {
  /** Whether to allow newline characters when pressing Enter. Default is true */
  allowNewline?: boolean
  children?: ReactNode
  className?: string
  contentRef?: React.RefObject<HTMLDivElement>
  focusSelection?: "all" | "end" | "none"
  /** Line height in pixels for calculating textarea height. Default is 16 */
  lineHeight?: number
  maxRows?: number
  minRows?: number
  onChange?: (value: string) => void
  onIsEditingChange?: (isEditing: boolean) => void
  /** Padding in pixels (top/bottom) for calculating textarea height. Default is 4 (py-1) */
  padding?: number
  resize?: "auto" | "handle" | false
  scrollRef?: React.RefObject<HTMLDivElement>
  selected?: boolean
  value?: string
  variant?: "default" | "light" | "dark" | "reset"
}

export interface TextareaContentProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "style"> {
  cacheMeasurements?: boolean
  className?: string
  /** 防抖延迟（毫秒），默认为 0（无防抖） */
  debounceMs?: number
  maxRows?: number
  minRows?: number
  onChange?: (value: string) => void
  onHeightChange?: (height: number, meta: { rowHeight: number }) => void
  style?: Omit<
    NonNullable<TextareaHTMLAttributes<HTMLTextAreaElement>["style"]>,
    "maxHeight" | "minHeight"
  > & {
    height?: number
  }
  value?: string
}
