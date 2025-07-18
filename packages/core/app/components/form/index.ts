// 导出适配器
export {
  CheckboxAdapter,
  InputAdapter,
  RadioGroupAdapter,
  SelectAdapter,
  TextareaAdapter,
  SwitchAdapter,
  RangeAdapter,
} from "./adapters"

// 导出类型
export type * from "./types"

// 导入 TanStack Form
import { useForm as useTanStackForm } from "@tanstack/react-form"
import { Button } from "../button"
import {
  CheckboxAdapter,
  InputAdapter,
  RadioGroupAdapter,
  SelectAdapter,
  TextareaAdapter,
  SwitchAdapter,
  RangeAdapter,
} from "./adapters"

/**
 * 增强版的 useForm hook
 * 在 TanStack Form 的基础上添加适配器组件
 */
export function useForm(options: {
  [key: string]: unknown
  defaultValues?: Record<string, unknown>
  onSubmit?: (formApi: { value: unknown }) => void | Promise<void>
}) {
  const form = useTanStackForm(options)

  // 给 form 对象添加适配器组件
  const enhancedForm = Object.assign(form, {
    Input: InputAdapter,
    Select: SelectAdapter,
    Textarea: TextareaAdapter,
    Checkbox: CheckboxAdapter,
    RadioGroup: RadioGroupAdapter,
    Switch: SwitchAdapter,
    Range: RangeAdapter,
    Button: Button,
  })

  return enhancedForm
}
