import type { BaseFieldInputProps } from "./types"
import { ConditionsFieldType, type ConditionsTagField } from "../../types"

export function TagInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Tag) {
    return null
  }

  const tagField = field as ConditionsTagField

  return (
    <input
      type="text"
      value={String(condition.value || "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={tagField.placeholder || "Enter tags..."}
      className="text-body-small min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  )
}
