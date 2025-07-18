import { Label, Switch } from "~/components"
import { FormTv } from "../tv"
import type { SwitchAdapterProps } from "../types"

/**
 * Switch 适配器 - 将 Switch 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function SwitchAdapter<T extends boolean>({
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
}: SwitchAdapterProps<T>) {
  const tv = FormTv()

  // 排除会造成类型冲突的属性，传递其他所有属性
  const { ref, ...switchProps } = props

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
      <Switch
        value={Boolean(value)}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        onFocus={onFocus}
        label={name}
        {...switchProps}
      />
      {description && <p className={tv.description()}>{description}</p>}
      {(error || errors?.length) && <p className={tv.error()}>{error}</p>}
    </fieldset>
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
