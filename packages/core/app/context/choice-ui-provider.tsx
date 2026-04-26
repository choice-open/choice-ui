import { FloatingDelayGroup } from "@floating-ui/react"
import { useMemo, type ReactNode } from "react"
import { AlertDialogProvider } from "../components/alert-dialog/src/context"
import type { AlertDialogProviderProps } from "../components/alert-dialog/src/context"
import { TooltipDelayContext } from "../components/tooltip/src/context/tooltip-delay-context"

export interface ChoiceUiProviderProps {
  children: ReactNode
  /**
   * AlertDialog configuration
   */
  alertDialog?: Omit<AlertDialogProviderProps, "children">
  /**
   * Tooltip delay configuration
   * @default { open: 400, close: 200 }
   */
  tooltipDelay?: {
    open?: number
    close?: number
  }
}

const DEFAULT_TOOLTIP_DELAY = {
  open: 400,
  close: 200,
}

/**
 * Unified provider for Choice UI components.
 * Combines TooltipProvider and AlertDialogProvider for convenience.
 *
 * @example
 * ```tsx
 * import { ChoiceUiProvider } from "@choice-ui/react"
 *
 * function App() {
 *   return (
 *     <ChoiceUiProvider>
 *       <YourApp />
 *     </ChoiceUiProvider>
 *   )
 * }
 * ```
 */
export function ChoiceUiProvider(props: ChoiceUiProviderProps) {
  const { children, alertDialog, tooltipDelay = DEFAULT_TOOLTIP_DELAY } = props

  // Stable reference for the static delay config so consumers (useTooltip)
  // don't re-render across hovers.
  const stableDelay = useMemo(
    () => ({ open: tooltipDelay.open, close: tooltipDelay.close }),
    [tooltipDelay.open, tooltipDelay.close],
  )

  return (
    <TooltipDelayContext.Provider value={stableDelay}>
      <FloatingDelayGroup delay={tooltipDelay}>
        <AlertDialogProvider {...alertDialog}>{children}</AlertDialogProvider>
      </FloatingDelayGroup>
    </TooltipDelayContext.Provider>
  )
}
