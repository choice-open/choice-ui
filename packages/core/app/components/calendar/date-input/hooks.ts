import { format, isValid, parse } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useCallback, useEffect, useMemo, useState } from "react"
import { tryRelaxedParsing, tryRelaxedTimeParsing } from "../utils/input"
import type { DateFormat, TimeFormat } from "./types"

// 简单的去抖
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// 智能日期输入 - 永远不报错，总是尝试修正
export function useDateInput(
  initialValue?: Date | null,
  options: {
    format?: DateFormat
    onChange?: (value: Date | null) => void
  } = {},
) {
  const { format: dateFormat = "yyyy-MM-dd", onChange } = options

  const [value, setValue] = useState<Date | null>(initialValue || null)
  const [inputValue, setInputValue] = useState(() => {
    return initialValue ? format(initialValue, dateFormat, { locale: zhCN }) : ""
  })

  const [isFocused, setIsFocused] = useState(false)
  const debouncedInput = useDebounce(inputValue, 300)

  // 智能解析 - 永远尝试修正，从不报错
  const smartDate = useMemo(() => {
    if (!debouncedInput.trim()) return null

    const now = new Date()
    let result: Date | null = null

    // 1. 尝试标准格式
    try {
      result = parse(debouncedInput, dateFormat, now, { locale: zhCN })
      if (isValid(result)) return result
    } catch {
      // 忽略解析错误，继续下一步
    }

    // 2. 尝试宽松解析
    result = tryRelaxedParsing(debouncedInput, dateFormat, zhCN)
    if (result) return result

    // 3. 最后的猜测 - 总是返回一个合理的日期
    const digits = debouncedInput.replace(/\D/g, "")
    if (digits) {
      const num = parseInt(digits, 10)
      if (num <= 31) return new Date(now.getFullYear(), now.getMonth(), num)
      if (num <= 1231) {
        const month = Math.floor(num / 100) - 1
        const day = num % 100
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
          return new Date(now.getFullYear(), month, day)
        }
      }
    }

    // 实在解析不出来，返回今天
    return now
  }, [debouncedInput, dateFormat])

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue)
  }, [])

  const handleFocus = useCallback(() => setIsFocused(true), [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (smartDate) {
      const formatted = format(smartDate, dateFormat, { locale: zhCN })
      setInputValue(formatted)
      setValue(smartDate)
      onChange?.(smartDate)
    }
  }, [smartDate, dateFormat, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (smartDate) {
          const formatted = format(smartDate, dateFormat, { locale: zhCN })
          setInputValue(formatted)
          setValue(smartDate)
          onChange?.(smartDate)
        }
        if (e.target instanceof HTMLElement) e.target.blur()
      }
    },
    [smartDate, dateFormat, onChange],
  )

  return {
    value,
    inputValue,
    isFocused,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
  }
}

// 智能时间输入 - 纯输入框，永远不报错
export function useTimeInput(
  initialValue?: string | null,
  options: {
    format?: TimeFormat
    onChange?: (value: string | null) => void
  } = {},
) {
  const { format: timeFormat = "HH:mm", onChange } = options

  const [value, setValue] = useState<string | null>(initialValue || null)
  const [inputValue, setInputValue] = useState(() => {
    if (!initialValue) return ""
    const [h, m] = initialValue.split(":")
    const date = new Date(2000, 0, 1, parseInt(h), parseInt(m))
    return format(date, timeFormat, { locale: zhCN })
  })

  const [isFocused, setIsFocused] = useState(false)
  const debouncedInput = useDebounce(inputValue, 300)

  // 智能解析时间 - 永远尝试修正
  const smartTime = useMemo(() => {
    if (!debouncedInput.trim()) return null

    // 尝试宽松解析
    const result = tryRelaxedTimeParsing(debouncedInput, timeFormat, zhCN)
    if (result) return result

    // 最后的猜测
    const digits = debouncedInput.replace(/\D/g, "")
    if (digits) {
      const num = parseInt(digits, 10)
      if (num <= 23) return `${num.toString().padStart(2, "0")}:00`
      if (num <= 2359) {
        const hours = Math.floor(num / 100)
        const minutes = num % 100
        if (hours <= 23 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }
    }

    // 默认返回当前时间
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  }, [debouncedInput, timeFormat])

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue)
  }, [])

  const handleFocus = useCallback(() => setIsFocused(true), [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (smartTime) {
      const [h, m] = smartTime.split(":")
      const date = new Date(2000, 0, 1, parseInt(h), parseInt(m))
      const formatted = format(date, timeFormat, { locale: zhCN })
      setInputValue(formatted)
      setValue(smartTime)
      onChange?.(smartTime)
    }
  }, [smartTime, timeFormat, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (smartTime) {
          const [h, m] = smartTime.split(":")
          const date = new Date(2000, 0, 1, parseInt(h), parseInt(m))
          const formatted = format(date, timeFormat, { locale: zhCN })
          setInputValue(formatted)
          setValue(smartTime)
          onChange?.(smartTime)
        }
        if (e.target instanceof HTMLElement) e.target.blur()
      }
    },
    [smartTime, timeFormat, onChange],
  )

  return {
    value,
    inputValue,
    isFocused,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
  }
}
