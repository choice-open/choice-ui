import { createContext, useContext } from "react"
import type { ContextEditor } from "../types/editor"

// 创建编辑器上下文
export const ContextInputEditorContext = createContext<ContextEditor | null>(null)

// 使用编辑器的 hook
export const useContextInputEditor = (): ContextEditor => {
  const editor = useContext(ContextInputEditorContext)
  if (!editor) {
    throw new Error("useContextInputEditor must be used within a ContextInputEditorProvider")
  }
  return editor
}
