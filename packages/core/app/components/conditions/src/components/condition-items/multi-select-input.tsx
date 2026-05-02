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

  const selectedValues: string[] = Array.isArray(condition.value)
    ? condition.value.map(String)
    : condition.value
      ? [String(condition.value)]
      : []

  return (
    <select
      multiple
      value={selectedValues}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, (o) => o.value)
        onChange(selected)
      }}
      disabled={disabled}
      className="text-body-small min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    >
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
