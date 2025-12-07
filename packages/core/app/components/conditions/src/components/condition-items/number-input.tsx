import { NumericInput } from "@choiceform/numeric-input"
import { ConditionsFieldType, type ConditionsNumberField } from "../../types"
import type { BaseFieldInputProps, RangeFieldInputProps } from "./types"

export function NumberInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Number) {
    return null
  }

  const numberField = field as ConditionsNumberField

  return (
    <NumericInput
      value={Number(condition.value || 0)}
      onChange={(value) => onChange(value)}
      disabled={disabled}
      min={numberField.min}
      max={numberField.max}
      step={numberField.step}
    />
  )
}

export function NumberRangeInput({
  condition,
  field,
  disabled,
  onChange,
  onSecondValueChange,
}: RangeFieldInputProps) {
  if (field.type !== ConditionsFieldType.Number) {
    return null
  }

  const numberField = field as ConditionsNumberField

  return (
    <NumericInput
      value={Number(condition.secondValue || 0)}
      onChange={(value) => onSecondValueChange(value)}
      disabled={disabled}
      min={numberField.min}
      max={numberField.max}
    />
  )
}
