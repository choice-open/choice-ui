import { createContext, useContext } from "react"

export type TooltipDelayValue = number | { open?: number; close?: number }

// Stable context: only carries the user-configured delay, which does not change
// at runtime. Splitting it from FloatingDelayGroup's volatile state
// (currentId / isInstantPhase) prevents every Tooltip in the tree from
// re-rendering whenever any other Tooltip is hovered.
export const TooltipDelayContext = createContext<TooltipDelayValue>(0)

export function useTooltipDelay(): TooltipDelayValue {
  return useContext(TooltipDelayContext)
}
