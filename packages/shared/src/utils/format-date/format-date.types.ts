import type { Locale } from "date-fns"

export type SupportedLanguage = "en" | "cn" | "ja" | "ko" | "es" | "fr" | "de" | "pt" | "ru" | "ar"

export interface TimezoneOptions {
  referenceTime?: Date
  useUTC?: boolean
}

export interface CustomFormatOptions {
  fullDate?: string
  monthDay?: string
  time?: string
}

export interface FormatRelativeTimeOptions {
  customFormat?: CustomFormatOptions
  daysThreshold?: number
  forceNumericFormat?: boolean
  language?: SupportedLanguage
  showSpecificTime?: boolean
  timezone?: TimezoneOptions
  yearThreshold?: number
}

export interface LanguageConfig {
  language: SupportedLanguage
  locale: Locale
  t: TranslationConfig
}

export interface TranslationConfig {
  common: {
    relativeTime: {
      dateAt: (params: { date: string; time: string }) => string
      today: (params: { time: string }) => string
      weekdayAt: (params: { time: string; weekday: string }) => string
      yesterday: (params: { time: string }) => string
    }
  }
}

export interface DateFormatterConfig {
  defaultDaysThreshold?: number
  defaultLanguage?: SupportedLanguage
  defaultTimezone?: TimezoneOptions
  defaultYearThreshold?: number
}
