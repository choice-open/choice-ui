import {
  startOfDay,
  addDays,
  subDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  startOfMonth,
  addMonths,
  subMonths,
  startOfYear,
  addYears,
  subYears,
} from "date-fns"
import { naturalLanguageMap, defaultLocaleMap } from "./constants"
import { type Locale } from "date-fns"

// 解析自然语言日期
export function parseNaturalLanguage(input: string, localeKey: string = "zh-CN"): Date | null {
  const normalizedInput = input.toLowerCase().trim()
  const keywords = naturalLanguageMap[localeKey] || naturalLanguageMap["en-US"]
  const now = new Date()
  const locale = defaultLocaleMap[localeKey]

  // 检查各种自然语言关键词
  for (const [key, values] of Object.entries(keywords)) {
    for (const value of values) {
      if (normalizedInput.includes(value.toLowerCase())) {
        switch (key) {
          case "today":
            return startOfDay(now)
          case "tomorrow":
            return startOfDay(addDays(now, 1))
          case "yesterday":
            return startOfDay(subDays(now, 1))
          case "thisWeek":
            return startOfWeek(now, { locale })
          case "nextWeek":
            return startOfWeek(addWeeks(now, 1), { locale })
          case "lastWeek":
            return startOfWeek(subWeeks(now, 1), { locale })
          case "thisMonth":
            return startOfMonth(now)
          case "nextMonth":
            return startOfMonth(addMonths(now, 1))
          case "lastMonth":
            return startOfMonth(subMonths(now, 1))
          case "thisYear":
            return startOfYear(now)
          case "nextYear":
            return startOfYear(addYears(now, 1))
          case "lastYear":
            return startOfYear(subYears(now, 1))
          case "now":
            return now
        }
      }
    }
  }

  return null
}

// 获取语言环境key
export function getLocaleKey(locale?: Locale): string {
  if (!locale) return "en-US"

  // 查找对应的 key
  for (const [key, value] of Object.entries(defaultLocaleMap)) {
    if (value === locale) {
      return key
    }
  }

  return "en-US"
}
