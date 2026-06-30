import { tcx } from "@choice-ui/shared"
import { enUS } from "date-fns/locale"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "@choice-ui/shared"
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
    readOnly = false,
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

  // 🎯 Advanced data flow direction detection
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

  // Use useMergedValue to manage the selection state
  const [currentValue, setCurrentValue] = useMergedValue<CalendarValue>({
    value,
    defaultValue,
    onChange,
  })

  // 🔄 Listen for external value changes, detect data flow direction
  useEffect(() => {
    const flow = dataFlowRef.current

    // Check if it is an external data change (handle undefined)
    const normalizedValue = value ?? null
    const isExternalChange = !isCalendarValueEqual(
      normalizedValue,
      flow.lastExternalValue,
      timeZone,
      dateComparisonMode,
    )

    if (isExternalChange) {
      // 🔄 External data flow: if the user is interacting, pause responding to external updates
      if (flow.isUserInteracting) {
        // Update the record but do not affect the current state
        flow.lastExternalValue = normalizedValue
        return
      }

      // 🔄 External data flow: update the internal state
      flow.direction = "external"
      flow.lastExternalValue = normalizedValue

      // Short delay to restore internal processing
      setTimeout(() => {
        if (dataFlowRef.current.direction === "external") {
          dataFlowRef.current.direction = "idle"
        }
      }, 50)
    }
  }, [value, currentValue, timeZone, dateComparisonMode])

  // Internal month state (for user manual navigation)
  const [internalMonth, setInternalMonth] = useState<Date | null>(null)

  // Calculate the final displayed month
  const currentMonth = useMemo(() => {
    // 1. If there is a controlled currentMonth, use it first
    if (propCurrentMonth) {
      return propCurrentMonth
    }

    // 2. If the user has manually navigated, use the internal state
    if (internalMonth) {
      return internalMonth
    }

    // 3. Otherwise, infer from the current value
    const inferFromValue = inferMonthFromValue(currentValue)
    if (inferFromValue) {
      return inferFromValue
    }

    // 4. Finally, use the current date
    return new Date()
  }, [propCurrentMonth, internalMonth, currentValue])

  // Determine the current selection mode
  const selectionMode = propSelectionMode || inferSelectionMode(currentValue)

  // Internal state
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selectingRange, setSelectingRange] = useState(false)

  // 🎯 Range selection state management - detect if the user is currently selecting a range
  useEffect(() => {
    const flow = dataFlowRef.current

    if (selectionMode === "range") {
      if (selectingRange) {
        flow.isUserInteracting = true
        flow.interactionType = "range-selecting"
      } else if (flow.interactionType === "range-selecting") {
        // Range selection completed, short delay to end the interaction state
        setTimeout(() => {
          dataFlowRef.current.isUserInteracting = false
          dataFlowRef.current.interactionType = null
          dataFlowRef.current.direction = "idle"
        }, 200)
      }
    }
  }, [selectingRange, selectionMode])

  // Dynamically generate or use custom weekday names
  const weekdayNames = useMemo(() => {
    if (customWeekdayNames) {
      return customWeekdayNames
    }
    return generateWeekdayNames(locale, weekStartsOn)
  }, [customWeekdayNames, locale, weekStartsOn])

  // Generate calendar days - use fixedGrid parameter
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentMonth, weekStartsOn, fixedGrid)
  }, [currentMonth, weekStartsOn, fixedGrid])

  // Calculate the array of week numbers
  const weekNumbers = useMemo(() => {
    if (!showWeekNumbers) return []
    return calculateWeekNumbers(calendarDays, locale)
  }, [showWeekNumbers, calendarDays, locale])

  // Formatted month title
  const formattedMonthTitle = useMemo(() => {
    return formatMonthTitle(currentMonth, locale)
  }, [currentMonth, locale])

  // Check if it is today
  const isToday = useCallback(
    (date: Date): boolean => {
      if (!highlightToday) return false
      return dateUtils.isSameDay(date, dateUtils.now())
    },
    [highlightToday],
  )

  // Check if it is disabled
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate) {
        const minDateStart = dateUtils.startOfDay(minDate)
        if (date < minDateStart) return true
      }
      if (maxDate) {
        const maxDateEnd = dateUtils.endOfDay(maxDate)
        if (date > maxDateEnd) return true
      }
      return disabledDates.some((disabledDate) => isSameDayInTimeZone(date, disabledDate, timeZone))
    },
    [minDate, maxDate, disabledDates, timeZone],
  )

  // Check if it is highlighted
  const isHighlighted = useCallback(
    (date: Date): boolean => {
      return highlightDates.some((highlightDate) =>
        isSameDayInTimeZone(date, highlightDate, timeZone),
      )
    },
    [highlightDates, timeZone],
  )

  // Check if it is selected
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
        // In range mode, both the start and end dates should be marked as selected
        return (
          isSameDayInTimeZone(date, range.start, timeZone) ||
          isSameDayInTimeZone(date, range.end, timeZone)
        )
      }

      return false
    },
    [currentValue, selectionMode, timeZone],
  )

  // Check if it is in range
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

  // Navigation function
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

  // 🚀 Optimized internal state update function
  const updateInternalValue = useCallback(
    (newValue: CalendarValue) => {
      const flow = dataFlowRef.current

      // 🔄 Marked as internal data flow
      flow.direction = "internal"
      flow.lastExternalValue = newValue

      // Update the internal state
      setCurrentValue(newValue)

      // Reset to idle state
      setTimeout(() => {
        if (dataFlowRef.current.direction === "internal") {
          dataFlowRef.current.direction = "idle"
        }
      }, 100)
    },
    [setCurrentValue],
  )

  // Date click handling
  const handleDateClick = useEventCallback((date: Date) => {
    if (readOnly) return
    if (isDateDisabled(date)) return

    const flow = dataFlowRef.current

    if (selectionMode === "range") {
      const currentRange =
        currentValue && !Array.isArray(currentValue) && typeof currentValue === "object"
          ? (currentValue as DateRange)
          : null

      if (!currentRange || !selectingRange) {
        // 🎯 Start a new range selection
        flow.isUserInteracting = true
        flow.interactionType = "range-selecting"

        const newRange: DateRange = { start: date, end: date }
        updateInternalValue(newRange)
        setSelectingRange(true)
      } else {
        // 🎯 Complete range selection
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
      // 🎯 Multiple selection mode
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

      // Immediately end the interaction state in multiple selection mode
      setTimeout(() => {
        dataFlowRef.current.isUserInteracting = false
        dataFlowRef.current.interactionType = null
      }, 100)
    } else {
      // 🎯 Single selection mode
      flow.isUserInteracting = true
      flow.interactionType = "single-selecting"

      updateInternalValue(date)

      // Immediately end the interaction state in single selection mode
      setTimeout(() => {
        dataFlowRef.current.isUserInteracting = false
        dataFlowRef.current.interactionType = null
      }, 100)
    }
  })

  // Range selection helper functions
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
        // 🚀 Use a professional range checking tool - need to determine direction
        const minDate = currentRange.start <= hoverDate ? currentRange.start : hoverDate
        const maxDate = currentRange.start <= hoverDate ? hoverDate : currentRange.start
        return isWithinRange(date, minDate, maxDate, timeZone, dateComparisonMode)
      },
      isFirstInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !currentRange || !hoverDate) return false

        // 🔧 Determine which is the start point of the range
        if (currentRange.start <= hoverDate) {
          return isSameDay(date, currentRange.start)
        } else {
          return isSameDay(date, hoverDate)
        }
      },
      isLastInHoverRange: (date: Date): boolean => {
        if (!selectingRange || !currentRange || !hoverDate) return false

        // 🔧 Determine which is the end point of the range
        if (currentRange.start <= hoverDate) {
          return isSameDay(date, hoverDate)
        } else {
          return isSameDay(date, currentRange.start)
        }
      },
    }
  }, [currentValue, selectionMode, selectingRange, hoverDate, timeZone, dateComparisonMode])

  // Mouse event handling
  const handleMouseEnter = useEventCallback((date: Date) => {
    if (!isDateDisabled(date)) {
      setHoverDate(date)
    }
  })

  const handleMouseLeave = useEventCallback(() => {
    setHoverDate(null)
  })

  // Calculate the state
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

          // Check if it is the first or last row
          const isFirstInRow = index % 7 === 0
          const isLastInRow = index % 7 === 6

          // Use range helper functions
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

          // Add week numbers at the beginning of each row
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

          // Add date cells
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
