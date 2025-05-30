import { format, parse, isValid, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { DateFormat, DateInputValue, DateParserOptions } from "../../date-input/types"
import { commonDateFormats } from "./constants"
import { getLocaleKey, parseNaturalLanguage } from "./natural-language"
import { parseRelativeDate } from "./relative-dates"

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
    for (const tryFormat of commonDateFormats) {
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
