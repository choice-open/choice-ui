export interface YearPickerProps {
  /** 自定义类名 */
  className?: string
  /** 当前显示的年份（用于高亮） */
  currentYear?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用的年份数组 */
  disabledYears?: number[]
  /** 最大可选年份 */
  maxYear?: number
  /** 最小可选年份 */
  minYear?: number
  /** 年份范围导航回调 */
  onNavigate?: (direction: "prev" | "next", newStartYear: number) => void
  /** 年份选择变化回调 */
  onYearSelect?: (year: number) => void
  /** 当前选中的年份 */
  selectedYear?: number
  /** 显示年份范围的起始年份，默认为当前年份-10 */
  startYear?: number
  /** 显示年份的数量，默认12个 */
  yearCount?: number
}

export interface YearItem {
  isCurrent: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  year: number
}
