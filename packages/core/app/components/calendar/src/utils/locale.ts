import type { Locale } from "date-fns"
import { zhCN, enUS, ja, ko, de, fr, es } from "date-fns/locale"

// 🗺️ 字符串 locale 到 Locale 对象的映射
export const LOCALE_MAP: Record<string, Locale> = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": ja,
  "ko-KR": ko,
  "de-DE": de,
  "fr-FR": fr,
  "es-ES": es,
}

/**
 * 🔧 安全的 locale 解析函数
 *
 * 支持以下输入格式：
 * - Locale 对象：直接返回
 * - 字符串：自动映射到对应的 Locale 对象
 * - 无效值：返回中文 locale (zhCN)
 *
 * @param locale - 可以是 Locale 对象或字符串
 * @returns 解析后的 Locale 对象
 *
 * @example
 * ```ts
 * resolveLocale("zh-CN") // → zhCN
 * resolveLocale("en-US") // → enUS
 * resolveLocale(enUS) // → enUS
 * resolveLocale("invalid") // → zhCN (with warning)
 * ```
 */
export function resolveLocale(locale: Locale | string | undefined | null): Locale {
  // 如果已经是 Locale 对象，直接返回
  if (locale && typeof locale === "object" && locale.code) {
    return locale
  }

  // 如果是字符串，尝试映射
  if (typeof locale === "string") {
    const mapped = LOCALE_MAP[locale]
    if (mapped) {
      return mapped
    }
    console.warn(`⚠️ Unknown locale string: ${locale}, falling back to zhCN`)
  }

  // 无效输入，返回中文作为默认值
  if (locale !== undefined && locale !== null) {
    console.warn(`⚠️ Invalid locale type: ${typeof locale}, falling back to zhCN`)
  }

  return zhCN
}

/**
 * 🔍 获取所有支持的 locale 列表
 * @returns 支持的 locale 字符串数组
 */
export function getSupportedLocales(): string[] {
  return Object.keys(LOCALE_MAP)
}

/**
 * 🎯 检查是否为中文 locale
 * @param locale - Locale 对象或字符串
 * @returns 是否为中文
 */
export function isChineseLocale(locale: Locale | string | undefined | null): boolean {
  const resolved = resolveLocale(locale)
  return resolved === zhCN || resolved.code === "zh-CN"
}
