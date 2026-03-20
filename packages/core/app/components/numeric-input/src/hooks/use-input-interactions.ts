import React, { RefObject, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { NumberResult, NumericInputValue } from "../types"
import { dealWithNumericInputValue, compareNumberResults } from "../utils"

interface UseInputInteractionsProps<T extends NumericInputValue> {
  decimal?: number
  defaultValue?: T
  disabled?: boolean
  displayValue: string
  expression: string
  getCurrentStep: () => number
  innerValue?: NumberResult
  inputRef: RefObject<HTMLInputElement>
  isFocused: boolean
  max?: number
  min?: number
  onChange?: (value: T, detail: NumberResult) => void
  onRawInputEditingChange?: (editing: boolean) => void
  onEmpty?: () => void
  readOnly?: boolean
  setDisplayValue: (value: string) => void
  setIsFocused: (focused: boolean) => void
  setValue: (value: NumberResult | ((prev: NumberResult | undefined) => NumberResult)) => void
  updateValue: (
    updateFn?: (value: number) => number,
    options?: { source?: "drag" | "keyboard" },
  ) => void
  value?: T
}

/**
 * Hook to handle input box interactions
 * @param props Input interaction configuration
 * @returns Input handlers and initial value reference
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
  defaultValue,
  disabled,
  readOnly,
  innerValue,
  setValue,
  updateValue,
  getCurrentStep,
  onChange,
  onRawInputEditingChange,
  onEmpty,
  value,
}: UseInputInteractionsProps<T>) {
  const initialValueRef = useRef<string>("")
  const outputShapeSource = value ?? defaultValue

  const handleInputChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onRawInputEditingChange?.(true)
    setDisplayValue(e.target.value)
  })

  const handleInputFocus = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    initialValueRef.current = e.target.value
    setIsFocused(true)
    e.target.select()
  })

  const handleInputBlur = useEventCallback(() => {
    onRawInputEditingChange?.(false)
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

      // Use separated comparison logic
      const isSameValue = compareNumberResults(innerValue, valuePre)

      if (isSameValue) {
        // Whether or not onChange is triggered, the input box display value should be updated to the calculated result
        setDisplayValue(valuePre.string)
        setValue(valuePre)
        return
      }

      setValue(valuePre)
      onChange?.(
        (typeof outputShapeSource === "string"
          ? valuePre.string
          : typeof outputShapeSource === "number"
            ? valuePre.array[0]
            : Array.isArray(outputShapeSource)
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
