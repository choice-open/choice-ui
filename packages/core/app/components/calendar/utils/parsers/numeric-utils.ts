/**
 * 数字解析统一工具函数
 * 用于消除parsers中的重复代码
 */

import { smartCorrectDate } from "./validators"

/** 提取纯数字字符串 */
export function extractDigits(input: string): string {
  return input.replace(/[^\d]/g, "")
}

/** 数字段提取器 */
export class DigitExtractor {
  constructor(private digits: string) {}

  /** 提取指定位置的数字 */
  extract(start: number, length: number): number {
    return parseInt(this.digits.substring(start, start + length), 10)
  }

  /** 提取年份 (前2位) */
  getYear2(): number {
    return this.extract(0, 2)
  }

  /** 提取年份 (前4位) */
  getYear4(): number {
    return this.extract(0, 4)
  }

  /** 提取月份 (前2位) */
  getMonth(): number {
    return this.extract(0, 2)
  }

  /** 提取日期 (第3-4位) */
  getDay(): number {
    return this.extract(2, 2)
  }

  /** 提取6位数字的各个部分 (YYMMDD格式) */
  getYYMMDD(): { day: number; month: number; year: number } {
    return {
      year: this.extract(0, 2),
      month: this.extract(2, 2),
      day: this.extract(4, 2),
    }
  }

  /** 提取8位数字的各个部分 (YYYYMMDD格式) */
  getYYYYMMDD(): { day: number; month: number; year: number } {
    return {
      year: this.extract(0, 4),
      month: this.extract(4, 2),
      day: this.extract(6, 2),
    }
  }

  /** 提取3位数字的各个部分 */
  get3DigitParts(): { first: number; lastTwo: number } {
    return {
      first: this.extract(0, 1),
      lastTwo: this.extract(1, 2),
    }
  }
}

/** 年份转换工具 */
export function convertTwoDigitYear(year: number): number {
  return year < 50 ? 2000 + year : 1900 + year
}

/** 检查是否为有效的月日组合 */
export function isValidMonthDay(month: number, day: number): boolean {
  return month >= 1 && month <= 12 && day >= 1 && day <= 31
}

/** 检查3位数字是否可以解释为月日 */
export function canBeMonthDay(firstDigit: number, lastTwoDigits: number): boolean {
  return firstDigit >= 1 && firstDigit <= 12 && lastTwoDigits >= 1 && lastTwoDigits <= 31
}

/** 检查是否为合理的年份 */
export function isReasonableYear(year: number): boolean {
  return year >= 1950 && year <= 2100
}

/** 数字解析结果 */
export interface NumericParseResult {
  day: number
  formatted: string
  month: number
  year: number
}

/** 通用的6位数字解析器 (YYMMDD) */
export function parseYYMMDD(digits: string, targetFormat: string): NumericParseResult | null {
  const extractor = new DigitExtractor(digits)
  const { year: yy, month, day } = extractor.getYYMMDD()

  if (!isValidMonthDay(month, day)) {
    return null
  }

  const fullYear = convertTwoDigitYear(yy)
  const corrected = smartCorrectDate(fullYear, month, day)

  let formatted: string
  if (targetFormat === "yyyy-MM-dd") {
    formatted = `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
  } else if (targetFormat === "MM/dd/yyyy") {
    formatted = `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
  } else {
    return null
  }

  return {
    year: corrected.year,
    month: corrected.month,
    day: corrected.day,
    formatted,
  }
}

/** 通用的8位数字解析器 (YYYYMMDD) */
export function parseYYYYMMDD(digits: string, targetFormat: string): NumericParseResult | null {
  const extractor = new DigitExtractor(digits)
  const { year, month, day } = extractor.getYYYYMMDD()

  if (!isReasonableYear(year)) {
    return null
  }

  const corrected = smartCorrectDate(year, month, day)

  let formatted: string
  if (targetFormat === "yyyy-MM-dd") {
    formatted = `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
  } else if (targetFormat === "MM/dd/yyyy") {
    formatted = `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
  } else {
    return null
  }

  return {
    year: corrected.year,
    month: corrected.month,
    day: corrected.day,
    formatted,
  }
}

/** 智能的3位数字解析器 */
export function parse3Digits(
  digits: string,
  currentYear: number,
  targetFormat: string,
): NumericParseResult | null {
  const extractor = new DigitExtractor(digits)
  const { first, lastTwo } = extractor.get3DigitParts()

  if (canBeMonthDay(first, lastTwo)) {
    // 解释为月日，如 315 → 3月15日
    const corrected = smartCorrectDate(currentYear, first, lastTwo)

    let formatted: string
    if (targetFormat === "yyyy-MM-dd") {
      formatted = `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
    } else if (targetFormat === "MM/dd/yyyy") {
      formatted = `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
    } else {
      return null
    }

    return {
      year: corrected.year,
      month: corrected.month,
      day: corrected.day,
      formatted,
    }
  }

  return null
}
