import type { Placement, UseFloatingReturn } from "@floating-ui/react"
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react"
import { useMemo, useRef, useState } from "react"

type HintPlacement = "left-start" | "right-start"

interface HintOptions {
  disabled?: boolean
  initialOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
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
}

export function useHint({
  initialOpen = false,
  placement = "right-start",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  disabled = false,
}: HintOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const arrowRef = useRef<HTMLElement>(null)

  // 缓存 middleware 配置，避免每次重新创建
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
  })

  const dismiss = useDismiss(context, {
    enabled: !disabled,
  })
  const role = useRole(context, { role: "tooltip" })

  const interactions = useInteractions([hover, dismiss, role])

  // 优化 memoization，只依赖真正变化的值
  return useMemo<UseHintReturn>(
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
