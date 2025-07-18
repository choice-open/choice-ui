import { Textarea as TextareaComponent } from "./textarea"
import { ResizeHandle } from "./components"

export const Textarea = Object.assign(TextareaComponent, {
  ResizeHandle,
})

export type { TextareaProps } from "./types"
export type { ResizeHandleProps } from "./components"
