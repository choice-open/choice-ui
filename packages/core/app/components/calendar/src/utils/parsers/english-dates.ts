import { isValid } from "date-fns"
import { parseMonthName } from "./month-names"

// 增强的英文日期解析
export function parseEnglishDate(input: string): Date | null {
  const normalized = input.toLowerCase().trim()
  const now = new Date()
  const currentYear = now.getFullYear()

  // 模式1: "may 15, 2024" 或 "may 15 2024" 或 "15 may 2024" 或 "15th may 2024" (包含年份，优先匹配)
  const fullDatePattern =
    /^(?:([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})|(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\s+(\d{4}))$/
  const fullDateMatch = normalized.match(fullDatePattern)

  if (fullDateMatch) {
    const monthName = fullDateMatch[1] || fullDateMatch[5]
    const dayStr = fullDateMatch[2] || fullDateMatch[4]
    const yearStr = fullDateMatch[3] || fullDateMatch[6]

    const month = parseMonthName(monthName)
    const day = parseInt(dayStr, 10)
    const year = parseInt(yearStr, 10)

    if (month && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
      const date = new Date(year, month - 1, day)
      if (isValid(date) && date.getDate() === day) {
        return date
      }
    }
  }

  // 模式2: "may 15" 或 "may 15th" 或 "15 may" 或 "15th may" (不包含年份)
  const monthDayPattern =
    /^(?:([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?|(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+))$/
  const monthDayMatch = normalized.match(monthDayPattern)

  if (monthDayMatch) {
    const monthName = monthDayMatch[1] || monthDayMatch[4]
    const dayStr = monthDayMatch[2] || monthDayMatch[3]

    const month = parseMonthName(monthName)
    const day = parseInt(dayStr, 10)

    if (month && day >= 1 && day <= 31) {
      const date = new Date(currentYear, month - 1, day)
      if (isValid(date) && date.getDate() === day) {
        return date
      }
    }
  }

  // 模式3: 只输入月份名 "may" → 当年5月1日
  const monthOnlyPattern = /^[a-z]{3,}$/
  if (monthOnlyPattern.test(normalized)) {
    const month = parseMonthName(normalized)

    if (month) {
      const date = new Date(currentYear, month - 1, 1)

      if (isValid(date)) {
        return date
      }
    }
  }

  return null
}
