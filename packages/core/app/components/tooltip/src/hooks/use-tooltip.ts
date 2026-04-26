import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useMemo, useRef, useState } from "react"
import { useTooltipDelay } from "../context/tooltip-delay-context"
import type {
  TooltipContextValue,
  TooltipDelayRefValue,
  TooltipOptions,
} from "../types"

function normalizeDelay(
  delay: number | { open?: number; close?: number },
): TooltipDelayRefValue {
  if (typeof delay === "number") {
    return { open: delay, close: delay }
  }
  return { open: delay.open ?? 0, close: delay.close ?? 0 }
}

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

  // Static delay from a stable context. We do NOT subscribe to FloatingDelayGroup's
  // volatile state here — that would force every Tooltip in the tree to re-render
  // on every hover. Instead, a small invisible <TooltipDelayGroupSync> mutates
  // delayRef.current.open/close in-place when instant-phase toggles. useHover
  // reads delayRef.current at hover time via its own useLatestRef, so the
  // dynamic instant-phase open delay is preserved without re-rendering us.
  const staticDelay = useTooltipDelay()
  const delayRef = useRef<TooltipDelayRefValue | null>(null)
  if (delayRef.current === null) {
    delayRef.current = normalizeDelay(staticDelay)
  }

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null && !disabled,
    delay: delayRef.current,
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
      _delayRef: delayRef as React.MutableRefObject<TooltipDelayRefValue>,
      ...interactions,
      ...data,
    }),
    [open, setOpen, disabled, interactions, data],
  )
}
