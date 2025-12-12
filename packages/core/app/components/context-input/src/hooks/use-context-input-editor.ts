import { createContext, useContext } from "react"
import type { ContextEditor } from "../types/editor"

// Create editor context
export const ContextInputEditorContext = createContext<ContextEditor | null>(null)

// Hook to use the editor
export const useContextInputEditor = (): ContextEditor => {
  const editor = useContext(ContextInputEditorContext)
  if (!editor) {
    throw new Error("useContextInputEditor must be used within a ContextInputEditorProvider")
  }
  return editor
}
