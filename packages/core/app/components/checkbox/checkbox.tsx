import { Check, Indeterminate } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, ReactNode, useId } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { CheckboxContext } from "./context"
import { CheckboxLabel } from "./checkbox-label"
import { checkboxTv } from "./tv"

export interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  children?: ReactNode
  className?: string
  focused?: boolean
  mixed?: boolean
  onChange?: (value: boolean) => void
  value?: boolean
  variant?: "default" | "accent" | "outline"
}

const CheckboxBase = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    value,
    onChange,
    disabled,
    variant = "default",
    className,
    focused,
    mixed,
    children,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props
  const id = useId()
  const descriptionId = useId()

  const styles = checkboxTv({
    type: "checkbox",
    variant,
    disabled,
    checked: value,
    focused: focused,
  })

  const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  })

  return (
    <CheckboxContext.Provider
      value={{
        value,
        onChange: (val) => onChange?.(val),
        disabled,
        id,
        descriptionId,
        variant,
        mixed,
      }}
    >
      <div className={tcx(styles.root(), className)}>
        <div className="pointer-events-none relative">
          <input
            ref={ref}
            className={styles.input()}
            type="checkbox"
            id={id}
            checked={value}
            disabled={disabled}
            onChange={handleChange}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby || descriptionId}
            aria-checked={mixed ? "mixed" : value}
            role="checkbox"
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                onChange?.(!value)
              }
            }}
            {...rest}
          />

          <div className={styles.box()}>{value && (mixed ? <Indeterminate /> : <Check />)}</div>
        </div>

        {children}
      </div>
    </CheckboxContext.Provider>
  )
})

const MemoizedCheckbox = memo(CheckboxBase) as unknown as CheckboxType

interface CheckboxType {
  (props: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }): JSX.Element
  Label: typeof CheckboxLabel
  displayName?: string
}

export const Checkbox = MemoizedCheckbox as CheckboxType
Checkbox.Label = CheckboxLabel
Checkbox.displayName = "Checkbox"
