import { RadioGroup } from "@choiceform/radio"
import type { RadioGroupAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * RadioGroup 适配器 - 将 RadioGroup 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function RadioGroupAdapter<T extends string>({
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
}: RadioGroupAdapterProps<T>) {
  const { ref, ...filteredProps } = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      legendMode={true}
    >
      <RadioGroup
        value={value}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        {...filteredProps}
      />
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createRadioGroupAdapter = <T extends string>(
  defaultProps?: Partial<RadioGroupAdapterProps<T>>,
) => {
  const AdapterComponent = (props: RadioGroupAdapterProps<T>) => (
    <RadioGroupAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "RadioGroupAdapter"

  return AdapterComponent
}
