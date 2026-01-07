import { NumericInput, type NumericInputValue } from "@choice-ui/numeric-input"
import { tcx, type PressMoveProps } from "@choice-ui/shared"
import { Relative } from "@choiceform/icons-react"
import { round } from "es-toolkit"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { translation } from "../contents"
import { alphaInputTv } from "./tv"

export interface AlphaInputProps {
  active?: boolean
  className?: string
  disabled?: boolean
  onChange?: (alpha: number) => void
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  tooltipLabel?: string
  value?: number
}

export const AlphaInput = forwardRef<HTMLInputElement, AlphaInputProps>(
  function IfAlphaInput(props, ref) {
    const { value, onChange, disabled, active, className, tooltipLabel, ...rest } = props

    const handleChange = useEventCallback((value: NumericInputValue) => {
      if (typeof value === "number") {
        onChange?.(value / 100)
      }
    })

    const styles = alphaInputTv({
      active,
      disabled,
    })

    return (
      <NumericInput
        tooltip={{
          content: tooltipLabel ?? translation.input.ALPHA,
        }}
        ref={ref}
        classNames={{
          container: tcx(styles.root(), className),
          input: styles.input(),
        }}
        disabled={disabled}
        max={100}
        min={0}
        onChange={handleChange}
        value={round((value ?? 1) * 100, 0)}
        variant="reset"
        {...rest}
      >
        <NumericInput.Suffix className={styles.suffix()}>
          <Relative />
        </NumericInput.Suffix>
      </NumericInput>
    )
  },
)

AlphaInput.displayName = "AlphaInput"
