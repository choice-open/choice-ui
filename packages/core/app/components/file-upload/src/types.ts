import { RefObject } from "react"

export type Direction = "ltr" | "rtl"

export interface FileState {
  error?: string
  file: File
  progress: number
  status: "idle" | "uploading" | "error" | "success"
}

export interface StoreState {
  dragOver: boolean
  files: Map<File, FileState>
  invalid: boolean
}

export type StoreAction =
  | { files: File[]; variant: "ADD_FILES" }
  | { files: File[]; variant: "SET_FILES" }
  | { file: File; progress: number; variant: "SET_PROGRESS" }
  | { file: File; variant: "SET_SUCCESS" }
  | { error: string; file: File; variant: "SET_ERROR" }
  | { file: File; variant: "REMOVE_FILE" }
  | { dragOver: boolean; variant: "SET_DRAG_OVER" }
  | { invalid: boolean; variant: "SET_INVALID" }
  | { variant: "CLEAR" }

export interface FileUploadContextValue {
  dir: Direction
  disabled: boolean
  dropzoneId: string
  inputId: string
  inputRef: RefObject<HTMLInputElement | null>
  labelId: string
  listId: string
}

export interface FileUploadItemContextValue {
  fileState: FileState | undefined
  id: string
  messageId: string
  nameId: string
  sizeId: string
  statusId: string
}
