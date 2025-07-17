import type { ReactNode } from "react"
import type { InputProps } from "../input"
import type { SelectProps } from "../select"

/**
 * 表单验证器类型
 */
export type FormValidator<T> = (values: T) => string | void | Promise<string | void>

/**
 * 字段验证器类型
 */
export type FieldValidator<T> = (value: T) => string | void | Promise<string | void>

/**
 * 字段验证器集合
 */
export interface FieldValidators<T> {
  onBlur?: FieldValidator<T>
  onBlurAsync?: FieldValidator<T>
  onBlurAsyncDebounceMs?: number
  onChange?: FieldValidator<T>
  onChangeAsync?: FieldValidator<T>
  onChangeAsyncDebounceMs?: number
  onSubmit?: FieldValidator<T>
  onSubmitAsync?: FieldValidator<T>
  onSubmitAsyncDebounceMs?: number
}

/**
 * 表单配置
 */
export interface FormConfig<T = Record<string, unknown>> {
  defaultValues?: Partial<T>
  disabled?: boolean
  mode?: "onChange" | "onBlur" | "onSubmit"
  onSubmit?: (values: T) => void | Promise<void>
  validators?: {
    onBlur?: FormValidator<T>
    onBlurAsync?: FormValidator<T>
    onChange?: FormValidator<T>
    onChangeAsync?: FormValidator<T>
    onSubmit?: FormValidator<T>
    onSubmitAsync?: FormValidator<T>
  }
}

/**
 * 字段配置
 */
export interface FieldConfig<T = unknown> {
  component?: React.ComponentType<{
    disabled?: boolean
    error?: string
    errors?: string[]
    onBlur?: () => void
    onChange: (value: T) => void
    placeholder?: string
    required?: boolean
    size?: "default" | "large"
    value: T
    variant?: "default" | "dark"
  }>
  componentProps?: Record<string, unknown>
  description?: string
  disabled?: boolean
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  validators?: FieldValidators<T>
}

/**
 * 表单状态
 */
export interface FormState<T = Record<string, unknown>> {
  canSubmit: boolean
  errors: Record<string, string[]>
  isDirty: boolean
  isSubmitting: boolean
  isValid: boolean
  touched: Record<string, boolean>
  values: T
}

/**
 * 字段状态
 */
export interface FieldState<T = unknown> {
  error?: string
  errors: string[]
  isDirty: boolean
  isValid: boolean
  isValidating: boolean
  touched: boolean
  value: T
}

/**
 * 简化的表单 API 类型
 */
export interface SimpleFormApi<T = Record<string, unknown>> {
  getFieldValue: (name: keyof T) => T[keyof T]
  handleSubmit: () => void
  reset: () => void
  setFieldValue: (name: keyof T, value: T[keyof T]) => void
  state: FormState<T>
  validateAll: () => void
  validateField: (name: keyof T) => void
}

/**
 * 简化的字段 API 类型
 */
export interface SimpleFieldApi<T = unknown> {
  handleBlur: () => void
  handleChange: (value: T) => void
  handleReset: () => void
  state: FieldState<T>
  value: T
}

/**
 * 表单上下文类型
 */
export interface FormContextValue<T = Record<string, unknown>> {
  config: FormConfig<T>
  formApi: SimpleFormApi<T>
}

/**
 * 字段上下文类型
 */
export interface FieldContextValue<T = unknown> {
  config: FieldConfig<T>
  fieldApi: SimpleFieldApi<T>
  state: FieldState<T>
}

/**
 * 表单提交结果
 */
export interface FormSubmitResult<T = Record<string, unknown>> {
  errors?: Record<string, string[]>
  success: boolean
  values?: T
}

/**
 * 表单组件 Props
 */
export interface FormProps<T = Record<string, unknown>> extends FormConfig<T> {
  children?: ReactNode
  className?: string
  size?: "default" | "large"
  variant?: "default" | "dark"
}

/**
 * 字段组件 Props
 */
export interface FormFieldProps<T = unknown> extends FieldConfig<T> {
  children?: ReactNode | ((field: SimpleFieldApi<T>) => ReactNode)
  className?: string
  size?: "default" | "large"
  variant?: "default" | "dark"
}

/**
 * 提交按钮 Props
 */
export interface FormSubmitProps {
  children?: ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  size?: "default" | "large"
  variant?: "primary" | "secondary" | "ghost"
}

/**
 * 字段错误显示 Props
 */
export interface FormFieldErrorProps {
  className?: string
  error?: string
  errors?: string[]
  variant?: "default" | "dark"
}

/**
 * 字段信息显示 Props
 */
export interface FormFieldInfoProps {
  className?: string
  description?: string
  label?: string
  required?: boolean
  variant?: "default" | "dark"
}

/**
 * 表单字段通用属性
 */
export interface FormFieldCommonProps<T = unknown> {
  error?: string
  errors?: string[]
  onBlur?: () => void
  onChange: (value: T) => void
  value: T
}

/**
 * Input 适配器 Props - 继承 Input 的原生 props
 */
export interface InputAdapterProps<T extends string = string>
  extends Omit<InputProps, "value" | "onChange" | "onBlur"> {
  error?: string
  errors?: string[]
  onBlur?: () => void
  onChange: (value: T) => void
  size?: "default" | "large"
  value: T
  variant?: "default" | "dark"
}

/**
 * Select 适配器 Props - 继承 Select 的原生 props
 */
export interface SelectAdapterProps<T extends string = string>
  extends Omit<SelectProps, "value" | "onChange" | "children"> {
  error?: string
  errors?: string[]
  label?: string
  name?: string
  onBlur?: () => void
  onChange: (value: T) => void
  options?: Array<{
    divider?: boolean
    label?: string
    value?: T
  }>
  placeholder?: string
  size?: "default" | "large"
  value: T
  variant?: "default" | "dark"
}
