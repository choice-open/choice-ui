import {
  createContext,
  forwardRef,
  HTMLProps,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { Radio, RadioProps } from "./radio"

interface RadioGroupContextType {
  name: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  variant?: "default" | "accent" | "outline"
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined)

export interface RadioGroupProps extends Omit<HTMLProps<HTMLDivElement>, "value" | "onChange"> {
  options?: {
    value: string
    label: string
  }[]
  value: string
  onChange: (value: string) => void
  variant?: "default" | "accent" | "outline"
  children?: ReactNode
}

type RadioGroupItemProps = Omit<RadioProps, "value" | "onChange"> & {
  value: string
  children: ReactNode
}

const RadioGroupItem = memo(
  forwardRef<HTMLInputElement, RadioGroupItemProps>(function RadioGroupItem(props, ref) {
    const { value, children, className, ...rest } = props
    const context = useContext(RadioGroupContext)

    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup")
    }

    const { name, value: selectedValue, onChange, disabled, variant } = context
    const isChecked = selectedValue === value

    const handleChange = useEventCallback(() => {
      onChange(value)
    })

    return (
      <Radio
        name={name}
        value={isChecked}
        disabled={disabled}
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
    variant = "default",
    children,
    ...rest
  } = props
  const id = useId()

  const contextValue = useMemo(
    () => ({
      name: id,
      value,
      onChange,
      disabled,
      variant,
    }),
    [id, value, onChange, disabled, variant],
  )

  // 渲染基于选项的单选按钮
  const renderOptionsRadios = useCallback(() => {
    if (!options) return null

    return options.map((option) => {
      const isChecked = value === option.value
      const handleOptionChange = () => onChange(option.value)

      return (
        <Radio
          key={option.value}
          name={id}
          value={isChecked}
          disabled={disabled}
          variant={variant}
          onChange={handleOptionChange}
        >
          <Radio.Label>{option.label}</Radio.Label>
        </Radio>
      )
    })
  }, [options, value, onChange, id, disabled, variant])

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
        {options ? renderOptionsRadios() : children}
      </div>
    </RadioGroupContext.Provider>
  )
})

// 使用 memo 包装组件以避免不必要的重渲染
const MemoizedRadioGroup = memo(RadioGroupBase) as unknown as RadioGroupType

interface RadioGroupType {
  (props: RadioGroupProps & { ref?: React.Ref<HTMLDivElement> }): JSX.Element
  Item: typeof RadioGroupItem
  displayName?: string
}

export const RadioGroup = MemoizedRadioGroup

RadioGroup.Item = RadioGroupItem
RadioGroup.displayName = "RadioGroup"
