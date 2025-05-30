import { enUS, zhCN, type Locale } from "date-fns/locale"
import type { NaturalLanguageMap, RelativeDatePattern } from "../../date-input/types"

// 默认语言环境映射
export const defaultLocaleMap: Record<string, Locale> = {
  "zh-CN": zhCN,
  "en-US": enUS,
}

// 自然语言关键词映射
export const naturalLanguageMap: Record<string, NaturalLanguageMap> = {
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
export const relativeDatePatterns: RelativeDatePattern[] = [
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

// 常见日期格式
export const commonDateFormats = [
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

// 常见时间格式
export const commonTimeFormats = [
  "HH:mm",
  "HH:mm:ss",
  "H:mm",
  "h:mm a",
  "hh:mm a",
  "h:mm aa",
  "HHmm",
  "Hmm",
]
