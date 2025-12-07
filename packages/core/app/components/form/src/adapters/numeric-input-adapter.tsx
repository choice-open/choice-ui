import { NumericInput } from "@choiceform/numeric-input"
import type { NumericInputAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * NumericInput 适配器 - 将 NumericInput 组件适配到 Form 系统
 */
export function NumericInputAdapter<T extends number>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  children,
  ...props
}: NumericInputAdapterProps<T>) {
  const filteredProps = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <NumericInput
        id={props.name}
        value={value}
        onChange={(inputValue) => onChange?.(inputValue as T)}
        onBlur={onBlur}
        {...filteredProps}
      >
        {children}
      </NumericInput>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createNumericInputAdapter = <T extends number>(
  defaultProps?: Partial<NumericInputAdapterProps<T>>,
) => {
  const AdapterComponent = (props: NumericInputAdapterProps<T>) => (
    <NumericInputAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "NumericInputAdapter"

  return AdapterComponent
}
