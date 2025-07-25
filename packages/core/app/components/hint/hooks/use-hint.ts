import type { Placement } from "@floating-ui/react"
import {
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

type HintPlacement = "left-start" | "right-start"

interface HintOptions {
  disabled?: boolean
  initialOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
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
  return useMemo(
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
