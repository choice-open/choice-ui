import { createContext, useContext } from "react"
import type { MdInputContextValue } from "../types"

export const MdInputContext = createContext<MdInputContextValue | null>(null)

export const useMdInputContext = () => {
  const context = useContext(MdInputContext)
  if (!context) {
    throw new Error("MdInput compound components must be used within a MdInput component")
  }
  return context
}
