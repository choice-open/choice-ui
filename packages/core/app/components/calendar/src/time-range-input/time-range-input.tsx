import { tcx } from "@choiceform/design-shared"
import { ArrowRight } from "@choiceform/icons-react"
import { TextFieldProps } from "@choiceform/text-field"
import { Locale, differenceInMinutes } from "date-fns"
import { enUS } from "date-fns/locale"
import { useMemo } from "react"
import { TimeInput } from "../time-input"
import type { TimeFormat } from "../types"
import { resolveLocale } from "../utils"

interface TimeRangeInputProps
  extends Omit<TextFieldProps, "value" | "onChange" | "step" | "defaultValue"> {
  endDisabled?: boolean
  endPlaceholder?: string
  endSuffixElement?: React.ReactNode
  endValue?: Date | null
  format?: TimeFormat
  locale?: Locale | string
  maxTime?: Date
  minTime?: Date
  onEndChange?: (time: Date | null) => void
  onEndFocus?: () => void
  onEnterKeyDown?: () => void
  onStartChange?: (time: Date | null) => void
  onStartFocus?: () => void
  startDisabled?: boolean
  startPlaceholder?: string
  startSuffixElement?: React.ReactNode
  startValue?: Date | null
}

/**
 * 计算时间差（以分钟为单位）
 */
function calculateTimeDifferenceInMinutes(startTime: Date, endTime: Date): number {
  let timeDiff = differenceInMinutes(endTime, startTime)

  // 处理跨日情况（如 22:00 到 02:00）
  if (timeDiff < 0) {
    // 假设是跨日，加一天的分钟数
    timeDiff += 24 * 60
  }

  return timeDiff
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
    startDisabled,
    endDisabled,
    maxTime,
    minTime,
    startSuffixElement,
    endSuffixElement,
    ...rest
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const rangeDuration = useMemo(() => {
    if (!startValue || !endValue) return ""

    try {
      const minutes = calculateTimeDifferenceInMinutes(startValue, endValue)

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
        disabled={startDisabled}
        minTime={minTime}
        suffixElement={startSuffixElement}
        {...rest}
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
        prefixElement={<ArrowRight />}
        suffixElement={endSuffixElement}
        disabled={endDisabled}
        maxTime={maxTime}
        {...rest}
      />
      <span
        className={tcx(
          "col-span-3 col-start-5 row-start-2 truncate select-none",
          rest.variant === "dark" ? "text-gray-400" : "text-secondary-foreground",
        )}
      >
        {rangeDuration}
      </span>
    </>
  )
}
