import { tcx } from "@choiceform/design-system"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import type { DateRange, MonthCalendarProps } from "./types"
import {
  calculateWeekNumbers,
  dateUtils,
  formatMonthTitle,
  generateCalendarDays,
  generateWeekdayNames,
} from "../utils"
import { MonthCalendarDateCell } from "./month-calendar-date-cell"
import { MonthCalendarHeader } from "./month-calendar-header"
import { MonthCalendarWeekDay } from "./month-calendar-week-day"
import { MonthCalendarWeekNumber } from "./month-calendar-week-number"
import { MonthCalendarTv } from "./tv"

export const MonthCalendar = (props: MonthCalendarProps) => {
  const {
    className,
    currentMonth: propCurrentMonth,
    dateComparisonMode = "date-only",
    disabledDates = [],
    highlightDates = [],
    highlightToday = true,
    locale = "zh-CN",
    maxDate,
    minDate,
    multiSelect = false,
    rangeSelect = false,
    onDateClick,
    onMonthChange,
    onMultiSelect,
    onRangeSelect,
    selectedDate,
    selectedDates = [],
    selectedRange,
    showOutsideDays = true,
    showWeekNumbers = false,
    timeZone = "Asia/Shanghai",
    weekStartsOn = 1,
    weekdayNames: customWeekdayNames,
    fixedGrid = true,
  } = props

  // 内部状态
  const [currentMonth, setCurrentMonth] = useState(propCurrentMonth || new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selectingRange, setSelectingRange] = useState(false)

  // 同步外部currentMonth变化
  useEffect(() => {
    if (propCurrentMonth) {
      setCurrentMonth(propCurrentMonth)
    }
  }, [propCurrentMonth])

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
      return disabledDates.some((disabledDate) => dateUtils.isSameDay(date, disabledDate))
    },
    [minDate, maxDate, disabledDates],
  )

  // 检查是否被高亮
  const isHighlighted = useCallback(
    (date: Date): boolean => {
      return highlightDates.some((highlightDate) => dateUtils.isSameDay(date, highlightDate))
    },
    [highlightDates],
  )

  // 检查是否被选中
  const isSelected = useCallback(
    (date: Date): boolean => {
      if (multiSelect) {
        return selectedDates.some((selectedDate) => dateUtils.isSameDay(date, selectedDate))
      }
      if (selectedDate) {
        return dateUtils.isSameDay(date, selectedDate)
      }
      return false
    },
    [multiSelect, selectedDates, selectedDate],
  )

  // 检查是否在范围内
  const isInRange = useCallback(
    (date: Date): boolean => {
      if (!selectedRange) return false
      return date >= selectedRange.start && date <= selectedRange.end
    },
    [selectedRange],
  )

  // 导航函数
  const handleToday = useCallback(() => {
    const today = dateUtils.now()
    setCurrentMonth(today)
    onMonthChange?.(today)
  }, [onMonthChange])

  const handlePrevMonth = useCallback(() => {
    const prevMonth = dateUtils.addMonths(currentMonth, -1)
    setCurrentMonth(prevMonth)
    onMonthChange?.(prevMonth)
  }, [currentMonth, onMonthChange])

  const handleNextMonth = useCallback(() => {
    const nextMonth = dateUtils.addMonths(currentMonth, 1)
    setCurrentMonth(nextMonth)
    onMonthChange?.(nextMonth)
  }, [currentMonth, onMonthChange])

  // 日期点击处理
  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return

      if (rangeSelect) {
        if (!selectedRange || !selectingRange) {
          // 开始新的范围选择
          const newRange: DateRange = { start: date, end: date }
          onRangeSelect?.(newRange)
          setSelectingRange(true)
        } else {
          // 完成范围选择
          const start = selectedRange.start
          const end = date
          const orderedRange: DateRange = {
            start: start <= end ? start : end,
            end: start <= end ? end : start,
          }
          onRangeSelect?.(orderedRange)
          setSelectingRange(false)
          setHoverDate(null)
        }
      } else if (multiSelect) {
        const isCurrentlySelected = selectedDates.some((selectedDate) =>
          dateUtils.isSameDay(date, selectedDate),
        )

        let newSelectedDates: Date[]
        if (isCurrentlySelected) {
          newSelectedDates = selectedDates.filter(
            (selectedDate) => !dateUtils.isSameDay(date, selectedDate),
          )
        } else {
          newSelectedDates = [...selectedDates, date]
        }

        onMultiSelect?.(newSelectedDates)
      } else {
        // 单选模式
        onDateClick?.(date)
      }
    },
    [
      isDateDisabled,
      rangeSelect,
      multiSelect,
      selectedRange,
      selectingRange,
      selectedDates,
      onRangeSelect,
      onMultiSelect,
      onDateClick,
    ],
  )

  // 范围选择辅助函数
  const rangeHelpers = useMemo(() => {
    const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
      if (!date1 || !date2) return false
      return dateUtils.isSameDay(date1, date2)
    }

    return {
      isSameDay,
      isFirstInRange: (date: Date): boolean => {
        if (!selectedRange) return false
        return isSameDay(date, selectedRange.start)
      },
      isLastInRange: (date: Date): boolean => {
        if (!selectedRange) return false
        return isSameDay(date, selectedRange.end)
      },
      isInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !selectedRange || !hoverDate) return false

        const dateTime = date.getTime()
        const startDateTime = selectedRange.start.getTime()
        const hoverDateTime = hoverDate.getTime()

        return (
          (dateTime >= startDateTime && dateTime <= hoverDateTime) ||
          (dateTime <= startDateTime && dateTime >= hoverDateTime)
        )
      },
      isFirstInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !selectedRange || !hoverDate) return false

        if (selectedRange.start.getTime() <= hoverDate.getTime()) {
          return isSameDay(date, selectedRange.start)
        } else {
          return isSameDay(date, hoverDate)
        }
      },
      isLastInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !selectedRange || !hoverDate) return false

        if (selectedRange.start.getTime() <= hoverDate.getTime()) {
          return isSameDay(date, hoverDate)
        } else {
          return isSameDay(date, selectedRange.start)
        }
      },
    }
  }, [selectedRange, selectingRange, hoverDate])

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
      />

      <div className={tv.weekdaysContainer()}>
        {showWeekNumbers && (
          <div className="flex items-center justify-center text-xs font-medium text-gray-500">
            {/* 周数列头 - 空白 */}
          </div>
        )}
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
              dayClasses={dayClasses}
              disabled={disabled}
              inRange={inRange}
              inHoverRange={inHoverRange}
              onDateClick={handleDateClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-selected={selected}
            />,
          )

          return elements
        })}
      </div>
    </div>
  )
}
