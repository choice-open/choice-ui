import { enUS } from "date-fns/locale"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"
import { tcx } from "~/utils"
import type { BaseCalendarProps, CalendarLayoutProps, CalendarValue, DateRange } from "../types"
import {
  calculateWeekNumbers,
  dateUtils,
  formatMonthTitle,
  generateCalendarDays,
  generateWeekdayNames,
  inferMonthFromValue,
  inferSelectionMode,
  isCalendarValueEqual,
  isSameDayInTimeZone,
  isWithinRange,
} from "../utils"
import { MonthCalendarDateCell } from "./month-calendar-date-cell"
import { MonthCalendarHeader } from "./month-calendar-header"
import { MonthCalendarWeekDay } from "./month-calendar-week-day"
import { MonthCalendarWeekNumber } from "./month-calendar-week-number"
import { MonthCalendarTv } from "./tv"

export interface MonthCalendarProps extends BaseCalendarProps, CalendarLayoutProps {}

export const MonthCalendar = memo(function MonthCalendar(props: MonthCalendarProps) {
  const {
    className,
    children,
    direction = "horizontal",
    currentMonth: propCurrentMonth,
    dateComparisonMode = "date-only",
    defaultValue,
    disabledDates = [],
    highlightDates = [],
    highlightToday = true,
    locale = enUS,
    maxDate,
    minDate,
    onChange,
    onMonthChange,
    readonly = false,
    selectionMode: propSelectionMode,
    showOutsideDays = true,
    showWeekNumbers = false,
    timeZone = "Asia/Shanghai",
    value,
    weekStartsOn = 1,
    weekdayNames: customWeekdayNames,
    fixedGrid = true,
    variant = "default",
  } = props

  // 🎯 高级数据流方向检测
  const dataFlowRef = useRef<{
    direction: "external" | "internal" | "idle"
    interactionType: "range-selecting" | "multi-selecting" | "single-selecting" | null
    isUserInteracting: boolean
    lastExternalValue: CalendarValue
  }>({
    direction: "idle",
    lastExternalValue: null,
    isUserInteracting: false,
    interactionType: null,
  })

  // 使用 useMergedValue 管理选择状态
  const [currentValue, setCurrentValue] = useMergedValue<CalendarValue>({
    value,
    defaultValue,
    onChange,
  })

  // 🔄 监听外部 value 变化，检测数据流方向
  useEffect(() => {
    const flow = dataFlowRef.current

    // 检测是否为外部数据变化（处理 undefined）
    const normalizedValue = value ?? null
    const isExternalChange = !isCalendarValueEqual(
      normalizedValue,
      flow.lastExternalValue,
      timeZone,
      dateComparisonMode,
    )

    if (isExternalChange) {
      // 🔄 外部数据流：如果用户正在交互，暂停响应外部更新
      if (flow.isUserInteracting) {
        // 更新记录但不影响当前状态
        flow.lastExternalValue = normalizedValue
        return
      }

      // 🔄 外部数据流：更新内部状态
      flow.direction = "external"
      flow.lastExternalValue = normalizedValue

      // 短暂延迟后恢复内部处理
      setTimeout(() => {
        if (dataFlowRef.current.direction === "external") {
          dataFlowRef.current.direction = "idle"
        }
      }, 50)
    }
  }, [value, currentValue, timeZone, dateComparisonMode])

  // 内部月份状态（用于用户手动导航）
  const [internalMonth, setInternalMonth] = useState<Date | null>(null)

  // 计算最终显示的月份
  const currentMonth = useMemo(() => {
    // 1. 如果有受控的 currentMonth，优先使用
    if (propCurrentMonth) {
      return propCurrentMonth
    }

    // 2. 如果用户手动导航过，使用内部状态
    if (internalMonth) {
      return internalMonth
    }

    // 3. 否则从当前值推导
    const inferFromValue = inferMonthFromValue(currentValue)
    if (inferFromValue) {
      return inferFromValue
    }

    // 4. 最后使用当前日期
    return new Date()
  }, [propCurrentMonth, internalMonth, currentValue])

  // 确定当前选择模式
  const selectionMode = propSelectionMode || inferSelectionMode(currentValue)

  // 内部状态
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selectingRange, setSelectingRange] = useState(false)

  // 🎯 范围选择状态管理 - 检测用户是否正在进行范围选择
  useEffect(() => {
    const flow = dataFlowRef.current

    if (selectionMode === "range") {
      if (selectingRange) {
        flow.isUserInteracting = true
        flow.interactionType = "range-selecting"
      } else if (flow.interactionType === "range-selecting") {
        // 范围选择完成，短暂延迟后结束交互状态
        setTimeout(() => {
          dataFlowRef.current.isUserInteracting = false
          dataFlowRef.current.interactionType = null
          dataFlowRef.current.direction = "idle"
        }, 200)
      }
    }
  }, [selectingRange, selectionMode])

  // 动态生成或使用自定义的星期名称
  const weekdayNames = useMemo(() => {
    if (customWeekdayNames) {
      return customWeekdayNames
    }
    return generateWeekdayNames(locale, weekStartsOn)
  }, [customWeekdayNames, locale, weekStartsOn])

  // 生成日历天数 - 使用fixedGrid参数
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentMonth, weekStartsOn, fixedGrid)
  }, [currentMonth, weekStartsOn, fixedGrid])

  // 计算周数数组
  const weekNumbers = useMemo(() => {
    if (!showWeekNumbers) return []
    return calculateWeekNumbers(calendarDays, locale)
  }, [showWeekNumbers, calendarDays, locale])

  // 格式化的月份标题
  const formattedMonthTitle = useMemo(() => {
    return formatMonthTitle(currentMonth, locale)
  }, [currentMonth, locale])

  // 检查是否为今天
  const isToday = useCallback(
    (date: Date): boolean => {
      if (!highlightToday) return false
      return dateUtils.isSameDay(date, dateUtils.now())
    },
    [highlightToday],
  )

  // 检查是否被禁用
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some((disabledDate) => isSameDayInTimeZone(date, disabledDate, timeZone))
    },
    [minDate, maxDate, disabledDates, timeZone],
  )

  // 检查是否被高亮
  const isHighlighted = useCallback(
    (date: Date): boolean => {
      return highlightDates.some((highlightDate) =>
        isSameDayInTimeZone(date, highlightDate, timeZone),
      )
    },
    [highlightDates, timeZone],
  )

  // 检查是否被选中
  const isSelected = useCallback(
    (date: Date): boolean => {
      if (!currentValue) return false

      if (selectionMode === "multiple" && Array.isArray(currentValue)) {
        return currentValue.some((selectedDate) =>
          isSameDayInTimeZone(date, selectedDate, timeZone),
        )
      }

      if (selectionMode === "single" && currentValue instanceof Date) {
        return isSameDayInTimeZone(date, currentValue, timeZone)
      }

      if (
        selectionMode === "range" &&
        !Array.isArray(currentValue) &&
        typeof currentValue === "object" &&
        "start" in currentValue
      ) {
        const range = currentValue as DateRange
        // 在 range 模式下，start 和 end 日期都应该被标记为选中
        return (
          isSameDayInTimeZone(date, range.start, timeZone) ||
          isSameDayInTimeZone(date, range.end, timeZone)
        )
      }

      return false
    },
    [currentValue, selectionMode, timeZone],
  )

  // 检查是否在范围内
  const isInRange = useCallback(
    (date: Date): boolean => {
      if (
        selectionMode !== "range" ||
        !currentValue ||
        Array.isArray(currentValue) ||
        typeof currentValue !== "object"
      ) {
        return false
      }
      const range = currentValue as DateRange
      return isWithinRange(date, range.start, range.end, timeZone, dateComparisonMode)
    },
    [currentValue, selectionMode, timeZone, dateComparisonMode],
  )

  // 导航函数
  const handleToday = useEventCallback(() => {
    const today = dateUtils.now()
    setInternalMonth(today)
    onMonthChange?.(today)
  })

  const handlePrevMonth = useEventCallback(() => {
    const prevMonth = dateUtils.addMonths(currentMonth, -1)
    setInternalMonth(prevMonth)
    onMonthChange?.(prevMonth)
  })

  const handleNextMonth = useEventCallback(() => {
    const nextMonth = dateUtils.addMonths(currentMonth, 1)
    setInternalMonth(nextMonth)
    onMonthChange?.(nextMonth)
  })

  // 🚀 优化的内部状态更新函数
  const updateInternalValue = useCallback(
    (newValue: CalendarValue) => {
      const flow = dataFlowRef.current

      // 🔄 标记为内部数据流
      flow.direction = "internal"
      flow.lastExternalValue = newValue

      // 更新内部状态
      setCurrentValue(newValue)

      // 重置为空闲状态
      setTimeout(() => {
        if (dataFlowRef.current.direction === "internal") {
          dataFlowRef.current.direction = "idle"
        }
      }, 100)
    },
    [setCurrentValue],
  )

  // 日期点击处理
  const handleDateClick = useEventCallback((date: Date) => {
    if (readonly) return
    if (isDateDisabled(date)) return

    const flow = dataFlowRef.current

    if (selectionMode === "range") {
      const currentRange =
        currentValue && !Array.isArray(currentValue) && typeof currentValue === "object"
          ? (currentValue as DateRange)
          : null

      if (!currentRange || !selectingRange) {
        // 🎯 开始新的范围选择
        flow.isUserInteracting = true
        flow.interactionType = "range-selecting"

        const newRange: DateRange = { start: date, end: date }
        updateInternalValue(newRange)
        setSelectingRange(true)
      } else {
        // 🎯 完成范围选择
        const start = currentRange.start
        const end = date
        const orderedRange: DateRange = {
          start: start <= end ? start : end,
          end: start <= end ? end : start,
        }
        updateInternalValue(orderedRange)
        setSelectingRange(false)
        setHoverDate(null)
      }
    } else if (selectionMode === "multiple") {
      // 🎯 多选模式
      flow.isUserInteracting = true
      flow.interactionType = "multi-selecting"

      const currentDates = Array.isArray(currentValue) ? currentValue : []
      const isCurrentlySelected = currentDates.some((selectedDate) =>
        isSameDayInTimeZone(date, selectedDate, timeZone),
      )

      let newSelectedDates: Date[]
      if (isCurrentlySelected) {
        newSelectedDates = currentDates.filter(
          (selectedDate) => !isSameDayInTimeZone(date, selectedDate, timeZone),
        )
      } else {
        newSelectedDates = [...currentDates, date]
      }

      updateInternalValue(newSelectedDates)

      // 多选模式下立即结束交互状态
      setTimeout(() => {
        dataFlowRef.current.isUserInteracting = false
        dataFlowRef.current.interactionType = null
      }, 100)
    } else {
      // 🎯 单选模式
      flow.isUserInteracting = true
      flow.interactionType = "single-selecting"

      updateInternalValue(date)

      // 单选模式下立即结束交互状态
      setTimeout(() => {
        dataFlowRef.current.isUserInteracting = false
        dataFlowRef.current.interactionType = null
      }, 100)
    }
  })

  // 范围选择辅助函数
  const rangeHelpers = useMemo(() => {
    const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
      if (!date1 || !date2) return false
      return isSameDayInTimeZone(date1, date2, timeZone)
    }

    const currentRange =
      selectionMode === "range" &&
      currentValue &&
      !Array.isArray(currentValue) &&
      typeof currentValue === "object"
        ? (currentValue as DateRange)
        : null

    return {
      isSameDay,
      isFirstInRange: (date: Date): boolean => {
        if (!currentRange) return false
        return isSameDay(date, currentRange.start)
      },
      isLastInRange: (date: Date): boolean => {
        if (!currentRange) return false
        return isSameDay(date, currentRange.end)
      },
      isInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !currentRange || !hoverDate) return false
        // 🚀 使用专业的范围检查工具 - 需要判断方向
        const minDate = currentRange.start <= hoverDate ? currentRange.start : hoverDate
        const maxDate = currentRange.start <= hoverDate ? hoverDate : currentRange.start
        return isWithinRange(date, minDate, maxDate, timeZone, dateComparisonMode)
      },
      isFirstInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !currentRange || !hoverDate) return false

        // 🔧 判断哪个是范围的起始点
        if (currentRange.start <= hoverDate) {
          return isSameDay(date, currentRange.start)
        } else {
          return isSameDay(date, hoverDate)
        }
      },
      isLastInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !currentRange || !hoverDate) return false

        // 🔧 判断哪个是范围的结束点
        if (currentRange.start <= hoverDate) {
          return isSameDay(date, hoverDate)
        } else {
          return isSameDay(date, currentRange.start)
        }
      },
    }
  }, [currentValue, selectionMode, selectingRange, hoverDate, timeZone, dateComparisonMode])

  // 鼠标事件处理
  const handleMouseEnter = useEventCallback((date: Date) => {
    if (!isDateDisabled(date)) {
      setHoverDate(date)
    }
  })

  const handleMouseLeave = useEventCallback(() => {
    setHoverDate(null)
  })

  // 计算状态
  const today = dateUtils.now()
  const currentMonthContainsToday = dateUtils.isSameMonth(today, currentMonth)

  const tv = MonthCalendarTv({
    showWeekNumbers,
    variant,
  })

  return (
    <div className={tcx(tv.container(), className)}>
      <MonthCalendarHeader
        formattedMonthTitle={formattedMonthTitle}
        currentMonthContainsToday={currentMonthContainsToday}
        handleToday={handleToday}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        showWeekNumbers={showWeekNumbers}
        variant={variant}
        direction={direction}
      />

      <div className={tv.weekdaysContainer()}>
        {showWeekNumbers && <div />}
        {weekdayNames.map((day, index) => (
          <MonthCalendarWeekDay
            key={index}
            day={day}
          />
        ))}
      </div>

      <div className={tv.daysGrid()}>
        {calendarDays.map((date, index) => {
          const dayInMonth = date.getMonth() === currentMonth.getMonth()
          const disabled = isDateDisabled(date)
          const selected = isSelected(date)
          const inRange = isInRange(date)
          const highlighted = isHighlighted(date)
          const today = isToday(date)

          // 判断是否为行首或行尾
          const isFirstInRow = index % 7 === 0
          const isLastInRow = index % 7 === 6

          // 使用范围帮助函数
          const inHoverRange = rangeHelpers.isInHoverRange(date)
          const firstInRange = rangeHelpers.isFirstInRange(date)
          const lastInRange = rangeHelpers.isLastInRange(date)
          const firstInHoverRange = rangeHelpers.isFirstInHoverRange(date)
          const lastInHoverRange = rangeHelpers.isLastInHoverRange(date)

          const firstInRow =
            (inRange && isFirstInRow && !firstInRange) ||
            (inHoverRange && isFirstInRow && !firstInHoverRange)

          const lastInRow =
            (inRange && isLastInRow && !lastInRange) ||
            (inHoverRange && isLastInRow && !lastInHoverRange)

          const dayClasses = tv.day({
            selected,
            inRange,
            today,
            highlighted,
            disabled,
            showOutsideDays,
            inMonth: dayInMonth,
            isFirstInRow: firstInRow,
            isLastInRow: lastInRow,
            isFirstInRange: firstInRange,
            isLastInRange: lastInRange,
            isFirstInHoverRange: firstInHoverRange,
            isLastInHoverRange: lastInHoverRange,
            inHoverRange,
            selectionMode,
          })

          const elements = []

          // 在每行的开始添加周数
          if (showWeekNumbers && isFirstInRow) {
            const weekIndex = Math.floor(index / 7)
            const weekNumber = weekNumbers[weekIndex]
            elements.push(
              <MonthCalendarWeekNumber
                key={`week-${weekIndex}`}
                weekNumber={weekNumber}
              />,
            )
          }

          // 添加日期单元格
          elements.push(
            <MonthCalendarDateCell
              key={index}
              date={date}
              className={dayClasses}
              disabled={disabled}
              selected={selected}
              inRange={inRange}
              inHoverRange={inHoverRange}
              onDateClick={handleDateClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />,
          )

          return elements
        })}
      </div>

      {children}
    </div>
  )
})

MonthCalendar.displayName = "MonthCalendar"
