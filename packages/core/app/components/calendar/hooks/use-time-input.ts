import type { Locale } from "date-fns"
import { addMinutes, format } from "date-fns"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { PressMoveProps, useMergedValue, useModifierKeys, usePressMove } from "~/hooks"
import { mergeRefs } from "~/utils"
import type { TimeFormat } from "../types"
import { smartParseTime } from "../utils"

interface UseTimeInputProps {
  defaultValue?: string | null
  disabled?: boolean
  enableCache?: boolean
  enableKeyboardNavigation?: boolean
  enableProfiling?: boolean
  format?: TimeFormat
  locale: Locale
  maxTime?: string
  metaStep?: number
  minTime?: string
  onChange?: (time: string | null) => void
  onEnterKeyDown?: () => void
  onPressEnd?: PressMoveProps["onPressEnd"]
  onPressStart?: PressMoveProps["onPressStart"]
  readOnly?: boolean
  ref?: React.Ref<HTMLInputElement>
  shiftStep?: number
  step?: number
  value?: string | null
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
    locale,
    enableCache = true,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    onEnterKeyDown,
    ref,
  } = props

  const innerRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")

  // 🎯 高级数据流方向检测
  const dataFlowRef = useRef<{
    direction: "external" | "internal" | "idle"
    handledByEnter: boolean
    lastExternalValue: string | null
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
    (time: string): boolean => {
      if (!time || !/^\d{2}:\d{2}$/.test(time)) return false
      if (minTime && time < minTime) return false
      if (maxTime && time > maxTime) return false
      return true
    },
    [minTime, maxTime],
  )

  // 🎯 将时间调整到允许范围内
  const clampTimeToRange = useCallback(
    (time: string): string | null => {
      if (!time || !/^\d{2}:\d{2}$/.test(time)) return null
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

      if (normalizedValue && /^\d{2}:\d{2}$/.test(normalizedValue)) {
        // 解析时间并格式化显示
        const [hours, minutes] = normalizedValue.split(":")
        const baseDate = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10))
        const formatted = format(baseDate, timeFormat, { locale })
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
    if (
      innerValue &&
      /^\d{2}:\d{2}$/.test(innerValue) &&
      dataFlowRef.current.direction !== "external"
    ) {
      const [hours, minutes] = innerValue.split(":")
      const baseDate = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10))
      const formatted = format(baseDate, timeFormat, { locale })
      setInputValue(formatted)
      dataFlowRef.current.lastInternalInput = formatted
    }
  }, [timeFormat, locale]) // 只依赖 timeFormat 和 locale

  // 更新时间值的函数
  const updateValue = useCallback(
    (updateFn?: (currentTime: string) => string) => {
      if (disabled || readOnly) return

      setValue((prev) => {
        let baseTime = prev

        // 如果没有当前值，智能选择基准时间
        if (!baseTime || !/^\d{2}:\d{2}$/.test(baseTime)) {
          if (minTime && maxTime) {
            // 如果有最小和最大时间限制，使用中间值作为基准
            const [minHours, minMinutes] = minTime.split(":").map(Number)
            const [maxHours, maxMinutes] = maxTime.split(":").map(Number)
            const minTotalMinutes = minHours * 60 + minMinutes
            let maxTotalMinutes = maxHours * 60 + maxMinutes

            // 处理跨日情况
            if (maxTotalMinutes < minTotalMinutes) {
              maxTotalMinutes += 24 * 60
            }

            const midTotalMinutes = Math.floor((minTotalMinutes + maxTotalMinutes) / 2)
            const hours = Math.floor(midTotalMinutes / 60) % 24
            const minutes = midTotalMinutes % 60
            baseTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
          } else if (minTime) {
            // 只有最小时间限制，使用最小时间作为基准
            baseTime = minTime
          } else if (maxTime) {
            // 只有最大时间限制，使用最大时间往前1小时作为基准（给拖拽留空间）
            const [maxHours, maxMinutes] = maxTime.split(":").map(Number)
            const maxTotalMinutes = maxHours * 60 + maxMinutes
            const baseTotalMinutes = Math.max(0, maxTotalMinutes - 60) // 往前1小时，最小为0
            const hours = Math.floor(baseTotalMinutes / 60)
            const minutes = baseTotalMinutes % 60
            baseTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
          } else {
            // 没有时间限制，使用当前时间
            const now = new Date()
            baseTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
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
  const parseWithOptimization = useEventCallback((text: string): string | null => {
    const startTime = enableProfiling ? Date.now() : 0

    // 使用智能时间解析
    const result = smartParseTime(text, {
      format: timeFormat,
      locale,
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

    return result.isValid ? result.time : null
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

      if (parsedTime && /^\d{2}:\d{2}$/.test(parsedTime)) {
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
        const isSameTime = currentValue && finalTime === currentValue

        // 只有在非重复输入且时间不同时才调用 setValue
        if (!isRepeatInput && !isSameTime) {
          // 🔄 内部 → 外部：触发更新
          setValue(finalTime)
        }

        // 格式化显示
        const [hours, minutes] = finalTime.split(":")
        const baseDate = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10))
        const formatted = format(baseDate, timeFormat, { locale })
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
        const [hours, minutes] = currentTime.split(":").map(Number)
        const baseDate = new Date(2000, 0, 1, hours, minutes)
        const newDate = addMinutes(baseDate, -delta * getCurrentStep())
        return `${newDate.getHours().toString().padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`
      })
    },
    onPressMoveRight: (delta) => {
      // 右拖：增加时间
      updateValue((currentTime) => {
        const [hours, minutes] = currentTime.split(":").map(Number)
        const baseDate = new Date(2000, 0, 1, hours, minutes)
        const newDate = addMinutes(baseDate, delta * getCurrentStep())
        return `${newDate.getHours().toString().padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`
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
      let baseTime: string

      if (innerValue && /^\d{2}:\d{2}$/.test(innerValue)) {
        // 优先使用当前有效的 innerValue
        baseTime = innerValue
      } else if (inputValue.trim()) {
        // 尝试解析当前输入
        const parsed = parseWithOptimization(inputValue.trim())
        baseTime = parsed && /^\d{2}:\d{2}$/.test(parsed) ? parsed : "00:00"
      } else {
        // 使用当前时间作为默认基准
        const now = new Date()
        baseTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      }

      // 🔄 计算增量和新时间
      const isUp = event.key === "ArrowUp"
      const increment = isUp ? 1 : -1 // 上键增加，下键减少

      const [hours, minutes] = baseTime.split(":").map(Number)
      const baseDate = new Date(2000, 0, 1, hours, minutes)
      let newDate: Date

      if (event.altKey || event.metaKey) {
        // Alt/Meta + 上下键：使用 metaStep（默认60分钟）
        newDate = addMinutes(baseDate, increment * metaStep)
      } else if (event.shiftKey) {
        // Shift + 上下键：使用 shiftStep（可配置，默认15分钟）
        newDate = addMinutes(baseDate, increment * shiftStep)
      } else {
        // 上下键：使用 step（可配置，默认1分钟）
        newDate = addMinutes(baseDate, increment * step)
      }

      const newTime = `${newDate.getHours().toString().padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`

      // 🎯 检查时间范围约束
      if (!isTimeInRange(newTime)) {
        // 如果新时间超出范围，尝试调整到边界
        const clampedTime = clampTimeToRange(newTime)
        if (!clampedTime || clampedTime === baseTime) {
          // 如果无法调整或调整后与当前时间相同，忽略该操作
          return
        }
        newDate = new Date(2000, 0, 1, ...clampedTime.split(":").map(Number))
      }

      // 🔄 更新状态和显示
      const finalTime = `${newDate.getHours().toString().padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}`
      const formatted = format(newDate, timeFormat, { locale })

      // 标记为内部数据流
      flow.direction = "internal"
      flow.lastInternalInput = formatted

      // 更新显示
      setInputValue(formatted)

      // 触发外部更新
      setValue(finalTime)

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
