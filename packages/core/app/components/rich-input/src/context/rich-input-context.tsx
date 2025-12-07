import { createContext, useContext } from "react"
import type { RichInputContextValue } from "../types"

export const RichInputContext = createContext<RichInputContextValue | null>(null)

export const useRichInputContext = () => {
  const context = useContext(RichInputContext)
  if (!context) {
    throw new Error("useRichInputContext must be used within a RichInput component")
  }
  return context
}
