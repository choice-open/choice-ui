import type { Field, Condition } from "../../types"

/**
 * 字段输入组件的基础Props
 */
export interface BaseFieldInputProps {
  condition: Condition
  disabled?: boolean
  field: Field
  onChange: (value: unknown) => void
}

/**
 * 范围输入组件的Props
 */
export interface RangeFieldInputProps extends BaseFieldInputProps {
  onSecondValueChange: (value: unknown) => void
}
