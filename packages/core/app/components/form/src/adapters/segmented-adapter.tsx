import { Segmented } from "@choiceform/segmented"
import type { SegmentedAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Segmented 适配器 - 将 Segmented 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function SegmentedAdapter<T extends string>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  name,
  options,
  ...props
}: SegmentedAdapterProps<T>) {
  const { ref, ...filteredProps } = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      legendMode={true}
    >
      <Segmented
        value={value}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        {...filteredProps}
      >
        {options?.map((option) => (
          <Segmented.Item
            key={option.value}
            value={option.value as T}
          >
            {option.content}
          </Segmented.Item>
        ))}
      </Segmented>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createSegmentedAdapter = <T extends string>(
  defaultProps?: Partial<SegmentedAdapterProps<T>>,
) => {
  const AdapterComponent = (props: SegmentedAdapterProps<T>) => (
    <SegmentedAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "SegmentedAdapter"

  return AdapterComponent
}
