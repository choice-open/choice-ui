import { FloatingPortal, useMergeRefs, useTransitionStyles } from "@floating-ui/react"
import { forwardRef, HTMLProps, ReactNode, useMemo } from "react"
import { tcx } from "~/utils"
import { useHintState } from "../hint"
import { hintVariants } from "../tv"

interface HintContentProps extends HTMLProps<HTMLDivElement> {
  icon?: ReactNode
  portalId?: string
}

export const HintContent = forwardRef<HTMLDivElement, HintContentProps>(
  function HintContent(props, propRef) {
    const { className, children, icon, portalId, ...rest } = props
    const state = useHintState()
    const ref = useMergeRefs([state.refs.setFloating, propRef])

    const { isMounted, styles } = useTransitionStyles(state.context, {
      duration: 150,
      initial: {
        opacity: 0,
      },
      // 使用 common 选项设置正确的 transformOrigin
      common: ({ side }) => ({
        transformOrigin: side === "left" ? "right center" : "left center",
      }),
    })

    // 缓存样式变体计算
    const tv = useMemo(
      () => hintVariants({ placement: state.placement as "left-start" | "right-start" }),
      [state.placement],
    )

    // 如果被禁用或未挂载，不渲染
    if (state.disabled || !isMounted) return null

    return (
      <FloatingPortal id={portalId}>
        <div
          ref={ref}
          className="z-tooltip pointer-events-none"
          style={state.floatingStyles}
          {...state.getFloatingProps(rest)}
        >
          <div
            className={tcx(tv.content({ className }))}
            data-state={state.open ? "open" : "closed"}
            style={styles}
          >
            <div className={tv.icon()}>{icon}</div>

            <div className={tv.text()}>{children}</div>
          </div>
        </div>
      </FloatingPortal>
    )
  },
)
