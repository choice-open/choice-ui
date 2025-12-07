import { enUS, zhCN, type Locale } from "date-fns/locale"
import type { CalendarValue, NaturalLanguageMap, RelativeDatePattern } from "../types"

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
    night: ["深夜", "夜里", "夜间", "午夜"],
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

// 常见日期格式 - 按使用频率排序优化性能
export const commonDateFormats = [
  "yyyy-MM-dd", // 最常用的 ISO 格式
  "MM/dd/yyyy", // 美式格式
  "dd/MM/yyyy", // 欧式格式
  "yyyy/MM/dd", // 日式格式
  "yyyyMMdd", // 紧凑格式
  "yyyy-M-d", // 宽松格式
  "yyyy/M/d",
  "M/d/yyyy",
  "d/M/yyyy",
  "dd.MM.yyyy", // 德式格式
  "yyyy.MM.dd",
]

// 常见时间格式 - 按使用频率排序
export const commonTimeFormats = [
  "HH:mm", // 24小时制（最常用）
  "H:mm", // 24小时制不补零
  "HH:mm:ss", // 带秒
  "h:mm a", // 12小时制
  "hh:mm a", // 12小时制补零
  "h:mm aa",
  "HHmm", // 紧凑格式
  "Hmm",
]

// 解析器性能配置
export const parserConfig = {
  // 解析器优先级（数字越小优先级越高）
  priority: {
    digits: 1, // 纯数字解析（最快）
    shortcuts: 2, // 快捷键解析
    standardFormat: 3, // 标准格式解析
    naturalLanguage: 4, // 自然语言解析
    relativeDate: 5, // 相对日期解析
    englishDate: 6, // 英文日期解析
    fuzzyMatch: 7, // 模糊匹配（最慢）
  },

  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 100, // 最大缓存条目数
    ttl: 60000, // 缓存时间 (ms)
  },

  // 性能阈值
  performance: {
    maxParseTime: 50, // 最大解析时间 (ms)
    enableProfiling: false, // 是否启用性能分析
  },
}

// 简单的 LRU 缓存实现
class SimpleCache<T> {
  private cache = new Map<string, { timestamp: number; value: T }>()
  private maxSize: number
  private ttl: number

  constructor(maxSize: number = 100, ttl: number = 60000) {
    this.maxSize = maxSize
    this.ttl = ttl
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = Array.from(this.cache.keys())[0]
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, { value, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}

// 全局解析缓存
export const parseCache = new SimpleCache<Date | null>(
  parserConfig.cache.maxSize,
  parserConfig.cache.ttl,
)
