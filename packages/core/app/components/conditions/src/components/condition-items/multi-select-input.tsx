import type { BaseFieldInputProps } from "./types"
import { ConditionsFieldType, type ConditionsSelectField, type Field } from "../../types"

function isMultiSelectField(field: Field): field is ConditionsSelectField {
  return (
    field.type === ConditionsFieldType.MultiSelect &&
    "options" in field &&
    Array.isArray(field.options)
  )
}

export function MultiSelectInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.MultiSelect) {
    return null
  }

  if (!isMultiSelectField(field)) {
    return null
  }

  return (
    <select
      value={String(condition.value || "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="text-body-small min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select values...</option>
      {field.options.map((option) => (
        <option
          key={option.value}
          value={String(option.value)}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}
