import { Menus, tcx } from "@choiceform/design-system"
import React, { useMemo, useCallback, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { TimePickerProps, Time } from "./types"
import {
  generateTimeOptions,
  generateHourOptions,
  generateMinuteOptions,
  isTimeEqual,
  createTime,
} from "./utils"
import { TimePickerTv } from "./tv"
import { Check } from "@choiceform/icons-react"

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  const {
    value,
    onChange,
    format = "24h",
    layout = "single",
    minuteStep = 15,
    hourStep = 1,
    disabled = false,
    className,
    minTime,
    maxTime,
  } = props

  const [activeTimeIndex, setActiveTimeIndex] = useState<number | null>(null)
  const [activeHourIndex, setActiveHourIndex] = useState<number | null>(null)
  const [activeMinuteIndex, setActiveMinuteIndex] = useState<number | null>(null)

  const tv = TimePickerTv({ layout })

  // 生成时间选项（单列模式）
  const timeOptions = useMemo(() => {
    if (layout === "single") {
      return generateTimeOptions(minuteStep, hourStep, format, minTime, maxTime)
    }
    return []
  }, [layout, minuteStep, hourStep, format, minTime, maxTime])

  // 生成小时和分钟选项（双列模式）
  const hourOptions = useMemo(() => {
    if (layout === "dual") {
      return generateHourOptions(hourStep, format)
    }
    return []
  }, [layout, hourStep, format])

  const minuteOptions = useMemo(() => {
    if (layout === "dual") {
      return generateMinuteOptions(minuteStep)
    }
    return []
  }, [layout, minuteStep])

  // 处理时间选择（单列模式）
  const handleTimeSelect = useEventCallback((time: Time) => {
    if (disabled) return
    onChange?.(time)
  })

  // 处理小时选择（双列模式）
  const handleHourSelect = useEventCallback((hour: number) => {
    if (disabled) return
    const newTime = createTime(hour, value?.minute ?? 0)
    onChange?.(newTime)
  })

  // 处理分钟选择（双列模式）
  const handleMinuteSelect = useEventCallback((minute: number) => {
    if (disabled) return
    const newTime = createTime(value?.hour ?? 0, minute)
    onChange?.(newTime)
  })

  const handleTimeMouseEnter = useEventCallback((index: number) => {
    setActiveTimeIndex(index)
  })
  const handleTimeMouseLeave = useEventCallback(() => {
    setActiveTimeIndex(null)
  })

  const handleDualHourMouseEnter = useEventCallback((hour: number) => {
    setActiveHourIndex(hour)
  })
  const handleDualHourMouseLeave = useEventCallback(() => {
    setActiveHourIndex(null)
  })

  const handleDualMinuteMouseEnter = useEventCallback((minute: number) => {
    setActiveMinuteIndex(minute)
  })
  const handleDualMinuteMouseLeave = useEventCallback(() => {
    setActiveMinuteIndex(null)
  })

  // 单列布局渲染
  const renderSingleColumn = () => (
    <Menus className={className}>
      {timeOptions.map((option, index) => {
        const isSelected = value ? isTimeEqual(value, option.value) : false
        const isDisabled = disabled || option.disabled

        return (
          <Menus.Item
            key={index}
            onMouseEnter={() => handleTimeMouseEnter(index)}
            onMouseLeave={handleTimeMouseLeave}
            active={activeTimeIndex === index}
            disabled={isDisabled}
            onClick={() => handleTimeSelect(option.value)}
            prefixElement={isSelected ? <Check /> : <></>}
          >
            <Menus.Value>{option.label}</Menus.Value>
          </Menus.Item>
        )
      })}
    </Menus>
  )

  // 双列布局渲染
  const renderDualColumn = () => (
    <div className={tcx(tv.dualColumn(), className)}>
      {/* 小时列 */}
      <Menus className={tv.column()}>
        <Menus.Label selection>时</Menus.Label>
        {hourOptions.map((option) => {
          const isSelected = value?.hour === option.value

          return (
            <Menus.Item
              key={option.value}
              onMouseEnter={() => handleDualHourMouseEnter(option.value)}
              onMouseLeave={handleDualHourMouseLeave}
              active={activeHourIndex === option.value}
              disabled={disabled}
              onClick={() => handleHourSelect(option.value)}
              prefixElement={isSelected ? <Check /> : <></>}
            >
              <Menus.Value>{option.label}</Menus.Value>
            </Menus.Item>
          )
        })}
      </Menus>

      {/* 分隔线 */}
      <div className={tv.separator()} />

      {/* 分钟列 */}
      <Menus className={tv.column()}>
        <Menus.Label selection>分</Menus.Label>
        {minuteOptions.map((option) => {
          const isSelected = value?.minute === option.value

          return (
            <Menus.Item
              key={option.value}
              onMouseEnter={() => handleDualMinuteMouseEnter(option.value)}
              onMouseLeave={handleDualMinuteMouseLeave}
              active={activeMinuteIndex === option.value}
              disabled={disabled}
              onClick={() => handleMinuteSelect(option.value)}
              prefixElement={isSelected ? <Check /> : <></>}
            >
              <Menus.Value>{option.label}</Menus.Value>
            </Menus.Item>
          )
        })}
      </Menus>
    </div>
  )

  return layout === "single" ? renderSingleColumn() : renderDualColumn()
}

TimePicker.displayName = "TimePicker"
