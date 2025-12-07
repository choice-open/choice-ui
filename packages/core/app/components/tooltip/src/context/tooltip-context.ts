import { createContext, useContext } from "react"
import type { TooltipContextValue } from "../types"

export const TooltipContext = createContext<TooltipContextValue | null>(null)

export function useTooltipState(): TooltipContextValue {
  const context = useContext(TooltipContext)
  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />")
  }
  return context
}

export const PORTAL_ROOT_ID = "floating-tooltip-root"
