import { type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import type { DateFormat } from "../../types"
import { defaultLocaleMap } from "../constants"

// 获取语言环境
export function getLocale(localeKey?: string): Locale {
  if (!localeKey) return enUS
  return defaultLocaleMap[localeKey] || enUS
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
