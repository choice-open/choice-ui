import { Check, Indeterminate } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, ReactNode, useId, isValidElement } from "react"
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
  readonly?: boolean
  value?: boolean
  variant?: "default" | "accent" | "outline"
}

const CheckboxBase = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    value,
    onChange,
    disabled,
    readonly = false,
    variant = "default",
    className,
    focused,
    mixed,
    children,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    onKeyDown,
    ...rest
  } = props
  const internalId = useId()
  const descriptionId = useId()

  const styles = checkboxTv({
    type: "checkbox",
    variant,
    disabled,
    checked: value,
    focused: focused,
  })

  const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) return
    onChange?.(e.target.checked)
  })

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readonly) return
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      onChange?.(!value)
    }
    onKeyDown?.(e)
  })

  // 自动将字符串类型的 children 包装成 CheckboxLabel
  const renderChildren = () => {
    if (typeof children === "string" || typeof children === "number") {
      return <CheckboxLabel>{children}</CheckboxLabel>
    }
    return children
  }

  return (
    <CheckboxContext.Provider
      value={{
        value,
        onChange: (val) => onChange?.(val),
        disabled,
        id: id || internalId,
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
            id={id || internalId}
            checked={value}
            disabled={disabled || readonly}
            onChange={handleChange}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby || descriptionId}
            aria-checked={mixed ? "mixed" : value}
            aria-disabled={disabled || readonly}
            role="checkbox"
            onKeyDown={handleKeyDown}
            {...rest}
          />

          <div className={styles.box()}>{value && (mixed ? <Indeterminate /> : <Check />)}</div>
        </div>

        {renderChildren()}
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
