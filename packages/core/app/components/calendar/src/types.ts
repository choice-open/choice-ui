/**
 * 日期格式字符串
 *
 * 支持所有 date-fns 格式字符串，常用格式示例：
 *
 * **年份**：
 * - yyyy: 2025 (4位年份)
 * - yy: 25 (2位年份)
 *
 * **月份**：
 * - MMMM: December (完整月份名)
 * - MMM: Dec (缩写月份名)
 * - MM: 12 (2位数字月份)
 * - M: 12 (1-2位数字月份)
 *
 * **日期**：
 * - dd: 31 (2位日期)
 * - d: 31 (1-2位日期)
 *
 * **常用组合**：
 * - "yyyy-MM-dd" → 2025-12-31
 * - "yy-MM-dd" → 25-12-31
 * - "yyyy年MM月dd日" → 2025年12月31日
 * - "yy年M月d日" → 25年12月31日
 * - "MMMM dd, yyyy" → December 31, 2025
 * - "MMM dd, yy" → Dec 31, 25
 * - "MM/dd/yyyy" → 12/31/2025
 * - "dd.MM.yy" → 31.12.25
 *
 * @see https://date-fns.org/v2.29.3/docs/format
 */
export type DateFormat = string

/**
 * 时间格式字符串
 *
 * 支持所有 date-fns 时间格式字符串，常用格式示例：
 *
 * **24小时制**：
 * - "HH:mm" → 09:30, 14:45 (2位小时)
 * - "H:mm" → 9:30, 14:45 (1-2位小时)
 * - "HH:mm:ss" → 09:30:15 (带秒)
 * - "HHmm" → 0930, 1445 (紧凑格式)
 *
 * **12小时制**：
 * - "h:mm a" → 9:30 AM, 2:45 PM
 * - "hh:mm a" → 09:30 AM, 02:45 PM (2位小时)
 * - "h:mm aa" → 9:30 A.M., 2:45 P.M. (完整AM/PM)
 * - "h:mm:ss a" → 9:30:15 AM (带秒)
 *
 * @see https://date-fns.org/v2.29.3/docs/format
 */
export type TimeFormat = string

// ====== 时间相关的基础类型 ======

import type { Day, Locale, Quarter as Quarters } from "date-fns"

/**
 * 时间对象（小时和分钟）
 */
export interface Time {
  hour: number
  minute: number
}

/**
 * 时间布局模式
 */
export type TimeLayout = "single" | "dual"

// ====== 时间解析相关类型 ======

/**
 * 时间输入解析结果
 */
export interface TimeInputValue {
  /** 解析错误信息 */
  error: string | null
  /** 格式化后的显示值 */
  formatted: string
  /** 原始输入值 */
  input: string
  /** 是否为有效时间 */
  isValid: boolean
  /** 解析后的时间 Date 对象 */
  time: Date | null
}

/**
 * 时间解析选项
 */
export interface TimeParserOptions {
  /** 时间格式 */
  format: TimeFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 严格模式 */
  strict?: boolean
}

// ====== 时间组件的公共属性接口 ======

/**
 * 时间组件的基础属性
 */
export interface BaseTimeProps {
  /** 默认值 */
  defaultValue?: Date | null
  /** 是否禁用 */
  disabled?: boolean
  /** 时间格式，支持所有 date-fns 格式字符串 */
  format?: TimeFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大时间 */
  maxTime?: Date
  /** 最小时间 */
  minTime?: Date
  /** 时间变化回调 */
  onChange?: (time: Date | null) => void
  /** 是否只读（禁用选择但不改变样式） */
  readOnly?: boolean
  /** 当前选中的时间 */
  value?: Date | null
}

/**
 * 时间步长相关属性
 */
export interface StepProps {
  /** Meta/Ctrl + 按键的步长（分钟），默认60分钟 */
  metaStep?: number
  /** Shift + 按键的步长（分钟），默认15分钟 */
  shiftStep?: number
  /** 基础步长（分钟），默认1分钟 */
  step?: number
}

/**
 * 时间交互功能属性
 */
export interface TimeInteractionProps {
  /** 是否启用解析缓存 */
  enableCache?: boolean
  /** 是否启用键盘导航（默认启用） */
  enableKeyboardNavigation?: boolean
  /** 是否启用性能分析 */
  enableProfiling?: boolean
  /** 按下 Enter 键的回调 */
  onEnterKeyDown?: () => void
}

/**
 * 时间选项项
 */
export interface TimeOptionItem {
  disabled?: boolean
  label: string
  value: Time
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

// ====== 日期相关的基础类型 ======

/**
 * 日期范围对象
 */
export interface DateRange {
  end: Date
  start: Date
}

/**
 * 一周开始的日期
 */
export type WeekStartsOn = Day

/**
 * 日期比较模式
 */
export type DateComparisonMode = "exact-time" | "date-only"

/**
 * 日历选择值的类型
 */
export type CalendarValue = Date | Date[] | DateRange | null

/**
 * 选择模式
 */
export type SelectionMode = "single" | "multiple" | "range"

// ====== 日期解析相关类型 ======

/**
 * 日期输入解析结果
 */
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

/**
 * 日期解析选项
 */
export interface DateParserOptions {
  /** 是否启用自然语言解析 */
  enableNaturalLanguage?: boolean
  /** 是否启用相对日期解析 */
  enableRelativeDate?: boolean
  /** 是否启用智能修正 */
  enableSmartCorrection?: boolean
  /** 日期格式 */
  format: DateFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  /** 严格模式（不允许无效日期） */
  strict?: boolean
}

// ====== 自然语言相关类型 ======

/**
 * 自然语言关键词映射
 */
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

/**
 * 相对日期模式
 */
export interface RelativeDatePattern {
  multiplier: number
  pattern: RegExp
  type: "day" | "week" | "month" | "year"
}

// ====== 日期组件的公共属性接口 ======

/**
 * 日期组件的基础属性
 */
export interface BaseDateProps {
  /** 默认值 */
  defaultValue?: Date | null
  /** 是否禁用 */
  disabled?: boolean
  /** 日期格式，支持所有 date-fns 格式字符串 */
  format?: DateFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  /** 日期变化回调 */
  onChange?: (date: Date | null) => void
  /** 当前选中的日期 */
  value?: Date | null
}

/**
 * 日期交互功能属性
 */
export interface DateInteractionProps {
  /** 是否启用解析缓存 */
  enableCache?: boolean
  /** 是否启用键盘导航（默认启用） */
  enableKeyboardNavigation?: boolean
  /** 是否启用预测功能 */
  enablePrediction?: boolean
  /** 是否启用性能分析 */
  enableProfiling?: boolean
  /** 按下 Enter 键的回调 */
  onEnterKeyDown?: () => void
}

/**
 * 月历组件的基础属性
 */
export interface BaseCalendarProps {
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 当前显示的月份 */
  currentMonth?: Date
  /** 日期比较模式 */
  dateComparisonMode?: DateComparisonMode
  /** 非受控模式的默认值 */
  defaultValue?: CalendarValue
  /** 禁用的日期数组 */
  disabledDates?: Date[]
  /** 是否固定6行显示（42天），默认true确保高度一致 */
  fixedGrid?: boolean
  /** 需要高亮的日期数组 */
  highlightDates?: Date[]
  /** 是否高亮今天 */
  highlightToday?: boolean
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大可选日期 */
  maxDate?: Date
  /** 最小可选日期 */
  minDate?: Date
  /** 值变更回调 */
  onChange?: (value: CalendarValue) => void
  /** 月份变更回调 */
  onMonthChange?: (month: Date) => void
  /** 是否只读（禁用选择但不改变样式） */
  readOnly?: boolean
  /** 选择模式，如果未指定，会根据 value 类型自动推断 */
  selectionMode?: SelectionMode
  /** 是否显示非当前月份的日期 */
  showOutsideDays?: boolean
  /** 是否显示周数，默认false */
  showWeekNumbers?: boolean
  /** 时区 */
  timeZone?: string
  /** 受控模式的值 */
  value?: CalendarValue
  /** 一周开始的日期（0=周日, 1=周一） */
  weekStartsOn?: WeekStartsOn
  /** 自定义星期名称 */
  weekdayNames?: string[]
}

/**
 * 月历布局相关属性
 */
export interface CalendarLayoutProps {
  /** 方向 */
  direction?: "horizontal" | "vertical"
  /** 变体样式 */
  variant?: "default" | "dark"
}

// ====== 日历状态相关类型 ======

/**
 * 日历状态接口
 */
export interface CalendarState {
  isSingleDay: boolean
  selectedRange: {
    end: Date
    endTime: Time
    start: Date
    startTime: Time
  } | null
}

/**
 * 日历拖拽选择状态
 */
export interface CalendarDragSelectionState {
  currentDate: Date | null
  isDragging: boolean
  isPreparing: boolean
  startDate: Date | null
}

/**
 * 日历操作接口
 */
export interface CalendarActions {
  clearSelection(): void
  getSelectedDateRange(): { end: Date; start: Date } | null
  isDateSelected(date: Date): boolean
  selectDate(date: Date): void
  selectRange(start: Date, end: Date): void
}

// ====== 季度相关的基础类型 ======

/**
 * 季度对象
 */
export interface Quarter {
  label: string
  months: string[]
  quarter: Quarters // 1, 2, 3, 4
  year: number
}

/**
 * 季度项目状态
 */
export interface QuarterItem {
  isCurrent: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  quarter: Quarter
}

/**
 * 年份项目状态
 */
export interface YearItem {
  isCurrent: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  year: Date
}

// ====== 季度组件的公共属性接口 ======

/**
 * 季度组件的基础属性
 */
export interface BaseQuarterProps {
  children?: React.ReactNode
  /** 当前显示的年份 */
  currentYear?: number
  /** 默认值 */
  defaultValue?: Quarter
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用的季度数组 */
  disabledQuarters?: Array<{ quarter: number; year: number }>
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大可选年份 */
  maxYear?: number
  /** 最小可选年份 */
  minYear?: number
  /** 季度选择变化回调 */
  onChange?: (quarter: Quarter | null) => void
  /** 是否只读（禁用选择但不改变样式） */
  readOnly?: boolean
  /** 显示的年份 */
  startYear?: number
  /** 当前选中的季度 */
  value?: Quarter | null
}

/**
 * 季度导航相关属性
 */
export interface QuarterNavigationProps {
  /** 年份范围导航回调 */
  onNavigate?: (direction: "prev" | "next", newYear: number) => void
}

/**
 * 季度布局相关属性
 */
export interface QuarterLayoutProps {
  /** 自定义类名 */
  className?: string
  /** 变体样式 */
  variant?: "default" | "dark"
}

// ====== 年份组件的公共属性接口 ======

/**
 * 年份组件的基础属性
 */
export interface BaseYearProps {
  children?: React.ReactNode
  /** 当前显示的年份（用于高亮） */
  currentYear?: Date
  /** 默认值 */
  defaultValue?: Date
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用的年份数组 */
  disabledYears?: Date[]
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大可选年份 */
  maxYear?: Date
  /** 最小可选年份 */
  minYear?: Date
  /** 年份选择变化回调 */
  onChange?: (year: Date | null) => void
  /** 是否只读（禁用选择但不改变样式） */
  readOnly?: boolean
  /** 显示年份范围的起始年份，默认为当前年份-10 */
  startYear?: Date
  /** 当前选中的年份 */
  value?: Date | null
  /** 显示年份的数量，默认12个 */
  yearCount?: number
}

/**
 * 年份导航相关属性
 */
export interface YearNavigationProps {
  /** 年份范围导航回调 */
  onNavigate?: (direction: "prev" | "next", newStartYear: Date) => void
}

/**
 * 年份布局相关属性
 */
export interface YearLayoutProps {
  /** 自定义类名 */
  className?: string
  /** 变体样式 */
  variant?: "default" | "dark"
}
