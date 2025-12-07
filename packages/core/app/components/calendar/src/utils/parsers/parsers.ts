import { format, isValid, parse, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { DateInputValue, DateParserOptions } from "../../types"
import type { DateDataFormat } from "../../types"
import { commonDateFormats } from "../constants"
import { resolveLocale } from "../locale"
import { parseEnglishDate } from "./english-dates"
import { getLocaleKey, parseNaturalLanguage } from "./natural-language"
import {
  convertTwoDigitYear,
  extractDigits,
  isReasonableYear,
  isValidMonthDay,
  parse3Digits,
  parseYYMMDD,
  parseYYYYMMDD,
} from "./numeric-utils"
import { parseExtendedRelativeDate, parseRelativeDate } from "./relative-dates"
import { handleShortcuts } from "./shortcuts"
import { smartCorrectDate, smartCorrectYear } from "./validators"

// 解析结果类型
export type ParseResult = Date | null
export type DetailedParseResult = DateInputValue

// 解析选项
export interface ParseOptions {
  /** 是否返回详细信息 */
  detailed?: boolean
  /** 是否启用自然语言解析 */
  enableNaturalLanguage?: boolean
  /** 是否启用相对日期解析 */
  enableRelativeDate?: boolean
  /** 是否启用智能修正 */
  enableSmartCorrection?: boolean
  /** 目标格式 */
  format?: DateDataFormat
  /** 语言环境 */
  locale?: Locale
  /** 是否严格模式 */
  strict?: boolean
}

/**
 * 统一的日期解析器 - 合并了原来的 tryRelaxedParsing 和 smartParseDate
 *
 * 解析策略按优先级排序（修正为正确的优先级）：
 * 1. 标准格式解析 - 严格按照指定格式解析
 * 2. 智能数字解析（核心功能） - 纯数字输入的智能猜测 [最重要]
 * 3. 快捷键解析 - today, tomorrow, yesterday 等
 * 4. 扩展相对日期解析 - "3 days ago", "next week" 等
 * 5. 自然语言解析 - "今天", "明天", "下周三" 等
 * 6. 相对日期解析 - "+3d", "-1w" 等简短格式
 * 7. 英文日期解析 - "Jan 15, 2024", "March 3rd" 等
 * 8. 常见格式尝试 - 尝试其他常用日期格式
 */
export function parseDate(
  input: string,
  options: ParseOptions & { detailed: true },
): DetailedParseResult
export function parseDate(input: string, options?: ParseOptions): ParseResult
export function parseDate(
  input: string,
  options: ParseOptions = {},
): ParseResult | DetailedParseResult {
  const {
    format: dateFormat = "yyyy-MM-dd",
    locale = enUS,
    enableNaturalLanguage = true,
    enableRelativeDate = true,
    enableSmartCorrection = true,
    strict = false,
    detailed = false,
  } = options

  // 详细结果对象 - 用于返回完整的解析信息
  const detailedResult: DateInputValue = {
    input,
    date: null,
    formatted: "",
    isValid: false,
    error: null,
  }

  const trimmedInput = input.trim()
  if (!trimmedInput) {
    return detailed ? detailedResult : null
  }

  let result: Date | null = null

  try {
    // 1. 标准格式解析 - 严格按照用户指定的格式解析
    try {
      result = parse(trimmedInput, dateFormat, new Date(), { locale })
      if (isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    } catch {
      // 标准格式解析失败，继续尝试其他解析策略
    }

    // 1.1 智能格式修正 - 处理格式正确但日期无效的输入（如 2025-04-31）
    if (enableSmartCorrection) {
      result = parseInvalidFormattedDate(trimmedInput, dateFormat, locale)
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 1.2 复合日期格式智能解析 - 处理包含星期但date-fns不支持的格式
    if (hasWeekdayInFormat(dateFormat)) {
      result = parseCompositeFormat(trimmedInput, dateFormat, locale)
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 2. 智能数字解析（核心功能，优先级最高）- 处理纯数字输入，如 20240315, 1225, 315, 25 等
    if (enableSmartCorrection) {
      result = parseNumericInput(trimmedInput, dateFormat, locale)
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 3. 快捷键解析 - 处理 today, tomorrow, yesterday 等常用词
    result = handleShortcuts(trimmedInput)
    if (result && isValid(result)) {
      return formatResult(result, dateFormat, locale, detailed, detailedResult)
    }

    // 4. 扩展相对日期解析 - 处理 "3 days ago", "next week", "last month" 等
    if (enableRelativeDate) {
      result = parseExtendedRelativeDate(trimmedInput)
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 5. 自然语言解析 - 处理 "今天", "明天", "下周三" 等自然语言表达
    if (enableNaturalLanguage) {
      result = parseNaturalLanguage(trimmedInput, getLocaleKey(locale))
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 6. 相对日期解析 - 处理 "+3d", "-1w", "2m" 等简短相对格式
    if (enableRelativeDate) {
      result = parseRelativeDate(trimmedInput)
      if (result && isValid(result)) {
        return formatResult(result, dateFormat, locale, detailed, detailedResult)
      }
    }

    // 7. 英文日期解析 - 处理 "Jan 15, 2024", "March 3rd", "15th of May" 等
    result = parseEnglishDate(trimmedInput)
    if (result && isValid(result)) {
      return formatResult(result, dateFormat, locale, detailed, detailedResult)
    }

    // 8. 常见格式尝试 - 最后尝试其他常用的日期格式
    for (const tryFormat of commonDateFormats) {
      if (tryFormat !== dateFormat) {
        try {
          result = parse(trimmedInput, tryFormat, new Date(), { locale })
          if (isValid(result)) {
            return formatResult(result, dateFormat, locale, detailed, detailedResult)
          }
        } catch {
          // 继续尝试下一个格式
        }
      }
    }

    // 解析失败 - 所有策略都失效
    if (detailed) {
      detailedResult.error = strict ? "Invalid date format" : null
      return detailedResult
    }
    return null
  } catch (error) {
    // 捕获异常并提供错误信息
    if (detailed) {
      detailedResult.error = error instanceof Error ? error.message : "Parse error"
      return detailedResult
    }
    return null
  }
}

/**
 * 格式化解析结果 - 统一处理返回值格式
 */
function formatResult(
  date: Date,
  dateFormat: DateDataFormat,
  locale: Locale,
  detailed: boolean,
  detailedResult: DateInputValue,
): Date | DateInputValue {
  if (detailed) {
    detailedResult.date = date
    detailedResult.formatted = format(date, dateFormat, { locale })
    detailedResult.isValid = true
    return detailedResult
  }
  return date
}

/**
 * 智能数字解析（原 tryRelaxedParsing 的核心逻辑）
 *
 * 处理纯数字输入的智能猜测，支持多种长度和格式：
 * - 1-3位：年份补全
 * - 4位：智能判断是年份还是月日
 * - 5-8位：逐步构建完整日期
 *
 * 特色功能：
 * - 智能年份修正（如 25 → 2025）
 * - 无效日期修正（如 0431 → 0430）
 * - 格式适配（根据目标格式调整解析逻辑）
 */
function parseNumericInput(
  input: string,
  targetFormat: DateDataFormat,
  locale: Locale,
): Date | null {
  // 只处理真正的纯数字输入 - 原始输入必须完全是数字
  if (!/^\d+$/.test(input.trim())) {
    return null
  }

  const digitOnlyInput = input.trim()
  const now = new Date()
  const currentYear = now.getFullYear().toString()
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0")
  const currentDay = now.getDate().toString().padStart(2, "0")

  let tempDisplayValue = ""

  // 根据目标格式和输入长度构建日期字符串
  if (targetFormat === "yyyy-MM-dd") {
    tempDisplayValue = buildYYYYMMDDFormat(
      digitOnlyInput,
      digitOnlyInput.length,
      currentYear,
      currentMonth,
      currentDay,
    )
  } else if (targetFormat === "MM/dd/yyyy") {
    tempDisplayValue = buildMMDDYYYYFormat(
      digitOnlyInput,
      digitOnlyInput.length,
      currentYear,
      currentMonth,
      currentDay,
    )
  } else {
    // 其他格式，尝试通用解析
    return tryGenericNumericParsing(digitOnlyInput, digitOnlyInput.length, now)
  }

  // 尝试解析构建的日期字符串
  try {
    const parsedDate = parse(tempDisplayValue, targetFormat, new Date(), { locale })
    if (isValid(parsedDate)) {
      return parsedDate
    }
  } catch {
    // 解析失败，返回 null
  }

  return null
}

/**
 * 构建 yyyy-MM-dd 格式（修正3位数字逻辑）
 *
 * 根据输入数字长度智能构建日期字符串：
 * 1位：用作年份个位数，如 5 → 2025-03-15
 * 2位：用作年份后两位，如 25 → 2025-03-15
 * 3位：智能判断是月日还是年份
 * 4位：智能判断是年份还是MMDD
 * 5位：年份+月份十位，如 20253 → 2025-3-15
 * 6位：年份+完整月份，如 202503 → 2025-03-15
 * 7位：年份+月份+日期十位，如 2025031 → 2025-03-1
 * 8位：完整日期，如 20250315 → 2025-03-15, 20250431 → 2025-04-30 (智能修正)
 */
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
    // 2位：智能判断是日期还是年份
    const num = parseInt(digitOnlyInput, 10)

    if (num >= 1 && num <= 31) {
      // 1-31：优先当作当月日期，如 25 → 当月25日
      const month = parseInt(currentMonth, 10)
      const corrected = smartCorrectDate(parseInt(currentYear, 10), month, num)
      return `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
    } else {
      // 其他情况：当作年份后两位，如 99 → 2099年
      return `${currentYear.substring(0, 2)}${digitOnlyInput}-${currentMonth}-${currentDay}`
    }
  } else if (length === 3) {
    // 3位：智能判断是月日还是年份
    const result = parse3Digits(digitOnlyInput, parseInt(currentYear, 10), "yyyy-MM-dd")
    if (result) {
      return result.formatted
    }

    // 降级：当作年份后三位处理
    const year = digitOnlyInput + currentYear.substring(3, 4)
    return `${year}-${currentMonth}-${currentDay}`
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
    // 6位数字：智能判断是 YYMMDD 格式
    const result = parseYYMMDD(digitOnlyInput, "yyyy-MM-dd")
    return (
      result?.formatted ||
      // 降级到智能修正，强制使用 YYMMDD 格式
      (() => {
        const yymmddYear = parseInt(digitOnlyInput.substring(0, 2), 10)
        const yymmddMonth = parseInt(digitOnlyInput.substring(2, 4), 10)
        const yymmddDay = parseInt(digitOnlyInput.substring(4, 6), 10)
        const correctedYear = convertTwoDigitYear(yymmddYear)
        const corrected = smartCorrectDate(correctedYear, yymmddMonth, yymmddDay)
        return `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
      })()
    )
  } else if (length === 7) {
    // 7位：年份+月份+日期十位，如 2025031 → 2025-03-1
    const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
    const month = parseInt(digitOnlyInput.substring(4, 6), 10)
    const dayTens = digitOnlyInput.substring(6, 7)
    const validMonth = month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
    return `${year}-${validMonth}-${dayTens}`
  } else if (length === 8) {
    // 8位数字：YYYYMMDD 格式
    const result = parseYYYYMMDD(digitOnlyInput, "yyyy-MM-dd")
    return (
      result?.formatted ||
      // 降级到智能修正
      (() => {
        const year = parseInt(digitOnlyInput.substring(0, 4), 10)
        const month = parseInt(digitOnlyInput.substring(4, 6), 10)
        const day = parseInt(digitOnlyInput.substring(6, 8), 10)
        const corrected = smartCorrectDate(year, month, day)
        return `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`
      })()
    )
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

/**
 * 构建 MM/dd/yyyy 格式（修正数字解析逻辑）
 *
 * 根据输入数字长度智能构建美式日期格式：
 * 1位：用作年份个位数，如 5 → 12/24/2025
 * 2位：智能判断是日期还是年份，如 11 → 当月11日，99 → 2099年
 * 3位：智能判断是月日还是其他
 * 4位：月份+完整日期，如 0315 → 03/15/2024
 * 5-8位：包含年份信息的完整日期
 */
function buildMMDDYYYYFormat(
  digitOnlyInput: string,
  length: number,
  currentYear: string,
  currentMonth: string,
  currentDay: string,
): string {
  if (length === 1) {
    // 1位：用作年份个位数，如 5 → 12/24/2025
    const year = parseInt(`${currentYear.substring(0, 3)}${digitOnlyInput}`, 10)
    return `${currentMonth}/${currentDay}/${year}`
  } else if (length === 2) {
    // 2位：智能判断是日期还是年份
    const num = parseInt(digitOnlyInput, 10)

    if (num >= 1 && num <= 31) {
      // 1-31：优先当作当月日期，如 25 → 当月25日
      const corrected = smartCorrectDate(parseInt(currentYear, 10), parseInt(currentMonth, 10), num)
      return `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
    } else {
      // 其他：当作年份后两位，如 99 → 2099年当前月日
      const year = parseInt(`${currentYear.substring(0, 2)}${digitOnlyInput}`, 10)
      return `${currentMonth}/${currentDay}/${year}`
    }
  } else if (length === 3) {
    // 3位：智能判断是月日还是其他
    const firstDigit = parseInt(digitOnlyInput.substring(0, 1), 10)
    const lastTwoDigits = parseInt(digitOnlyInput.substring(1, 3), 10)

    // 如果第一位是1-12，且后两位是1-31，解释为月日
    if (firstDigit >= 1 && firstDigit <= 12 && lastTwoDigits >= 1 && lastTwoDigits <= 31) {
      // 315 → 03/15/2024，128 → 01/28/2024
      return `${firstDigit.toString().padStart(2, "0")}/${lastTwoDigits.toString().padStart(2, "0")}/${currentYear}`
    } else {
      // 否则按原逻辑：前两位作为月份，最后一位作为日期十位
      const month = parseInt(digitOnlyInput.substring(0, 2), 10)
      const dayTens = digitOnlyInput.substring(2, 3)
      const validMonth =
        month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
      return `${validMonth}/${dayTens}/${currentYear}`
    }
  } else if (length === 4) {
    // 4位：月份+完整日期，如 0315 → 03/15/2024
    const month = parseInt(digitOnlyInput.substring(0, 2), 10)
    const day = parseInt(digitOnlyInput.substring(2, 4), 10)

    // 使用智能修正来处理无效日期
    const corrected = smartCorrectDate(parseInt(currentYear, 10), month, day)
    return `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
  } else if (length === 6) {
    // 6位：智能判断是 MMDDYY 还是其他格式
    // 对于 MM/dd/yyyy 格式，6位数字更可能是 MMDDYY（如 121223 → 12/12/2023）
    const result = parseYYMMDD(digitOnlyInput, "MM/dd/yyyy")
    if (result) {
      return result.formatted
    }
  } else if (length >= 5) {
    // 降级到原来的逻辑处理其他长度
    const month = parseInt(digitOnlyInput.substring(0, 2), 10)
    const day = parseInt(digitOnlyInput.substring(2, 4), 10)
    const yearPart = digitOnlyInput.substring(4)

    let year = parseInt(currentYear, 10)
    if (yearPart.length === 1) {
      // 5位：如 03155 → 03/15/2025
      year = parseInt(`${currentYear.substring(0, 3)}${yearPart}`, 10)
    } else if (yearPart.length === 2) {
      // 6位：如 031525 → 03/15/2025
      year = parseInt(`${currentYear.substring(0, 2)}${yearPart}`, 10)
    } else if (yearPart.length === 3) {
      // 7位：如 0315025 → 03/15/2025
      year = parseInt(`${yearPart}${currentYear.substring(3, 4)}`, 10)
    } else if (yearPart.length >= 4) {
      // 8位：如 03152025 → 03/15/2025
      year = parseInt(yearPart.substring(0, 4), 10)
    }

    year = smartCorrectYear(year)

    // 使用智能修正来处理无效日期
    const corrected = smartCorrectDate(year, month, day)
    return `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`
  }

  return ""
}

/**
 * 通用数字解析 - 处理其他格式的数字输入
 *
 * 支持常见的数字格式：
 * - 8位：YYYYMMDD（如 20240315）
 * - 6位：YYMMDD 或 MMDDYY（如 240315）
 * - 4位：MMDD（如 0315 → 当年3月15日）
 */
function tryGenericNumericParsing(digitOnly: string, length: number, now: Date): Date | null {
  const currentYear = now.getFullYear().toString()

  if (length === 1) {
    // 1位：用作年份个位数，如 5 → 2025年当前月日
    const year = parseInt(`${currentYear.substring(0, 3)}${digitOnly}`, 10)
    return new Date(year, now.getMonth(), now.getDate())
  } else if (length === 2) {
    // 2位：智能判断是日期还是年份
    const num = parseInt(digitOnly, 10)

    if (num >= 1 && num <= 31) {
      // 1-31：优先当作当月日期，如 25 → 当月25日
      const corrected = smartCorrectDate(parseInt(currentYear, 10), now.getMonth() + 1, num)
      return new Date(corrected.year, corrected.month - 1, corrected.day)
    } else {
      // 其他：当作年份后两位，如 99 → 2099年当前月日
      const year = convertTwoDigitYear(num)
      return new Date(year, now.getMonth(), now.getDate())
    }
  } else if (length === 3) {
    // 3位：智能判断是月日还是年份
    const result = parse3Digits(digitOnly, parseInt(currentYear, 10), "yyyy-MM-dd")
    if (result) {
      return new Date(result.year, result.month - 1, result.day)
    }

    // 降级：当作年份后三位
    const year = parseInt(`${digitOnly}${currentYear.substring(3, 4)}`, 10)
    return new Date(year, now.getMonth(), now.getDate())
  } else if (length === 4) {
    // 4位：MMDD 格式（使用当前年份）
    const month = parseInt(digitOnly.substring(0, 2), 10)
    const day = parseInt(digitOnly.substring(2, 4), 10)
    const corrected = smartCorrectDate(parseInt(currentYear, 10), month, day)
    return new Date(corrected.year, corrected.month - 1, corrected.day)
  } else if (length === 6) {
    // 6位：YYMMDD 格式
    const result = parseYYMMDD(digitOnly, "yyyy-MM-dd")
    if (result) {
      return new Date(result.year, result.month - 1, result.day)
    }
  } else if (length === 8) {
    // 8位：YYYYMMDD 格式
    const result = parseYYYYMMDD(digitOnly, "yyyy-MM-dd")
    if (result) {
      return new Date(result.year, result.month - 1, result.day)
    }
  }

  return null
}

/**
 * 输入预测和补全信息 - 为用户提供输入提示（修正3位数字逻辑）
 *
 * 根据当前输入预测用户可能想要的日期，并提供中文描述
 * 主要用于输入提示和自动补全功能
 */
export function getPredictionInfo(
  input: string,
  targetFormat: DateDataFormat,
): {
  description: string
  prediction: string
} | null {
  const digitOnlyInput = extractDigits(input)

  if (!/^\d+$/.test(digitOnlyInput)) return null

  const now = new Date()
  const currentYear = now.getFullYear().toString()
  const length = digitOnlyInput.length

  if (targetFormat === "yyyy-MM-dd") {
    if (length === 1) {
      // 1位数字：预测为年份个位数
      const year = currentYear.substring(0, 3) + digitOnlyInput
      return {
        prediction: `${year}-${format(now, "MM-dd")}`,
        description: `${year}年当前月日`,
      }
    } else if (length === 2) {
      // 2位数字：智能判断是日期还是年份
      const num = parseInt(digitOnlyInput, 10)

      if (num >= 1 && num <= 31) {
        // 1-31：优先当作当月日期，如 25 → 当月25日
        const month = now.getMonth() + 1
        const corrected = smartCorrectDate(parseInt(currentYear, 10), month, num)
        return {
          prediction: `${corrected.year}-${corrected.month.toString().padStart(2, "0")}-${corrected.day.toString().padStart(2, "0")}`,
          description: `当月${corrected.day}日`,
        }
      } else {
        // 其他情况：当作年份后两位，如 99 → 2099年
        const year = parseInt(`${currentYear.substring(0, 2)}${digitOnlyInput}`, 10)
        return {
          prediction: `${year}-${format(now, "MM-dd")}`,
          description: `${year}年当前月日`,
        }
      }
    } else if (length === 3) {
      // 3位数字：智能判断是月日还是年份
      const result = parse3Digits(digitOnlyInput, parseInt(currentYear, 10), targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `当年${result.month}月${result.day}日`,
        }
      }

      // 降级：当作年份
      const year = digitOnlyInput + currentYear.substring(3, 4)
      return {
        prediction: `${year}-${format(now, "MM-dd")}`,
        description: `${year}年当前月日`,
      }
    } else if (length === 4) {
      // 4位数字：智能判断是年份还是MMDD
      const asYear = parseInt(digitOnlyInput, 10)
      const asMonth = parseInt(digitOnlyInput.substring(0, 2), 10)
      const asDay = parseInt(digitOnlyInput.substring(2, 4), 10)

      if (isReasonableYear(asYear) && !isValidMonthDay(asMonth, asDay)) {
        // 当作年份处理，如 2024 → 2024年当前月日
        const year = smartCorrectYear(asYear)
        return {
          prediction: `${year}-${format(now, "MM-dd")}`,
          description: `${year}年当前月日`,
        }
      } else if (isValidMonthDay(asMonth, asDay)) {
        // 当作MMDD处理，如 1212 → 当年12月12日
        return {
          prediction: `${currentYear}-${asMonth.toString().padStart(2, "0")}-${asDay.toString().padStart(2, "0")}`,
          description: `当年${asMonth}月${asDay}日`,
        }
      }
    } else if (length === 6) {
      // 6位数字：YYMMDD 格式
      const result = parseYYMMDD(digitOnlyInput, targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `${result.year}年${result.month}月${result.day}日`,
        }
      }
    } else if (length === 8) {
      // 8位数字：YYYYMMDD 格式
      const result = parseYYYYMMDD(digitOnlyInput, targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `${result.year}年${result.month}月${result.day}日`,
        }
      }
    }
  } else if (targetFormat === "MM/dd/yyyy") {
    if (length === 1) {
      // 1位数字：预测为年份个位数
      const year = currentYear.substring(0, 3) + digitOnlyInput
      return {
        prediction: `${format(now, "MM/dd")}/${year}`,
        description: `${year}年当前月日`,
      }
    } else if (length === 2) {
      // 2位数字：智能判断是日期还是年份
      const num = parseInt(digitOnlyInput, 10)

      if (num >= 1 && num <= 31) {
        // 1-31：优先当作当月日期，如 25 → 当月25日
        const month = now.getMonth() + 1
        const corrected = smartCorrectDate(parseInt(currentYear, 10), month, num)
        return {
          prediction: `${corrected.month.toString().padStart(2, "0")}/${corrected.day.toString().padStart(2, "0")}/${corrected.year}`,
          description: `当月${corrected.day}日`,
        }
      } else {
        // 其他情况：当作年份后两位，如 99 → 2099年
        const year = parseInt(`${currentYear.substring(0, 2)}${digitOnlyInput}`, 10)
        return {
          prediction: `${format(now, "MM/dd")}/${year}`,
          description: `${year}年当前月日`,
        }
      }
    } else if (length === 3) {
      // 3位数字：智能判断是月日还是年份
      const result = parse3Digits(digitOnlyInput, parseInt(currentYear, 10), targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `当月${result.day}日`,
        }
      }

      // 降级：当作年份
      const year = parseInt(`${now.getFullYear().toString().substring(0, 2)}${digitOnlyInput}`, 10)
      return {
        prediction: `${format(now, "MM/dd")}/${year}`,
        description: `${year}年当前月日`,
      }
    } else if (length === 4) {
      // 4位数字：智能判断是年份还是MMDD
      const asYear = parseInt(digitOnlyInput, 10)
      const asMonth = parseInt(digitOnlyInput.substring(0, 2), 10)
      const asDay = parseInt(digitOnlyInput.substring(2, 4), 10)

      if (isReasonableYear(asYear) && !isValidMonthDay(asMonth, asDay)) {
        // 当作年份处理，如 2024 → 2024年当前月日
        const year = smartCorrectYear(asYear)
        return {
          prediction: `${format(now, "MM/dd")}/${year}`,
          description: `${year}年当前月日`,
        }
      } else if (isValidMonthDay(asMonth, asDay)) {
        // 当作MMDD处理，如 1212 → 当年12月12日
        return {
          prediction: `${asMonth.toString().padStart(2, "0")}/${asDay.toString().padStart(2, "0")}/${now.getFullYear()}`,
          description: `当年${asMonth}月${asDay}日`,
        }
      }
    } else if (length === 6) {
      // 6位数字：YYMMDD 格式
      const result = parseYYMMDD(digitOnlyInput, targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `${result.year}年${result.month}月${result.day}日`,
        }
      }
    } else if (length === 8) {
      // 8位数字：YYYYMMDD 格式
      const result = parseYYYYMMDD(digitOnlyInput, targetFormat)
      if (result) {
        return {
          prediction: result.formatted,
          description: `${result.year}年${result.month}月${result.day}日`,
        }
      }
    }
  }

  return null
}

// 向后兼容的导出 - 保持旧接口可用
export const tryRelaxedParsing = (input: string, format: DateDataFormat, locale?: Locale) =>
  parseDate(input, { format, locale, enableSmartCorrection: true })

export const smartParseDate = (input: string, options: DateParserOptions): DateInputValue =>
  parseDate(input, {
    ...options,
    locale: resolveLocale(options.locale),
    detailed: true,
  }) as DateInputValue

/**
 * 检测日期格式是否包含星期信息
 * 支持的星期格式标记：e, ee, eee, eeee, E, EE, EEE, EEEE, i, ii, iii, iiii, c, cc, ccc, cccc
 */
function hasWeekdayInFormat(format: string): boolean {
  // 匹配 date-fns 中的星期格式标记
  const weekdayPatterns = [
    /\be{1,4}\b/, // e, ee, eee, eeee (localized weekday)
    /\bE{1,4}\b/, // E, EE, EEE, EEEE (weekday)
    /\bi{1,4}\b/, // i, ii, iii, iiii (ISO weekday)
    /\bc{1,4}\b/, // c, cc, ccc, cccc (standalone weekday)
  ]

  return weekdayPatterns.some((pattern) => pattern.test(format))
}

/**
 * 复合日期格式智能解析 - 处理包含星期但date-fns不支持的格式
 *
 * 策略：
 * 1. 分离日期部分和星期部分
 * 2. 先解析日期部分获得准确日期
 * 3. 忽略用户输入的星期（可能错误），使用解析出的日期
 */
function parseCompositeFormat(input: string, format: string, locale: Locale): Date | null {
  try {
    // 移除格式中的星期部分，得到纯日期格式
    const dateOnlyFormat = removeWeekdayFromFormat(format)

    // 移除输入中的星期部分，得到纯日期输入
    const dateOnlyInput = removeWeekdayFromInput(input, locale)

    if (!dateOnlyFormat || !dateOnlyInput) {
      return null
    }

    // 使用纯日期格式解析纯日期输入
    const result = parse(dateOnlyInput, dateOnlyFormat, new Date(), { locale })

    return isValid(result) ? result : null
  } catch {
    return null
  }
}

/**
 * 从格式字符串中移除星期相关的标记
 */
function removeWeekdayFromFormat(format: string): string {
  return (
    format
      // 移除星期标记及其周围的空格和标点
      .replace(/\s*[eEic]{1,4}\s*/g, "")
      // 清理多余的连续空格和标点
      .replace(/\s+/g, " ")
      .replace(/\s*([,，、])\s*/g, "$1")
      .trim()
  )
}

/**
 * 智能移除输入字符串中的星期信息
 * 使用 date-fns 动态获取本地化的星期名字，支持所有语言环境
 */
function removeWeekdayFromInput(input: string, locale: Locale): string {
  try {
    // 生成所有星期名字的数组（包括完整名称和缩写）
    const weekdayNames = generateWeekdayNames(locale)

    if (weekdayNames.length === 0) {
      return input
    }

    // 构建正则表达式，按长度降序排列以优先匹配完整名称
    const sortedNames = weekdayNames.sort((a, b) => b.length - a.length)
    const pattern = new RegExp(`\\s*(${sortedNames.join("|")})\\s*`, "gi")

    return input.replace(pattern, "").replace(/\s+/g, " ").trim()
  } catch {
    // 如果获取星期名字失败，降级到简单的中文处理
    return input
      .replace(/\s*(星期[一二三四五六日天]|周[一二三四五六日天])\s*/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }
}

/**
 * 使用 date-fns 生成指定语言环境的所有星期名字
 * 包括完整名称（Monday）和缩写（Mon）
 */
function generateWeekdayNames(locale: Locale): string[] {
  const names: string[] = []

  try {
    // 创建一个星期的 7 天（从周日开始）
    const baseDate = new Date(2024, 0, 7) // 2024年1月7日是星期日

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(baseDate.getDate() + i)

      // 获取完整星期名称 (eeee)
      const fullName = format(currentDate, "eeee", { locale })
      if (fullName && fullName !== "eeee") {
        names.push(fullName)
      }

      // 获取缩写星期名称 (eee)
      const shortName = format(currentDate, "eee", { locale })
      if (shortName && shortName !== "eee" && shortName !== fullName) {
        names.push(shortName)
      }

      // 获取最短星期名称 (ee)
      const veryShortName = format(currentDate, "ee", { locale })
      if (
        veryShortName &&
        veryShortName !== "ee" &&
        veryShortName !== shortName &&
        veryShortName !== fullName
      ) {
        names.push(veryShortName)
      }

      // 对于中文，还要尝试获取其他格式
      const localeKey = getLocaleKey(locale)
      if (localeKey === "zh") {
        // 尝试获取 "周X" 格式
        const weekFormat = format(currentDate, "eeee", { locale }).replace("星期", "周")
        if (weekFormat !== fullName) {
          names.push(weekFormat)
        }
      }
    }

    // 去重并过滤无效值
    return [...new Set(names)].filter(
      (name) =>
        name &&
        name.length > 0 &&
        !name.includes("e") && // 过滤掉格式化失败的情况
        name !== "Invalid Date",
    )
  } catch {
    return []
  }
}

/**
 * 智能格式修正 - 处理格式正确但日期无效的输入
 *
 * 当用户输入如 "2025-04-31" 这样格式正确但日期无效的字符串时，
 * 提取年月日并应用智能修正，返回有效日期
 */
function parseInvalidFormattedDate(
  input: string,
  targetFormat: DateDataFormat,
  locale: Locale,
): Date | null {
  // 定义常见格式的解析模式
  const formatPatterns: Record<string, RegExp> = {
    "yyyy-MM-dd": /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    "yyyy/MM/dd": /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    "MM/dd/yyyy": /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    "dd/MM/yyyy": /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    "dd.MM.yyyy": /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    "yyyy.MM.dd": /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/,
    yyyy年MM月dd日: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/,
  }

  const pattern = formatPatterns[targetFormat]
  if (!pattern) {
    return null
  }

  const match = input.match(pattern)
  if (!match) {
    return null
  }

  // 根据格式提取年、月、日
  let year: number, month: number, day: number

  switch (targetFormat) {
    case "yyyy-MM-dd":
    case "yyyy/MM/dd":
    case "yyyy.MM.dd":
    case "yyyy年MM月dd日":
      year = parseInt(match[1], 10)
      month = parseInt(match[2], 10)
      day = parseInt(match[3], 10)
      break

    case "MM/dd/yyyy":
      month = parseInt(match[1], 10)
      day = parseInt(match[2], 10)
      year = parseInt(match[3], 10)
      break

    case "dd/MM/yyyy":
    case "dd.MM.yyyy":
      day = parseInt(match[1], 10)
      month = parseInt(match[2], 10)
      year = parseInt(match[3], 10)
      break

    default:
      return null
  }

  // 应用智能修正
  const corrected = smartCorrectDate(year, month, day)

  // 创建修正后的日期（使用与date-fns一致的方式）
  const correctedDate = new Date(corrected.year, corrected.month - 1, corrected.day)

  return isValid(correctedDate) ? correctedDate : null
}
