import { Textarea } from "@choiceform/textarea"
import type { TextareaAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

/**
 * Textarea 适配器 - 将 Textarea 组件适配到 Form 系统
 */
export function TextareaAdapter<T extends string>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  ...props
}: TextareaAdapterProps<T>) {
  const filteredProps = filterFormProps(props)

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <Textarea
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
export const createTextareaAdapter = <T extends string>(
  defaultProps?: Partial<TextareaAdapterProps<T>>,
) => {
  const AdapterComponent = (props: TextareaAdapterProps<T>) => (
    <TextareaAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "TextareaAdapter"

  return AdapterComponent
}
