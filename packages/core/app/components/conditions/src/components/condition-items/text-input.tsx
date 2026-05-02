import { Input } from "@choice-ui/input"
import { ConditionsFieldType } from "../../types"
import type { BaseFieldInputProps } from "./types"

export function TextInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  if (field.type !== ConditionsFieldType.Text) {
    return null
  }

  const displayValue = String(condition.value || "")

  return (
    <div className="contents">
      <Input
        type="text"
        value={displayValue}
        onChange={(value) => onChange(value)}
        disabled={disabled}
        placeholder={field.placeholder || "Enter value..."}
      />
      <span className="sr-only">{displayValue}</span>
    </div>
  )
}
