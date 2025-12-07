import { MultiSelect } from "@choiceform/multi-select"
import { Fragment } from "react"
import type { MultiSelectAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * MultiSelect 适配器 - 将 MultiSelect 组件适配到 Form 系统
 */
export function MultiSelectAdapter<T extends string>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder,
  ...props
}: MultiSelectAdapterProps<T>) {
  const filteredProps = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <MultiSelect
        values={value}
        onChange={(value) => onChange?.(value as T[])}
        {...filteredProps}
      >
        <MultiSelect.Trigger
          placeholder={placeholder}
          getDisplayValue={(displayValue) => {
            const option = options.find((opt) => String(opt.value) === displayValue)
            return option?.label ? String(option.label) : displayValue
          }}
        />

        <MultiSelect.Content>
          {options.map((option) => (
            <Fragment key={String(option.value)}>
              {option.divider ? (
                <MultiSelect.Divider />
              ) : option.value === undefined ? (
                <MultiSelect.Label>{option.label}</MultiSelect.Label>
              ) : (
                <MultiSelect.Item value={String(option.value)}>
                  <MultiSelect.Value>{option.label}</MultiSelect.Value>
                </MultiSelect.Item>
              )}
            </Fragment>
          ))}
        </MultiSelect.Content>
      </MultiSelect>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createMultiSelectAdapter = <T extends string>(
  defaultProps?: Partial<MultiSelectAdapterProps<T>>,
) => {
  const AdapterComponent = (props: MultiSelectAdapterProps<T>) => (
    <MultiSelectAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "MultiSelectAdapter"

  return AdapterComponent
}
