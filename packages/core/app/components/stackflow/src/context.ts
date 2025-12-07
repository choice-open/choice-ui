import { createContext, useContext } from "react"
import type { StackflowControls } from "./hooks"

export interface StackflowContextValue extends StackflowControls {
  registerItem: (id: string, content: React.ReactNode) => void
}

export const StackflowContext = createContext<StackflowContextValue | null>(null)

export function useStackflowContext() {
  const context = useContext(StackflowContext)
  if (!context) {
    throw new Error("Stackflow components must be used within a Stackflow component")
  }
  return context
}
