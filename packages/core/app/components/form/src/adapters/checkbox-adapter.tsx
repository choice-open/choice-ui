import { Checkbox } from "@choiceform/checkbox"
import type { CheckboxAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Checkbox 适配器 - 将 Checkbox 组件适配到 Form 系统
 */
export function CheckboxAdapter<T extends boolean>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  name,
  ...props
}: CheckboxAdapterProps<T>) {
  const { ref, ...filteredProps } = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      description={description}
      error={error}
      legendMode={true}
    >
      <Checkbox
        value={Boolean(value)}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        {...filteredProps}
      >
        {label && <Checkbox.Label>{label}</Checkbox.Label>}
      </Checkbox>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createCheckboxAdapter = <T extends boolean>(
  defaultProps?: Partial<CheckboxAdapterProps<T>>,
) => {
  const AdapterComponent = (props: CheckboxAdapterProps<T>) => (
    <CheckboxAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "CheckboxAdapter"

  return AdapterComponent
}
