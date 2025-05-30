import type { Locale } from "date-fns"

export type DateFormat =
  | "yyyy-MM-dd"
  | "MM/dd/yyyy"
  | "dd/MM/yyyy"
  | "dd.MM.yyyy"
  | "yyyy年MM月dd日"
  | "MMMM dd, yyyy"
  | "dd MMMM yyyy"
  | "MMM dd, yyyy"
  | "dd MMM yyyy"
  | "yyyy/MM/dd"
  | "M/d/yyyy"
  | "d/M/yyyy"
  | "d.M.yyyy"

export type TimeFormat =
  | "HH:mm"
  | "HH:mm:ss"
  | "H:mm"
  | "H:mm:ss"
  | "h:mm a"
  | "h:mm:ss a"
  | "hh:mm a"
  | "hh:mm:ss a"
  | "h:mm aa"
  | "h:mm:ss aa"

export interface DateInputValue {
  /** 解析后的日期对象 */
  date: Date | null
  /** 解析错误信息 */
  error: string | null
  /** 格式化后的显示值 */
  formatted: string
  /** 原始输入值 */
  input: string
  /** 是否为有效日期 */
  isValid: boolean
}

export interface TimeInputValue {
  /** 解析错误信息 */
  error: string | null
  /** 格式化后的显示值 */
  formatted: string
  /** 原始输入值 */
  input: string
  /** 是否为有效时间 */
  isValid: boolean
  /** 解析后的时间（24小时格式 HH:mm） */
  time: string | null
}

export interface DateParserOptions {
  /** 是否启用自然语言解析 */
  enableNaturalLanguage?: boolean
  /** 是否启用相对日期解析 */
  enableRelativeDate?: boolean
  /** 日期格式 */
  format: DateFormat
  /** 语言区域 */
  locale?: Locale
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  /** 严格模式（不允许无效日期） */
  strict?: boolean
}

export interface TimeParserOptions {
  /** 时间格式 */
  format: TimeFormat
  /** 语言区域 */
  locale?: Locale
  /** 最大时间 */
  maxTime?: string
  /** 最小时间 */
  minTime?: string
  /** 时间间隔（分钟） */
  step?: number
  /** 严格模式 */
  strict?: boolean
}

export interface SmartInputOptions {
  /** 去抖延迟（毫秒） */
  debounceMs?: number
  /** 是否启用自动完成 */
  enableAutoComplete?: boolean
  /** 是否启用键盘导航 */
  enableKeyboardNavigation?: boolean
  /** 是否启用实时验证 */
  enableLiveValidation?: boolean
  /** 是否显示解析预览 */
  showParsePreview?: boolean
}

// 自然语言关键词映射
export interface NaturalLanguageMap {
  afternoon: string[]
  evening: string[]
  lastMonth: string[]
  lastWeek: string[]
  lastYear: string[]
  morning: string[]
  nextMonth: string[]
  nextWeek: string[]
  nextYear: string[]
  night: string[]
  now: string[]
  thisMonth: string[]
  thisWeek: string[]
  thisYear: string[]
  today: string[]
  tomorrow: string[]
  yesterday: string[]
}

// 相对日期模式
export interface RelativeDatePattern {
  multiplier: number
  pattern: RegExp
  type: "day" | "week" | "month" | "year"
}

export interface DateInputProps {
  /** 自定义类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 错误状态 */
  error?: boolean
  /** 日期格式 */
  format?: DateFormat
  /** 智能输入选项 */
  inputOptions?: Partial<SmartInputOptions>
  /** 语言区域 */
  locale?: Locale
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  /** 值变化回调 */
  onChange?: (value: Date | null) => void
  /** 输入值变化回调 */
  onInputChange?: (value: DateInputValue) => void
  /** 解析器选项 */
  parserOptions?: Partial<DateParserOptions>
  /** 占位符 */
  placeholder?: string
  /** 是否只读 */
  readOnly?: boolean
  /** 当前值 */
  value?: Date | null
}

export interface TimeInputProps {
  /** 自定义类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 错误状态 */
  error?: boolean
  /** 时间格式 */
  format?: TimeFormat
  /** 智能输入选项 */
  inputOptions?: Partial<SmartInputOptions>
  /** 语言区域 */
  locale?: Locale
  /** 最大时间 */
  maxTime?: string
  /** 最小时间 */
  minTime?: string
  /** 值变化回调 */
  onChange?: (value: string | null) => void
  /** 输入值变化回调 */
  onInputChange?: (value: TimeInputValue) => void
  /** 解析器选项 */
  parserOptions?: Partial<TimeParserOptions>
  /** 占位符 */
  placeholder?: string
  /** 是否只读 */
  readOnly?: boolean
  /** 是否显示时间选项列表 */
  showTimeList?: boolean
  /** 时间间隔（分钟） */
  step?: number
  /** 当前值（HH:mm 格式） */
  value?: string | null
}
