import { createContext, useContext } from "react"
import type { ScrollAreaContextType } from "../types"

export const ScrollAreaContext = createContext<ScrollAreaContextType | null>(null)

export function useScrollAreaContext() {
  const context = useContext(ScrollAreaContext)
  if (!context) {
    throw new Error("ScrollArea compound components must be used within ScrollArea")
  }
  return context
}
