import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps } from "react"
import { usePanelContext } from "../context"
import { panelLabelTv } from "../tv"

interface PanelLabelProps extends HTMLProps<HTMLLegendElement> {
  className?: string
}

export const PanelLabel = forwardRef<HTMLLegendElement, PanelLabelProps>(
  function PanelLabel(props, ref) {
    const { className, children, ...rest } = props

    const { showLabels } = usePanelContext()

    return (
      <span
        ref={ref}
        className={tcx(panelLabelTv({ showLabels }), className)}
        {...rest}
      >
        {showLabels ? children : null}
      </span>
    )
  },
)

PanelLabel.displayName = "PanelLabel"
