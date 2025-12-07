import { Fragment } from "react"
import { Select } from "@choiceform/select"
import type { SelectAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Select 适配器 - 将 Select 组件适配到 Form 系统
 */
export function SelectAdapter<T extends string>({
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
}: SelectAdapterProps<T>) {
  const filteredProps = filterFormProps(props)
  const stringValue = String(value || "")

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <Select
        value={stringValue}
        onChange={(selectedValue) => onChange?.(selectedValue as T)}
        {...filteredProps}
      >
        <Select.Trigger
          id={props.name}
          onBlur={onBlur}
        >
          <Select.Value>
            {stringValue
              ? options.find((opt) => String(opt.value) === stringValue)?.label
              : placeholder}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Fragment key={String(option.value)}>
              {option.divider ? (
                <Select.Divider />
              ) : option.value === undefined ? (
                <Select.Label>{option.label}</Select.Label>
              ) : (
                <Select.Item value={String(option.value)}>
                  <Select.Value>{option.label}</Select.Value>
                </Select.Item>
              )}
            </Fragment>
          ))}
        </Select.Content>
      </Select>
    </BaseAdapter>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createSelectAdapter = <T extends string>(
  defaultProps?: Partial<SelectAdapterProps<T>>,
) => {
  const AdapterComponent = (props: SelectAdapterProps<T>) => (
    <SelectAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "SelectAdapter"

  return AdapterComponent
}
