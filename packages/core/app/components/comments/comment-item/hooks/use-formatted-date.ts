import { format, formatDistanceToNow, isValid, parseISO } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { useMemo } from "react"

export type DateLocale = "zh-cn" | "en-us"

/**
 * 格式化日期的自定义Hook
 *
 * @param date 日期或日期字符串
 * @param locale 语言设置 (zh-cn 或 en)
 * @param formatString 可选的日期时间格式字符串 (例如 'yyyy-MM-dd HH:mm:ss')
 * @returns 包含相对时间和完整格式化时间的对象
 */
export function useFormattedDate(
  date: string | Date,
  locale: DateLocale = "en-us",
  formatString?: string,
) {
  // 格式化日期
  const { relative, full } = useMemo(() => {
    // 默认完整时间格式
    const defaultFullFormat = "yyyy-MM-dd HH:mm:ss"

    // 获取对应的 locale
    const dateLocale = locale === "zh-cn" ? zhCN : enUS

    let dateObj: Date

    if (typeof date === "string") {
      // 如果传入的是字符串，尝试解析
      dateObj = parseISO(date)
      if (!isValid(dateObj)) {
        return { relative: date, full: date }
      }
    } else {
      dateObj = date
    }

    const now = new Date()
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)

    let relativeTimeDisplay: string
    // 如果小于24小时，显示相对时间
    if (diffInHours < 24) {
      relativeTimeDisplay = formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: dateLocale,
      })
    }
    // 如果是今年内的日期，显示月和日
    else if (now.getFullYear() === dateObj.getFullYear()) {
      relativeTimeDisplay = format(dateObj, locale === "zh-cn" ? "M月d日" : "MMM d", {
        locale: dateLocale,
      })
    }
    // 如果是不同年份，显示完整日期
    else {
      relativeTimeDisplay = format(dateObj, locale === "zh-cn" ? "yyyy年M月d日" : "MMM d, yyyy", {
        locale: dateLocale,
      })
    }

    return {
      relative: relativeTimeDisplay,
      full: format(dateObj, formatString || defaultFullFormat, { locale: dateLocale }),
    }
  }, [date, locale, formatString])

  return { relative, full }
}
