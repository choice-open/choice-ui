import { FieldTypeDate } from "@choiceform/icons-react"
import type { Locale } from "date-fns"
import { isThisYear } from "date-fns"
import { enUS } from "date-fns/locale"
import React, { forwardRef, useEffect, useMemo, useState } from "react"
import { TextField, TextFieldProps } from "~/components"
import { tcx } from "~/utils"
import { useDateInput } from "../hooks/use-date-input"
import type { DateFormat } from "../types"
import { getEnhancedPrediction, resolveLocale, type PredictionResult } from "../utils"

interface DateInputProps extends Omit<TextFieldProps, "value" | "onChange" | "format"> {
  /** 是否启用解析缓存 */
  enableCache?: boolean
  /**
   * 是否启用键盘导航（默认启用）
   *
   * 快捷键说明：
   * - ↑ 键：减少 1 天（向过去）
   * - ↓ 键：增加 1 天（向未来）
   * - Shift + ↑ 键：减少 1 周
   * - Shift + ↓ 键：增加 1 周
   * - Ctrl/Cmd + ↑ 键：减少 1 月
   * - Ctrl/Cmd + ↓ 键：增加 1 月
   * - Enter 键：确认输入
   */
  enableKeyboardNavigation?: boolean
  /** 是否启用智能预测（默认启用） */
  enablePrediction?: boolean
  /** 是否启用性能分析 */
  enableProfiling?: boolean
  format?: DateFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  onChange?: (date: Date | null) => void
  /** 当用户按回车键时触发（用于控制popover关闭等） */
  onEnterKeyDown?: () => void
  prefixElement?: React.ReactNode
  suffixElement?: React.ReactNode
  value?: Date | null
}

/**
 * 高级日期输入组件
 *
 * 特性：
 * - 🎯 智能日期解析：支持多种格式和自然语言
 * - ⌨️ 键盘导航：上键向过去，下键向未来（直觉性操作）
 * - 🔄 竞态保护：智能检测数据流方向，避免循环更新
 * - 🚀 性能优化：使用 useEventCallback 和缓存机制
 * - 🛡️ 类型安全：完整的 TypeScript 支持
 * - 🌍 国际化支持：可配置语言区域
 * - 💡 智能预测：实时预测提示和节假日识别
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

    return <span className={`text-sm ${confidenceColor}`}>{description}</span>
  }

  return (
    <TextField
      {...inputProps}
      placeholder={placeholder}
      {...rest}
    >
      {prefixElement && (
        <TextField.Prefix>
          <div
            {...handlerProps}
            className={tcx(
              "cursor-ew-resize",
              rest.disabled ? "text-disabled-foreground" : "text-secondary-foreground",
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
