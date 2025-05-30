import { format, isValid, parse, type Locale } from "date-fns"
import type { DateFormat } from "../../date-input/types"
import { parseEnglishDate } from "./english-dates"
import { getLocaleKey, parseNaturalLanguage } from "./natural-language"
import { parseExtendedRelativeDate, parseRelativeDate } from "./relative-dates"
import { handleShortcuts } from "./shortcuts"
import { isValidDateExists, smartCorrectYear } from "./validators"

// 宽松的日期解析 - 尝试猜测用户意图并自动补全
export function tryRelaxedParsing(
  input: string,
  targetFormat: DateFormat,
  locale: Locale,
): Date | null {
  const trimmedInput = input.trim()
  if (!trimmedInput) return null

  const now = new Date()
  const currentYear = now.getFullYear().toString()
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0")
  const currentDay = now.getDate().toString().padStart(2, "0")

  try {
    // 1. 首先检查快捷键
    const shortcutDate = handleShortcuts(trimmedInput)
    if (shortcutDate) return shortcutDate

    // 2. 检查扩展相对日期
    const relativeDate = parseExtendedRelativeDate(trimmedInput)
    if (relativeDate) return relativeDate

    // 3. 处理纯数字输入
    const digitOnlyInput = trimmedInput.replace(/[^\d]/g, "")

    if (!/^\d+$/.test(digitOnlyInput)) {
      // 非纯数字，尝试其他解析方式
      return tryOtherFormats(trimmedInput, targetFormat, locale)
    }

    const length = digitOnlyInput.length
    let tempDisplayValue = ""

    // 根据目标格式和输入长度构建日期字符串
    if (targetFormat === "yyyy-MM-dd") {
      tempDisplayValue = buildYYYYMMDDFormat(
        digitOnlyInput,
        length,
        currentYear,
        currentMonth,
        currentDay,
      )
    } else if (targetFormat === "MM/dd/yyyy") {
      tempDisplayValue = buildMMDDYYYYFormat(
        digitOnlyInput,
        length,
        currentYear,
        currentMonth,
        currentDay,
      )
    } else {
      // 其他格式，使用通用逻辑
      return tryOtherFormats(trimmedInput, targetFormat, locale)
    }

    // 尝试解析构建的日期字符串
    const parsedDate = parse(tempDisplayValue, targetFormat, new Date(), { locale })
    if (isValid(parsedDate)) {
      return parsedDate
    }
  } catch (error) {
    // 解析失败
  }

  return null
}

// 构建 yyyy-MM-dd 格式
function buildYYYYMMDDFormat(
  digitOnlyInput: string,
  length: number,
  currentYear: string,
  currentMonth: string,
  currentDay: string,
): string {
  if (length === 1) {
    // 1位：用作年份个位数，如 5 → 2025-03-15
    return `${currentYear.substring(0, 3)}${digitOnlyInput}-${currentMonth}-${currentDay}`
  } else if (length === 2) {
    // 2位：用作年份后两位，如 25 → 2025-03-15
    return `${currentYear.substring(0, 2)}${digitOnlyInput}-${currentMonth}-${currentDay}`
  } else if (length === 3) {
    // 3位：用作年份后三位，如 025 → 2025-03-15
    return `${digitOnlyInput}${currentYear.substring(3, 4)}-${currentMonth}-${currentDay}`
  } else if (length === 4) {
    // 4位：智能判断是年份还是MMDD
    const asYear = parseInt(digitOnlyInput, 10)
    const asMonth = parseInt(digitOnlyInput.substring(0, 2), 10)
    const asDay = parseInt(digitOnlyInput.substring(2, 4), 10)

    const isReasonableYear = asYear >= 1950 && asYear <= 2100
    const isValidMMDD = asMonth >= 1 && asMonth <= 12 && asDay >= 1 && asDay <= 31

    if (isReasonableYear && !isValidMMDD) {
      // 当作年份处理，如 2024 → 2024年当前月日
      const year = smartCorrectYear(asYear)
      return `${year}-${currentMonth}-${currentDay}`
    } else if (isValidMMDD) {
      // 当作MMDD处理，如 1212 → 当年12月12日
      return `${currentYear}-${asMonth.toString().padStart(2, "0")}-${asDay.toString().padStart(2, "0")}`
    } else {
      // 既不是合理年份也不是有效MMDD，尝试智能修正
      const year = smartCorrectYear(asYear)
      return `${year}-${currentMonth}-${currentDay}`
    }
  } else if (length === 5) {
    // 5位：年份+月份十位，如 20253 → 2025-3-15
    const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
    const monthTens = digitOnlyInput.substring(4, 5)
    return `${year}-${monthTens}-${currentDay}`
  } else if (length === 6) {
    // 6位：年份+完整月份，如 202503 → 2025-03-15
    const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
    const month = parseInt(digitOnlyInput.substring(4, 6), 10)
    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    return `${year}-${validMonth}-${currentDay}`
  } else if (length === 7) {
    // 7位：年份+月份+日期十位，如 2025031 → 2025-03-1
    const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
    const month = parseInt(digitOnlyInput.substring(4, 6), 10)
    const dayTens = digitOnlyInput.substring(6, 7)
    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    return `${year}-${validMonth}-${dayTens}`
  } else if (length === 8) {
    // 8位：完整日期，如 20250315 → 2025-03-15
    const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
    const month = parseInt(digitOnlyInput.substring(4, 6), 10)
    const day = parseInt(digitOnlyInput.substring(6, 8), 10)

    // 验证日期存在性
    if (isValidDateExists(year, month, day)) {
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    } else {
      // 日期不存在，使用当前月日
      const validMonth =
        month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
      return `${year}-${validMonth}-${currentDay}`
    }
  } else {
    // 超过8位，截取前8位处理
    return buildYYYYMMDDFormat(
      digitOnlyInput.substring(0, 8),
      8,
      currentYear,
      currentMonth,
      currentDay,
    )
  }
}

// 构建 MM/dd/yyyy 格式
function buildMMDDYYYYFormat(
  digitOnlyInput: string,
  length: number,
  currentYear: string,
  currentMonth: string,
  currentDay: string,
): string {
  if (length === 1 || length === 2) {
    // 1-2位：用作月份，如 3 → 03/15/2024
    const month = parseInt(digitOnlyInput.padStart(2, "0"), 10)
    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    return `${validMonth}/${currentDay}/${currentYear}`
  } else if (length === 3) {
    // 3位：月份+日期十位，如 315 → 03/15/2024
    const month = parseInt(digitOnlyInput.substring(0, 2), 10)
    const dayTens = digitOnlyInput.substring(2, 3)
    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    return `${validMonth}/${dayTens}/${currentYear}`
  } else if (length === 4) {
    // 4位：月份+完整日期，如 0315 → 03/15/2024
    const month = parseInt(digitOnlyInput.substring(0, 2), 10)
    const day = parseInt(digitOnlyInput.substring(2, 4), 10)

    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    const validDay = day >= 1 && day <= 31 ? day.toString().padStart(2, "0") : currentDay

    // 验证日期存在性
    if (
      isValidDateExists(parseInt(currentYear, 10), parseInt(validMonth, 10), parseInt(validDay, 10))
    ) {
      return `${validMonth}/${validDay}/${currentYear}`
    } else {
      return `${validMonth}/${currentDay}/${currentYear}`
    }
  } else if (length >= 5) {
    // 5-8位：包含年份信息
    const month = parseInt(digitOnlyInput.substring(0, 2), 10)
    const day = parseInt(digitOnlyInput.substring(2, 4), 10)
    const yearPart = digitOnlyInput.substring(4)

    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    const validDay = day >= 1 && day <= 31 ? day.toString().padStart(2, "0") : currentDay

    let year = parseInt(currentYear, 10)
    if (yearPart.length === 1) {
      year = parseInt(`${currentYear.substring(0, 3)}${yearPart}`, 10)
    } else if (yearPart.length === 2) {
      year = parseInt(`${currentYear.substring(0, 2)}${yearPart}`, 10)
    } else if (yearPart.length === 3) {
      year = parseInt(`${yearPart}${currentYear.substring(3, 4)}`, 10)
    } else if (yearPart.length >= 4) {
      year = parseInt(yearPart.substring(0, 4), 10)
    }

    year = smartCorrectYear(year)

    // 验证日期存在性
    if (isValidDateExists(year, parseInt(validMonth, 10), parseInt(validDay, 10))) {
      return `${validMonth}/${validDay}/${year}`
    } else {
      return `${validMonth}/${currentDay}/${year}`
    }
  }

  return ""
}

// 处理非数字输入的其他格式
function tryOtherFormats(input: string, targetFormat: DateFormat, locale: Locale): Date | null {
  const now = new Date()

  try {
    // 1. 英文日期解析
    const englishDate = parseEnglishDate(input)
    if (englishDate) return englishDate

    // 2. 自然语言处理
    const naturalDate = parseNaturalLanguage(input, getLocaleKey(locale))
    if (naturalDate) return naturalDate

    // 3. 相对日期处理
    const relativeDate = parseRelativeDate(input)
    if (relativeDate) return relativeDate

    // 4. 常见格式尝试
    const commonFormats = [
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
      "yyyy/MM/dd",
      "dd.MM.yyyy",
      "yyyy.MM.dd",
      "yyyyMMdd",
      "yyyy-M-d",
      "yyyy/M/d",
      "M/d/yyyy",
      "d/M/yyyy",
    ]

    for (const fmt of commonFormats) {
      if (fmt !== targetFormat) {
        try {
          const parsed = parse(input, fmt, now, { locale })
          if (isValid(parsed)) return parsed
        } catch {
          continue
        }
      }
    }
  } catch (error) {
    // 继续处理
  }

  return null
}

// 输入预测和补全信息
export function getPredictionInfo(
  input: string,
  targetFormat: DateFormat,
): {
  description: string
  prediction: string
} | null {
  const digitOnlyInput = input.replace(/[^\d]/g, "")

  if (!/^\d+$/.test(digitOnlyInput)) return null

  const now = new Date()
  const currentYear = now.getFullYear()
  const length = digitOnlyInput.length

  if (targetFormat === "yyyy-MM-dd") {
    if (length === 1) {
      const year = currentYear.toString().substring(0, 3) + digitOnlyInput
      return {
        prediction: `${year}-${format(now, "MM-dd")}`,
        description: `${year}年当前月日`,
      }
    } else if (length === 3) {
      // 315 → 3月15日
      const month = parseInt(digitOnlyInput.substring(0, 1), 10)
      const day = parseInt(digitOnlyInput.substring(1, 3), 10)
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return {
          prediction: `${currentYear}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
          description: `当年${month}月${day}日`,
        }
      }
    } else if (length === 4) {
      // 4位：智能判断是年份还是MMDD
      const asYear = parseInt(digitOnlyInput, 10)
      const asMonth = parseInt(digitOnlyInput.substring(0, 2), 10)
      const asDay = parseInt(digitOnlyInput.substring(2, 4), 10)

      const isReasonableYear = asYear >= 1950 && asYear <= 2100
      const isValidMMDD = asMonth >= 1 && asMonth <= 12 && asDay >= 1 && asDay <= 31

      if (isReasonableYear && !isValidMMDD) {
        // 当作年份处理，如 2024 → 2024年当前月日
        const year = smartCorrectYear(asYear)
        return {
          prediction: `${year}-${format(now, "MM-dd")}`,
          description: `${year}年当前月日`,
        }
      } else if (isValidMMDD) {
        // 当作MMDD处理，如 1212 → 当年12月12日
        return {
          prediction: `${currentYear}-${asMonth.toString().padStart(2, "0")}-${asDay.toString().padStart(2, "0")}`,
          description: `当年${asMonth}月${asDay}日`,
        }
      }
    }
  }

  return null
}
