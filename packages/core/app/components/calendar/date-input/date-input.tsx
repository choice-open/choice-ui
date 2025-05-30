import { format, isValid } from "date-fns"
import { zhCN } from "date-fns/locale"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { handleShortcuts, parseExtendedRelativeDate, tryRelaxedParsing } from "../utils/input"
import type { DateFormat } from "./types"

interface DateInputProps {
  className?: string
  disabled?: boolean
  format?: DateFormat
  onChange?: (date: Date | null) => void
  placeholder?: string
  readOnly?: boolean
  value?: Date | null
}

export function DateInput({
  value,
  onChange,
  format: dateFormat = "yyyy-MM-dd",
  placeholder = "输入日期...",
  className = "",
  disabled = false,
  readOnly = false,
}: DateInputProps) {
  const [inputValue, setInputValue] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)
  const isUpdatingRef = useRef(false)

  // 从 Date 值同步到 input
  useEffect(() => {
    if (value && isValid(value) && !isUpdatingRef.current) {
      const formatted = format(value, dateFormat, { locale: zhCN })
      setInputValue(formatted)
    } else if (!value && !isUpdatingRef.current) {
      setInputValue("")
    }
  }, [value, dateFormat])

  // 处理输入变化
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingRef.current) return

    const text = event.target.value
    setInputValue(text)
  }, [])

  // 处理回车和失焦
  const handleSubmit = useCallback(() => {
    // 如果正在更新中，跳过
    if (isUpdatingRef.current) return

    const text = inputValue.trim()
    if (!text) {
      onChange?.(null)
      return
    }

    try {
      // 首先检查快捷键
      const shortcutDate = handleShortcuts(text)
      if (shortcutDate) {
        onChange?.(shortcutDate)
        return
      }

      // 检查扩展相对日期
      const relativeDate = parseExtendedRelativeDate(text)
      if (relativeDate) {
        onChange?.(relativeDate)
        return
      }

      // 尝试解析日期
      const parsedDate = tryRelaxedParsing(text, dateFormat, zhCN)
      if (parsedDate && isValid(parsedDate)) {
        onChange?.(parsedDate)

        // 格式化并更新显示（防止循环更新）
        const formatted = format(parsedDate, dateFormat, { locale: zhCN })
        if (formatted !== text) {
          isUpdatingRef.current = true
          setInputValue(formatted)
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 0)
        }
      }
    } catch (error) {
      // 处理错误，但不干扰用户
      console.warn("Date parsing error:", error)
    }
  }, [inputValue, onChange, dateFormat])

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  // 处理失焦
  const handleBlur = useCallback(() => {
    // 延迟处理，避免干扰其他交互
    setTimeout(() => {
      handleSubmit()
    }, 100)
  }, [handleSubmit])

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${readOnly ? "bg-gray-50" : "bg-white"}`}
        style={{
          minHeight: "40px",
          fontFamily: "inherit",
        }}
      />
    </div>
  )
}
