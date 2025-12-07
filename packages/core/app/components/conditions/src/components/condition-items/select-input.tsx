import { Select } from "@choiceform/select"
import { ConditionsFieldType, type ConditionsSelectField, type Field } from "../../types"
import type { BaseFieldInputProps } from "./types"

function isSelectField(field: Field): field is ConditionsSelectField {
  return (
    field.type === ConditionsFieldType.Select && "options" in field && Array.isArray(field.options)
  )
}

export function SelectInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Select) {
    return null
  }

  if (!isSelectField(field)) {
    return null
  }

  return (
    <Select
      value={String(condition.value || "")}
      onChange={(value) => onChange(value)}
      disabled={disabled}
    >
      <Select.Trigger>
        <Select.Value>
          {field.options.find((option) => String(option.value) === String(condition.value))
            ?.label || "Select value..."}
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        {field.options.map((option) => (
          <Select.Item
            key={option.value}
            value={String(option.value)}
          >
            <Select.Value>{option.label}</Select.Value>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
