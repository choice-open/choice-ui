import type { Placement, UseFloatingReturn } from "@floating-ui/react"
import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useMemo, useRef, useState } from "react"

type HintPlacement = "left-start" | "right-start" | "left-end" | "right-end"

interface HintOptions {
  disabled?: boolean
  initialOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
  delay?: number
}

interface UseHintReturn {
  arrowRef: React.RefObject<HTMLElement>
  context: UseFloatingReturn["context"]
  disabled: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  isPositioned: UseFloatingReturn["isPositioned"]
  middlewareData: UseFloatingReturn["middlewareData"]
  open: boolean
  placement: Placement
  refs: UseFloatingReturn["refs"]
  setOpen: (open: boolean) => void
  strategy: UseFloatingReturn["strategy"]
  update: UseFloatingReturn["update"]
  x: number | null
  y: number | null
  delay: number
}

export function useHint({
  initialOpen = false,
  placement = "right-start",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  disabled = false,
  delay = 0,
}: HintOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const arrowRef = useRef<HTMLElement>(null)

  // Cache middleware configuration, avoid recreating each time
  const middleware = useMemo(
    () => [
      offset({ mainAxis: -24, crossAxis: 0 }),
      flip({
        fallbackPlacements: placement === "left-start" ? ["right-start"] : ["left-start"],
      }),
      shift({ padding: 8 }),
    ],
    [placement],
  )

  const data = useFloating({
    placement: placement as Placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    enabled: !disabled,
    delay: {
      open: delay,
      close: 0,
    },
    // Allow hover to floating content to keep display
    handleClose: safePolygon(),
  })

  const dismiss = useDismiss(context, {
    enabled: !disabled,
  })
  const role = useRole(context, { role: "tooltip" })

  const interactions = useInteractions([hover, dismiss, role])

  // Optimize memoization, only depend on truly changing values
  return useMemo<UseHintReturn>(
    () => ({
      open,
      setOpen,
      arrowRef,
      disabled,
      delay,
      ...interactions,
      ...data,
    }),
    [open, setOpen, disabled, interactions, data, delay],
  )
}
