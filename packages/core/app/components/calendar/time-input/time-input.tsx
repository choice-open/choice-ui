import { Clock } from "@choiceform/icons-react"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import React, { forwardRef, useMemo } from "react"
import { TextField, TextFieldProps } from "~/components"
import { tcx } from "~/utils"
import { useTimeInput } from "../hooks/use-time-input"
import type { TimeFormat } from "../types"
import { resolveLocale } from "../utils"

interface TimeInputProps extends Omit<TextFieldProps, "value" | "onChange" | "format"> {
  /** 是否启用解析缓存 */
  enableCache?: boolean
  /**
   * 是否启用键盘导航（默认启用）
   *
   * 快捷键说明：
   * - ↑ 键：增加时间（默认 1 分钟）
   * - ↓ 键：减少时间（默认 1 分钟）
   * - Shift + ↑ 键：增加时间（默认 15 分钟）
   * - Shift + ↓ 键：减少时间（默认 15 分钟）
   * - Ctrl/Cmd + ↑ 键：增加时间（默认 60 分钟）
   * - Ctrl/Cmd + ↓ 键：减少时间（默认 60 分钟）
   * - Enter 键：确认输入
   */
  enableKeyboardNavigation?: boolean
  /** 是否启用性能分析 */
  enableProfiling?: boolean
  format?: TimeFormat
  /** 语言区域 - 支持 Locale 对象或字符串（如 "zh-CN", "en-US"） */
  locale?: Locale | string
  /** 最大时间 */
  maxTime?: string
  /** Ctrl/Cmd 键时的步长（分钟，默认为60） */
  metaStep?: number
  /** 最小时间 */
  minTime?: string
  onChange?: (time: string | null) => void
  /** 当用户按回车键时触发（用于控制popover关闭等） */
  onEnterKeyDown?: () => void
  prefixElement?: React.ReactNode
  /** Shift 键时的步长（分钟，默认为15） */
  shiftStep?: number
  /** 时间间隔（分钟，默认为1） */
  step?: number
  suffixElement?: React.ReactNode
  value?: string | null
}

/**
 * 高级时间输入组件
 *
 * 特性：
 * - 🎯 智能时间解析：支持多种格式和自然语言
 * - ⌨️ 键盘导航：上键增加，下键减少（直觉性操作）
 * - 🔄 竞态保护：智能检测数据流方向，避免循环更新
 * - 🚀 性能优化：使用 useEventCallback 和缓存机制
 * - 🛡️ 类型安全：完整的 TypeScript 支持
 * - 🌍 国际化支持：可配置语言区域
 * - 📱 拖拽交互：支持通过前缀图标拖拽调整时间
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
  const {
    enableCache = true,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    format: propFormat = "HH:mm",
    locale: propLocale = enUS,
    maxTime,
    metaStep = 60,
    minTime,
    onChange,
    onEnterKeyDown,
    placeholder = "Enter time...",
    prefixElement = <Clock />,
    step = 1,
    shiftStep = 15,
    suffixElement,
    value,
    ...rest
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const timeFormat = useMemo(() => {
    if (propFormat) {
      return propFormat
    }

    const localeKey = typeof propLocale === "string" ? propLocale : locale.code || "en-US"

    // 中文系列
    if (localeKey.startsWith("zh")) {
      return "HH:mm"
    }

    // 日文
    if (localeKey.startsWith("ja")) {
      return "HH:mm"
    }

    // 韩文
    if (localeKey.startsWith("ko")) {
      return "HH:mm"
    }

    // 德文
    if (localeKey.startsWith("de")) {
      return "HH:mm"
    }

    // 法文
    if (localeKey.startsWith("fr")) {
      return "HH:mm"
    }

    // 西班牙文
    if (localeKey.startsWith("es")) {
      return "HH:mm"
    }

    // 英文和其他语言（默认）
    return "h:mm a" // 12小时制
  }, [propFormat, propLocale, locale])

  // 使用 use-time-input hook 管理所有逻辑
  const { handlerPressed, inputProps, handlerProps } = useTimeInput({
    value,
    onChange,
    disabled: rest.disabled,
    readOnly: rest.readOnly,
    minTime,
    maxTime,
    step,
    shiftStep,
    metaStep,
    format: timeFormat,
    locale,
    enableCache,
    enableProfiling,
    onEnterKeyDown,
    ref,
  })

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
    </TextField>
  )
})

TimeInput.displayName = "TimeInput"
