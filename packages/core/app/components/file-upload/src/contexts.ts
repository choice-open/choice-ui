import { createContext } from "react"
import { FileUploadContextValue, FileUploadItemContextValue } from "./types"
import { createStore } from "./store"

export const StoreContext = createContext<ReturnType<typeof createStore> | null>(null)
StoreContext.displayName = "FileUpload"

export const FileUploadContext = createContext<FileUploadContextValue | null>(null)

export const FileUploadItemContext = createContext<FileUploadItemContextValue | null>(null)
