import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfWeek,
  type Locale,
} from "date-fns"
import { zhCN } from "date-fns/locale"
import { getDateKey } from "./date-comparisons"
import { CalendarValue, SelectionMode } from "../month/types"
import { isSameDayInTimeZone } from "./date-comparisons"
import { resolveLocale, isChineseLocale } from "./locale"

// 使用 date-fns 的日期工具函数
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
}

// 生成星期名称（使用 date-fns 多语言）
export function generateWeekdayNames(
  locale: Locale | string = zhCN,
  weekStartsOn: number = 1,
): string[] {
  // 🔧 使用公用的 locale 解析
  const safeLocale = resolveLocale(locale)

  // 使用一个已知的周日作为基准（2024年1月7日是周日）
  const baseSunday = new Date(2024, 0, 7)

  const weekdays: string[] = []
  for (let i = 0; i < 7; i++) {
    // 计算从weekStartsOn开始的每一天
    const dayIndex = (weekStartsOn + i) % 7
    const day = addDays(baseSunday, dayIndex)

    // 根据语言选择格式 - 使用 isChineseLocale 判断
    const formatPattern = isChineseLocale(safeLocale) ? "EEEEE" : "EEE"
    const dayName = format(day, formatPattern, { locale: safeLocale })
    weekdays.push(dayName)
  }

  return weekdays
}

// 生成日历日期数组（使用 date-fns）
export function generateCalendarDays(
  currentMonth: Date,
  weekStartsOn: number = 0,
  fixedGrid: boolean = true,
): Date[] {
  const start = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6,
  })

  if (fixedGrid) {
    // 固定返回42天（6行），确保高度一致
    const end = addDays(start, 41) // 0-41 = 42天
    return eachDayOfInterval({ start, end })
  } else {
    // 根据实际需要动态调整行数
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    })
    return eachDayOfInterval({ start, end })
  }
}

// 格式化月份标题（使用 date-fns）
export function formatMonthTitle(date: Date, locale: Locale | string = zhCN): string {
  // 🔧 使用公用的 locale 解析
  const safeLocale = resolveLocale(locale)

  // 根据语言选择格式 - 使用 isChineseLocale 判断
  const formatPattern = isChineseLocale(safeLocale) ? "yyyy年M月" : "MMMM yyyy"
  return format(date, formatPattern, { locale: safeLocale })
}

// 计算周数数组
export function calculateWeekNumbers(
  calendarDays: Date[],
  locale: Locale | string = zhCN,
): number[] {
  // 🔧 使用公用的 locale 解析
  const safeLocale = resolveLocale(locale)

  const weekNumbers: number[] = []

  // 每7天计算一次周数（取每周的第一天）
  for (let i = 0; i < calendarDays.length; i += 7) {
    const weekFirstDay = calendarDays[i]
    const weekNumber = getWeek(weekFirstDay, {
      locale: safeLocale,
      weekStartsOn: 1, // ISO周数标准，周一开始
    })
    weekNumbers.push(weekNumber)
  }

  return weekNumbers
}

/**
 * 根据值类型推断选择模式
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
 * 从 CalendarValue 推断应该显示的月份
 */
export function inferMonthFromValue(value: CalendarValue): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    // 取最后选择的日期，通常是用户最关心的
    return value[value.length - 1]
  }

  if (typeof value === "object" && "start" in value) {
    // 范围选择时显示开始日期所在的月份
    return value.start
  }

  return null
}

/**
 * 比较两个 CalendarValue 是否相等（支持时区感知和比较精度）
 */
export function isCalendarValueEqual(
  a: CalendarValue,
  b: CalendarValue,
  timeZone?: string,
  dateComparisonMode: "exact-time" | "date-only" = "date-only",
): boolean {
  if (a === b) return true
  if (!a || !b) return a === b

  // Date 类型比较 - 根据比较模式选择策略
  if (a instanceof Date && b instanceof Date) {
    if (dateComparisonMode === "date-only") {
      return isSameDayInTimeZone(a, b, timeZone)
    } else {
      // exact-time 模式：比较完整时间戳（考虑时区）
      return getDateKey(a, timeZone, true) === getDateKey(b, timeZone, true)
    }
  }

  // Array 类型比较
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

  // DateRange 类型比较 - 根据比较模式选择策略
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
