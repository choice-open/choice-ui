import {
  format,
  parse,
  isValid,
  startOfDay,
  endOfDay,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setHours,
  setMinutes,
  type Locale,
} from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import type {
  DateFormat,
  TimeFormat,
  DateInputValue,
  TimeInputValue,
  NaturalLanguageMap,
  RelativeDatePattern,
  DateParserOptions,
  TimeParserOptions,
} from "./types"

// 默认语言环境映射
const defaultLocaleMap: Record<string, Locale> = {
  "zh-CN": zhCN,
  "en-US": enUS,
}

// 自然语言关键词映射
const naturalLanguageMap: Record<string, NaturalLanguageMap> = {
  "zh-CN": {
    today: ["今天", "今日", "现在"],
    tomorrow: ["明天", "明日"],
    yesterday: ["昨天", "昨日"],
    thisWeek: ["本周", "这周", "这个星期", "本星期"],
    nextWeek: ["下周", "下个星期"],
    lastWeek: ["上周", "上个星期"],
    thisMonth: ["本月", "这个月"],
    nextMonth: ["下月", "下个月"],
    lastMonth: ["上月", "上个月"],
    thisYear: ["今年", "本年"],
    nextYear: ["明年", "下年"],
    lastYear: ["去年", "上年"],
    now: ["现在", "此刻"],
    morning: ["早上", "上午", "晨"],
    afternoon: ["下午", "午后"],
    evening: ["晚上", "傍晚"],
    night: ["深夜", "夜里", "夜间"],
  },
  "en-US": {
    today: ["today", "now"],
    tomorrow: ["tomorrow", "tmr"],
    yesterday: ["yesterday"],
    thisWeek: ["this week"],
    nextWeek: ["next week"],
    lastWeek: ["last week"],
    thisMonth: ["this month"],
    nextMonth: ["next month"],
    lastMonth: ["last month"],
    thisYear: ["this year"],
    nextYear: ["next year"],
    lastYear: ["last year"],
    now: ["now"],
    morning: ["morning", "am"],
    afternoon: ["afternoon", "pm"],
    evening: ["evening"],
    night: ["night"],
  },
}

// 相对日期模式
const relativeDatePatterns: RelativeDatePattern[] = [
  // 数字 + 天/日
  { pattern: /(\d+)\s*天[后前]?/g, type: "day", multiplier: 1 },
  { pattern: /(\d+)\s*日[后前]?/g, type: "day", multiplier: 1 },
  { pattern: /(\d+)\s*days?\s*(later|ago)?/gi, type: "day", multiplier: 1 },

  // 数字 + 周/星期
  { pattern: /(\d+)\s*周[后前]?/g, type: "week", multiplier: 1 },
  { pattern: /(\d+)\s*星期[后前]?/g, type: "week", multiplier: 1 },
  { pattern: /(\d+)\s*weeks?\s*(later|ago)?/gi, type: "week", multiplier: 1 },

  // 数字 + 月
  { pattern: /(\d+)\s*个?月[后前]?/g, type: "month", multiplier: 1 },
  { pattern: /(\d+)\s*months?\s*(later|ago)?/gi, type: "month", multiplier: 1 },

  // 数字 + 年
  { pattern: /(\d+)\s*年[后前]?/g, type: "year", multiplier: 1 },
  { pattern: /(\d+)\s*years?\s*(later|ago)?/gi, type: "year", multiplier: 1 },
]

// 节假日映射
const holidays: Record<string, string> = {
  "0101": "元旦 🎊",
  "0214": "情人节 💕",
  "0301": "妇女节 👩",
  "0401": "愚人节 😄",
  "0501": "劳动节 💪",
  "0601": "儿童节 👶",
  "0701": "建党节 🎉",
  "0801": "建军节 🪖",
  "1001": "国庆节 🇨🇳",
  "1111": "光棍节 🕺",
  "1225": "圣诞节 🎄",
  "1231": "跨年夜 🎊",
}

// 英文月份映射（支持全称、缩写和常见变体）
const englishMonths: Record<string, number> = {
  // 全称
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,

  // 标准缩写
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,

  // 常见变体和带点缩写
  sept: 9,
  "sept.": 9,
  "sep.": 9,
  "jan.": 1,
  "feb.": 2,
  "mar.": 3,
  "apr.": 4,
  "jun.": 6,
  "jul.": 7,
  "aug.": 8,
  "oct.": 10,
  "nov.": 11,
  "dec.": 12,
}

// 中文月份映射
const chineseMonths: Record<string, number> = {
  一月: 1,
  二月: 2,
  三月: 3,
  四月: 4,
  五月: 5,
  六月: 6,
  七月: 7,
  八月: 8,
  九月: 9,
  十月: 10,
  十一月: 11,
  十二月: 12,
  "1月": 1,
  "2月": 2,
  "3月": 3,
  "4月": 4,
  "5月": 5,
  "6月": 6,
  "7月": 7,
  "8月": 8,
  "9月": 9,
  "10月": 10,
  "11月": 11,
  "12月": 12,
}

// 获取语言环境
export function getLocale(localeKey?: string): Locale {
  if (!localeKey) return enUS
  return defaultLocaleMap[localeKey] || enUS
}

// 从 Locale 对象获取 locale key
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

// 解析自然语言日期
export function parseNaturalLanguage(input: string, localeKey: string = "zh-CN"): Date | null {
  const normalizedInput = input.toLowerCase().trim()
  const keywords = naturalLanguageMap[localeKey] || naturalLanguageMap["en-US"]
  const now = new Date()

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
            return startOfWeek(now, { locale: getLocale(localeKey) })
          case "nextWeek":
            return startOfWeek(addWeeks(now, 1), { locale: getLocale(localeKey) })
          case "lastWeek":
            return startOfWeek(subWeeks(now, 1), { locale: getLocale(localeKey) })
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

// 解析相对日期
export function parseRelativeDate(input: string): Date | null {
  const now = new Date()

  for (const pattern of relativeDatePatterns) {
    const match = pattern.pattern.exec(input)
    if (match) {
      const amount = parseInt(match[1], 10)
      const isAgo = input.includes("前") || input.includes("ago")
      const actualAmount = isAgo ? -amount : amount

      switch (pattern.type) {
        case "day":
          return addDays(now, actualAmount)
        case "week":
          return addWeeks(now, actualAmount)
        case "month":
          return addMonths(now, actualAmount)
        case "year":
          return addYears(now, actualAmount)
      }
    }
  }

  return null
}

// 智能解析日期
export function smartParseDate(input: string, options: DateParserOptions): DateInputValue {
  const { format: dateFormat, locale, enableNaturalLanguage, enableRelativeDate, strict } = options
  const dateFnsLocale = locale || enUS
  const localeKey = getLocaleKey(locale)

  const result: DateInputValue = {
    input,
    date: null,
    formatted: "",
    isValid: false,
    error: null,
  }

  // 空输入处理
  if (!input.trim()) {
    return result
  }

  let parsedDate: Date | null = null

  try {
    // 1. 尝试按指定格式解析
    parsedDate = parse(input, dateFormat, new Date(), { locale: dateFnsLocale })

    if (isValid(parsedDate)) {
      result.date = parsedDate
      result.formatted = format(parsedDate, dateFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // 2. 尝试自然语言解析
    if (enableNaturalLanguage) {
      parsedDate = parseNaturalLanguage(input, localeKey)
      if (parsedDate && isValid(parsedDate)) {
        result.date = parsedDate
        result.formatted = format(parsedDate, dateFormat, { locale: dateFnsLocale })
        result.isValid = true
        return result
      }
    }

    // 3. 尝试相对日期解析
    if (enableRelativeDate) {
      parsedDate = parseRelativeDate(input)
      if (parsedDate && isValid(parsedDate)) {
        result.date = parsedDate
        result.formatted = format(parsedDate, dateFormat, { locale: dateFnsLocale })
        result.isValid = true
        return result
      }
    }

    // 4. 尝试其他常见格式
    const commonFormats = [
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
      "yyyy/MM/dd",
      "dd.MM.yyyy",
      "yyyy.MM.dd",
      "yyyyMMdd",
    ]

    for (const tryFormat of commonFormats) {
      if (tryFormat !== dateFormat) {
        try {
          parsedDate = parse(input, tryFormat, new Date(), { locale: dateFnsLocale })
          if (isValid(parsedDate)) {
            result.date = parsedDate
            result.formatted = format(parsedDate, dateFormat, { locale: dateFnsLocale })
            result.isValid = true
            return result
          }
        } catch {
          // 继续尝试下一个格式
        }
      }
    }

    // 解析失败
    result.error = strict ? "Invalid date format" : null
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Parse error"
  }

  return result
}

// 智能解析时间
export function smartParseTime(input: string, options: TimeParserOptions): TimeInputValue {
  const { format: timeFormat, locale, strict } = options
  const dateFnsLocale = locale || enUS

  const result: TimeInputValue = {
    input,
    time: null,
    formatted: "",
    isValid: false,
    error: null,
  }

  // 空输入处理
  if (!input.trim()) {
    return result
  }

  let parsedDate: Date | null = null

  try {
    // 1. 尝试按指定格式解析
    const baseDate = new Date(2000, 0, 1) // 使用固定日期，只关心时间
    parsedDate = parse(input, timeFormat, baseDate, { locale: dateFnsLocale })

    if (isValid(parsedDate)) {
      result.time = format(parsedDate, "HH:mm")
      result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
      result.isValid = true
      return result
    }

    // 2. 尝试其他常见时间格式
    const commonTimeFormats = [
      "HH:mm",
      "HH:mm:ss",
      "H:mm",
      "h:mm a",
      "hh:mm a",
      "h:mm aa",
      "HHmm",
      "Hmm",
    ]

    for (const tryFormat of commonTimeFormats) {
      if (tryFormat !== timeFormat) {
        try {
          parsedDate = parse(input, tryFormat, baseDate, { locale: dateFnsLocale })
          if (isValid(parsedDate)) {
            result.time = format(parsedDate, "HH:mm")
            result.formatted = format(parsedDate, timeFormat, { locale: dateFnsLocale })
            result.isValid = true
            return result
          }
        } catch {
          // 继续尝试下一个格式
        }
      }
    }

    // 3. 尝试简单的数字输入解析（如：9 -> 09:00, 930 -> 09:30）
    const numericMatch = input.match(/^(\d{1,4})$/)
    if (numericMatch) {
      const num = numericMatch[1].padStart(4, "0")
      const hours = parseInt(num.substring(0, 2), 10)
      const minutes = parseInt(num.substring(2, 4), 10)

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const timeDate = setMinutes(setHours(baseDate, hours), minutes)
        result.time = format(timeDate, "HH:mm")
        result.formatted = format(timeDate, timeFormat, { locale: dateFnsLocale })
        result.isValid = true
        return result
      }
    }

    // 解析失败
    result.error = strict ? "Invalid time format" : null
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Parse error"
  }

  return result
}

// 生成时间选项列表
export function generateTimeOptions(
  step: number = 30,
  timeFormat: TimeFormat = "HH:mm",
  locale?: Locale,
): Array<{ label: string; value: string }> {
  const options: Array<{ label: string; value: string }> = []
  const baseDate = new Date(2000, 0, 1)

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const timeDate = setMinutes(setHours(baseDate, hour), minute)
      const value = format(timeDate, "HH:mm")
      const label = format(timeDate, timeFormat, { locale })

      options.push({ value, label })
    }
  }

  return options
}

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
      if (length === 1) {
        // 1位：用作年份个位数，如 5 → 2025-03-15
        tempDisplayValue = `${currentYear.substring(0, 3)}${digitOnlyInput}-${currentMonth}-${currentDay}`
      } else if (length === 2) {
        // 2位：用作年份后两位，如 25 → 2025-03-15
        tempDisplayValue = `${currentYear.substring(0, 2)}${digitOnlyInput}-${currentMonth}-${currentDay}`
      } else if (length === 3) {
        // 3位：用作年份后三位，如 025 → 2025-03-15
        tempDisplayValue = `${digitOnlyInput}${currentYear.substring(3, 4)}-${currentMonth}-${currentDay}`
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
          tempDisplayValue = `${year}-${currentMonth}-${currentDay}`
        } else if (isValidMMDD) {
          // 当作MMDD处理，如 1212 → 当年12月12日
          const holiday = getHolidayInfo(asMonth, asDay)
          tempDisplayValue = `${currentYear}-${asMonth.toString().padStart(2, "0")}-${asDay.toString().padStart(2, "0")}`
        } else {
          // 既不是合理年份也不是有效MMDD，尝试智能修正
          const year = smartCorrectYear(asYear)
          tempDisplayValue = `${year}-${currentMonth}-${currentDay}`
        }
      } else if (length === 5) {
        // 5位：年份+月份十位，如 20253 → 2025-3-15
        const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
        const monthTens = digitOnlyInput.substring(4, 5)
        tempDisplayValue = `${year}-${monthTens}-${currentDay}`
      } else if (length === 6) {
        // 6位：年份+完整月份，如 202503 → 2025-03-15
        const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
        const month = parseInt(digitOnlyInput.substring(4, 6), 10)
        // 验证月份
        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
        tempDisplayValue = `${year}-${validMonth}-${currentDay}`
      } else if (length === 7) {
        // 7位：年份+月份+日期十位，如 2025031 → 2025-03-1
        const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
        const month = parseInt(digitOnlyInput.substring(4, 6), 10)
        const dayTens = digitOnlyInput.substring(6, 7)
        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
        tempDisplayValue = `${year}-${validMonth}-${dayTens}`
      } else if (length === 8) {
        // 8位：完整日期，如 20250315 → 2025-03-15
        const year = smartCorrectYear(parseInt(digitOnlyInput.substring(0, 4), 10))
        const month = parseInt(digitOnlyInput.substring(4, 6), 10)
        const day = parseInt(digitOnlyInput.substring(6, 8), 10)

        // 验证日期存在性
        if (isValidDateExists(year, month, day)) {
          tempDisplayValue = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
        } else {
          // 日期不存在，使用当前月日
          const validMonth =
            month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
          tempDisplayValue = `${year}-${validMonth}-${currentDay}`
        }
      } else {
        // 超过8位，截取前8位处理
        return tryRelaxedParsing(digitOnlyInput.substring(0, 8), targetFormat, locale)
      }
    } else if (targetFormat === "MM/dd/yyyy") {
      // MM/DD/YYYY 格式的逐步构建逻辑
      if (length === 1 || length === 2) {
        // 1-2位：用作月份，如 3 → 03/15/2024
        const month = parseInt(digitOnlyInput.padStart(2, "0"), 10)
        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
        tempDisplayValue = `${validMonth}/${currentDay}/${currentYear}`
      } else if (length === 3) {
        // 3位：月份+日期十位，如 315 → 03/15/2024
        const month = parseInt(digitOnlyInput.substring(0, 2), 10)
        const dayTens = digitOnlyInput.substring(2, 3)
        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
        tempDisplayValue = `${validMonth}/${dayTens}/${currentYear}`
      } else if (length === 4) {
        // 4位：月份+完整日期，如 0315 → 03/15/2024
        const month = parseInt(digitOnlyInput.substring(0, 2), 10)
        const day = parseInt(digitOnlyInput.substring(2, 4), 10)

        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
        const validDay = day >= 1 && day <= 31 ? day.toString().padStart(2, "0") : currentDay

        // 验证日期存在性
        if (
          isValidDateExists(
            parseInt(currentYear, 10),
            parseInt(validMonth, 10),
            parseInt(validDay, 10),
          )
        ) {
          tempDisplayValue = `${validMonth}/${validDay}/${currentYear}`
        } else {
          tempDisplayValue = `${validMonth}/${currentDay}/${currentYear}`
        }
      } else if (length >= 5) {
        // 5-8位：包含年份信息
        const month = parseInt(digitOnlyInput.substring(0, 2), 10)
        const day = parseInt(digitOnlyInput.substring(2, 4), 10)
        const yearPart = digitOnlyInput.substring(4)

        const validMonth =
          month >= 1 && month <= 12 ? month.toString().padStart(2, "0") : currentMonth
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
          tempDisplayValue = `${validMonth}/${validDay}/${year}`
        } else {
          tempDisplayValue = `${validMonth}/${currentDay}/${year}`
        }
      }
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

// 宽松的时间解析 - 尝试猜测用户意图并自动补全
export function tryRelaxedTimeParsing(
  input: string,
  targetFormat: TimeFormat,
  locale: Locale,
): string | null {
  const trimmedInput = input.trim()
  if (!trimmedInput) return null

  try {
    // 1. 纯数字处理
    const digitOnly = trimmedInput.replace(/[^\d]/g, "")

    if (/^\d+$/.test(digitOnly)) {
      const len = digitOnly.length

      // 1-2位数字：H 或 HH (补全为 H:00)
      if (len <= 2) {
        const hours = parseInt(digitOnly, 10)
        if (hours >= 0 && hours <= 23) {
          return `${hours.toString().padStart(2, "0")}:00`
        }
      }

      // 3-4位数字：HMM 或 HHMM
      if (len === 3 || len === 4) {
        const paddedInput = digitOnly.padStart(4, "0")
        const hours = parseInt(paddedInput.substring(0, 2), 10)
        const minutes = parseInt(paddedInput.substring(2, 4), 10)

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
        }
      }
    }

    // 2. 带分隔符但不完整的时间
    const timeMatch = trimmedInput.match(/(\d{1,2})[:.](\d{0,2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minuteStr = timeMatch[2] || "00"
      const minutes = parseInt(minuteStr.padEnd(2, "0"), 10)

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 3. 包含 AM/PM 的处理
    const ampmMatch = trimmedInput.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm|上午|下午)/i)
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10)
      const minutes = parseInt(ampmMatch[2] || "0", 10)
      const period = ampmMatch[3].toLowerCase()

      if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
        // 转换为24小时制
        if ((period === "pm" || period === "下午") && hours !== 12) {
          hours += 12
        } else if ((period === "am" || period === "上午") && hours === 12) {
          hours = 0
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    }

    // 4. 中文时间描述
    const chineseTimePatterns = [
      { pattern: /(\d{1,2})\s*点/, hour: true },
      { pattern: /(\d{1,2})\s*时/, hour: true },
      { pattern: /(\d{1,2})\s*分/, minute: true },
    ]

    let parsedHour: number | null = null
    let parsedMinute: number | null = null

    for (const { pattern, hour } of chineseTimePatterns) {
      const match = trimmedInput.match(pattern)
      if (match) {
        const num = parseInt(match[1], 10)
        if (hour && num >= 0 && num <= 23) {
          parsedHour = num
        } else if (!hour && num >= 0 && num <= 59) {
          parsedMinute = num
        }
      }
    }

    if (parsedHour !== null) {
      const minutes = parsedMinute || 0
      return `${parsedHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }
  } catch (error) {
    // 解析失败
  }

  return null
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

// 日期存在性验证
export function isValidDateExists(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false

  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

// 格式自动识别
export function detectDateFormat(input: string): DateFormat {
  if (input.includes("年") && input.includes("月") && input.includes("日")) {
    return "yyyy年MM月dd日"
  }
  if (input.includes("/")) {
    // 判断是美式还是欧式
    const parts = input.split("/")
    if (parts.length >= 2) {
      const first = parseInt(parts[0], 10)
      if (first > 12) return "dd/MM/yyyy" // 欧式
      return "MM/dd/yyyy" // 美式
    }
  }
  if (input.includes("-")) return "yyyy-MM-dd"
  if (input.includes(".")) return "dd.MM.yyyy"
  return "yyyy-MM-dd" // 默认
}

// 快捷键处理
export function handleShortcuts(input: string): Date | null {
  const lower = input.toLowerCase().trim()
  const now = new Date()

  // 中英文快捷键
  const shortcuts: Record<string, () => Date> = {
    t: () => startOfDay(now),
    today: () => startOfDay(now),
    今: () => startOfDay(now),
    今天: () => startOfDay(now),

    y: () => startOfDay(subDays(now, 1)),
    yesterday: () => startOfDay(subDays(now, 1)),
    昨: () => startOfDay(subDays(now, 1)),
    昨天: () => startOfDay(subDays(now, 1)),

    tm: () => startOfDay(addDays(now, 1)),
    tomorrow: () => startOfDay(addDays(now, 1)),
    明: () => startOfDay(addDays(now, 1)),
    明天: () => startOfDay(addDays(now, 1)),

    w: () => startOfWeek(now),
    week: () => startOfWeek(now),
    周: () => startOfWeek(now),
    本周: () => startOfWeek(now),

    m: () => startOfMonth(now),
    month: () => startOfMonth(now),
    月: () => startOfMonth(now),
    本月: () => startOfMonth(now),
  }

  const handler = shortcuts[lower]
  return handler ? handler() : null
}

// 节假日识别
export function getHolidayInfo(month: number, day: number): string | undefined {
  const key = month.toString().padStart(2, "0") + day.toString().padStart(2, "0")
  return holidays[key] || undefined
}

// 相对日期扩展处理
export function parseExtendedRelativeDate(input: string): Date | null {
  const now = new Date()
  const patterns = [
    // +数字 (天数)
    {
      regex: /^\+(\d+)$/,
      handler: (match: RegExpMatchArray) => addDays(now, parseInt(match[1], 10)),
    },
    // -数字 (天数)
    {
      regex: /^-(\d+)$/,
      handler: (match: RegExpMatchArray) => subDays(now, parseInt(match[1], 10)),
    },

    // w+数字 (周数)
    {
      regex: /^w\+(\d+)$/i,
      handler: (match: RegExpMatchArray) => addWeeks(now, parseInt(match[1], 10)),
    },
    {
      regex: /^w-(\d+)$/i,
      handler: (match: RegExpMatchArray) => subWeeks(now, parseInt(match[1], 10)),
    },

    // m+数字 (月数)
    {
      regex: /^m\+(\d+)$/i,
      handler: (match: RegExpMatchArray) => addMonths(now, parseInt(match[1], 10)),
    },
    {
      regex: /^m-(\d+)$/i,
      handler: (match: RegExpMatchArray) => subMonths(now, parseInt(match[1], 10)),
    },

    // y+数字 (年数)
    {
      regex: /^y\+(\d+)$/i,
      handler: (match: RegExpMatchArray) => addYears(now, parseInt(match[1], 10)),
    },
    {
      regex: /^y-(\d+)$/i,
      handler: (match: RegExpMatchArray) => subYears(now, parseInt(match[1], 10)),
    },

    // 中文相对表达
    {
      regex: /^(\d+)天后$/,
      handler: (match: RegExpMatchArray) => addDays(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)天前$/,
      handler: (match: RegExpMatchArray) => subDays(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)周后$/,
      handler: (match: RegExpMatchArray) => addWeeks(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)周前$/,
      handler: (match: RegExpMatchArray) => subWeeks(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)月后$/,
      handler: (match: RegExpMatchArray) => addMonths(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)月前$/,
      handler: (match: RegExpMatchArray) => subMonths(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)年后$/,
      handler: (match: RegExpMatchArray) => addYears(now, parseInt(match[1], 10)),
    },
    {
      regex: /^(\d+)年前$/,
      handler: (match: RegExpMatchArray) => subYears(now, parseInt(match[1], 10)),
    },
  ]

  for (const pattern of patterns) {
    const match = input.trim().match(pattern.regex)
    if (match) {
      return pattern.handler(match)
    }
  }

  return null
}

// 输入预测和补全信息
export function getPredictionInfo(
  input: string,
  targetFormat: DateFormat,
): {
  description: string
  holiday?: string
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
        const holiday = getHolidayInfo(month, day)
        return {
          prediction: `${currentYear}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
          holiday,
          description: `当年${month}月${day}日${holiday ? ` (${holiday})` : ""}`,
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
        const holiday = getHolidayInfo(asMonth, asDay)
        return {
          prediction: `${currentYear}-${asMonth.toString().padStart(2, "0")}-${asDay.toString().padStart(2, "0")}`,
          holiday,
          description: `当年${asMonth}月${asDay}日${holiday ? ` (${holiday})` : ""}`,
        }
      }
    }
  }

  return null
}

// 智能月份识别
export function parseMonthName(input: string): number | null {
  const normalized = input.toLowerCase().trim()

  // 直接查找英文月份
  if (englishMonths[normalized]) {
    return englishMonths[normalized]
  }

  // 查找中文月份
  if (chineseMonths[input.trim()]) {
    return chineseMonths[input.trim()]
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

// 增强的英文日期解析
export function parseEnglishDate(input: string): Date | null {
  const normalized = input.toLowerCase().trim()
  const now = new Date()
  const currentYear = now.getFullYear()

  // 模式1: "may 15" 或 "may 15th" 或 "15 may"
  const monthDayPattern =
    /^(?:(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?)|(?:(\d{1,2})(?:st|nd|rd|th)?\s+(\w+))$/
  const monthDayMatch = normalized.match(monthDayPattern)

  if (monthDayMatch) {
    const monthName = monthDayMatch[1] || monthDayMatch[4]
    const dayStr = monthDayMatch[2] || monthDayMatch[3]

    const month = parseMonthName(monthName)
    const day = parseInt(dayStr, 10)

    if (month && day >= 1 && day <= 31) {
      const date = new Date(currentYear, month - 1, day)
      if (isValid(date)) return date
    }
  }

  // 模式2: "may 15, 2024" 或 "15 may 2024"
  const fullDatePattern =
    /^(?:(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4}))|(?:(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4}))$/
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
      if (isValid(date)) return date
    }
  }

  // 模式3: 只输入月份名 "may" → 当年5月1日
  const monthOnly = parseMonthName(normalized)
  if (monthOnly) {
    const date = new Date(currentYear, monthOnly - 1, 1)
    if (isValid(date)) return date
  }

  return null
}
