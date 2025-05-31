import { ArrowRight } from "@choiceform/icons-react"
import { formatDistanceStrict, Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import { useMemo } from "react"
import { DateInput } from "../date-input"
import type { DateFormat } from "../types"
import { resolveLocale } from "../utils"

interface DateRangeInputProps {
  endPlaceholder?: string
  endValue?: Date | null
  format?: DateFormat
  locale?: Locale | string
  onEndChange?: (date: Date | null) => void
  onEndFocus?: () => void
  onEnterKeyDown?: () => void
  onStartChange?: (date: Date | null) => void
  onStartFocus?: () => void
  startPlaceholder?: string
  startValue?: Date | null
}

export const DateRangeInput = (props: DateRangeInputProps) => {
  const {
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    format,
    locale: propLocale = enUS,
    startPlaceholder = "Start Date",
    endPlaceholder = "End Date",
    onStartFocus,
    onEndFocus,
    onEnterKeyDown,
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const rangeLength = useMemo(() => {
    if (!startValue || !endValue) return 0

    // 使用 date-fns 的 formatDistanceStrict 进行多语言格式化
    // 支持所有 date-fns locale 的天数显示
    return formatDistanceStrict(startValue, endValue, {
      locale,
      unit: "day",
      addSuffix: false,
    })
  }, [startValue, endValue, locale])

  return (
    <>
      <DateInput
        className="[grid-area:input-1]"
        locale={propLocale}
        format={format}
        placeholder={startPlaceholder}
        onFocus={onStartFocus}
        value={startValue}
        onChange={onStartChange}
        onEnterKeyDown={onEnterKeyDown}
        maxDate={endValue || undefined}
      />

      <DateInput
        className="[grid-area:input-2]"
        locale={propLocale}
        format={format}
        placeholder={endPlaceholder}
        onFocus={onEndFocus}
        value={endValue}
        onChange={onEndChange}
        onEnterKeyDown={onEnterKeyDown}
        minDate={startValue || undefined}
        prefixElement={<ArrowRight />}
      />
      <span className="text-secondary-foreground col-span-3 col-start-5 row-start-2 truncate select-none">
        {rangeLength}
      </span>
    </>
  )
}
