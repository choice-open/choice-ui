import { Label } from "~/components/label"
import { Input } from "../../input"
import type { InputAdapterProps } from "../types"

/**
 * Input 适配器 - 将 Input 组件适配到 Form 系统
 *
 * 核心功能：
 * 1. 值绑定
 * 2. 事件处理
 * 3. 错误状态显示
 * 4. 样式适配
 */
export function InputAdapter<T extends string>({
  label,
  value,
  onChange,
  onBlur,
  error,
  errors,
  ...props
}: InputAdapterProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Input
        id={props.name}
        name={props.name}
        value={String(value || "")}
        onChange={(inputValue) => onChange(inputValue as T)}
        onBlur={onBlur}
        {...props}
      />
    </fieldset>
  )
}

// 为了方便使用，导出一个创建适配器的工厂函数
export const createInputAdapter = <T extends string>(
  defaultProps?: Partial<InputAdapterProps<T>>,
) => {
  const AdapterComponent = (props: InputAdapterProps<T>) => (
    <InputAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "InputAdapter"

  return AdapterComponent
}
