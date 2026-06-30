import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type Locale,
} from "date-fns"
import { zhCN } from "date-fns/locale"
import { getDateKey } from "./date-comparisons"
import type { CalendarValue, SelectionMode, WeekStartsOn } from "../types"
import { isSameDayInTimeZone } from "./date-comparisons"
import { resolveLocale, isChineseLocale } from "./locale"

// Use date-fns date utility functions
export const dateUtils = {
  now: () => new Date(),
  isSameDay,
  isSameMonth,
  isSameYear,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
}

// Generate weekday names (using date-fns multilingual)
export function generateWeekdayNames(
  locale: Locale | string = zhCN,
  weekStartsOn: number = 1,
): string[] {
  // 🔧 Use common locale parsing
  const safeLocale = resolveLocale(locale)

  // Use a known Sunday as the base (January 7, 2024 is Sunday)
  const baseSunday = new Date(2024, 0, 7)

  const weekdays: string[] = []
  for (let i = 0; i < 7; i++) {
    // Calculate each day starting from weekStartsOn
    const dayIndex = (weekStartsOn + i) % 7
    const day = addDays(baseSunday, dayIndex)

    // Select format based on language - use isChineseLocale to determine
    const formatPattern = isChineseLocale(safeLocale) ? "EEEEE" : "EEE"
    const dayName = format(day, formatPattern, { locale: safeLocale })
    weekdays.push(dayName)
  }

  return weekdays
}

// Generate calendar date array (using date-fns)
export function generateCalendarDays(
  currentMonth: Date,
  weekStartsOn: number = 0,
  fixedGrid: boolean = true,
): Date[] {
  const start = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: weekStartsOn as WeekStartsOn,
  })

  if (fixedGrid) {
    // Fixed return 42 days (6 rows), ensure consistent height
    const end = addDays(start, 41) // 0-41 = 42天
    return eachDayOfInterval({ start, end })
  } else {
    // Dynamically adjust row count based on actual needs
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: weekStartsOn as WeekStartsOn,
    })
    return eachDayOfInterval({ start, end })
  }
}

// Format month title (using date-fns)
export function formatMonthTitle(date: Date, locale: Locale | string = zhCN): string {
  // 🔧 Use common locale parsing
  const safeLocale = resolveLocale(locale)

  // Select format based on language - use isChineseLocale to determine
  const formatPattern = isChineseLocale(safeLocale) ? "yyyy年M月" : "MMMM yyyy"
  return format(date, formatPattern, { locale: safeLocale })
}

// Calculate week number array
export function calculateWeekNumbers(
  calendarDays: Date[],
  locale: Locale | string = zhCN,
): number[] {
  // 🔧 Use common locale parsing
  const safeLocale = resolveLocale(locale)

  const weekNumbers: number[] = []

  // Calculate week number for each 7 days (take the first day of each week)
  for (let i = 0; i < calendarDays.length; i += 7) {
    const weekFirstDay = calendarDays[i]
    const weekNumber = getWeek(weekFirstDay, {
      locale: safeLocale,
      weekStartsOn: 1, // ISO week number standard, week starts on Monday
    })
    weekNumbers.push(weekNumber)
  }

  return weekNumbers
}

/**
 * Infer selection mode based on value type
 */
export function inferSelectionMode(value: CalendarValue): SelectionMode {
  if (value === undefined || value === null) {
    return "single"
  }
  if (Array.isArray(value)) {
    return "multiple"
  }
  if (typeof value === "object" && "start" in value && "end" in value) {
    return "range"
  }
  return "single"
}

/**
 * Infer month from CalendarValue
 */
export function inferMonthFromValue(value: CalendarValue): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    // Take the last selected date, usually the user is most interested in
    return value[value.length - 1]
  }

  if (typeof value === "object" && "start" in value) {
    // Display the month of the start date when range selection
    return value.start
  }

  return null
}

/**
 * Compare two CalendarValue for equality (supports time zone aware and comparison precision)
 */
export function isCalendarValueEqual(
  a: CalendarValue,
  b: CalendarValue,
  timeZone?: string,
  dateComparisonMode: "exact-time" | "date-only" = "date-only",
): boolean {
  if (a === b) return true
  if (!a || !b) return a === b

  // Date type comparison - select strategy based on comparison mode
  if (a instanceof Date && b instanceof Date) {
    if (dateComparisonMode === "date-only") {
      return isSameDayInTimeZone(a, b, timeZone)
    } else {
      // exact-time mode: compare full timestamp (consider time zone)
      return getDateKey(a, timeZone, true) === getDateKey(b, timeZone, true)
    }
  }

  // Array type comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((dateA, index) => {
      const dateB = b[index]
      if (!(dateA instanceof Date && dateB instanceof Date)) return false

      if (dateComparisonMode === "date-only") {
        return isSameDayInTimeZone(dateA, dateB, timeZone)
      } else {
        return getDateKey(dateA, timeZone, true) === getDateKey(dateB, timeZone, true)
      }
    })
  }

  // DateRange type comparison - select strategy based on comparison mode
  if (typeof a === "object" && "start" in a && typeof b === "object" && "start" in b) {
    if (dateComparisonMode === "date-only") {
      return (
        isSameDayInTimeZone(a.start, b.start, timeZone) &&
        isSameDayInTimeZone(a.end, b.end, timeZone)
      )
    } else {
      return (
        getDateKey(a.start, timeZone, true) === getDateKey(b.start, timeZone, true) &&
        getDateKey(a.end, timeZone, true) === getDateKey(b.end, timeZone, true)
      )
    }
  }

  return false
}
