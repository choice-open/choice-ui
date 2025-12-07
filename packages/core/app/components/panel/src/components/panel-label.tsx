import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { usePanelContext } from "../context"

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
        className={tcx("[grid-area:label]", showLabels ? "rows--label" : "sr-only", className)}
        {...rest}
      >
        {showLabels ? children : null}
      </span>
    )
  },
)

PanelLabel.displayName = "PanelLabel"
