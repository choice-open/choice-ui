import { Chip } from "@choiceform/chip"
import { tcx } from "@choiceform/design-shared"
import { forwardRef } from "react"
import { useNumericInputContext } from "../context"
import { NumericInputVariableTv } from "../tv"

interface NumericInputVariableProps {
  className?: string
  hasPrefixElement?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  value?: number | null
}

export const NumericInputVariable = forwardRef<HTMLDivElement, NumericInputVariableProps>(
  (props, ref) => {
    const { onClick, className, hasPrefixElement, value } = props
    const context = useNumericInputContext()

    const styles = NumericInputVariableTv({
      prefixElement: hasPrefixElement,
      variant: context.variant,
      disabled: context.disabled,
      selected: context.selected,
    })

    return (
      <div className={tcx(styles.root(), className)}>
        <Chip
          as="button"
          className={styles.chip()}
          ref={ref}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.(e)
          }}
          disabled={context.disabled}
        >
          {String(value)}
        </Chip>
      </div>
    )
  },
)

NumericInputVariable.displayName = "NumericInputVariable"
