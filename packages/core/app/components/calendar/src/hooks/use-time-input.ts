import {
  mergeRefs,
  PressMoveProps,
  useMergedValue,
  useModifierKeys,
  usePressMove,
} from "@choiceform/design-shared"
import { addMinutes, format, setHours, setMinutes, startOfDay } from "date-fns"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { BaseTimeProps, StepProps, TimeInteractionProps } from "../types"
import { resolveLocale, smartParseTime } from "../utils"

interface UseTimeInputProps extends BaseTimeProps, StepProps, TimeInteractionProps {
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  readOnly?: boolean
  ref?: React.Ref<HTMLInputElement>
}

export function useTimeInput(props: UseTimeInputProps) {
  const {
    value,
    defaultValue,
    onChange,
    disabled = false,
    readOnly = false,
    minTime,
    maxTime,
    step = 1,
    shiftStep = 15,
    metaStep = 60,
    onPressStart,
    onPressEnd,
    format: timeFormat = "HH:mm",
    locale: propLocale,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    onEnterKeyDown,
    ref,
  } = props

  // 解析 locale
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
      return metaStep // Ctrl/Cmd: 1小时 = 60分钟
    }
    if (shiftPressed) {
      return shiftStep // Shift: 15分钟
    }
    return step // 默认: 1分钟
  }, [metaPressed, shiftPressed, step, metaStep, shiftStep])

  // 使用 useMergedValue 管理内外状态
  const [innerValue, setValue] = useMergedValue({
    value,
    defaultValue,
    onChange,
    allowEmpty: true,
  })

  // 检查时间是否在范围内
  const isTimeInRange = useCallback(
    (time: Date): boolean => {
      if (!time) return false
      if (minTime && time < minTime) return false
      if (maxTime && time > maxTime) return false
      return true
    },
    [minTime, maxTime],
  )

  // 🎯 将时间调整到允许范围内
  const clampTimeToRange = useCallback(
    (time: Date): Date | null => {
      if (!time) return null
      if (minTime && time < minTime) return minTime
      if (maxTime && time > maxTime) return maxTime
      return time
    },
    [minTime, maxTime],
  )

  // 从外部 value 同步到内部 input（外部 → 内部）
  useEffect(() => {
    const flow = dataFlowRef.current

    // 检测是否为外部数据变化
    const normalizedValue = innerValue ?? null
    const isExternalChange = normalizedValue !== flow.lastExternalValue

    if (isExternalChange) {
      // 🔄 外部数据流：暂停内部解析，同步显示
      flow.direction = "external"
      flow.lastExternalValue = normalizedValue

      if (normalizedValue) {
        // 格式化显示
        const formatted = format(normalizedValue, timeFormat, { locale })
        setInputValue(formatted)
        flow.lastInternalInput = formatted
      } else {
        setInputValue("")
        flow.lastInternalInput = ""
      }

      // 短暂延迟后恢复内部处理
      setTimeout(() => {
        flow.direction = "idle"
      }, 50)
    }
  }, [innerValue, timeFormat, locale])

  // 🔧 专门处理 locale/format 变化的 useEffect
  useEffect(() => {
    // 如果当前有值且不在外部数据流状态，重新格式化
    if (innerValue && dataFlowRef.current.direction !== "external") {
      const formatted = format(innerValue, timeFormat, { locale })
      setInputValue(formatted)
      dataFlowRef.current.lastInternalInput = formatted
    }
  }, [timeFormat, locale, innerValue]) // 添加 innerValue 依赖

  // 更新时间值的函数
  const updateValue = useCallback(
    (updateFn?: (currentTime: Date) => Date) => {
      if (disabled || readOnly) return

      setValue((prev) => {
        let baseTime = prev

        // 如果没有当前值，智能选择基准时间
        if (!baseTime) {
          if (minTime && maxTime) {
            // 如果有最小和最大时间限制，使用中间值作为基准
            const minTotalMinutes = minTime.getHours() * 60 + minTime.getMinutes()
            let maxTotalMinutes = maxTime.getHours() * 60 + maxTime.getMinutes()

            // 处理跨日情况
            if (maxTotalMinutes < minTotalMinutes) {
              maxTotalMinutes += 24 * 60
            }

            const midTotalMinutes = Math.floor((minTotalMinutes + maxTotalMinutes) / 2)
            const hours = Math.floor(midTotalMinutes / 60) % 24
            const minutes = midTotalMinutes % 60
            baseTime = setMinutes(setHours(startOfDay(new Date()), hours), minutes)
          } else if (minTime) {
            // 只有最小时间限制，使用最小时间作为基准
            baseTime = minTime
          } else if (maxTime) {
            // 只有最大时间限制，使用最大时间往前1小时作为基准（给拖拽留空间）
            baseTime = addMinutes(maxTime, -60)
          } else {
            // 没有时间限制，使用当前时间
            baseTime = new Date()
          }
        }

        // 如果提供了更新函数，应用它
        const newTime = updateFn ? updateFn(baseTime) : baseTime

        // 检查范围限制
        if (!isTimeInRange(newTime)) {
          return prev // 保持原值
        }

        return newTime
      })
    },
    [disabled, readOnly, setValue, isTimeInRange, minTime, maxTime],
  )

  // 🚀 优化：使用 useEventCallback 的解析函数
  const parseWithOptimization = useEventCallback((text: string): Date | null => {
    const startTime = enableProfiling ? Date.now() : 0

    // 使用智能时间解析
    const result = smartParseTime(text, {
      format: timeFormat,
      locale: propLocale,
      strict: false,
    })

    // 性能分析
    if (enableProfiling) {
      const parseTime = Date.now() - startTime
      if (parseTime > 100) {
        // 时间解析应该比日期解析更快
        console.warn(`Slow time parse detected: ${parseTime}ms for "${text}"`)
      }
    }

    return result.isValid && result.time ? result.time : null
  })

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

    // 检查是否为重复输入
    const isRepeatInput = text === flow.lastInternalInput && flow.direction !== "internal"

    try {
      const parsedTime = parseWithOptimization(text)

      if (parsedTime) {
        // 🎯 检查时间范围约束
        let finalTime = parsedTime
        if (!isTimeInRange(parsedTime)) {
          // 如果时间不在范围内，尝试调整到范围内
          const clampedTime = clampTimeToRange(parsedTime)
          if (!clampedTime) {
            // 如果无法调整，保持原始输入但不更新值
            return
          }
          // 使用调整后的时间
          finalTime = clampedTime
        }

        // 智能去重：避免设置相同的时间
        const currentValue = flow.lastExternalValue
        const isSameTime = currentValue && finalTime.getTime() === currentValue.getTime()

        // 只有在非重复输入且时间不同时才调用 setValue
        if (!isRepeatInput && !isSameTime) {
          // 🔄 内部 → 外部：触发更新
          setValue(finalTime)
        }

        // 格式化显示
        const formatted = format(finalTime, timeFormat, { locale })
        if (formatted !== text) {
          setInputValue(formatted)
          flow.lastInternalInput = formatted
        } else if (!isRepeatInput) {
          // 更新内部输入记录，即使格式化结果相同
          flow.lastInternalInput = text
        }
      }
    } catch (error) {
      console.warn("Time parsing error:", error)
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
      // 左拖：减少时间
      updateValue((currentTime) => {
        return addMinutes(currentTime, -delta * getCurrentStep())
      })
    },
    onPressMoveRight: (delta) => {
      // 右拖：增加时间
      updateValue((currentTime) => {
        return addMinutes(currentTime, delta * getCurrentStep())
      })
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

      // 🎯 智能基准时间选择
      let baseTime: Date

      if (innerValue) {
        // 优先使用当前有效的 innerValue
        baseTime = innerValue
      } else if (inputValue.trim()) {
        // 尝试解析当前输入
        const parsed = parseWithOptimization(inputValue.trim())
        baseTime = parsed || new Date()
      } else {
        // 使用当前时间作为默认基准
        baseTime = new Date()
      }

      // 🔄 计算增量和新时间
      const isUp = event.key === "ArrowUp"
      const increment = isUp ? -1 : 1 // 上键减少时间（向列表上方），下键增加时间（向列表下方）

      let newDate: Date

      if (event.altKey || event.metaKey) {
        // Alt/Meta + 上下键：使用 metaStep（默认60分钟）
        newDate = addMinutes(baseTime, increment * metaStep)
      } else if (event.shiftKey) {
        // Shift + 上下键：使用 shiftStep（可配置，默认15分钟）
        newDate = addMinutes(baseTime, increment * shiftStep)
      } else {
        // 上下键：使用 step（可配置，默认1分钟）
        newDate = addMinutes(baseTime, increment * step)
      }

      // 🎯 检查时间范围约束
      if (!isTimeInRange(newDate)) {
        // 如果新时间超出范围，尝试调整到边界
        const clampedTime = clampTimeToRange(newDate)
        if (!clampedTime || clampedTime.getTime() === baseTime.getTime()) {
          // 如果无法调整或调整后与当前时间相同，忽略该操作
          return
        }
        newDate = clampedTime
      }

      // 🔄 更新状态和显示
      const formatted = format(newDate, timeFormat, { locale })

      // 标记为内部数据流
      flow.direction = "internal"
      flow.lastInternalInput = formatted

      // 更新显示
      setInputValue(formatted)

      // 触发外部更新
      setValue(newDate)

      // 完成后重置状态
      setTimeout(() => {
        flow.direction = "idle"
      }, 0)
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
