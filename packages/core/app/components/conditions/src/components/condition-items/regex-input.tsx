import { Checkbox } from "@choiceform/checkbox"
import { Input } from "@choiceform/input"
import { useCallback, useMemo, useState } from "react"
import type { BaseFieldInputProps } from "./types"

interface RegexValue {
  flags?: string
  pattern: string
}

export function RegexInput({ condition, disabled, onChange }: BaseFieldInputProps) {
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  // 解析当前值
  const currentValue = useMemo((): RegexValue => {
    if (!condition.value) {
      return { pattern: "", flags: "" }
    }

    if (typeof condition.value === "string") {
      return { pattern: condition.value, flags: "" }
    }

    if (typeof condition.value === "object" && condition.value !== null) {
      const val = condition.value as RegexValue
      return {
        pattern: val.pattern || "",
        flags: val.flags || "",
      }
    }

    return { pattern: "", flags: "" }
  }, [condition.value])

  // 验证正则表达式
  const validateRegex = useCallback((pattern: string, flags: string = "") => {
    if (!pattern.trim()) {
      setIsValid(true)
      setErrorMessage("")
      return true
    }

    try {
      new RegExp(pattern, flags)
      setIsValid(true)
      setErrorMessage("")
      return true
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error instanceof Error ? error.message : "Invalid regex pattern")
      return false
    }
  }, [])

  // 处理模式变化
  const handlePatternChange = useCallback(
    (newPattern: string) => {
      const isValidPattern = validateRegex(newPattern, currentValue.flags)
      const newValue: RegexValue = {
        pattern: newPattern,
        flags: currentValue.flags,
      }

      // 只有在正则表达式有效或为空时才更新值
      if (isValidPattern || !newPattern.trim()) {
        onChange(newValue)
      }
    },
    [currentValue.flags, onChange, validateRegex],
  )

  // 处理标志变化
  const handleFlagChange = useCallback(
    (flag: string, checked: boolean) => {
      let newFlags = currentValue.flags || ""

      if (checked) {
        if (!newFlags.includes(flag)) {
          newFlags += flag
        }
      } else {
        newFlags = newFlags.replace(flag, "")
      }

      const isValidPattern = validateRegex(currentValue.pattern, newFlags)
      const newValue: RegexValue = {
        pattern: currentValue.pattern,
        flags: newFlags,
      }

      if (isValidPattern) {
        onChange(newValue)
      }
    },
    [currentValue.pattern, currentValue.flags, onChange, validateRegex],
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {/* 正则表达式模式输入 */}
      <div className="flex flex-col gap-1">
        <Input
          value={currentValue.pattern}
          onChange={handlePatternChange}
          disabled={disabled}
          placeholder="Enter regex pattern..."
          className={`min-w-0 flex-1 font-mono ${!isValid ? "border-red-500" : ""}`}
        />
        {!isValid && errorMessage && <div className="text-xs text-red-600">{errorMessage}</div>}
      </div>

      {/* 正则表达式标志 */}
      <div className="text-body-small flex flex-wrap gap-3">
        <Checkbox
          value={currentValue.flags?.includes("i") || false}
          onChange={(checked) => handleFlagChange("i", checked)}
          disabled={disabled}
        >
          <Checkbox.Label>i (ignore case)</Checkbox.Label>
        </Checkbox>

        <Checkbox
          value={currentValue.flags?.includes("g") || false}
          onChange={(checked) => handleFlagChange("g", checked)}
          disabled={disabled}
        >
          <Checkbox.Label>g (global)</Checkbox.Label>
        </Checkbox>

        <Checkbox
          value={currentValue.flags?.includes("m") || false}
          onChange={(checked) => handleFlagChange("m", checked)}
          disabled={disabled}
        >
          <Checkbox.Label>m (multiline)</Checkbox.Label>
        </Checkbox>

        <Checkbox
          value={currentValue.flags?.includes("s") || false}
          onChange={(checked) => handleFlagChange("s", checked)}
          disabled={disabled}
        >
          <Checkbox.Label>s (dotall)</Checkbox.Label>
        </Checkbox>
      </div>

      {/* 示例和帮助 */}
      {currentValue.pattern && isValid && (
        <div className="mt-1 text-xs text-gray-500">
          Pattern:{" "}
          <code className="rounded bg-gray-100 px-1">
            /{currentValue.pattern}/{currentValue.flags}
          </code>
        </div>
      )}
    </div>
  )
}
