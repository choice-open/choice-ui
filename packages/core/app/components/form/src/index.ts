// 导出适配器
export {
  CheckboxAdapter,
  InputAdapter,
  RadioGroupAdapter,
  SelectAdapter,
  TextareaAdapter,
  SwitchAdapter,
  RangeAdapter,
  NumericInputAdapter,
  MultiSelectAdapter,
  SegmentedAdapter,
} from "./adapters"

// 导出类型
export type * from "./types"

// 导入 TanStack Form
import { useForm as useTanStackForm } from "@tanstack/react-form"
export * as TanstackReactForm from "@tanstack/react-form"
import { Button } from "@choiceform/button"
// Import adapters directly from their individual files to avoid circular dependency
import { InputAdapter } from "./adapters/input-adapter"
import { SelectAdapter } from "./adapters/select-adapter"
import { TextareaAdapter } from "./adapters/textarea-adapter"
import { CheckboxAdapter } from "./adapters/checkbox-adapter"
import { RadioGroupAdapter } from "./adapters/raido-group-adapter"
import { SwitchAdapter } from "./adapters/switch-adapter"
import { RangeAdapter } from "./adapters/range-adapter"
import { NumericInputAdapter } from "./adapters/numeric-input-adapter"
import { MultiSelectAdapter } from "./adapters/multi-select-adapter"
import { SegmentedAdapter } from "./adapters/segmented-adapter"

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
    NumericInput: NumericInputAdapter,
    MultiSelect: MultiSelectAdapter,
    Segmented: SegmentedAdapter,
    Button: Button,
  })

  return enhancedForm
}
