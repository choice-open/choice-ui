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
  /** 禁用的日期数组 */
  disabledDates?: Date[]
  /** 是否固定6行显示（42天），默认true确保高度一致 */
  fixedGrid?: boolean
  /** 需要高亮的日期数组 */
  highlightDates?: Date[]
  /** 是否高亮今天 */
  highlightToday?: boolean
  /** 语言区域 */
  locale?: string
  /** 最大可选日期 */
  maxDate?: Date
  /** 最小可选日期 */
  minDate?: Date
  /** 是否启用多选模式 */
  multiSelect?: boolean
  /** 日期点击回调 */
  onDateClick?: (date: Date) => void
  /** 月份变更回调 */
  onMonthChange?: (month: Date) => void
  /** 多选模式下的选择变更回调 */
  onMultiSelect?: (dates: Date[]) => void
  /** 范围选择变更回调 */
  onRangeSelect?: (range: DateRange | null) => void
  /** 是否启用范围选择模式 */
  rangeSelect?: boolean
  /** 单选模式下的选中日期 */
  selectedDate?: Date
  /** 多选模式下的选中日期数组 */
  selectedDates?: Date[]
  /** 范围选择模式下的选中范围 */
  selectedRange?: DateRange
  /** 是否显示非当前月份的日期 */
  showOutsideDays?: boolean

  /** 是否显示周数，默认false */
  showWeekNumbers?: boolean
  /** 时区 */
  timeZone?: string
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
