import { Locale } from "date-fns"

export interface DateRange {
  end: Date
  start: Date
}

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type DateComparisonMode = "exact-time" | "date-only"

export type Time = {
  hour: number
  minute: number
}

/** 日历选择值的类型 */
export type CalendarValue = Date | Date[] | DateRange | null

/** 选择模式 */
export type SelectionMode = "single" | "multiple" | "range"

export interface MonthCalendarProps {
  className?: string
  /** 当前显示的月份 */
  currentMonth?: Date
  /**
   * 日期比较模式
   * - 'exact-time': 精确时间比较，适用于时间敏感的应用（如会议系统）
   * - 'date-only': 仅日期比较，适用于日期选择器等场景（默认）
   */
  dateComparisonMode?: DateComparisonMode
  /** 非受控模式的默认值 */
  defaultValue?: CalendarValue
  direction?: "horizontal" | "vertical"
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
  /**
   * 选择模式，如果未指定，会根据 value 类型自动推断
   * - 'single': 单选模式
   * - 'multiple': 多选模式
   * - 'range': 范围选择模式
   */
  selectionMode?: SelectionMode
  /** 是否显示非当前月份的日期 */
  showOutsideDays?: boolean
  /** 是否显示周数，默认false */
  showWeekNumbers?: boolean
  /** 时区 */
  timeZone?: string
  /** 受控模式的值 */
  value?: CalendarValue
  variant?: "default" | "dark"
  /** 一周开始的日期（0=周日, 1=周一） */
  weekStartsOn?: WeekStartsOn
  /** 自定义星期名称 */
  weekdayNames?: string[]
}

export interface CalendarState {
  isSingleDay: boolean
  selectedRange: {
    end: Date
    endTime: Time
    start: Date
    startTime: Time
  } | null
}

export interface CalendarDragSelectionState {
  currentDate: Date | null
  isDragging: boolean
  isPreparing: boolean
  startDate: Date | null
}

export interface CalendarActions {
  clearSelection(): void
  getSelectedDateRange(): { end: Date; start: Date } | null
  isDateSelected(date: Date): boolean
  selectDate(date: Date): void
  selectRange(start: Date, end: Date): void
}
