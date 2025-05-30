export interface Quarter {
  label: string
  // Q1, Q2, Q3, Q4
  months: string[]
  quarter: number
  // 1, 2, 3, 4
  year: number // 该季度包含的月份
}

export interface QuarterPickerProps {
  /** 自定义类名 */
  className?: string
  /** 当前显示的年份 */
  currentYear?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用的季度数组 */
  disabledQuarters?: Array<{ quarter: number; year: number }>
  /** 季度标签的语言 */
  locale?: string
  /** 最大可选年份 */
  maxYear?: number
  /** 最小可选年份 */
  minYear?: number
  /** 季度选择变化回调 */
  onQuarterSelect?: (quarter: Quarter) => void
  /** 年份变化回调 */
  onYearChange?: (year: number) => void
  /** 当前选中的季度 */
  selectedQuarter?: Quarter
}

export interface QuarterItem {
  isCurrent: boolean
  isDisabled: boolean
  isSelected: boolean
  quarter: Quarter
}
