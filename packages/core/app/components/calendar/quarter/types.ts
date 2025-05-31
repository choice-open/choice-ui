import type { Locale } from "date-fns"
import type { Quarter } from "../utils"

export interface QuarterCalendarProps {
  /** 自定义类名 */
  className?: string
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
  /** 年份范围导航回调 */
  onNavigate?: (direction: "prev" | "next", newYear: number) => void
  /** 显示的年份 */
  startYear?: number
  /** 当前选中的季度 */
  value?: Quarter | null
  variant?: "default" | "dark"
}

export interface QuarterItem {
  isCurrent: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  quarter: Quarter
}
