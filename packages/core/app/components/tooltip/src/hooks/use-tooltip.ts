import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useMemo, useRef, useState } from "react"
import type { TooltipContextValue, TooltipOptions } from "../types"

export function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  disabled = false,
  offset: offsetValue = 5,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const arrowRef = useRef<HTMLElement>(null)

  // Cache middleware to avoid recreating on every render
  const middleware = useMemo(
    () => [
      offset(offsetValue),
      flip(),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 8, // Corner protection: ensure arrow is at least 8px from container edge
      }),
    ],
    [offsetValue],
  )

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  })

  const context = data.context

  // Use useDelayGroup instead of deprecated useDelayGroupContext
  const { delay } = useDelayGroup(context)

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null && !disabled,
    delay,
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null && !disabled,
  })
  const dismiss = useDismiss(context, {
    enabled: !disabled,
  })
  const role = useRole(context, { role: "tooltip" })

  const interactions = useInteractions([hover, focus, dismiss, role])

  // Optimize memoization, only depend on values that actually change
  return useMemo<TooltipContextValue>(
    () => ({
      open,
      setOpen,
      arrowRef,
      disabled,
      ...interactions,
      ...data,
    }),
    [open, setOpen, disabled, interactions, data],
  )
}
