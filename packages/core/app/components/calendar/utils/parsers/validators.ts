import { getDaysInMonth, isValid } from "date-fns"

// 验证日期范围
export function validateDateRange(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < minDate) return false
  if (maxDate && date > maxDate) return false
  return true
}

// 验证时间范围
export function validateTimeRange(time: string, minTime?: string, maxTime?: string): boolean {
  if (!time) return false

  const [hours, minutes] = time.split(":").map(Number)
  const timeMinutes = hours * 60 + minutes

  if (minTime) {
    const [minHours, minMinutes] = minTime.split(":").map(Number)
    const minTimeMinutes = minHours * 60 + minMinutes
    if (timeMinutes < minTimeMinutes) return false
  }

  if (maxTime) {
    const [maxHours, maxMinutes] = maxTime.split(":").map(Number)
    const maxTimeMinutes = maxHours * 60 + maxMinutes
    if (timeMinutes > maxTimeMinutes) return false
  }

  return true
}

// 日期存在性验证 - 使用 date-fns 优化
export function isValidDateExists(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false
  if (day < 1) return false

  // 使用 date-fns 检查该月的天数
  const testDate = new Date(year, month - 1, 1)
  const daysInMonth = getDaysInMonth(testDate)

  return day <= daysInMonth
}

// 获取指定年月的最后一天 - 使用 date-fns 优化
export function getLastDayOfMonth(year: number, month: number): number {
  const date = new Date(year, month - 1, 1)
  return getDaysInMonth(date)
}

// 智能日期修正 - 将无效日期修正为合理日期
export function smartCorrectDate(
  year: number,
  month: number,
  day: number,
): { day: number; month: number; year: number } {
  // 修正年份
  const correctedYear = smartCorrectYear(year)

  // 修正月份
  let correctedMonth = month
  if (month < 1) {
    correctedMonth = 1
  } else if (month > 12) {
    correctedMonth = 12
  }

  // 修正日期 - 使用 date-fns 获取准确天数
  let correctedDay = day
  if (day < 1) {
    correctedDay = 1
  } else {
    const lastDay = getLastDayOfMonth(correctedYear, correctedMonth)
    if (day > lastDay) {
      correctedDay = lastDay
    }
  }

  return {
    year: correctedYear,
    month: correctedMonth,
    day: correctedDay,
  }
}

// 智能年份纠正
export function smartCorrectYear(year: number): number {
  if (year < 1950) {
    // 1111 → 2011, 1234 → 2024, 999 → 2999, 23 → 2023
    if (year < 100) {
      return year < 50 ? 2000 + year : 1900 + year
    } else if (year < 1000) {
      return 2000 + year
    } else {
      // 1000-1949 → 2000+ (取后两位)
      return 2000 + (year % 100)
    }
  } else if (year > 2100) {
    // 太遥远的年份调整到合理范围 9999 → 2024 + 9 = 2033
    return 2024 + (year % 10)
  }
  return year
}

// 快速日期验证 - 使用 date-fns 的 isValid
export function quickValidateDate(date: Date): boolean {
  return isValid(date)
}
