import { useMemo, useEffect } from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/zh-cn"

// 初始化dayjs插件
dayjs.extend(relativeTime)

export type DateLocale = "zh-cn" | "en-us"

/**
 * 格式化日期的自定义Hook
 *
 * @param date 日期或日期字符串
 * @param locale 语言设置 (zh-cn 或 en)
 * @param formatString 可选的日期时间格式字符串 (例如 'YYYY-MM-DD HH:mm:ss')
 * @returns 包含相对时间和完整格式化时间的对象
 */
export function useFormattedDate(
  date: string | Date,
  locale: DateLocale = "en-us",
  formatString?: string,
) {
  // 设置语言
  useEffect(() => {
    dayjs.locale(locale)
  }, [locale])

  // 格式化日期
  const { relative, full } = useMemo(() => {
    // 默认完整时间格式
    const defaultFullFormat = "YYYY-MM-DD HH:mm:ss"

    if (typeof date === "string") {
      // 如果传入的是字符串，尝试解析，如果失败则直接返回
      const parsedDate = dayjs(date)
      if (!parsedDate.isValid()) {
        return { relative: date, full: date }
      }
      return {
        relative: parsedDate.fromNow(),
        full: parsedDate.format(formatString || defaultFullFormat),
      }
    }

    // 如果是Date对象，使用dayjs格式化
    const dateObj = dayjs(date)
    const now = dayjs()

    let relativeTimeDisplay: string
    // 如果小于24小时，显示相对时间
    if (now.diff(dateObj, "hour") < 24) {
      relativeTimeDisplay = dateObj.fromNow() // 例如："2小时前" 或 "2 hours ago"
    }
    // 如果是今年内的日期，显示月和日
    else if (now.year() === dateObj.year()) {
      relativeTimeDisplay =
        locale === "zh-cn"
          ? dateObj.format("M月D日") // 例如："3月15日"
          : dateObj.format("MMM D") // 例如："Mar 15"
    }
    // 如果是不同年份，显示完整日期
    else {
      relativeTimeDisplay =
        locale === "zh-cn"
          ? dateObj.format("YYYY年M月D日") // 例如："2023年3月15日"
          : dateObj.format("MMM D, YYYY") // 例如："Mar 15, 2023"
    }

    return {
      relative: relativeTimeDisplay,
      full: dateObj.format(formatString || defaultFullFormat),
    }
  }, [date, locale, formatString])

  return { relative, full }
}
