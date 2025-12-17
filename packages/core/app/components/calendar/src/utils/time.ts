import { format, isValid, parse, setHours, setMinutes, startOfDay, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { Time, TimeDataFormat, TimeInputValue, TimeParserOptions } from "../types"
import { commonTimeFormats } from "./constants"
import { resolveLocale } from "./locale"

// Cache time string to Date object mapping, ensure reference stability
let timeStringDateCache: Map<string, Date> | null = null
let cacheDateKey: string | null = null

/**
 * Convert Date object to time string (HH:mm)
 * @param date - Date 对象
 * @returns Time string, format is "HH:mm", if date is null then return null
 */
export function dateToTimeString(date: Date | null): string | null {
  if (!date) return null
  return format(date, "HH:mm")
}

/**
 * Convert time string to Date object (today's date + specified time)
 * @param timeStr - Time string, format is "HH:mm"
 * @returns Date object, contains today's date and specified time
 */
export function timeStringToDate(timeStr: string): Date {
  // Get current date as cache key
  const today = new Date()
  const dateKey = today.toDateString() // For example: "Mon Jan 01 2024"

  // If date changed, clear cache
  if (cacheDateKey !== dateKey) {
    timeStringDateCache = new Map()
    cacheDateKey = dateKey
  }

  // Check if cache already has this time
  if (timeStringDateCache!.has(timeStr)) {
    return timeStringDateCache!.get(timeStr)!
  }

  // Create new Date object and cache
  const baseDate = startOfDay(today)
  const [hours, minutes] = timeStr.split(":").map(Number)
  const dateObject = setMinutes(setHours(baseDate, hours), minutes)

  timeStringDateCache!.set(timeStr, dateObject)
  return dateObject
}

/**
 * Normalize any Date value to time string format
 * @param value - Date object or null
 * @returns Normalized time string (HH:mm) or null
 */
export function normalizeTimeValue(value: Date | null | undefined): string | null {
  return dateToTimeString(value ?? null)
}

// Smart parse time
export function smartParseTimeValue(input: string, options: TimeParserOptions): TimeInputValue {
  const { format: timeFormat, locale, strict } = options
  const dateFnsLocale = resolveLocale(locale)

  const result: TimeInputValue = {
    input,
    time: null,
    formatted: "",
    isValid: false,
    error: null,
  }

  // Empty input handling
  if (!input.trim()) {
    return result
  }

  let parsedDate: Date | null = null

  try {
    // 1. Try to parse by specified format
    const baseDate = new Date(2000, 0, 1) // Use fixed date, only care about time
    parsedDate = parse(input, timeFormat, baseDate, { locale: dateFnsLocale })

    if (isValid(parsedDate)) {
      // Apply time to today's date
      const todayWithTime = timeStringToDate(format(parsedDate, "HH:mm"))

      result.time = todayWithTime
      result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // 2. Try other common time formats
    for (const tryFormat of commonTimeFormats) {
      if (tryFormat !== timeFormat) {
        try {
          parsedDate = parse(input, tryFormat, baseDate, { locale: dateFnsLocale })
          if (isValid(parsedDate)) {
            // Apply time to today's date
            const todayWithTime = timeStringToDate(format(parsedDate, "HH:mm"))

            result.time = todayWithTime
            result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
            result.isValid = true
            return result
          }
        } catch {
          // Continue to try next format
        }
      }
    }

    // 3. Use relaxed smart parsing (supports numbers, AM/PM, Chinese, etc.)
    const relaxedResult = tryRelaxedTimeParsing(input, timeFormat, locale || dateFnsLocale)
    if (relaxedResult) {
      // Parsing successful, use common method to create Date object
      const todayWithTime = timeStringToDate(relaxedResult)

      result.time = todayWithTime
      result.formatted = format(todayWithTime, timeFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // Parsing failed
    result.error = strict ? "Invalid time format" : null
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Parse error"
  }

  return result
}

// Relaxed time parsing
export function tryRelaxedTimeParsing(
  input: string,
  targetFormat: TimeDataFormat,
  locale: Locale | string,
): string | null {
  const trimmedInput = input.trim()
  if (!trimmedInput) return null

  const dateFnsLocale = resolveLocale(locale)

  try {
    // 1. Pure number handling (only process true pure number input, not contain letter)
    if (/^\d+$/.test(trimmedInput)) {
      const len = trimmedInput.length

      // 1-2 digits: as hour handling (e.g., 9 → 09:00)
      if (len <= 2) {
        const hours = parseInt(trimmedInput, 10)
        if (hours >= 0 && hours <= 23) {
          return `${hours.toString().padStart(2, "0")}:00`
        }
      }

      // 3 digits: first digit is hour, last two digits are minutes (e.g., 930 → 09:30)
      if (len === 3) {
        const hours = parseInt(trimmedInput.substring(0, 1), 10)
        const minutes = parseInt(trimmedInput.substring(1, 3), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }

      // 4 digits: first two digits are hours, last two digits are minutes (e.g., 1430 → 14:30)
      if (len === 4) {
        const hours = parseInt(trimmedInput.substring(0, 2), 10)
        const minutes = parseInt(trimmedInput.substring(2, 4), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }
    }

    // 2. Handle AM/PM (prioritize processing, avoid being interfered by pure number logic)
    const ampmMatch = trimmedInput.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm|上午|下午)/i)
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10)
      const minutes = parseInt(ampmMatch[2] || "0", 10)
      const period = ampmMatch[3].toLowerCase()

      if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
        // Convert to 24-hour format
        if ((period === "pm" || period === "下午") && hours !== 12) {
          hours += 12
        } else if ((period === "am" || period === "上午") && hours === 12) {
          hours = 0
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 3. Chinese time description (prioritize processing morning/afternoon)
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
          break // Stop when hour is found, avoid being overridden by subsequent patterns
        } else if (!hour && num >= 0 && num <= 59) {
          parsedMinute = num
        }
      }
    }

    if (parsedHour !== null) {
      let finalHour = parsedHour

      // Handle 12-hour format conversion
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

    // 4. Time with separator but not complete (e.g., 9:3 → 09:30)
    const timeMatch = trimmedInput.match(/(\d{1,2})[:.](\d{1,2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minuteStr = timeMatch[2]

      // Intelligent minute completion: single digit * 10 (e.g., 3 → 30)
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
    // Parsing failed
  }

  return null
}

// Create time object
export function createTimeValue(hour: number, minute: number): Time {
  return { hour: Math.max(0, Math.min(23, hour)), minute: Math.max(0, Math.min(59, minute)) }
}

// Time to Date object (based on today)
export function timeToDate(time: Time): Date {
  const today = startOfDay(new Date())
  return setMinutes(setHours(today, time.hour), time.minute)
}

// Date object to time
export function dateToTime(date: Date): Time {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

// Format time display
export function formatTimeValue(
  time: Time,
  timeFormat: TimeDataFormat = "24h",
  locale: Locale = enUS,
): string {
  const date = timeToDate(time)

  if (timeFormat === "12h") {
    return format(date, "h:mm a", { locale })
  }

  return format(date, "HH:mm", { locale })
}

// Format hour display
export function formatHourValue(
  hour: number,
  timeFormat: TimeDataFormat = "24h",
  locale: Locale = enUS,
): string {
  const date = setHours(startOfDay(new Date()), hour)

  if (timeFormat === "12h") {
    return format(date, "h a", { locale })
  }

  return hour.toString().padStart(2, "0")
}

// Format minute display
export function formatMinuteValue(minute: number): string {
  return minute.toString().padStart(2, "0")
}

// Generate hour options list (double column mode)
export function generateHourOptions(
  hourStep: number = 1,
  timeFormat: TimeDataFormat = "24h",
  locale: Locale = enUS,
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let hour = 0; hour < 24; hour += hourStep) {
    options.push({
      value: hour,
      label: formatHourValue(hour, timeFormat, locale),
    })
  }

  return options
}

// Generate minute options list (double column mode)
export function generateMinuteOptions(
  minuteStep: number = 15,
): Array<{ label: string; value: number }> {
  const options: Array<{ label: string; value: number }> = []

  for (let minute = 0; minute < 60; minute += minuteStep) {
    options.push({
      value: minute,
      label: formatMinuteValue(minute),
    })
  }

  return options
}

// Check if two times are equal
export function isTimeEqual(time1: Time, time2: Time): boolean {
  return time1.hour === time2.hour && time1.minute === time2.minute
}

// Find the closest valid time
export function findClosestValidTime(
  time: Time,
  minuteStep: number = 15,
  hourStep: number = 1,
): Time {
  // Find the closest valid minute
  const closestMinute = Math.round(time.minute / minuteStep) * minuteStep

  // Find the closest valid hour
  const closestHour = Math.round(time.hour / hourStep) * hourStep

  return createTimeValue(closestHour, closestMinute % 60)
}

export const generateTimeOptions = (format: TimeDataFormat, step: number = 15) => {
  const options: Array<{ label: string; value: string }> = []
  const totalMinutes = 24 * 60

  // Check if it is 12-hour format - check if format string contains 12-hour format identifier
  const is12Hour = format.toLowerCase().includes("a") || format === "12h"

  for (let i = 0; i < totalMinutes; i += step) {
    const hours = Math.floor(i / 60)
    const minutes = i % 60

    if (is12Hour) {
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      const ampm = hours < 12 ? "am" : "pm"
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

// Helper function: create today's specified time
export const createTimeToday = (hours: number, minutes: number = 0): Date => {
  return setMinutes(setHours(startOfDay(new Date()), hours), minutes)
}
