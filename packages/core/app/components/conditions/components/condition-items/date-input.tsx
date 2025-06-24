import { useState, useRef } from "react"
import { format, parse, isValid, parseISO } from "date-fns"
import { DateInput as CoreDateInput } from "../../../calendar/date-input"
import { MonthCalendar } from "../../../calendar"
import { Popover } from "../../../popover"
import type { BaseFieldInputProps, RangeFieldInputProps } from "./types"
import { ConditionsFieldType } from "../../types"

export function ConditionDateInput({ condition, field, disabled, onChange }: BaseFieldInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  // 解析当前值
  const parseValue = (value: unknown): Date | null => {
    if (!value) return null

    if (value instanceof Date) return value

    if (typeof value === "string") {
      try {
        const date = parseISO(value)
        if (isValid(date)) return date

        // 尝试根据字段类型解析
        if (field.type === ConditionsFieldType.DateTime) {
          const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
          return isValid(parsed) ? parsed : null
        } else {
          const parsed = parse(value, "yyyy-MM-dd", new Date())
          return isValid(parsed) ? parsed : null
        }
      } catch {
        return null
      }
    }

    return null
  }

  // 格式化值为字符串
  const formatValue = (date: Date | null): string => {
    if (!date || !isValid(date)) return ""

    try {
      if (field.type === ConditionsFieldType.DateTime) {
        return format(date, "yyyy-MM-dd'T'HH:mm")
      }
      return format(date, "yyyy-MM-dd")
    } catch {
      return ""
    }
  }

  if (field.type !== ConditionsFieldType.DateTime) {
    return null
  }

  // 处理日期变化
  const handleDateChange = (date: Date | null) => {
    const formattedValue = formatValue(date)
    onChange(formattedValue)
  }

  // 处理日历选择
  const handleCalendarChange = (value: Date | Date[] | { end: Date; start: Date } | null) => {
    // 单选模式下，只处理 Date 类型
    if (value instanceof Date) {
      handleDateChange(value)
      setIsOpen(false)
    } else if (value === null) {
      handleDateChange(null)
      setIsOpen(false)
    }
  }

  // 获取日期格式
  const dateFormat =
    field.type === ConditionsFieldType.DateTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd"

  return (
    <>
      <div ref={triggerRef}>
        <CoreDateInput
          value={parseValue(condition.value)}
          onChange={handleDateChange}
          disabled={disabled}
          format={dateFormat}
          className="min-w-0 flex-1"
          placeholder={
            field.type === ConditionsFieldType.DateTime
              ? "Select date and time..."
              : "Select date..."
          }
          onFocus={() => setIsOpen(true)}
          onEnterKeyDown={() => setIsOpen(false)}
        />
      </div>

      <Popover
        interactions="focus"
        triggerRef={triggerRef}
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom-start"
        focusManagerProps={{
          initialFocus: -1,
          returnFocus: false,
        }}
      >
        <Popover.Content className="overflow-hidden rounded-lg">
          <MonthCalendar
            className="w-64"
            value={parseValue(condition.value)}
            onChange={handleCalendarChange}
            selectionMode="single"
            highlightToday={true}
            showOutsideDays={true}
          />
        </Popover.Content>
      </Popover>
    </>
  )
}

export function ConditionDateRangeInput({
  condition,
  field,
  disabled,
  onChange,
  onSecondValueChange,
}: RangeFieldInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  // 解析当前值
  const parseValue = (value: unknown): Date | null => {
    if (!value) return null

    if (value instanceof Date) return value

    if (typeof value === "string") {
      try {
        const date = parseISO(value)
        if (isValid(date)) return date

        // 尝试根据字段类型解析
        if (field.type === ConditionsFieldType.DateTime) {
          const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
          return isValid(parsed) ? parsed : null
        } else {
          const parsed = parse(value, "yyyy-MM-dd", new Date())
          return isValid(parsed) ? parsed : null
        }
      } catch {
        return null
      }
    }

    return null
  }

  // 格式化值为字符串
  const formatValue = (date: Date | null): string => {
    if (!date || !isValid(date)) return ""

    try {
      if (field.type === ConditionsFieldType.DateTime) {
        return format(date, "yyyy-MM-dd'T'HH:mm")
      }
      return format(date, "yyyy-MM-dd")
    } catch {
      return ""
    }
  }

  if (field.type !== ConditionsFieldType.DateTime) {
    return null
  }

  // 处理第二个值变化
  const handleSecondValueChange = (date: Date | null) => {
    const formattedValue = formatValue(date)
    onSecondValueChange(formattedValue)
  }

  // 处理日历选择
  const handleCalendarChange = (value: Date | Date[] | { end: Date; start: Date } | null) => {
    // 单选模式下，只处理 Date 类型
    if (value instanceof Date) {
      handleSecondValueChange(value)
      setIsOpen(false)
    } else if (value === null) {
      handleSecondValueChange(null)
      setIsOpen(false)
    }
  }

  // 获取日期格式
  const dateFormat =
    field.type === ConditionsFieldType.DateTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd"

  return (
    <>
      <div ref={triggerRef}>
        <CoreDateInput
          value={parseValue(condition.secondValue)}
          onChange={handleSecondValueChange}
          disabled={disabled}
          format={dateFormat}
          className="min-w-0 flex-1"
          placeholder={
            field.type === ConditionsFieldType.DateTime
              ? "Select end date and time..."
              : "Select end date..."
          }
          onFocus={() => setIsOpen(true)}
          onEnterKeyDown={() => setIsOpen(false)}
        />
      </div>

      <Popover
        interactions="focus"
        triggerRef={triggerRef}
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom-start"
        focusManagerProps={{
          initialFocus: -1,
          returnFocus: false,
        }}
      >
        <Popover.Content className="overflow-hidden rounded-lg">
          <MonthCalendar
            className="w-64"
            value={parseValue(condition.secondValue)}
            onChange={handleCalendarChange}
            selectionMode="single"
            highlightToday={true}
            showOutsideDays={true}
          />
        </Popover.Content>
      </Popover>
    </>
  )
}
