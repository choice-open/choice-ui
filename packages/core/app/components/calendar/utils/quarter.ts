import { format, isDate, isValid, type Locale } from "date-fns"
import { zhCN } from "date-fns/locale"
import { resolveLocale, isChineseLocale } from "./locale"

export interface Quarter {
  label: string
  months: string[]
  quarter: number // 1, 2, 3, 4
  year: number
}

// 季度处理工具函数
export const quarterUtils = {
  /** 安全地从各种输入中提取年份数字 */
  extractYear(input: Date | number | undefined): number | undefined {
    if (isDate(input) && isValid(input)) {
      return input.getFullYear()
    }
    if (typeof input === "number" && Number.isFinite(input)) {
      return input
    }
    return undefined
  },

  /** 获取当前年份 */
  getCurrentYear(): number {
    return new Date().getFullYear()
  },

  /** 获取当前季度数字 (1-4) */
  getCurrentQuarterNumber(): number {
    const currentMonth = new Date().getMonth() + 1 // 1-12
    return Math.ceil(currentMonth / 3)
  },

  /** 验证年份是否在有效范围内 */
  isYearInRange(year: number, minYear?: number, maxYear?: number): boolean {
    const minValid = minYear === undefined || year >= minYear
    const maxValid = maxYear === undefined || year <= maxYear
    return minValid && maxValid
  },

  /** 创建季度的开始日期 */
  createQuarterStartDate(quarter: number, year: number): Date {
    const startMonth = (quarter - 1) * 3
    return new Date(year, startMonth, 1)
  },

  /** 创建季度的结束日期 */
  createQuarterEndDate(quarter: number, year: number): Date {
    const endMonth = (quarter - 1) * 3 + 2
    return new Date(year, endMonth + 1, 0) // 下月第0天 = 本月最后一天
  },
}

/** 获取季度的月份名称 */
export function getQuarterMonths(quarter: number, locale: Locale | string = zhCN): string[] {
  const safeLocale = resolveLocale(locale)
  const quarterStartMonth = (quarter - 1) * 3 // 0, 3, 6, 9

  const months: string[] = []
  for (let i = 0; i < 3; i++) {
    const monthIndex = quarterStartMonth + i
    // 创建该月份的第一天的日期
    const date = new Date(2024, monthIndex, 1) // 年份不重要，只用来格式化月份名

    // 根据语言环境格式化月份名
    const monthFormat = isChineseLocale(safeLocale) ? "MMMM" : "MMM"
    const monthName = format(date, monthFormat, { locale: safeLocale })
    months.push(monthName)
  }

  return months
}

/** 创建季度对象 */
export function createQuarter(
  quarter: number,
  year: number,
  locale: Locale | string = zhCN,
): Quarter {
  const safeLocale = resolveLocale(locale)

  // 动态生成季度标签
  const quarterLabels: Record<string, (q: number) => string> = {
    "zh-CN": (q: number) => `${["一", "二", "三", "四"][q - 1]}季度`,
    "en-US": (q: number) => `Q${q}`,
    "ja-JP": (q: number) => `第${q}四半期`,
    "ko-KR": (q: number) => `${q}분기`,
    "fr-FR": (q: number) => `T${q}`,
    "de-DE": (q: number) => `Q${q}`,
    "es-ES": (q: number) => `T${q}`,
  }

  const localeCode = safeLocale.code || "en-US"
  const labelGenerator = quarterLabels[localeCode] || quarterLabels["en-US"]
  const label = labelGenerator(quarter)
  const months = getQuarterMonths(quarter, locale)

  return {
    quarter,
    year,
    label,
    months,
  }
}

/** 获取当前季度 */
export function getCurrentQuarter(year?: number, locale: Locale | string = zhCN): Quarter {
  const currentYear = year ?? quarterUtils.getCurrentYear()
  const currentQuarter = quarterUtils.getCurrentQuarterNumber()

  return createQuarter(currentQuarter, currentYear, locale)
}

/** 获取年份的所有季度 */
export function getYearQuarters(year: number, locale: Locale | string = zhCN): Quarter[] {
  return [1, 2, 3, 4].map((quarter) => createQuarter(quarter, year, locale))
}

/** 检查两个季度是否相等 */
export function isQuarterEqual(quarter1: Quarter, quarter2: Quarter): boolean {
  return quarter1.quarter === quarter2.quarter && quarter1.year === quarter2.year
}

/** 格式化季度显示 */
export function formatQuarter(quarter: Quarter): string {
  return `${quarter.year}年 ${quarter.label}`
}

/** 获取季度的日期范围 */
export function getQuarterDateRange(quarter: Quarter): { end: Date; start: Date } {
  const start = quarterUtils.createQuarterStartDate(quarter.quarter, quarter.year)
  const end = quarterUtils.createQuarterEndDate(quarter.quarter, quarter.year)

  return { start, end }
}
