import type { Locale } from "date-fns"

export interface Time {
  hour: number
  minute: number
}

export type TimeFormat = "12h" | "24h"

export type TimeLayout = "single" | "dual"

export interface TimeCalendarProps {
  /** 自定义类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 时间格式，默认24小时制 */
  format?: TimeFormat
  /** 小时步进，默认1小时 */
  hourStep?: number
  /** 布局模式：single(单列) 或 dual(双列)，默认single */
  layout?: TimeLayout
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大时间 */
  maxTime?: Time
  /** 最小时间 */
  minTime?: Time
  /** 分钟步进，默认15分钟 */
  minuteStep?: number
  /** 时间变化回调 */
  onChange?: (time: Time) => void
  /** 当前选中的时间 */
  value?: Time
}

export interface TimeOptionItem {
  disabled?: boolean
  label: string
  value: Time
}
