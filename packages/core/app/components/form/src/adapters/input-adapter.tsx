import { Input } from "@choiceform/input"
import type { InputAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Input 适配器 - 将 Input 组件适配到 Form 系统
 */
export function InputAdapter<T extends string>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  ...props
}: InputAdapterProps<T>) {
  const filteredProps = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <Input
        id={props.name}
        value={String(value || "")}
        onChange={(inputValue) => onChange?.(inputValue as T)}
        onBlur={onBlur}
        {...filteredProps}
      />
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createInputAdapter = <T extends string>(
  defaultProps?: Partial<InputAdapterProps<T>>,
) => {
  const AdapterComponent = (props: InputAdapterProps<T>) => (
    <InputAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "InputAdapter"

  return AdapterComponent
}
