import type { BaseFieldInputProps } from "./types"
import { ConditionsFieldType } from "../../types"
import { Input } from "~/components/input"

export function TextInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Text) {
    return null
  }

  return (
    <Input
      type="text"
      value={String(condition.value || "")}
      onChange={(value) => onChange(value)}
      disabled={disabled}
      placeholder={field.placeholder || "Enter value..."}
    />
  )
}
