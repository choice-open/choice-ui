import React, { RefObject, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { NumberResult, NumericInputValue } from "../types"
import { dealWithNumericInputValue } from "../utils"

interface UseInputInteractionsProps<T extends NumericInputValue> {
  inputRef: RefObject<HTMLInputElement>
  displayValue: string
  setDisplayValue: (value: string) => void
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
  expression: string
  min?: number
  max?: number
  decimal?: number
  disabled?: boolean
  readOnly?: boolean
  innerValue?: NumberResult
  setValue: (value: NumberResult | ((prev: NumberResult | undefined) => NumberResult)) => void
  updateValue: (updateFn?: (value: number) => number) => void
  getCurrentStep: () => number
  onChange?: (value: T, detail: NumberResult) => void
  onEmpty?: () => void
  value?: T
}

/**
 * 处理输入框交互的钩子
 * @param props 输入交互配置
 * @returns 输入处理器和初始值引用
 */
export function useInputInteractions<T extends NumericInputValue>({
  inputRef,
  displayValue,
  setDisplayValue,
  isFocused,
  setIsFocused,
  expression,
  min,
  max,
  decimal,
  disabled,
  readOnly,
  innerValue,
  setValue,
  updateValue,
  getCurrentStep,
  onChange,
  onEmpty,
  value,
}: UseInputInteractionsProps<T>) {
  const initialValueRef = useRef<string>("")

  const handleInputChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value)
  })

  const handleInputFocus = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    initialValueRef.current = e.target.value
    setIsFocused(true)
    e.target.select()
  })

  const handleInputBlur = useEventCallback(() => {
    setIsFocused(false)
    if (disabled || readOnly) return

    try {
      const valuePre = dealWithNumericInputValue({
        input: displayValue,
        pattern: expression,
        max,
        min,
        decimal,
      })

      // 比较逻辑：检查计算后的值是否等于当前值
      // 1. 检查字符串完全相同
      // 2. 检查数值部分相同（考虑带单位的情况，如 "24px" 与 "24px" 或 "12+12" 与 "24px"）
      const isExpressionInput = displayValue !== valuePre.string
      const isSameNumericValue =
        innerValue?.array[0] !== undefined &&
        valuePre.array[0] !== undefined &&
        valuePre.array[0] === innerValue.array[0]

      const isSameValue =
        // 字符串完全相同
        valuePre.string === innerValue?.string ||
        // 或者数值部分相同（无论是直接输入还是表达式）
        isSameNumericValue

      if (isSameValue) {
        // 无论是否触发 onChange，都应该更新输入框显示值为计算结果
        setDisplayValue(valuePre.string)
        setValue(valuePre)
        return
      }

      setValue(valuePre)
      onChange?.(
        (typeof value === "string"
          ? valuePre.string
          : typeof value === "number"
            ? valuePre.array[0]
            : Array.isArray(value)
              ? valuePre.array
              : valuePre.object) as T,
        valuePre,
      )

      setDisplayValue(valuePre.string)
    } catch (_error) {
      if (displayValue === "") {
        onEmpty?.()
      }
      if (initialValueRef.current) {
        setDisplayValue(initialValueRef.current)
      }
    }
  })

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    e.stopPropagation()

    if (e.key === "Enter") {
      inputRef.current?.blur()
    }
    if (e.key === "ArrowUp") {
      updateValue((value) => value + getCurrentStep())
    }
    if (e.key === "ArrowDown") {
      updateValue((value) => value - getCurrentStep())
    }
  })

  return {
    inputHandlers: {
      onChange: handleInputChange,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      onKeyDown: handleKeyDown,
    },
    initialValueRef,
  }
}
