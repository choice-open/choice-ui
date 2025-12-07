import {
  mergeRefs,
  PressMoveProps,
  useMergedValue,
  useModifierKeys,
  usePressMove,
} from "@choiceform/design-shared"
import { addDays, addMonths, addWeeks, format, isValid } from "date-fns"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { BaseDateProps, DateInteractionProps, StepProps } from "../types"
import { parseCache, parseDate, parserConfig, resolveLocale, smartCorrectDate } from "../utils"

interface UseDateInputProps extends BaseDateProps, StepProps, DateInteractionProps {
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  readOnly?: boolean
  ref?: React.Ref<HTMLInputElement>
}

export function useDateInput(props: UseDateInputProps) {
  const {
    value,
    defaultValue,
    onChange,
    disabled = false,
    readOnly = false,
    minDate,
    maxDate,
    step = 1,
    shiftStep = 7,
    metaStep = 30,
    onPressStart,
    onPressEnd,
    format: dateFormat,
    locale: propLocale,
    enableCache = true,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    onEnterKeyDown,
    ref,
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const innerRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")

  // 🎯 高级数据流方向检测
  const dataFlowRef = useRef<{
    direction: "external" | "internal" | "idle"
    handledByEnter: boolean
    lastExternalValue: Date | null
    lastInternalInput: string
  }>({
    direction: "idle",
    lastExternalValue: null,
    lastInternalInput: "",
    handledByEnter: false,
  })

  // 修饰键状态
  const { shiftPressed, metaPressed } = useModifierKeys(disabled)

  // 计算当前步长
  const getCurrentStep = useCallback(() => {
    if (metaPressed) {
      return metaStep // Ctrl/Cmd: 1个月 ≈ 30天
    }
    if (shiftPressed) {
      return shiftStep // Shift: 7天
    }
    return step // 默认: 1天
  }, [metaPressed, shiftPressed, step, metaStep, shiftStep])

  // 使用 useMergedValue 管理内外状态
  const [innerValue, setValue] = useMergedValue({
    value,
    defaultValue,
    onChange,
    allowEmpty: true,
  })

  // 检查日期是否在范围内
  const isDateInRange = useCallback(
    (date: Date): boolean => {
      if (!isValid(date)) return false
      if (minDate && date < minDate) return false
      if (maxDate && date > maxDate) return false
      return true
    },
    [minDate, maxDate],
  )

  // 🎯 将日期调整到允许范围内
  const clampDateToRange = useCallback(
    (date: Date): Date | null => {
      if (!isValid(date)) return null
      if (minDate && date < minDate) return minDate
      if (maxDate && date > maxDate) return maxDate
      return date
    },
    [minDate, maxDate],
  )

  // 从外部 value 同步到内部 input（外部 → 内部）
  useEffect(() => {
    const flow = dataFlowRef.current

    // 检测是否为外部数据变化（处理 undefined）
    const normalizedValue = innerValue ?? null
    const isExternalChange = normalizedValue !== flow.lastExternalValue

    if (isExternalChange) {
      // 🔄 外部数据流：暂停内部解析，同步显示
      flow.direction = "external"
      flow.lastExternalValue = normalizedValue

      if (normalizedValue && isValid(normalizedValue)) {
        try {
          const formatted = format(normalizedValue, dateFormat || "yyyy-MM-dd", { locale })
          setInputValue(formatted)
          flow.lastInternalInput = formatted
        } catch (error) {
          console.warn("Date formatting error:", error)
          // 降级使用默认格式
          try {
            const formatted = format(normalizedValue, "yyyy-MM-dd", { locale })
            setInputValue(formatted)
            flow.lastInternalInput = formatted
          } catch {
            // 最后降级：不格式化，直接显示 ISO 字符串
            const isoString = normalizedValue.toISOString().split("T")[0]
            setInputValue(isoString)
            flow.lastInternalInput = isoString
          }
        }
      } else {
        setInputValue("")
        flow.lastInternalInput = ""
      }

      // 短暂延迟后恢复内部处理
      setTimeout(() => {
        flow.direction = "idle"
      }, 50)
    }
  }, [innerValue, dateFormat, locale])

  // 🔧 专门处理 locale/format 变化的 useEffect
  useEffect(() => {
    // 如果当前有值且不在外部数据流状态，重新格式化
    if (innerValue && isValid(innerValue) && dataFlowRef.current.direction !== "external") {
      try {
        const formatted = format(innerValue, dateFormat || "yyyy-MM-dd", { locale })
        setInputValue(formatted)
        dataFlowRef.current.lastInternalInput = formatted
      } catch (error) {
        console.warn("Date formatting error:", error)
        // 降级使用默认格式
        try {
          const formatted = format(innerValue, "yyyy-MM-dd", { locale })
          setInputValue(formatted)
          dataFlowRef.current.lastInternalInput = formatted
        } catch {
          // 最后降级：显示 ISO 字符串
          const isoString = innerValue.toISOString().split("T")[0]
          setInputValue(isoString)
          dataFlowRef.current.lastInternalInput = isoString
        }
      }
    }
  }, [dateFormat, locale]) // 只依赖 dateFormat 和 locale

  // 更新日期值的函数 - 参考 numeric-input 的模式
  const updateValue = useCallback(
    (updateFn?: (currentDate: Date) => Date) => {
      if (disabled || readOnly) return

      setValue((prev) => {
        let baseDate = prev

        // 如果没有当前值，智能选择基准日期
        if (!baseDate || !isValid(baseDate)) {
          if (minDate && maxDate) {
            // 如果有最小和最大日期限制，使用中间值作为基准
            const minTime = minDate.getTime()
            const maxTime = maxDate.getTime()
            const midTime = Math.floor((minTime + maxTime) / 2)
            baseDate = new Date(midTime)
          } else if (minDate) {
            // 只有最小日期限制，使用最小日期作为基准
            baseDate = minDate
          } else if (maxDate) {
            // 只有最大日期限制，使用最大日期往前1天作为基准（给拖拽留空间）
            baseDate = addDays(maxDate, -1)
          } else {
            // 没有日期限制，使用今天
            baseDate = new Date()
          }
        }

        // 如果提供了更新函数，应用它
        const newDate = updateFn ? updateFn(baseDate) : baseDate

        // 检查范围限制
        if (!isDateInRange(newDate)) {
          return prev // 保持原值
        }

        // 确保新日期有效
        if (!isValid(newDate)) {
          return prev // 保持原值
        }

        return newDate
      })
    },
    [disabled, readOnly, setValue, isDateInRange, minDate, maxDate],
  )

  // 🚀 优化：使用 useEventCallback 的解析函数
  const parseWithOptimization = useEventCallback((text: string): Date | null => {
    const startTime = enableProfiling ? Date.now() : 0

    // 检查缓存
    if (enableCache && parserConfig.cache.enabled) {
      const cacheKey = `${text}-${dateFormat || "yyyy-MM-dd"}-${locale.code || "unknown"}`
      const cached = parseCache.get(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    // 使用新的统一解析器
    const result = parseDate(text, {
      format: dateFormat || "yyyy-MM-dd",
      locale,
      enableSmartCorrection: true,
      enableNaturalLanguage: true,
      enableRelativeDate: true,
    })

    // 缓存结果
    if (enableCache && parserConfig.cache.enabled) {
      const cacheKey = `${text}-${dateFormat || "yyyy-MM-dd"}-${locale.code || "unknown"}`
      parseCache.set(cacheKey, result)
    }

    // 性能分析
    if (enableProfiling) {
      const parseTime = Date.now() - startTime
      if (parseTime > parserConfig.performance.maxParseTime) {
        console.warn(`Slow parse detected: ${parseTime}ms for "${text}"`)
      }
    }

    return result
  })

  // 确保日期有效的辅助函数
  const ensureValidDate = useCallback((date: Date): Date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const testDate = new Date(year, month - 1, day)
    if (
      testDate.getFullYear() === year &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day
    ) {
      return date
    }

    const corrected = smartCorrectDate(year, month, day)
    return new Date(corrected.year, corrected.month - 1, corrected.day)
  }, [])

  // 🚀 优化：使用 useEventCallback 处理用户输入变化
  const handleInputChange = useEventCallback((newValue: string) => {
    const flow = dataFlowRef.current

    // 如果正在处理外部数据流，忽略内部变化
    if (flow.direction === "external") {
      return
    }

    // 🔄 内部数据流：记录输入变化
    flow.direction = "internal"
    flow.lastInternalInput = newValue
    setInputValue(newValue)
  })

  const handleSubmit = useEventCallback(() => {
    const flow = dataFlowRef.current

    // 🚫 数据流保护：外部数据流期间不处理内部提交
    if (flow.direction === "external") {
      return
    }

    const text = inputValue.trim()

    if (!text) {
      setValue(null)
      return
    }

    // 检查是否为重复输入（仅用于 onChange 优化，不影响 onDateSubmit）
    const isRepeatInput = text === flow.lastInternalInput && flow.direction !== "internal"

    try {
      const parsedDate = parseWithOptimization(text)

      if (parsedDate && isValid(parsedDate)) {
        // 最终验证：确保日期有效
        const validDate = ensureValidDate(parsedDate)

        // 🎯 检查日期范围约束
        let finalDate = validDate
        if (!isDateInRange(validDate)) {
          // 如果日期不在范围内，尝试调整到范围内
          const clampedDate = clampDateToRange(validDate)
          if (!clampedDate) {
            // 如果无法调整，保持原始输入但不更新值
            return
          }
          // 使用调整后的日期
          finalDate = clampedDate
        }

        // 智能去重：避免设置相同的日期（仅影响 onChange）
        const currentValue = flow.lastExternalValue
        const isSameDate =
          currentValue &&
          finalDate.getFullYear() === currentValue.getFullYear() &&
          finalDate.getMonth() === currentValue.getMonth() &&
          finalDate.getDate() === currentValue.getDate()

        // 只有在非重复输入且日期不同时才调用 setValue
        if (!isRepeatInput && !isSameDate) {
          // 🔄 内部 → 外部：触发更新
          setValue(finalDate)
        }

        // 格式化显示
        try {
          const formatted = format(finalDate, dateFormat || "yyyy-MM-dd", { locale })
          if (formatted !== text) {
            setInputValue(formatted)
            flow.lastInternalInput = formatted
          } else if (!isRepeatInput) {
            // 更新内部输入记录，即使格式化结果相同
            flow.lastInternalInput = text
          }
        } catch (error) {
          console.warn("Date formatting error in handleSubmit:", error)
          // 降级处理：使用默认格式或保持原输入
          try {
            const formatted = format(finalDate, "yyyy-MM-dd", { locale })
            setInputValue(formatted)
            flow.lastInternalInput = formatted
          } catch {
            // 最后降级：保持用户输入
            if (!isRepeatInput) {
              flow.lastInternalInput = text
            }
          }
        }
      }
    } catch (error) {
      console.warn("Date parsing error:", error)
    }

    // 处理完成，重置为空闲状态
    flow.direction = "idle"
  })

  // 拖拽交互处理
  const { isPressed: handlerPressed, pressMoveProps } = usePressMove({
    disabled: disabled || readOnly,
    onPressStart: (e) => {
      onPressStart?.(e as PointerEvent)
    },
    onPressEnd: (e) => {
      onPressEnd?.(e as PointerEvent)
    },
    onPressMoveLeft: (delta) => {
      // 左拖：向过去移动（减少天数）
      updateValue((currentDate) => addDays(currentDate, -delta * getCurrentStep()))
    },
    onPressMoveRight: (delta) => {
      // 右拖：向未来移动（增加天数）
      updateValue((currentDate) => addDays(currentDate, delta * getCurrentStep()))
    },
  })

  // 🚀 优化：使用 useEventCallback 处理键盘事件
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()

      // 标记已被 Enter 处理
      dataFlowRef.current.handledByEnter = true

      handleSubmit()

      // 🎯 触发回车键回调（用于控制popover关闭等）
      onEnterKeyDown?.()

      // 延迟失焦，避免与 useEffect 竞态
      setTimeout(() => {
        const target = event.target as HTMLInputElement
        target.blur()
      }, 0)
    } else if (enableKeyboardNavigation && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault()

      const flow = dataFlowRef.current

      // 🎯 智能基准日期选择
      let baseDate: Date

      if (innerValue && isValid(innerValue)) {
        // 优先使用当前有效的 innerValue
        baseDate = innerValue
      } else if (inputValue.trim()) {
        // 尝试解析当前输入
        const parsed = parseWithOptimization(inputValue.trim())
        if (parsed && isValid(parsed)) {
          baseDate = parsed
        } else {
          // 解析失败时使用智能基准日期选择
          if (minDate && maxDate) {
            const minTime = minDate.getTime()
            const maxTime = maxDate.getTime()
            const midTime = Math.floor((minTime + maxTime) / 2)
            baseDate = new Date(midTime)
          } else if (minDate) {
            baseDate = minDate
          } else if (maxDate) {
            baseDate = addDays(maxDate, -1)
          } else {
            baseDate = new Date()
          }
        }
      } else {
        // 没有输入时使用智能基准日期选择
        if (minDate && maxDate) {
          const minTime = minDate.getTime()
          const maxTime = maxDate.getTime()
          const midTime = Math.floor((minTime + maxTime) / 2)
          baseDate = new Date(midTime)
        } else if (minDate) {
          baseDate = minDate
        } else if (maxDate) {
          baseDate = addDays(maxDate, -1)
        } else {
          baseDate = new Date()
        }
      }

      // 🔄 计算增量和新日期
      const isUp = event.key === "ArrowUp"
      const increment = isUp ? -1 : 1 // 🔄 反转：上键减少，下键增加

      let newDate: Date

      if (event.altKey) {
        // Alt + 上下键：按月跳转
        newDate = addMonths(baseDate, increment)
      } else if (event.shiftKey) {
        // Shift + 上下键：按周跳转
        newDate = addWeeks(baseDate, increment)
      } else {
        // 上下键：按天跳转
        newDate = addDays(baseDate, increment)
      }

      // 🎯 检查日期范围约束
      if (!isDateInRange(newDate)) {
        // 如果新日期超出范围，尝试调整到边界
        const clampedDate = clampDateToRange(newDate)
        if (!clampedDate || clampedDate.getTime() === baseDate.getTime()) {
          // 如果无法调整或调整后与当前日期相同，忽略该操作
          return
        }
        newDate = clampedDate
      }

      // 🔄 更新状态和显示
      try {
        const formatted = format(newDate, dateFormat || "yyyy-MM-dd", { locale })

        // 🚀 关键修复：立即更新显示，延迟更新值以避免竞态条件
        flow.direction = "internal"
        flow.lastInternalInput = formatted
        setInputValue(formatted)

        // 延迟更新值，避免与 useEffect 的数据流检测冲突
        setTimeout(() => {
          // 二次检查：确保状态仍然是内部操作
          if (flow.direction === "internal") {
            // 更新外部值状态以防止 useEffect 误判为外部变化
            flow.lastExternalValue = newDate
            setValue(newDate)

            // 标记操作完成
            flow.direction = "idle"
          }
        }, 10)
      } catch (error) {
        console.warn("Date formatting error during keyboard navigation:", error)
        // 降级处理：直接更新值而不格式化
        flow.direction = "internal"
        setValue(newDate)
        flow.lastExternalValue = newDate
        flow.direction = "idle"
      }
    }
  })

  // 🚀 优化：使用 useEventCallback 处理失焦
  const handleBlur = useEventCallback(() => {
    const flow = dataFlowRef.current

    // 如果是 Enter 键触发的失焦，不重复处理
    if (flow.handledByEnter) {
      flow.handledByEnter = false
      return
    }

    // 外部数据流期间不处理失焦
    if (flow.direction === "external") {
      return
    }

    // 智能延迟：给外部组件足够时间完成操作
    setTimeout(() => {
      // 二次检查：确保不是在外部数据流期间
      if (dataFlowRef.current.direction !== "external") {
        handleSubmit()
      }
    }, 100)
  })

  const inputProps = {
    ref: mergeRefs(innerRef, ref),
    disabled,
    readOnly,
    value: inputValue,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
  }

  const handlerProps = {
    ...pressMoveProps,
    ref: pressMoveProps.ref,
  }

  return {
    handlerPressed,
    inputProps,
    handlerProps,
    updateValue,
    currentValue: innerValue,
  }
}
