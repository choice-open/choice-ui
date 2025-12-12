import { mergeRefs } from "@choice-ui/shared"
import React, { HTMLProps, useCallback, useEffect, useRef, useState } from "react"
import { PressMoveProps, useMergedValue, useModifierKeys, usePressMove } from "@choice-ui/shared"
import { NumberResult, NumericInputValue } from "../types"
import { dealWithNumericInputValue } from "../utils/numeric-value-processor"
import { useInputInteractions } from "./use-input-interactions"
import { useNumericValueProcessing } from "./use-numeric-value-processing"
import { useStepCalculation } from "./use-step-calculation"

interface UseNumericInputProps<T extends NumericInputValue> extends Omit<
  HTMLProps<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "onWheel"
> {
  containerRef?: React.RefObject<HTMLElement>
  decimal?: number
  defaultValue?: T
  disabled?: boolean
  expression?: string
  max?: number
  min?: number
  onChange?: (value: T, obj: NumberResult) => void
  onEmpty?: () => void
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  readOnly?: boolean
  ref?: React.Ref<HTMLInputElement>
  shiftStep?: number
  step?: number
  value?: T
}

/**
 * Main hook for numeric input component, integrating various interaction features
 * @param props Configuration options
 * @returns State management and event handlers
 */
export function useNumericInput<T extends NumericInputValue>(props: UseNumericInputProps<T>) {
  const {
    decimal,
    defaultValue,
    disabled,
    expression = "{value}",
    max,
    min,
    readOnly,
    ref,
    shiftStep = 10,
    step = 1,
    value,
    onChange,
    onEmpty,
    onPressEnd,
    onPressStart,
  } = props

  const innerRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState("")

  // 1. Use sub-hooks to handle different focus points
  const { shiftPressed, metaPressed } = useModifierKeys(disabled)
  const getCurrentStep = useStepCalculation(shiftPressed, metaPressed, shiftStep, step)
  const { valuePre, defaultValuePre, expressionRef } = useNumericValueProcessing({
    value,
    defaultValue,
    expression,
    min,
    max,
    decimal,
  })

  // 2. State management and merging
  const [innerValue, setValue] = useMergedValue({
    value: valuePre,
    defaultValue: defaultValuePre,
    allowEmpty: true,
  })

  // 3. Update display value and synchronize to input
  useEffect(() => {
    if (!innerValue) {
      setDisplayValue("")
      return
    }

    // Handle expression change, but avoid circular dependency
    const valuePre = dealWithNumericInputValue({
      input: innerValue.object,
      pattern: expression,
      max,
      min,
      decimal,
    })

    // Only update internal value when expression causes actual value change
    if (JSON.stringify(valuePre.object) !== JSON.stringify(innerValue.object)) {
      setValue(valuePre)
    }

    setDisplayValue(valuePre.string)
  }, [innerValue, expression, max, min, decimal, setValue])

  // 4. Value update processing
  const updateValue = useCallback(
    (updateFn?: (value: number) => number) => {
      if (disabled || readOnly) return

      setValue((prev) => {
        if (!prev) {
          // Handle prev is empty case, create an initial value based on 0
          const initialValue = dealWithNumericInputValue({
            input: 0,
            pattern: expressionRef.current,
            call: updateFn,
            max,
            min,
            decimal,
          })

          onChange?.(
            (typeof value === "string"
              ? initialValue.string
              : typeof value === "number"
                ? initialValue.array[0]
                : Array.isArray(value)
                  ? initialValue.array
                  : initialValue.object) as T,
            initialValue,
          )

          return initialValue
        }

        const valuePre = dealWithNumericInputValue({
          input: prev.object,
          pattern: expressionRef.current,
          call: updateFn,
          max,
          min,
          decimal,
        })

        // Deep compare object values to see if they have changed
        const hasChanged = (() => {
          // If it's a basic type value, use string comparison
          if (typeof value === "string" || typeof value === "number" || Array.isArray(value)) {
            return JSON.stringify(valuePre.object) !== JSON.stringify(prev.object)
          }

          // For object type, compare each key-value pair
          if (typeof value === "object" && value !== null) {
            const prevKeys = Object.keys(prev.object)
            const newKeys = Object.keys(valuePre.object)

            // The number of keys is different, definitely has changed
            if (prevKeys.length !== newKeys.length) return true

            // Compare each key-value pair
            return prevKeys.some((key) => prev.object[key] !== valuePre.object[key])
          }

          return true // Default to认为有变化
        })()

        if (hasChanged) {
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
        }
        return valuePre
      })
    },
    [disabled, readOnly, setValue, max, min, decimal, onChange, value],
  )

  // 5. Input interaction processing
  const { inputHandlers } = useInputInteractions({
    inputRef: innerRef,
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
  })

  // 6. Drag interaction processing
  const { isPressed: handlerPressed, pressMoveProps } = usePressMove({
    disabled,
    onPressStart: (e) => {
      // Save current focus state
      const wasFocused = isFocused
      if (onPressStart && "nativeEvent" in e) {
        onPressStart(e.nativeEvent as PointerEvent)
      }

      // If previously focused, refocus and select after requestPointerLock
      if (wasFocused && innerRef.current) {
        requestAnimationFrame(() => {
          innerRef.current?.focus()
          innerRef.current?.select()
        })
      }

      onPressStart?.(e as PointerEvent)
    },
    onPressEnd: (e) => {
      // If previously focused, refocus and select after exitPointerLock
      if (isFocused && innerRef.current) {
        requestAnimationFrame(() => {
          innerRef.current?.focus()
          innerRef.current?.select()
        })
      }
      if (onPressEnd && "nativeEvent" in e) {
        onPressEnd(e.nativeEvent as PointerEvent)
      }

      onPressEnd?.(e as PointerEvent)
    },
    onPressMoveLeft: (delta) => {
      updateValue((value) => value - delta * getCurrentStep())
    },
    onPressMoveRight: (delta) => {
      updateValue((value) => value + delta * getCurrentStep())
    },
  })

  // 7. Combine final result
  const inputProps = {
    ref: mergeRefs(innerRef, ref),
    disabled,
    readOnly,
    value: displayValue,
    ...inputHandlers,
  }

  const handlerProps = {
    ...pressMoveProps,
    ref: pressMoveProps.ref,
  }

  return {
    handlerPressed,
    inputProps,
    handlerProps,
  }
}
