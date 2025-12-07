// 基础适配器
export { BaseAdapter, filterFormProps } from "./base-adapter"
export type { BaseAdapterProps } from "./base-adapter"

// 具体适配器
export { InputAdapter, createInputAdapter } from "./input-adapter"
export { TextareaAdapter, createTextareaAdapter } from "./textarea-adapter"
export { SelectAdapter, createSelectAdapter } from "./select-adapter"
export { CheckboxAdapter, createCheckboxAdapter } from "./checkbox-adapter"
export { RadioGroupAdapter, createRadioGroupAdapter } from "./raido-group-adapter"
export { SwitchAdapter, createSwitchAdapter } from "./switch-adapter"
export { RangeAdapter, createRangeAdapter } from "./range-adapter"
export { NumericInputAdapter, createNumericInputAdapter } from "./numeric-input-adapter"
export { MultiSelectAdapter, createMultiSelectAdapter } from "./multi-select-adapter"
export { SegmentedAdapter, createSegmentedAdapter } from "./segmented-adapter"

// 重新导出所有适配器类型
export type {
  InputAdapterProps,
  TextareaAdapterProps,
  SelectAdapterProps,
  MultiSelectAdapterProps,
  CheckboxAdapterProps,
  SwitchAdapterProps,
  RangeAdapterProps,
  NumericInputAdapterProps,
  RadioGroupAdapterProps,
  SegmentedAdapterProps,
} from "../types"
