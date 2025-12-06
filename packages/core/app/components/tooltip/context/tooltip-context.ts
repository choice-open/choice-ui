import type { Placement } from "@floating-ui/react"
import { createContext, useContext } from "react"
import type { useTooltip } from "../hooks/use-tooltip"

export const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null)

export function useTooltipState() {
  const context = useContext(TooltipContext)
  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />")
  }
  return context
}

export const PORTAL_ROOT_ID = "floating-tooltip-root"
