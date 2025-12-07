import { isDate, isValid } from "date-fns"

export const yearUtils = {
  extractYear(input: Date | number | undefined): number | undefined {
    if (isDate(input) && isValid(input)) {
      return input.getFullYear()
    }
    if (typeof input === "number" && Number.isFinite(input)) {
      return input
    }
    return undefined
  },

  /** 创建年份的开始日期 */
  createYearDate(year: number): Date {
    return new Date(year, 0, 1)
  },

  /** 获取当前年份 */
  getCurrentYear(): number {
    return new Date().getFullYear()
  },

  /** 验证年份是否在有效范围内 */
  isYearInRange(year: number, minYear?: number, maxYear?: number): boolean {
    const minValid = minYear === undefined || year >= minYear
    const maxValid = maxYear === undefined || year <= maxYear
    return minValid && maxValid
  },
}
