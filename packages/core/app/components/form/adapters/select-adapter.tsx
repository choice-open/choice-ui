import { Fragment } from "react"
import { Label } from "~/components/label"
import { Select } from "../../select"
import type { SelectAdapterProps } from "../types"
import { FormTv } from "../tv"

/**
 * Select 适配器 - 将 Select 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function SelectAdapter<T extends string>({
  label,
  description,
  value,
  onChange,
  onBlur,
  error,
  errors,
  options = [],
  placeholder,
  ...props
}: SelectAdapterProps<T>) {
  // 将 value 转换为 string 用于比较
  const stringValue = String(value || "")

  const tv = FormTv()

  return (
    <fieldset className={tv.field()}>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Select
        value={stringValue}
        onChange={(selectedValue) => onChange?.(selectedValue as T)}
        {...props}
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
      {description && <p className={tv.description()}>{description}</p>}
      {(error || errors?.length) && <p className={tv.error()}>{error}</p>}
    </fieldset>
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
