import { format, isValid, parse, setHours, setMinutes, startOfDay, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { TimeInputValue, TimeParserOptions } from "../time-input/types"
import { Time } from "../time/types"
import type { TimeFormat } from "../types"
import { commonTimeFormats } from "./constants"
import { resolveLocale } from "./locale"

// 智能解析时间
export function smartParseTime(input: string, options: TimeParserOptions): TimeInputValue {
  const { format: timeFormat, locale, strict } = options
  const dateFnsLocale = resolveLocale(locale)

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

    // 3. 使用宽松的智能解析（支持数字、AM/PM、中文等）
    const relaxedResult = tryRelaxedTimeParsing(input, timeFormat, locale || dateFnsLocale)
    if (relaxedResult) {
      // 解析成功，创建 Date 对象用于格式化
      const [hours, minutes] = relaxedResult.split(":")
      const timeDate = setMinutes(setHours(baseDate, parseInt(hours, 10)), parseInt(minutes, 10))

      result.time = relaxedResult
      result.formatted = format(timeDate, timeFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // 解析失败
    result.error = strict ? "Invalid time format" : null
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Parse error"
  }

  return result
}

// 宽松的时间解析
export function tryRelaxedTimeParsing(
  input: string,
  targetFormat: TimeFormat,
  locale: Locale | string,
): string | null {
  const trimmedInput = input.trim()
  if (!trimmedInput) return null

  const dateFnsLocale = resolveLocale(locale)

  try {
    // 1. 纯数字处理（只处理真正的纯数字输入，不包含字母）
    if (/^\d+$/.test(trimmedInput)) {
      const len = trimmedInput.length

      // 1-2位数字：作为小时处理（如 9 → 09:00）
      if (len <= 2) {
        const hours = parseInt(trimmedInput, 10)
        if (hours >= 0 && hours <= 23) {
          return `${hours.toString().padStart(2, "0")}:00`
        }
      }

      // 3位数字：第一位是小时，后两位是分钟（如 930 → 09:30）
      if (len === 3) {
        const hours = parseInt(trimmedInput.substring(0, 1), 10)
        const minutes = parseInt(trimmedInput.substring(1, 3), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }

      // 4位数字：前两位是小时，后两位是分钟（如 1430 → 14:30）
      if (len === 4) {
        const hours = parseInt(trimmedInput.substring(0, 2), 10)
        const minutes = parseInt(trimmedInput.substring(2, 4), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }
    }

    // 2. 包含 AM/PM 的处理（优先处理，避免被纯数字逻辑干扰）
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

    // 3. 中文时间描述（优先处理上午/下午）
    const chineseTimePatterns: Array<{
      hour: boolean
      isPM?: boolean | null
      pattern: RegExp
    }> = [
      { pattern: /(?:下午)\s*(\d{1,2})\s*[点时]/, hour: true, isPM: true },
      { pattern: /(?:上午)\s*(\d{1,2})\s*[点时]/, hour: true, isPM: false },
      { pattern: /(\d{1,2})\s*[点时]/, hour: true, isPM: null },
      { pattern: /(\d{1,2})\s*分/, hour: false, isPM: null },
    ]

    let parsedHour: number | null = null
    let parsedMinute: number | null = null
    let isPM: boolean | null = null

    for (const { pattern, hour, isPM: isAfternoon } of chineseTimePatterns) {
      const match = trimmedInput.match(pattern)
      if (match) {
        const num = parseInt(match[1], 10)
        if (hour && num >= 1 && num <= 12) {
          parsedHour = num
          isPM = isAfternoon !== undefined ? isAfternoon : null
          break // 找到小时就停止，避免被后续模式覆盖
        } else if (!hour && num >= 0 && num <= 59) {
          parsedMinute = num
        }
      }
    }

    if (parsedHour !== null) {
      let finalHour = parsedHour

      // 处理12小时制转换
      if (isPM === true && finalHour !== 12) {
        finalHour += 12
      } else if (isPM === false && finalHour === 12) {
        finalHour = 0
      }

      const minutes = parsedMinute || 0
      if (finalHour >= 0 && finalHour <= 23) {
        return `${finalHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 4. 带分隔符但不完整的时间（如 9:3 → 09:30）
    const timeMatch = trimmedInput.match(/(\d{1,2})[:.](\d{1,2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minuteStr = timeMatch[2]

      // 智能分钟补全：单个数字 * 10（如 3 → 30）
      let minutes: number
      if (minuteStr.length === 1) {
        minutes = parseInt(minuteStr, 10) * 10
      } else {
        minutes = parseInt(minuteStr, 10)
      }

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }
  } catch (error) {
    // 解析失败
  }

  return null
}

// 创建时间对象
export function createTime(hour: number, minute: number): Time {
  return { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) }
}

// 时间转换为Date对象（基于今天）
export function timeToDate(time: Time): Date {
  const today = startOfDay(new Date())
  return setMinutes(setHours(today, time.hour), time.minute)
}

// Date对象转换为时间
export function dateToTime(date: Date): Time {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

// 格式化时间显示
export function formatTime(
  time: Time,
  timeFormat: TimeFormat = "24h",
  locale: Locale = enUS,
): string {
  const date = timeToDate(time)

  if (timeFormat === "12h") {
    return format(date, "h:mm a", { locale })
  }

  return format(date, "HH:mm", { locale })
}

// 格式化小时显示
export function formatHour(
  hour: number,
  timeFormat: TimeFormat = "24h",
  locale: Locale = enUS,
): string {
  const date = setHours(startOfDay(new Date()), hour)

  if (timeFormat === "12h") {
    return format(date, "h a", { locale })
  }

  return hour.toString().padStart(2, "0")
}

// 格式化分钟显示
export function formatMinute(minute: number): string {
  return minute.toString().padStart(2, "0")
}

// 生成小时选项列表（双列模式）
export function generateHourOptions(
  hourStep: number = 1,
  timeFormat: TimeFormat = "24h",
  locale: Locale = enUS,
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let hour = 0; hour < 24; hour += hourStep) {
    options.push({
      value: hour,
      label: formatHour(hour, timeFormat, locale),
    })
  }

  return options
}

// 生成分钟选项列表（双列模式）
export function generateMinuteOptions(
  minuteStep: number = 15,
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let minute = 0; minute < 60; minute += minuteStep) {
    options.push({
      value: minute,
      label: formatMinute(minute),
    })
  }

  return options
}

// 检查两个时间是否相等
export function isTimeEqual(time1: Time, time2: Time): boolean {
  return time1.hour === time2.hour && time1.minute === time2.minute
}

// 查找最接近的有效时间
export function findClosestValidTime(
  time: Time,
  minuteStep: number = 15,
  hourStep: number = 1,
): Time {
  // 找到最接近的有效分钟
  const closestMinute = Math.round(time.minute / minuteStep) * minuteStep

  // 找到最接近的有效小时
  const closestHour = Math.round(time.hour / hourStep) * hourStep

  return createTime(closestHour, closestMinute % 60)
}

export const generateTimeOptions = (format: "12h" | "24h", step: number = 15) => {
  const options: Array<{ label: string; value: string }> = []
  const totalMinutes = 24 * 60

  for (let i = 0; i < totalMinutes; i += step) {
    const hours = Math.floor(i / 60)
    const minutes = i % 60

    if (format === "12h") {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      const ampm = hours < 12 ? "AM" : "PM"
      const value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      const label = `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`
      options.push({ value, label })
    } else {
      const value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      const label = value
      options.push({ value, label })
    }
  }

  return options
}

// Helper function to convert time object to string
export const timeObjectToString = (timeObj: { hour: number; minute: number }): string => {
  return `${timeObj.hour.toString().padStart(2, "0")}:${timeObj.minute.toString().padStart(2, "0")}`
}

// Helper function to convert time string to object
export const timeStringToObject = (timeStr: string): { hour: number; minute: number } => {
  const [hour, minute] = timeStr.split(":").map(Number)
  return { hour, minute }
}

// Normalize value to string format for internal use
export const normalizeValue = (
  value: string | { hour: number; minute: number } | undefined | null,
): string | null => {
  if (!value) return null
  if (typeof value === "string") return value
  return timeObjectToString(value)
}

// Convert back to original format
export const convertToOriginalFormat = (
  stringValue: string,
  originalValue: string | { hour: number; minute: number } | undefined | null,
): string | { hour: number; minute: number } => {
  if (typeof originalValue === "object" && originalValue !== null) {
    return timeStringToObject(stringValue)
  }
  return stringValue
}
