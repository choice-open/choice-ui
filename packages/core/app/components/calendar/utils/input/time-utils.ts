import { format, parse, isValid, setHours, setMinutes, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { TimeFormat, TimeInputValue, TimeParserOptions } from "../../date-input/types"
import { commonTimeFormats } from "./constants"

// 智能解析时间
export function smartParseTime(input: string, options: TimeParserOptions): TimeInputValue {
  const { format: timeFormat, locale, strict } = options
  const dateFnsLocale = locale || enUS

  const result: TimeInputValue = {
    input,
    time: null,
    formatted: "",
    isValid: false,
    error: null,
  }

  // 空输入处理
  if (!input.trim()) {
    return result
  }

  let parsedDate: Date | null = null

  try {
    // 1. 尝试按指定格式解析
    const baseDate = new Date(2000, 0, 1) // 使用固定日期，只关心时间
    parsedDate = parse(input, timeFormat, baseDate, { locale: dateFnsLocale })

    if (isValid(parsedDate)) {
      result.time = format(parsedDate, "HH:mm")
      result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // 2. 尝试其他常见时间格式
    for (const tryFormat of commonTimeFormats) {
      if (tryFormat !== timeFormat) {
        try {
          parsedDate = parse(input, tryFormat, baseDate, { locale: dateFnsLocale })
          if (isValid(parsedDate)) {
            result.time = format(parsedDate, "HH:mm")
            result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
            result.isValid = true
            return result
          }
        } catch {
          // 继续尝试下一个格式
        }
      }
    }

    // 3. 尝试简单的数字输入解析（如：9 -> 09:00, 930 -> 09:30）
    const numericMatch = input.match(/^(\d{1,4})$/)
    if (numericMatch) {
      const num = numericMatch[1].padStart(4, "0")
      const hours = parseInt(num.substring(0, 2), 10)
      const minutes = parseInt(num.substring(2, 4), 10)

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const timeDate = setMinutes(setHours(baseDate, hours), minutes)
        result.time = format(timeDate, "HH:mm")
        result.formatted = format(timeDate, timeFormat, { locale: dateFnsLocale })
        result.isValid = true
        return result
      }
    }

    // 解析失败
    result.error = strict ? "Invalid time format" : null
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Parse error"
  }

  return result
}

// 生成时间选项列表
export function generateTimeOptions(
  step: number = 30,
  timeFormat: TimeFormat = "HH:mm",
  locale?: Locale,
): Array<{ label: string; value: string }> {
  const options: Array<{ label: string; value: string }> = []
  const baseDate = new Date(2000, 0, 1)

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const timeDate = setMinutes(setHours(baseDate, hour), minute)
      const value = format(timeDate, "HH:mm")
      const label = format(timeDate, timeFormat, { locale })

      options.push({ value, label })
    }
  }

  return options
}

// 宽松的时间解析
export function tryRelaxedTimeParsing(
  input: string,
  targetFormat: TimeFormat,
  locale: Locale,
): string | null {
  const trimmedInput = input.trim()
  if (!trimmedInput) return null

  try {
    // 1. 纯数字处理
    const digitOnly = trimmedInput.replace(/[^\d]/g, "")

    if (/^\d+$/.test(digitOnly)) {
      const len = digitOnly.length

      // 1-2位数字：H 或 HH (补全为 H:00)
      if (len <= 2) {
        const hours = parseInt(digitOnly, 10)
        if (hours >= 0 && hours <= 23) {
          return `${hours.toString().padStart(2, "0")}:00`
        }
      }

      // 3-4位数字：HMM 或 HHMM
      if (len === 3 || len === 4) {
        const paddedInput = digitOnly.padStart(4, "0")
        const hours = parseInt(paddedInput.substring(0, 2), 10)
        const minutes = parseInt(paddedInput.substring(2, 4), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }
    }

    // 2. 带分隔符但不完整的时间
    const timeMatch = trimmedInput.match(/(\d{1,2})[:.](\d{0,2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minuteStr = timeMatch[2] || "00"
      const minutes = parseInt(minuteStr.padEnd(2, "0"), 10)

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 3. 包含 AM/PM 的处理
    const ampmMatch = trimmedInput.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm|上午|下午)/i)
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10)
      const minutes = parseInt(ampmMatch[2] || "0", 10)
      const period = ampmMatch[3].toLowerCase()

      if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
        // 转换为24小时制
        if ((period === "pm" || period === "下午") && hours !== 12) {
          hours += 12
        } else if ((period === "am" || period === "上午") && hours === 12) {
          hours = 0
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 4. 中文时间描述
    const chineseTimePatterns = [
      { pattern: /(\d{1,2})\s*点/, hour: true },
      { pattern: /(\d{1,2})\s*时/, hour: true },
      { pattern: /(\d{1,2})\s*分/, minute: true },
    ]

    let parsedHour: number | null = null
    let parsedMinute: number | null = null

    for (const { pattern, hour } of chineseTimePatterns) {
      const match = trimmedInput.match(pattern)
      if (match) {
        const num = parseInt(match[1], 10)
        if (hour && num >= 0 && num <= 23) {
          parsedHour = num
        } else if (!hour && num >= 0 && num <= 59) {
          parsedMinute = num
        }
      }
    }

    if (parsedHour !== null) {
      const minutes = parsedMinute || 0
      return `${parsedHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }
  } catch (error) {
    // 解析失败
  }

  return null
}
