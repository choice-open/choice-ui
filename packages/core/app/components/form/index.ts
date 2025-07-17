// 导出适配器
export { InputAdapter, SelectAdapter } from "./adapters"

// 导出类型
export type * from "./types"

// 导入 TanStack Form
import { useForm as useTanStackForm } from "@tanstack/react-form"
import { InputAdapter } from "./adapters/input-adapter"
import { SelectAdapter } from "./adapters/select-adapter"
import { Button } from "../button"

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
    Button: Button,
  })

  return enhancedForm
}
