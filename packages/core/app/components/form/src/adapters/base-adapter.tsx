import { tcx } from "@choiceform/design-shared"
import { Label } from "@choiceform/label"
import { ReactNode } from "react"
import { FormTv } from "../tv"

/**
 * 基础适配器组件
 * 提供统一的表单字段布局和样式
 */
export interface BaseAdapterProps {
  children: ReactNode
  className?: string
  description?: string | ReactNode
  error?: string | ReactNode
  htmlFor?: string
  label?: string | ReactNode
  legendMode?: boolean // 是否使用 legend 模式（用于 radio/checkbox 组）
}

export function BaseAdapter({
  className,
  label,
  description,
  error,
  children,
  htmlFor,
  legendMode = false,
}: BaseAdapterProps) {
  const tv = FormTv()

  return (
    <fieldset className={tcx(tv.field(), className)}>
      {label && (
        <Label
          as={legendMode ? "legend" : "label"}
          htmlFor={legendMode ? undefined : htmlFor}
          className={legendMode ? "mb-2" : undefined}
        >
          {label}
        </Label>
      )}
      {children}
      {description && <p className={tv.description()}>{description}</p>}
      {error && <p className={tv.error()}>{error}</p>}
    </fieldset>
  )
}

/**
 * 过滤表单特定属性的工具函数
 */
export function filterFormProps<T extends Record<string, unknown>>(
  props: T,
): Omit<
  T,
  | "label"
  | "description"
  | "error"
  | "onBlurAsync"
  | "onBlurAsyncDebounceMs"
  | "onChangeAsync"
  | "onChangeAsyncDebounceMs"
  | "onFocusAsync"
  | "onFocusAsyncDebounceMs"
  | "size"
> {
  const {
    label,
    description,
    error,
    onBlurAsync,
    onBlurAsyncDebounceMs,
    onChangeAsync,
    onChangeAsyncDebounceMs,
    onFocusAsync,
    onFocusAsyncDebounceMs,
    size,
    ...filteredProps
  } = props

  return filteredProps
}
