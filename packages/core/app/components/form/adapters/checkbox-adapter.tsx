import { Checkbox, Label } from "~/components"
import { FormTv } from "../tv"
import type { CheckboxAdapterProps } from "../types"

/**
 * Checkbox 适配器 - 将 Checkbox 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function CheckboxAdapter<T extends boolean>({
  label,
  description,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  errors,
  // 表单字段特定属性，不传递给组件
  onBlurAsync,
  onBlurAsyncDebounceMs,
  onChangeAsync,
  onChangeAsyncDebounceMs,
  onFocusAsync,
  onFocusAsyncDebounceMs,
  size: fieldSize,
  name,
  ...props
}: CheckboxAdapterProps<T>) {
  const tv = FormTv()

  // 排除会造成类型冲突的属性，传递其他所有属性
  const { ref, ...checkboxProps } = props

  return (
    <fieldset className={tv.field()}>
      {label && (
        <Label
          as="legend"
          className="mb-2"
        >
          {label}
        </Label>
      )}
      <Checkbox
        value={Boolean(value)}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        {...checkboxProps}
      >
        {label && <Checkbox.Label>{name}</Checkbox.Label>}
      </Checkbox>
      {description && <p className={tv.description()}>{description}</p>}
      {(error || errors?.length) && <p className={tv.error()}>{error}</p>}
    </fieldset>
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
