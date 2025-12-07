import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDelayGroupContext,
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

  const { delay } = useDelayGroupContext()

  // 缓存 middleware 配置，避免每次重新创建
  const middleware = useMemo(
    () => [
      offset(offsetValue),
      flip(),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 8, // 圆角保护：确保箭头距离容器边缘至少8px
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

  // 优化 memoization，只依赖真正变化的值
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
