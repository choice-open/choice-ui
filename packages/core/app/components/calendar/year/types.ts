import type { Locale } from "date-fns"

export interface YearCalendarProps {
  /** 自定义类名 */
  className?: string
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
  /** 年份范围导航回调 */
  onNavigate?: (direction: "prev" | "next", newStartYear: Date) => void
  /** 显示年份范围的起始年份，默认为当前年份-10 */
  startYear?: Date
  /** 当前选中的年份 */
  value?: Date | null
  variant?: "default" | "dark"
  /** 显示年份的数量，默认12个 */
  yearCount?: number
}

export interface YearItem {
  isCurrent: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  year: Date
}
