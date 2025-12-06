import {
  FloatingPortal,
  useDelayGroup,
  useDelayGroupContext,
  useMergeRefs,
  useTransitionStyles,
} from "@floating-ui/react"
import { forwardRef, HTMLProps, useMemo } from "react"
import { tcx } from "~/utils"
import { useTooltipState } from "../context/tooltip-context"
import { tooltipContentVariants } from "../tv"
import { TooltipArrow } from "./tooltip-arrow"

interface TooltipContentProps extends HTMLProps<HTMLDivElement> {
  portalId?: string
  variant?: "default" | "light"
  withArrow?: boolean
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props, propRef) {
    const { className, withArrow = true, variant = "default", children, portalId, ...rest } = props
    const state = useTooltipState()
    const { isInstantPhase, currentId } = useDelayGroupContext()
    const ref = useMergeRefs([state.refs.setFloating, propRef])

    useDelayGroup(state.context, { id: state.context.floatingId })

    // 常量提取，避免重复定义
    const INSTANT_DURATION = 0
    const ANIMATION_DURATION = 100

    const { isMounted, styles } = useTransitionStyles(state.context, {
      duration: isInstantPhase
        ? {
            open: INSTANT_DURATION,
            close: currentId === state.context.floatingId ? ANIMATION_DURATION : INSTANT_DURATION,
          }
        : ANIMATION_DURATION,
      initial: {
        opacity: 0,
        transform: "scale(0.96)",
      },
      // 使用 common 选项设置正确的 transformOrigin
      common: ({ side }) => ({
        transformOrigin: {
          top: "bottom",
          bottom: "top",
          left: "right",
          right: "left",
        }[side],
      }),
    })

    // 缓存样式变体计算
    const tv = useMemo(() => tooltipContentVariants({ variant }), [variant])

    // 如果被禁用或未挂载，不渲染 tooltip
    if (state.disabled || !isMounted) return null

    return (
      <FloatingPortal id={portalId}>
        <div
          ref={ref}
          style={state.floatingStyles}
          {...state.getFloatingProps(rest)}
          className="z-tooltip"
        >
          <div
            className={tcx(tv.root({ className }))}
            data-state={state.open ? "open" : "closed"}
            style={styles}
          >
            {children}
            {withArrow && <TooltipArrow variant={variant} />}
          </div>
        </div>
      </FloatingPortal>
    )
  },
)
