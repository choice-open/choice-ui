import type { BaseFieldInputProps } from "./types"
import { ConditionsFieldType, type ConditionsUserField } from "../../types"

export function UserInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.User) {
    return null
  }

  const userField = field as ConditionsUserField

  return (
    <input
      type="text"
      value={String(condition.value || "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={userField.placeholder || "Enter user..."}
      className="text-body-small min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  )
}
