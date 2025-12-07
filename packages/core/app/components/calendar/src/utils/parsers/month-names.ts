import { format, type Locale } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"

// 动态生成月份映射
function generateMonthMapping(locale: Locale, patterns: string[]): Record<string, number> {
  const mapping: Record<string, number> = {}

  for (let month = 0; month < 12; month++) {
    const date = new Date(2024, month, 1) // 使用固定年份

    for (const pattern of patterns) {
      const monthName = format(date, pattern, { locale }).toLowerCase()
      mapping[monthName] = month + 1
    }
  }

  return mapping
}

// 缓存生成的映射
let englishMonthsCache: Record<string, number> | null = null
let chineseMonthsCache: Record<string, number> | null = null

// 获取英文月份映射
function getEnglishMonths(): Record<string, number> {
  if (!englishMonthsCache) {
    englishMonthsCache = {
      ...generateMonthMapping(enUS, ["MMMM", "MMM", "MMM."]), // 全称、缩写、带点缩写
      // 常见变体
      sept: 9,
      "sept.": 9,
    }
  }
  return englishMonthsCache
}

// 获取中文月份映射
function getChineseMonths(): Record<string, number> {
  if (!chineseMonthsCache) {
    chineseMonthsCache = {
      ...generateMonthMapping(zhCN, ["MMMM", "M月"]), // 中文月份名和数字月份
    }
  }
  return chineseMonthsCache
}

// 智能月份识别
export function parseMonthName(input: string, locale?: string): number | null {
  const normalized = input.toLowerCase().trim()

  // 根据 locale 选择映射表
  const isChineseLocale = locale === "zh-CN" || /[\u4e00-\u9fff]/.test(input)

  if (isChineseLocale) {
    const chineseMonths = getChineseMonths()

    if (chineseMonths[normalized]) {
      return chineseMonths[normalized]
    }
  }

  // 英文月份检查
  const englishMonths = getEnglishMonths()

  if (englishMonths[normalized]) {
    return englishMonths[normalized]
  }

  // 模糊匹配英文月份（至少2个字符）
  if (normalized.length >= 2) {
    for (const [monthName, monthNum] of Object.entries(englishMonths)) {
      if (monthName.startsWith(normalized) && monthName.length >= normalized.length) {
        return monthNum
      }
    }
  }

  return null
}

// 导出兼容的接口（向后兼容）
export const englishMonths = new Proxy(
  {},
  {
    get: () => getEnglishMonths(),
  },
) as Record<string, number>

export const chineseMonths = new Proxy(
  {},
  {
    get: () => getChineseMonths(),
  },
) as Record<string, number>
