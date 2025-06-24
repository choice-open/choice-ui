import { useMemo } from "react"
import { NumericInput } from "../../../numeric-input"
import { NumericInputValue } from "../../../numeric-input/types"
import type { BaseFieldInputProps } from "./types"

export function ArrayLengthInput({ condition, disabled, onChange }: BaseFieldInputProps) {
  // 解析当前值为数字
  const currentValue = useMemo((): number => {
    if (typeof condition.value === "number") {
      return condition.value
    }

    if (typeof condition.value === "string") {
      const parsed = parseInt(condition.value, 10)
      return isNaN(parsed) ? 0 : parsed
    }

    return 0
  }, [condition.value])

  // 处理值变化
  const handleChange = (value: NumericInputValue) => {
    const numericValue = typeof value === "number" ? value : 0
    onChange(numericValue)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <NumericInput
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Enter array length..."
        min={0}
        step={1}
        className="min-w-0 flex-1"
      />
      <span className="text-sm whitespace-nowrap text-gray-500">items</span>
    </div>
  )
}
