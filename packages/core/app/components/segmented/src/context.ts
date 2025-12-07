import { createContext, useContext } from "react"

export interface SegmentedContextValue {
  disabled?: boolean
  groupId: string
  onChange: (value: string) => void
  readOnly?: boolean
  value?: string
  variant?: "default" | "light" | "dark" | "reset"
}

export const SegmentedContext = createContext<SegmentedContextValue | null>(null)

export function useSegmentedContext() {
  const context = useContext(SegmentedContext)
  if (!context) {
    throw new Error("SegmentedItem must be used within a Segmented component")
  }
  return context
}
