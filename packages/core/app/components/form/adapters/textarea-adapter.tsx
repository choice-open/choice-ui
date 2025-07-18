import { Textarea } from "~/components"
import { Label } from "~/components/label"
import { FormTv } from "../tv"
import type { TextareaAdapterProps } from "../types"

/**
 * Textarea 适配器 - 将 Textarea 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function TextareaAdapter<T extends string>({
  label,
  description,
  value,
  onChange,
  onBlur,
  error,
  errors,
  ...props
}: TextareaAdapterProps<T>) {
  const tv = FormTv()
  return (
    <fieldset className={tv.field()}>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Textarea
        id={props.name}
        name={props.name}
        value={String(value || "")}
        onChange={(inputValue) => onChange?.(inputValue as T)}
        onBlur={onBlur}
        {...props}
      />
      {description && <p className={tv.description()}>{description}</p>}
      {(error || errors?.length) && <p className={tv.error()}>{error}</p>}
    </fieldset>
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
