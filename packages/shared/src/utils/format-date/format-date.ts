import {
  differenceInDays,
  differenceInYears,
  format,
  formatDistanceToNow,
  isThisWeek,
  isToday,
  isYesterday,
} from "date-fns"
import { getLanguageConfig } from "./format-date.i18n"
import type { FormatRelativeTimeOptions } from "./format-date.types"

/**
 * Formats a date into a human-readable relative time string with internationalization support
 *
 * @param date - The date to format
 * @param options - Configuration options for formatting
 * @returns A formatted date string
 *
 * @example
 * ```typescript
 * // Basic usage
 * formatRelativeTime(new Date()) // "a few seconds ago"
 *
 * // With Chinese locale
 * formatRelativeTime(new Date(), { language: "cn" }) // "几秒前"
 *
 * // Show specific time for recent dates
 * formatRelativeTime(new Date(), {
 *   showSpecificTime: true,
 *   language: "en"
 * }) // "Today at 2:30 PM"
 *
 * // Custom thresholds
 * formatRelativeTime(oldDate, {
 *   daysThreshold: 30,
 *   yearThreshold: 2
 * })
 * ```
 */
export const formatRelativeTime = (date: Date, options: FormatRelativeTimeOptions = {}): string => {
  // Parameter validation
  if (!date || isNaN(date.getTime())) {
    console.warn("formatRelativeTime: Invalid date provided")
    return "Invalid Date"
  }

  try {
    // Timezone handling
    const referenceTime = options.timezone?.referenceTime || new Date()
    const now = options.timezone?.useUTC
      ? new Date(referenceTime.getTime() + referenceTime.getTimezoneOffset() * 60000)
      : referenceTime

    const targetDate = options.timezone?.useUTC
      ? new Date(date.getTime() + date.getTimezoneOffset() * 60000)
      : date

    const daysThreshold = options.daysThreshold ?? 7
    const yearThreshold = options.yearThreshold ?? 1
    const daysDiff = Math.abs(differenceInDays(now, targetDate))

    // Get language configuration (cached for performance)
    const { language, locale, t } = getLanguageConfig(options.language)

    // If showing specific time format
    if (options.showSpecificTime) {
      const timeFormat = format(targetDate, "HH:mm", { locale })

      if (isToday(targetDate)) {
        return t.common.relativeTime.today({ time: timeFormat })
      }

      if (isYesterday(targetDate)) {
        return t.common.relativeTime.yesterday({ time: timeFormat })
      }

      if (isThisWeek(targetDate)) {
        const dayName = format(targetDate, "EEEE", { locale })
        return t.common.relativeTime.weekdayAt({ time: timeFormat, weekday: dayName })
      }

      // Beyond this week, show specific date and time
      const dateStr = format(targetDate, "MMM d", { locale })
      return t.common.relativeTime.dateAt({ date: dateStr, time: timeFormat })
    }

    // Original relative time logic
    // Beyond specified days, show different formats based on year difference
    if (daysDiff > daysThreshold) {
      const yearsDiff = Math.abs(differenceInYears(now, targetDate))

      if (yearsDiff >= yearThreshold) {
        // Beyond year threshold, show full date
        const customFullDateFormat = options.customFormat?.fullDate
        if (customFullDateFormat) {
          return format(targetDate, customFullDateFormat, { locale })
        }
        return format(targetDate, "yyyy/MM/dd", { locale })
      } else {
        // Beyond days threshold but within year threshold, show month and day
        const customMonthDayFormat = options.customFormat?.monthDay
        if (customMonthDayFormat) {
          return format(targetDate, customMonthDayFormat, { locale })
        }

        if (options.forceNumericFormat) {
          return format(targetDate, "MM/dd", { locale })
        }

        if (language === "cn") {
          return format(targetDate, "M月d日", { locale })
        } else {
          return format(targetDate, "MMMM d", { locale })
        }
      }
    }

    // Within specified days, show relative time
    return formatDistanceToNow(targetDate, {
      addSuffix: true,
      locale,
    })
  } catch (error) {
    console.error("formatRelativeTime: Error formatting date", error)
    return "Format Error"
  }
}

/**
 * Creates a date formatter with default configuration
 *
 * @param defaultOptions - Default options to use for all formatting operations
 * @returns A configured formatter function
 *
 * @example
 * ```typescript
 * const formatter = createDateFormatter({
 *   language: "cn",
 *   daysThreshold: 14,
 *   showSpecificTime: true
 * })
 *
 * formatter(new Date()) // Uses configured defaults
 * formatter(new Date(), { language: "en" }) // Overrides language
 * ```
 */
export const createDateFormatter = (defaultOptions: FormatRelativeTimeOptions = {}) => {
  return (date: Date, options: FormatRelativeTimeOptions = {}) => {
    return formatRelativeTime(date, { ...defaultOptions, ...options })
  }
}

/**
 * Formats a date to a simple readable format
 *
 * @param date - The date to format
 * @param options - Formatting options
 * @returns A simple formatted date string
 *
 * @example
 * ```typescript
 * formatSimpleDate(new Date()) // "Jan 15, 2024"
 * formatSimpleDate(new Date(), { language: "cn" }) // "2024年1月15日"
 * ```
 */
export const formatSimpleDate = (
  date: Date,
  options: Pick<FormatRelativeTimeOptions, "language" | "customFormat"> = {},
): string => {
  if (!date || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const { language, locale } = getLanguageConfig(options.language)

  if (options.customFormat?.fullDate) {
    return format(date, options.customFormat.fullDate, { locale })
  }

  if (language === "cn") {
    return format(date, "yyyy年M月d日", { locale })
  }

  return format(date, "MMM d, yyyy", { locale })
}

/**
 * Formats time only from a date
 *
 * @param date - The date to extract time from
 * @param options - Formatting options
 * @returns A formatted time string
 *
 * @example
 * ```typescript
 * formatTime(new Date()) // "2:30 PM"
 * formatTime(new Date(), { language: "cn" }) // "14:30"
 * ```
 */
export const formatTime = (
  date: Date,
  options: Pick<FormatRelativeTimeOptions, "language" | "customFormat"> = {},
): string => {
  if (!date || isNaN(date.getTime())) {
    return "Invalid Time"
  }

  const { language, locale } = getLanguageConfig(options.language)

  if (options.customFormat?.time) {
    return format(date, options.customFormat.time, { locale })
  }

  if (language === "cn") {
    return format(date, "HH:mm", { locale })
  }

  return format(date, "h:mm a", { locale })
}
