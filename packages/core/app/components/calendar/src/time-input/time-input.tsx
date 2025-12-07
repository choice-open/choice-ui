import { tcx } from "@choiceform/design-shared"
import { Clock } from "@choiceform/icons-react"
import { TextField, TextFieldProps } from "@choiceform/text-field"
import { enUS } from "date-fns/locale"
import React, { forwardRef } from "react"
import { useTimeInput } from "../hooks/use-time-input"
import type { BaseTimeProps, StepProps, TimeInteractionProps } from "../types"
import { resolveLocale } from "../utils"

interface TimeInputProps
  extends Omit<TextFieldProps, "value" | "onChange" | "format" | "defaultValue" | "step">,
    BaseTimeProps,
    StepProps,
    TimeInteractionProps {
  prefixElement?: React.ReactNode
  suffixElement?: React.ReactNode
}

/**
 * 高级时间输入组件
 *
 * 特性：
 * - 🎯 智能时间解析：支持多种格式和自然语言
 * - ⌨️ 键盘导航：上键减少，下键增加（符合列表导航逻辑）
 * - 🔄 竞态保护：智能检测数据流方向，避免循环更新
 * - 🚀 性能优化：使用 useEventCallback 和缓存机制
 * - 🛡️ 类型安全：完整的 TypeScript 支持
 * - 🌍 国际化支持：可配置语言区域
 * - 📱 拖拽交互：支持通过前缀图标拖拽调整时间
 */
export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
  const {
    // 时间相关属性
    defaultValue,
    value,
    onChange,
    format: propFormat = "HH:mm",
    locale: propLocale = enUS,
    minTime,
    maxTime,
    step = 1,
    shiftStep = 15,
    metaStep = 60,

    // 交互相关属性
    enableCache = true,
    enableKeyboardNavigation = true,
    enableProfiling = false,
    onEnterKeyDown,

    // UI 相关属性
    placeholder = "Enter time...",
    prefixElement = <Clock />,
    suffixElement,

    // TextField 属性
    ...rest
  } = props

  // 🔧 使用公用的 locale 解析
  const locale = resolveLocale(propLocale)

  const { inputProps, handlerProps } = useTimeInput({
    value,
    defaultValue,
    onChange,
    disabled: rest.disabled,
    readOnly: rest.readOnly,
    minTime,
    maxTime,
    step,
    shiftStep,
    metaStep,
    format: propFormat,
    locale,
    enableCache,
    enableKeyboardNavigation,
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
    </TextField>
  )
})

TimeInput.displayName = "TimeInput"
