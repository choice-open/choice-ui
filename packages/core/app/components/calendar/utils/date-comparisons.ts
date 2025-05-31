import { tz, TZDate } from "@date-fns/tz"
import {
  isSameDay,
  isSameMonth,
  isSameYear,
  isSameWeek,
  isToday,
  isWithinInterval,
  startOfDay,
  endOfDay,
  isValid,
} from "date-fns"

// === 导出类型定义 ===

/**
 * 日期比较精度模式
 * - 'exact-time': 精确时间比较（包含时、分、秒、毫秒）
 * - 'date-only': 仅日期比较（忽略时间部分，比较年、月、日）
 */
export type DateComparisonMode = "exact-time" | "date-only"

/**
 * 时区感知的日期部分
 */
export interface DateParts {
  /** 日期（1-31） */
  day: number
  /** 月份（0-11） */
  month: number
  /** 星期几（0-6，0为周日） */
  weekday: number
  /** 年份 */
  year: number
}

// === 内部工具函数 ===

/**
 * LRU 缓存，避免重复创建 TZDate
 */
class TimeZoneCache {
  private cache = new Map<string, TZDate>()
  private maxSize = 100

  get(key: string): TZDate | undefined {
    const value = this.cache.get(key)
    if (value) {
      // LRU: 重新设置以更新访问顺序
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  set(key: string, value: TZDate): void {
    if (this.cache.size >= this.maxSize) {
      // 删除最旧的条目
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  clear(): void {
    this.cache.clear()
  }
}

const tzDateCache = new TimeZoneCache()

/**
 * 创建时区感知的日期对象（带缓存）
 */
function createTZDateCached(date: Date, timeZone: string): TZDate {
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${date}`)
  }

  try {
    const cacheKey = `${date.getTime()}-${timeZone}`
    let tzDate = tzDateCache.get(cacheKey)

    if (!tzDate) {
      tzDate = tz(timeZone)(date) as TZDate
      tzDateCache.set(cacheKey, tzDate)
    }

    return tzDate
  } catch (error) {
    console.warn(`Invalid timezone: ${timeZone}, falling back to local timezone`)
    return date as TZDate
  }
}

/**
 * 创建时区上下文选项（用于 date-fns 4.0+）
 */
export function createTimeZoneContext(timeZone?: string) {
  if (!timeZone) return undefined

  try {
    return { in: tz(timeZone) }
  } catch (error) {
    console.warn(`Invalid timezone: ${timeZone}, using default context`)
    return undefined
  }
}

// === 核心比较函数 ===

/**
 * 时区感知的日期比较（仅比较日期部分）
 *
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @param timeZone 时区（可选，默认使用本地时区）
 * @returns 是否为同一天
 *
 * @example
 * ```typescript
 * const date1 = new Date('2025-01-15T23:30:00Z')    // UTC
 * const date2 = new Date('2025-01-16T08:30:00+09:00') // JST (同一天)
 * isSameDayInTimeZone(date1, date2, 'Asia/Tokyo') // true
 * ```
 */
export function isSameDayInTimeZone(date1: Date, date2: Date, timeZone?: string): boolean {
  if (!isValid(date1) || !isValid(date2)) return false
  if (!timeZone) return isSameDay(date1, date2)

  try {
    const tz1 = createTZDateCached(date1, timeZone)
    const tz2 = createTZDateCached(date2, timeZone)
    return isSameDay(tz1, tz2)
  } catch (error) {
    console.warn("Date comparison failed, falling back to local timezone:", error)
    return isSameDay(date1, date2)
  }
}

/**
 * 时区感知的月份比较
 */
export function isSameMonthInTimeZone(date1: Date, date2: Date, timeZone?: string): boolean {
  if (!isValid(date1) || !isValid(date2)) return false
  if (!timeZone) return isSameMonth(date1, date2)

  try {
    const tz1 = createTZDateCached(date1, timeZone)
    const tz2 = createTZDateCached(date2, timeZone)
    return isSameMonth(tz1, tz2)
  } catch (error) {
    console.warn("Month comparison failed, falling back to local timezone:", error)
    return isSameMonth(date1, date2)
  }
}

/**
 * 时区感知的年份比较
 */
export function isSameYearInTimeZone(date1: Date, date2: Date, timeZone?: string): boolean {
  if (!isValid(date1) || !isValid(date2)) return false
  if (!timeZone) return isSameYear(date1, date2)

  try {
    const tz1 = createTZDateCached(date1, timeZone)
    const tz2 = createTZDateCached(date2, timeZone)
    return isSameYear(tz1, tz2)
  } catch (error) {
    console.warn("Year comparison failed, falling back to local timezone:", error)
    return isSameYear(date1, date2)
  }
}

/**
 * 时区感知的星期比较
 */
export function isSameWeekInTimeZone(date1: Date, date2: Date, timeZone?: string): boolean {
  if (!isValid(date1) || !isValid(date2)) return false
  if (!timeZone) return isSameWeek(date1, date2)

  try {
    const tz1 = createTZDateCached(date1, timeZone)
    const tz2 = createTZDateCached(date2, timeZone)
    return isSameWeek(tz1, tz2)
  } catch (error) {
    console.warn("Week comparison failed, falling back to local timezone:", error)
    return isSameWeek(date1, date2)
  }
}

/**
 * 时区感知的今天判断
 */
export function isTodayInTimeZone(date: Date, timeZone?: string): boolean {
  if (!isValid(date)) return false

  const contextOptions = createTimeZoneContext(timeZone)
  return isToday(date, contextOptions)
}

/**
 * 判断日期是否在指定范围内（支持时区和比较模式）
 *
 * @param date 要检查的日期
 * @param rangeStart 范围开始日期
 * @param rangeEnd 范围结束日期
 * @param timeZone 时区（可选）
 * @param mode 比较模式（默认仅日期）
 * @returns 是否在范围内
 *
 * @example
 * ```typescript
 * const date = new Date('2025-01-15T14:30:00')
 * const start = new Date('2025-01-10T00:00:00')
 * const end = new Date('2025-01-20T23:59:59')
 *
 * isWithinRange(date, start, end, 'Asia/Shanghai', 'date-only') // true
 * ```
 */
export function isWithinRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date,
  timeZone?: string,
  mode: DateComparisonMode = "date-only",
): boolean {
  if (!isValid(date) || !isValid(rangeStart) || !isValid(rangeEnd)) return false

  const contextOptions = createTimeZoneContext(timeZone)

  try {
    if (mode === "exact-time") {
      // 精确时间比较
      const interval = { start: rangeStart, end: rangeEnd }
      return isWithinInterval(date, interval, contextOptions)
    } else {
      // 仅日期比较：将所有日期转换为当天的开始和结束时间
      const dateStart = startOfDay(date, contextOptions)
      const rangeStartDay = startOfDay(rangeStart, contextOptions)
      const rangeEndDay = endOfDay(rangeEnd, contextOptions)

      const interval = { start: rangeStartDay, end: rangeEndDay }
      return isWithinInterval(dateStart, interval, contextOptions)
    }
  } catch (error) {
    console.warn("Range comparison failed:", error)
    return false
  }
}

// === 实用工具函数 ===

/**
 * 获取时区感知的详细日期部分
 */
export function getDateParts(date: Date, timeZone?: string): DateParts {
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${date}`)
  }

  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      weekday: date.getDay(),
    }
  }

  try {
    const tzDate = createTZDateCached(date, timeZone)
    return {
      year: tzDate.getFullYear(),
      month: tzDate.getMonth(),
      day: tzDate.getDate(),
      weekday: tzDate.getDay(),
    }
  } catch (error) {
    console.warn("Failed to get date parts with timezone, using local timezone:", error)
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      weekday: date.getDay(),
    }
  }
}

/**
 * 获取日期的唯一键（用于 Map/Set 等数据结构）
 *
 * @param date 日期对象
 * @param timeZone 时区（可选）
 * @param includeTime 是否包含时间部分（默认false）
 * @returns 格式化的日期键
 *
 * @example
 * ```typescript
 * getDateKey(new Date('2025-01-15'), 'Asia/Shanghai') // "2025-01-15"
 * getDateKey(new Date('2025-01-15T14:30:00'), 'Asia/Shanghai', true) // "2025-01-15T14:30:00"
 * ```
 */
export function getDateKey(date: Date, timeZone?: string, includeTime = false): string {
  if (!isValid(date)) {
    throw new Error(`Invalid date: ${date}`)
  }

  const { year, month, day } = getDateParts(date, timeZone)
  const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

  if (!includeTime) return dateKey

  // 包含时间部分
  const timeKey = timeZone
    ? createTZDateCached(date, timeZone).toISOString().split("T")[1]
    : date.toISOString().split("T")[1]

  return `${dateKey}T${timeKey}`
}

/**
 * 批量比较日期数组是否相等（时区感知）
 */
export function areDatesEqual(
  dates1: Date[],
  dates2: Date[],
  timeZone?: string,
  mode: DateComparisonMode = "date-only",
): boolean {
  if (dates1.length !== dates2.length) return false

  return dates1.every((date1, index) => {
    const date2 = dates2[index]
    if (!isValid(date1) || !isValid(date2)) return false

    if (mode === "date-only") {
      return isSameDayInTimeZone(date1, date2, timeZone)
    } else {
      // exact-time 比较
      return getDateKey(date1, timeZone, true) === getDateKey(date2, timeZone, true)
    }
  })
}

/**
 * 清除时区日期缓存（用于测试或内存管理）
 */
export function clearTimeZoneCache(): void {
  tzDateCache.clear()
}
