import { Switch } from "@choiceform/switch"
import type { SwitchAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Switch 适配器 - 将 Switch 组件适配到 Form 系统
 */
export function SwitchAdapter<T extends boolean>({
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
}: SwitchAdapterProps<T>) {
  const { ref, ...filteredProps } = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      legendMode={true}
    >
      <Switch
        value={Boolean(value)}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        label={name}
        {...filteredProps}
      />
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createSwitchAdapter = <T extends boolean>(
  defaultProps?: Partial<SwitchAdapterProps<T>>,
) => {
  const AdapterComponent = (props: SwitchAdapterProps<T>) => (
    <SwitchAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "SwitchAdapter"

  return AdapterComponent
}
