import { tcx } from "@choice-ui/shared"
import {
  FloatingPortal,
  useDelayGroup,
  useMergeRefs,
  useTransitionStyles,
} from "@floating-ui/react"
import { forwardRef, useMemo } from "react"
import { useTooltipState } from "../context/tooltip-context"
import type { TooltipContentProps } from "../types"
import { tooltipContentVariants } from "../tv"
import { TooltipArrow } from "./tooltip-arrow"

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props, propRef) {
    const {
      className,
      withArrow = true,
      variant = "default",
      children,
      portalId,
      interactive = true,
      ...rest
    } = props
    const state = useTooltipState()
    const ref = useMergeRefs([state.refs.setFloating, propRef])

    // Use useDelayGroup instead of deprecated useDelayGroupContext
    const { isInstantPhase, currentId } = useDelayGroup(state.context, {
      id: state.context.floatingId,
    })

    // Constants extraction, to avoid duplicate definitions
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
      // Use common option to set the correct transformOrigin
      common: ({ side }) => ({
        transformOrigin: {
          top: "bottom",
          bottom: "top",
          left: "right",
          right: "left",
        }[side],
      }),
    })

    // Cache style variant calculation
    const tv = useMemo(() => tooltipContentVariants({ variant }), [variant])

    // If disabled or not mounted, do not render tooltip
    if (state.disabled || !isMounted) return null

    // When interactive is false, pointer-events: none makes mouse unable to "find" the tooltip
    // So mouse events won't trigger on tooltip, and close delay from TooltipProvider will be respected
    const floatingProps = state.getFloatingProps(rest)

    return (
      <FloatingPortal id={portalId}>
        <div
          ref={ref}
          style={{
            ...state.floatingStyles,
            pointerEvents: interactive ? undefined : "none",
          }}
          {...floatingProps}
          className="z-tooltip"
        >
          <div
            className={tcx(tv.root({ className }))}
            data-state={state.open ? "open" : "closed"}
            style={{
              ...styles,
              pointerEvents: interactive ? undefined : "none",
              cursor: interactive ? undefined : "default",
            }}
          >
            {children}
            {withArrow && <TooltipArrow variant={variant} />}
          </div>
        </div>
      </FloatingPortal>
    )
  },
)
