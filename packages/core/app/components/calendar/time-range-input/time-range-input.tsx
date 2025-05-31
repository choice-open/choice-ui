import { ArrowRight } from "@choiceform/icons-react"
import { Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import { useMemo } from "react"
import { TimeInput } from "../time-input"
import type { TimeFormat } from "../types"
import { resolveLocale } from "../utils"

interface TimeRangeInputProps {
  endPlaceholder?: string
  endValue?: string | null
  format?: TimeFormat
  locale?: Locale | string
  onEndChange?: (time: string | null) => void
  onEndFocus?: () => void
  onEnterKeyDown?: () => void
  onStartChange?: (time: string | null) => void
  onStartFocus?: () => void
  startPlaceholder?: string
  startValue?: string | null
}

/**
 * 计算时间差（以分钟为单位）
 */
function calculateTimeDifferenceInMinutes(startTime: string, endTime: string): number {
  // 更宽松的时间解析 - 支持 H:mm 和 HH:mm 格式
  const parseTime = (timeStr: string): [number, number] => {
    const parts = timeStr.split(":")
    if (parts.length !== 2) {
      throw new Error(`Invalid time format: ${timeStr}`)
    }
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time values: ${timeStr}`)
    }

    return [hours, minutes]
  }

  const [startHours, startMinutes] = parseTime(startTime)
  const [endHours, endMinutes] = parseTime(endTime)

  const startTotalMinutes = startHours * 60 + startMinutes
  let endTotalMinutes = endHours * 60 + endMinutes

  // 处理跨日情况（如 22:00 到 02:00）
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60 // 加一天
  }

  return endTotalMinutes - startTotalMinutes
}

/**
 * 格式化时间差显示
 */
function formatTimeDuration(minutes: number, locale: Locale): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  const localeKey = locale.code || "en-US"

  // 中文系列
  if (localeKey.startsWith("zh")) {
    if (hours === 0) {
      return `${remainingMinutes}分钟`
    } else if (remainingMinutes === 0) {
      return `${hours}小时`
    } else {
      return `${hours}小时${remainingMinutes}分钟`
    }
  }

  // 日文
  if (localeKey.startsWith("ja")) {
    if (hours === 0) {
      return `${remainingMinutes}分`
    } else if (remainingMinutes === 0) {
      return `${hours}時間`
    } else {
      return `${hours}時間${remainingMinutes}分`
    }
  }

  // 韩文
  if (localeKey.startsWith("ko")) {
    if (hours === 0) {
      return `${remainingMinutes}분`
    } else if (remainingMinutes === 0) {
      return `${hours}시간`
    } else {
      return `${hours}시간 ${remainingMinutes}분`
    }
  }

  // 英文和其他语言（默认）
  if (hours === 0) {
    return `${remainingMinutes} min${remainingMinutes !== 1 ? "s" : ""}`
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else {
    return `${hours}h ${remainingMinutes}m`
  }
}

export const TimeRangeInput = (props: TimeRangeInputProps) => {
  const {
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    format,
    locale: propLocale = enUS,
    startPlaceholder = "Start Time",
    endPlaceholder = "End Time",
    onStartFocus,
    onEndFocus,
    onEnterKeyDown,
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  // 检测是否为跨日时间范围
  const isCrossMidnight = useMemo(() => {
    if (!startValue || !endValue) return false

    const timePattern = /^\d{1,2}:\d{2}$/
    if (!timePattern.test(startValue.trim()) || !timePattern.test(endValue.trim())) {
      return false
    }

    // 简单的字符串比较来判断是否跨日
    return startValue.trim() >= endValue.trim()
  }, [startValue, endValue])

  const rangeDuration = useMemo(() => {
    if (!startValue || !endValue) return ""

    // 更宽松的时间格式验证 - 支持 H:mm 和 HH:mm
    const timePattern = /^\d{1,2}:\d{2}$/
    if (!timePattern.test(startValue.trim()) || !timePattern.test(endValue.trim())) {
      return ""
    }

    try {
      const minutes = calculateTimeDifferenceInMinutes(startValue.trim(), endValue.trim())

      // 防止负数或异常大的值
      if (minutes < 0 || minutes > 24 * 60) {
        return ""
      }

      return formatTimeDuration(minutes, locale)
    } catch (error) {
      console.warn("Failed to calculate time duration:", error)
      return ""
    }
  }, [startValue, endValue, locale])

  return (
    <>
      <TimeInput
        className="[grid-area:input-1]"
        locale={propLocale}
        format={format}
        placeholder={startPlaceholder}
        onFocus={onStartFocus}
        value={startValue}
        onChange={onStartChange}
        onEnterKeyDown={onEnterKeyDown}
        maxTime={isCrossMidnight ? undefined : endValue || undefined}
      />

      <TimeInput
        className="[grid-area:input-2]"
        locale={propLocale}
        format={format}
        placeholder={endPlaceholder}
        onFocus={onEndFocus}
        value={endValue}
        onChange={onEndChange}
        onEnterKeyDown={onEnterKeyDown}
        minTime={isCrossMidnight ? undefined : startValue || undefined}
        prefixElement={<ArrowRight />}
      />
      <span className="text-secondary-foreground col-span-3 col-start-5 row-start-2 truncate select-none">
        {rangeDuration}
      </span>
    </>
  )
}
