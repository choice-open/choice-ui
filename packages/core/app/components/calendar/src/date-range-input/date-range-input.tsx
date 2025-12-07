import { tcx } from "@choiceform/design-shared"
import { ArrowRight } from "@choiceform/icons-react"
import { TextFieldProps } from "@choiceform/text-field"
import { formatDistanceStrict, type Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import { useMemo } from "react"
import { DateInput } from "../date-input"
import type { DateDataFormat } from "../types"
import { resolveLocale } from "../utils"

interface DateRangeInputProps
  extends Omit<TextFieldProps, "value" | "onChange" | "step" | "defaultValue"> {
  endDisabled?: boolean
  endPlaceholder?: string
  endSuffixElement?: React.ReactNode
  endValue?: Date | null
  format?: DateDataFormat
  locale?: Locale | string
  maxDate?: Date
  minDate?: Date
  onEndChange?: (date: Date | null) => void
  onEndFocus?: () => void
  onEnterKeyDown?: () => void
  onStartChange?: (date: Date | null) => void
  onStartFocus?: () => void
  /**
   * 范围长度显示精度，控制范围计算的最小单位
   * @default 1 - 最小单位为1天
   * @example 0.5 - 最小单位为0.5天（半天）
   * @example 0.1 - 最小单位为0.1天（2.4小时）
   * @example 0.25 - 最小单位为0.25天（6小时）
   */
  rangePrecision?: number
  startDisabled?: boolean
  startPlaceholder?: string
  startSuffixElement?: React.ReactNode
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
    startDisabled,
    endDisabled,
    maxDate,
    minDate,
    startSuffixElement,
    endSuffixElement,
    ...rest
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const rangeLength = useMemo(() => {
    if (!startValue || !endValue) return ""

    // 特殊处理：相同日期显示为1天
    if (startValue.getTime() === endValue.getTime()) {
      // 创建1天的差距让formatDistanceStrict处理
      const oneDayLater = new Date(startValue.getTime() + 24 * 60 * 60 * 1000)
      return formatDistanceStrict(startValue, oneDayLater, {
        locale,
        unit: "day",
        addSuffix: false,
      })
    }

    // 其他情况使用 formatDistanceStrict
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
        disabled={startDisabled}
        minDate={minDate}
        suffixElement={startSuffixElement}
        {...rest}
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
        prefixElement={<ArrowRight />}
        suffixElement={endSuffixElement}
        disabled={endDisabled}
        maxDate={maxDate}
        {...rest}
      />
      <span
        className={tcx(
          "col-span-3 col-start-5 row-start-2 truncate select-none",
          rest.variant === "dark" ? "text-gray-400" : "text-secondary-foreground",
        )}
        data-testid="range-length"
      >
        {rangeLength}
      </span>
    </>
  )
}
