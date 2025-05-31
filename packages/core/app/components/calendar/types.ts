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
