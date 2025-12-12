import { tcx } from "@choice-ui/shared"
import { forwardRef, HTMLProps, memo, ReactNode, useId, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { RadioGroupContext, useRadioGroupContext } from "./context"
import { Radio, RadioProps } from "./radio"

export interface RadioGroupProps extends Omit<HTMLProps<HTMLDivElement>, "value" | "onChange"> {
  children?: ReactNode
  onChange: (value: string) => void
  options?: {
    disabled?: boolean
    label: string
    value: string
  }[]
  readOnly?: boolean
  value: string
  variant?: "default" | "accent" | "outline"
}

type RadioGroupItemProps = Omit<RadioProps, "value" | "onChange"> & {
  children: ReactNode
  value: string
}

const RadioGroupItem = memo(
  forwardRef<HTMLInputElement, RadioGroupItemProps>(function RadioGroupItem(props, ref) {
    const { value, children, className, disabled, ...rest } = props
    const {
      name,
      value: selectedValue,
      onChange,
      variant,
      readOnly: contextReadonly,
    } = useRadioGroupContext()
    const isChecked = selectedValue === value

    const handleChange = useEventCallback(() => {
      if (contextReadonly) return
      onChange(value)
    })

    return (
      <Radio
        name={name}
        value={isChecked}
        disabled={disabled}
        readOnly={contextReadonly}
        variant={variant}
        onChange={handleChange}
        className={className}
        {...rest}
        ref={ref}
      >
        <Radio.Label>{children}</Radio.Label>
      </Radio>
    )
  }),
)

RadioGroupItem.displayName = "RadioGroup.Item"

const RadioGroupBase = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const {
    className,
    options,
    value,
    onChange,
    disabled,
    readOnly = false,
    variant = "default",
    children,
    ...rest
  } = props
  const id = useId()

  const handleChange = useEventCallback((newValue: string) => {
    if (readOnly) return
    onChange(newValue)
  })

  const contextValue = useMemo(
    () => ({
      name: id,
      value,
      onChange: handleChange,
      disabled,
      readOnly,
      variant,
    }),
    [id, value, handleChange, disabled, readOnly, variant],
  )

  // Render radios based on options
  const renderOptionsRadios = useMemo(() => {
    if (!options) return null

    return options.map((option) => (
      <RadioGroupItem
        key={option.value}
        value={option.value}
        disabled={option.disabled || disabled}
        variant={variant}
      >
        {option.label}
      </RadioGroupItem>
    ))
  }, [disabled, options, variant])

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={tcx("flex flex-col gap-2", className)}
        ref={ref}
        role="radiogroup"
        aria-labelledby={props["aria-labelledby"]}
        aria-label={props["aria-label"]}
        {...rest}
      >
        {options ? renderOptionsRadios : children}
      </div>
    </RadioGroupContext.Provider>
  )
})

// Use memo to wrap component to avoid unnecessary re-rendering
const MemoizedRadioGroup = memo(RadioGroupBase) as unknown as RadioGroupType

interface RadioGroupType {
  (props: RadioGroupProps & { ref?: React.Ref<HTMLDivElement> }): JSX.Element
  Item: typeof RadioGroupItem
  displayName?: string
}

export const RadioGroup = MemoizedRadioGroup

RadioGroup.Item = RadioGroupItem
RadioGroup.displayName = "RadioGroup"
