import { format, type Locale } from "date-fns"
import { zhCN, enUS, ja, ko, fr, de, es } from "date-fns/locale"
import type { Quarter } from "./types"

// 语言环境映射
const localeMap: Record<string, Locale> = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": ja,
  "ko-KR": ko,
  "fr-FR": fr,
  "de-DE": de,
  "es-ES": es,
}

// 获取季度的月份
export function getQuarterMonths(quarter: number, locale: string = "zh-CN"): string[] {
  const dateLocale = localeMap[locale] || localeMap["zh-CN"]
  const quarterStartMonth = (quarter - 1) * 3 // 0, 3, 6, 9

  const months: string[] = []
  for (let i = 0; i < 3; i++) {
    const monthIndex = quarterStartMonth + i
    // 创建该月份的第一天的日期
    const date = new Date(2024, monthIndex, 1) // 年份不重要，只用来格式化月份名

    // 根据语言环境格式化月份名
    let monthFormat = "MMM" // 默认缩写格式
    if (locale === "zh-CN") {
      monthFormat = "MMMM" // 中文使用完整月份名
    }

    const monthName = format(date, monthFormat, { locale: dateLocale })
    months.push(monthName)
  }

  return months
}

// 创建季度对象
export function createQuarter(quarter: number, year: number, locale: string = "zh-CN"): Quarter {
  // 动态生成季度标签
  const quarterLabels: Record<string, (q: number) => string> = {
    "zh-CN": (q: number) => `第${["一", "二", "三", "四"][q - 1]}季度`,
    "en-US": (q: number) => `Q${q}`,
    "ja-JP": (q: number) => `第${q}四半期`,
    "ko-KR": (q: number) => `${q}분기`,
    "fr-FR": (q: number) => `T${q}`,
    "de-DE": (q: number) => `Q${q}`,
    "es-ES": (q: number) => `T${q}`,
  }

  const labelGenerator = quarterLabels[locale] || quarterLabels["en-US"]
  const label = labelGenerator(quarter)
  const months = getQuarterMonths(quarter, locale)

  return {
    quarter,
    year,
    label,
    months,
  }
}

// 获取当前季度
export function getCurrentQuarter(year?: number, locale: string = "zh-CN"): Quarter {
  const now = new Date()
  const currentYear = year ?? now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentQuarter = Math.ceil(currentMonth / 3)

  return createQuarter(currentQuarter, currentYear, locale)
}

// 获取年份的所有季度
export function getYearQuarters(year: number, locale: string = "zh-CN"): Quarter[] {
  return [1, 2, 3, 4].map((quarter) => createQuarter(quarter, year, locale))
}

// 检查两个季度是否相等
export function isQuarterEqual(quarter1: Quarter, quarter2: Quarter): boolean {
  return quarter1.quarter === quarter2.quarter && quarter1.year === quarter2.year
}

// 格式化季度显示
export function formatQuarter(quarter: Quarter): string {
  return `${quarter.year}年 ${quarter.label}`
}

// 获取季度的日期范围
export function getQuarterDateRange(quarter: Quarter): { end: Date; start: Date } {
  const year = quarter.year
  const startMonth = (quarter.quarter - 1) * 3
  const endMonth = startMonth + 2

  const start = new Date(year, startMonth, 1)
  const end = new Date(year, endMonth + 1, 0) // 下月第0天 = 本月最后一天

  return { start, end }
}
