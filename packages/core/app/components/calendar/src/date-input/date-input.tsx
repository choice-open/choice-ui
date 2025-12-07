import { tcx } from "@choiceform/design-shared"
import { FieldTypeDate } from "@choiceform/icons-react"
import { TextField, TextFieldProps } from "@choiceform/text-field"
import type { Locale } from "date-fns"
import { isThisYear } from "date-fns"
import { enUS } from "date-fns/locale"
import React, { forwardRef, useEffect, useMemo, useState } from "react"
import { useDateInput } from "../hooks/use-date-input"
import type { DateFormat } from "../types"
import { getEnhancedPrediction, resolveLocale, type PredictionResult } from "../utils"

interface DateInputProps extends Omit<TextFieldProps, "value" | "onChange" | "format"> {
  /**
   * Whether to enable cache
   * @default true
   */
  enableCache?: boolean
  /**
   * Whether to enable keyboard navigation (default enabled)
   *
   * Keyboard shortcuts:
   * - ↑ key: Decrease 1 day (past)
   * - ↓ key: Increase 1 day (future)
   * - Shift + ↑ key: Decrease 1 week
   * - Shift + ↓ key: Increase 1 week
   * - Ctrl/Cmd + ↑ key: Decrease 1 month
   * - Ctrl/Cmd + ↓ key: Increase 1 month
   * - Enter key: Confirm input
   * @default true
   */
  enableKeyboardNavigation?: boolean
  /**
   * Whether to enable intelligent prediction
   * @default false
   */
  enablePrediction?: boolean
  /**
   * Whether to enable performance analysis
   * @default false
   */
  enableProfiling?: boolean
  format?: DateFormat
  locale?: Locale | string
  maxDate?: Date
  minDate?: Date
  onChange?: (date: Date | null) => void
  onEnterKeyDown?: () => void
  prefixElement?: React.ReactNode
  suffixElement?: React.ReactNode
  value?: Date | null
}

/**
 * Advanced date input component
 *
 * Features:
 * - 🎯 Intelligent date parsing: Supports multiple formats and natural language
 * - ⌨️ Keyboard navigation: Up key to past, down key to future (intuitive operation)
 * - 🔄 Race protection: Smartly detect data flow direction, avoid loop updates
 * - 🛡️ Type safety: Complete TypeScript support
 * - 🌍 Internationalization support: Configurable language region
 * - 💡 Intelligent prediction: Real-time prediction prompts and holiday recognition
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => {
  const {
    enableCache = true,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    enablePrediction = false,
    format: propFormat,
    locale: propLocale = enUS,
    maxDate,
    minDate,
    onChange,
    onEnterKeyDown,
    placeholder = "Enter date...",
    prefixElement = <FieldTypeDate />,
    suffixElement,
    value,
    ...rest
  } = props

  // 智能预测状态
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const dateFormat = useMemo(() => {
    if (propFormat) {
      return propFormat
    }

    const localeKey = typeof propLocale === "string" ? propLocale : locale.code || "en-US"
    const isCurrentYear = value && isThisYear(value)

    // 中文系列
    if (localeKey.startsWith("zh")) {
      return isCurrentYear ? "MMM do eee" : "yy\u5e74 MMM do eee"
    }

    // 日文
    if (localeKey.startsWith("ja")) {
      return isCurrentYear ? "MMM do\uff08eee\uff09" : "yy\u5e74 MMM do\uff08eee\uff09"
    }

    // 韩文
    if (localeKey.startsWith("ko")) {
      return isCurrentYear ? "MMM do\uff08eee\uff09" : "yy\ub144 MMM do\uff08eee\uff09"
    }

    // 德文
    if (localeKey.startsWith("de")) {
      return isCurrentYear ? "EE dd.MM" : "EE dd.MM ''yy"
    }

    // 法文
    if (localeKey.startsWith("fr")) {
      return isCurrentYear ? "EE dd MM" : "EE dd MM yy"
    }

    // 西班牙文
    if (localeKey.startsWith("es")) {
      return isCurrentYear ? "EE dd MM" : "EE dd MM ''yy"
    }

    // 英文和其他语言（默认）
    return isCurrentYear ? "EE MM dd" : "EE MM dd ''yy"
  }, [propFormat, value, propLocale, locale])

  // 使用 use-date-input hook 管理所有逻辑
  const { inputProps, handlerProps } = useDateInput({
    value,
    onChange,
    disabled: rest.disabled,
    readOnly: rest.readOnly,
    minDate,
    maxDate,
    step: 1,
    shiftStep: 7,
    format: dateFormat,
    locale,
    enableCache,
    enableProfiling,
    onEnterKeyDown,
    ref,
  })

  // 监听输入变化，更新预测
  useEffect(() => {
    if (!enablePrediction || !inputProps.value) {
      setPrediction(null)
      return
    }

    const inputValue = inputProps.value as string
    if (inputValue.trim()) {
      const predictionResult = getEnhancedPrediction(inputValue, dateFormat)
      setPrediction(predictionResult)
    } else {
      setPrediction(null)
    }
  }, [inputProps.value, dateFormat, enablePrediction])

  // 生成预测提示内容
  const renderPrediction = () => {
    if (!prediction) return null

    const { description, confidence } = prediction

    const confidenceColor =
      confidence >= 0.9 ? "text-green-600" : confidence >= 0.7 ? "text-blue-600" : "text-gray-600"

    return <span className={`text-body-small ${confidenceColor}`}>{description}</span>
  }

  return (
    <TextField
      {...inputProps}
      placeholder={placeholder}
      {...rest}
    >
      {rest.children}
      {prefixElement && (
        <TextField.Prefix>
          <div
            {...handlerProps}
            className={tcx(
              "cursor-ew-resize",
              rest.disabled ? "text-disabled-foreground" : "text-secondary-foreground",
              rest.variant === "dark" ? "text-white/50" : undefined,
            )}
          >
            {prefixElement}
          </div>
        </TextField.Prefix>
      )}
      {suffixElement && (
        <TextField.Suffix className="text-secondary-foreground w-full min-w-0 px-2">
          {suffixElement}
        </TextField.Suffix>
      )}
      {enablePrediction && <TextField.Description>{renderPrediction()}</TextField.Description>}
    </TextField>
  )
})

DateInput.displayName = "DateInput"
