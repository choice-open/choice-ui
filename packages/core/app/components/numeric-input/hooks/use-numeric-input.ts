import React, { HTMLProps, useCallback, useEffect, useRef, useState } from "react"
import { PressMoveProps, useMergedValue, usePressMove } from "~/hooks"
import { mergeRefs } from "~/utils"
import { NumberResult, NumericInputValue } from "../types"
import { dealWithNumericInputValue } from "../utils/numeric-value-processor"
import { useInputInteractions } from "./use-input-interactions"
import { useModifierKeys } from "./use-modifier-keys"
import { useNumericValueProcessing } from "./use-numeric-value-processing"
import { useStepCalculation } from "./use-step-calculation"

interface UseNumericInputProps<T extends NumericInputValue>
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onWheel"> {
  disabled?: boolean
  readOnly?: boolean
  value?: T
  defaultValue?: T
  onChange?: (value: T, obj: NumberResult) => void
  expression?: string
  max?: number
  min?: number
  onEmpty?: () => void
  decimal?: number
  shiftStep?: number
  step?: number
  ref?: React.Ref<HTMLInputElement>
  containerRef?: React.RefObject<HTMLElement>
  onPressStart?: PressMoveProps["onPressStart"]
  onPressEnd?: PressMoveProps["onPressEnd"]
}

/**
 * 数值输入控件的主钩子，整合各种交互功能
 * @param props 配置选项
 * @returns 处理状态和事件处理器
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

  // 1. 使用子钩子处理不同关注点
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

  // 2. 状态管理和合并
  const [innerValue, setValue] = useMergedValue({
    value: valuePre,
    defaultValue: defaultValuePre,
  })

  // 3. 更新显示值并同步到 input
  useEffect(() => {
    if (!innerValue) {
      setDisplayValue("")
      return
    }

    // 处理表达式变化，但避免循环依赖
    const valuePre = dealWithNumericInputValue({
      input: innerValue.object,
      pattern: expression,
      max,
      min,
      decimal,
    })

    // 只有当表达式导致实际值变化时才更新内部值
    if (JSON.stringify(valuePre.object) !== JSON.stringify(innerValue.object)) {
      setValue(valuePre)
    }

    setDisplayValue(valuePre.string)
  }, [innerValue, expression, max, min, decimal, setValue])

  // 4. 值更新处理
  const updateValue = useCallback(
    (updateFn?: (value: number) => number) => {
      if (disabled || readOnly) return

      setValue((prev) => {
        if (!prev) {
          // 处理 prev 为空的情况，创建一个基于 0 的初始值
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

        // 深度比较对象值是否发生变化
        const hasChanged = (() => {
          // 如果是基本类型值，使用字符串比较
          if (typeof value === "string" || typeof value === "number" || Array.isArray(value)) {
            return JSON.stringify(valuePre.object) !== JSON.stringify(prev.object)
          }

          // 对于对象类型，比较每个键值对
          if (typeof value === "object" && value !== null) {
            const prevKeys = Object.keys(prev.object)
            const newKeys = Object.keys(valuePre.object)

            // 键的数量不同，肯定有变化
            if (prevKeys.length !== newKeys.length) return true

            // 比较每个键值对
            return prevKeys.some((key) => prev.object[key] !== valuePre.object[key])
          }

          return true // 默认认为有变化
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

  // 5. 输入交互处理
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

  // 6. 拖拽交互处理
  const { isPressed: handlerPressed, pressMoveProps } = usePressMove({
    disabled,
    onPressStart: (e) => {
      // 保存当前 focus 状态
      const wasFocused = isFocused
      if (onPressStart && "nativeEvent" in e) {
        onPressStart(e.nativeEvent as PointerEvent)
      }

      // 如果之前是 focused，在 requestPointerLock 后重新聚焦并选中
      if (wasFocused && innerRef.current) {
        requestAnimationFrame(() => {
          innerRef.current?.focus()
          innerRef.current?.select()
        })
      }

      onPressStart?.(e as PointerEvent)
    },
    onPressEnd: (e) => {
      // 如果之前是 focused，在 exitPointerLock 后重新聚焦并选中
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

  // 7. 组合最终结果
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
