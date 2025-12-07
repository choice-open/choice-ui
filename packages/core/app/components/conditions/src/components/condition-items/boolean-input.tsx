import type { BaseFieldInputProps } from "./types"
import { ConditionsFieldType, type ConditionsBooleanField } from "../../types"
import { Checkbox } from "@choiceform/checkbox"

export function BooleanInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Boolean) {
    return null
  }

  const booleanField = field as ConditionsBooleanField

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        value={Boolean(condition.value)}
        onChange={(checked) => onChange(checked)}
        disabled={disabled}
      >
        <Checkbox.Label>
          {condition.value ? booleanField.trueLabel || "True" : booleanField.falseLabel || "False"}
        </Checkbox.Label>
      </Checkbox>
    </div>
  )
}
