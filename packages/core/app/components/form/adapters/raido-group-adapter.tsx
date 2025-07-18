import { Label, RadioGroup } from "~/components"
import { FormTv } from "../tv"
import type { RadioGroupAdapterProps } from "../types"

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
  ...props
}: RadioGroupAdapterProps<T>) {
  const tv = FormTv()

  // 排除会造成类型冲突的属性，传递其他所有属性
  const { ref, ...radioGroupProps } = props

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
      <RadioGroup
        value={value}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        {...radioGroupProps}
      />
      {description && <p className={tv.description()}>{description}</p>}
      {(error || errors?.length) && <p className={tv.error()}>{error}</p>}
    </fieldset>
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
