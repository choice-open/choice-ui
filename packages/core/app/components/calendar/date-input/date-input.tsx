import { format, isValid } from "date-fns"
import { zhCN } from "date-fns/locale"
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { TextField, TextFieldProps } from "~/components"
import { handleShortcuts, parseExtendedRelativeDate, tryRelaxedParsing } from "../utils/input"
import type { DateFormat } from "./types"
import { FieldTypeDate } from "@choiceform/icons-react"
import { mergeRefs } from "~/utils"

interface DateInputProps extends Omit<TextFieldProps, "value" | "onChange" | "format"> {
  format?: DateFormat
  onChange?: (date: Date | null) => void
  value?: Date | null
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => {
  const {
    value,
    onChange,
    format: dateFormat = "yyyy-MM-dd",
    placeholder = "Enter date...",
    className = "",
    ...rest
  } = props

  const [inputValue, setInputValue] = useState("")

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
  const handleInputChange = useCallback((value: string) => {
    if (isUpdatingRef.current) return

    const text = value
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
    <TextField
      ref={ref}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      {...rest}
    >
      <TextField.Prefix>
        <FieldTypeDate />
      </TextField.Prefix>
    </TextField>
  )
})

DateInput.displayName = "DateInput"
