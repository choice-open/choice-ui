import { Range } from "@choiceform/range"
import type { RangeAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Switch 适配器 - 将 Switch 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function RangeAdapter<T extends number>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: RangeAdapterProps<T>) {
  const { ...filteredProps } = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      legendMode={true}
    >
      <div className="flex items-center gap-2">
        <Range
          value={value}
          onChange={(inputValue) => onChange(inputValue as T)}
          {...filteredProps}
        />
        <div className="flex-1 text-right">{value}</div>
      </div>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createRangeAdapter = <T extends number>(
  defaultProps?: Partial<RangeAdapterProps<T>>,
) => {
  const AdapterComponent = (props: RangeAdapterProps<T>) => (
    <RangeAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "RangeAdapter"

  return AdapterComponent
}
