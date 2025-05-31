import type { Locale } from "date-fns"
import type { TimeFormat } from "../types"

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

export interface TimeParserOptions {
  /** 时间格式 */
  format: TimeFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 严格模式 */
  strict?: boolean
}
