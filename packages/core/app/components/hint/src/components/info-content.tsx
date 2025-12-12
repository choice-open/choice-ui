import { tcx } from "@choice-ui/shared"
import { FloatingPortal, useMergeRefs, useTransitionStyles } from "@floating-ui/react"
import { forwardRef, HTMLProps, useMemo } from "react"
import { useHintState } from "../context/hint-context"
import { hintVariants } from "../tv"

export interface HintContentProps extends HTMLProps<HTMLDivElement> {
  portalId?: string
  variant?: "default" | "dark" | "accent"
}

export const HintContent = forwardRef<HTMLDivElement, HintContentProps>(
  function HintContent(props, propRef) {
    const { className, children, portalId, variant = "default", ...rest } = props
    const state = useHintState()
    const ref = useMergeRefs([state.refs.setFloating, propRef])

    const { isMounted, styles } = useTransitionStyles(state.context, {
      duration: 150,
      initial: {
        opacity: 0,
      },
      // Use common option to set correct transformOrigin
      common: ({ side }) => ({
        transformOrigin: side === "left" ? "right center" : "left center",
      }),
    })

    // Cache style variant calculation
    const tv = useMemo(
      () => hintVariants({ placement: state.placement as "left-start" | "right-start" }),
      [state.placement],
    )

    // If disabled or not mounted, don't render
    if (state.disabled || !isMounted) return null

    return (
      <FloatingPortal id={portalId}>
        <div
          ref={ref}
          className="z-tooltip"
          style={state.floatingStyles}
          {...state.getFloatingProps(rest)}
        >
          <div
            className={tcx(tv.content({ variant }))}
            data-state={state.open ? "open" : "closed"}
            style={styles}
          >
            <div
              className={tv.icon({
                placement: state.placement as
                  | "left-start"
                  | "right-start"
                  | "left-end"
                  | "right-end",
              })}
            >
              {state.icon}
            </div>

            <div className={tcx(tv.text(), className)}>{children}</div>
          </div>
        </div>
      </FloatingPortal>
    )
  },
)
