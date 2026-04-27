import { tcx } from "@choice-ui/shared"
import { enUS } from "date-fns/locale"
import { forwardRef, useCallback, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "@choice-ui/shared"
import type {
  BaseQuarterProps,
  Quarter,
  QuarterItem,
  QuarterLayoutProps,
  QuarterNavigationProps,
} from "../types"
import { getCurrentQuarter, getYearQuarters, isQuarterEqual, quarterUtils } from "../utils"
import { resolveLocale } from "../utils/locale"
import { QuarterCalendarCell } from "./quarter-calendar-cell"
import { QuarterCalendarHeader } from "./quarter-calendar-header"
import { QuarterCalendarTv } from "./tv"

export interface QuarterCalendarProps
  extends BaseQuarterProps, QuarterNavigationProps, QuarterLayoutProps {}

export const QuarterCalendar = forwardRef<HTMLDivElement, QuarterCalendarProps>((props, ref) => {
  const {
    value,
    currentYear: propCurrentYear,
    onChange,
    onNavigate,
    className,
    children,
    minYear,
    maxYear,
    disabledQuarters = [],
    disabled = false,
    readOnly = false,
    startYear: propStartYear,
    locale = enUS,
    variant = "default",
    defaultValue,
  } = props

  // Create onChange adapter to handle type compatibility
  const handleQuarterChange = useCallback(
    (quarter: Quarter | null | undefined) => {
      onChange?.(quarter ?? null)
    },
    [onChange],
  )

  // Use simplified state management
  const [selectedQuarter, setSelectedQuarter] = useMergedValue<Quarter | null | undefined>({
    value,
    defaultValue,
    onChange: handleQuarterChange,
  })

  // Parse and validate input parameters
  const safeLocale = resolveLocale(locale)

  const currentYearNum = useMemo(() => {
    const extracted = quarterUtils.extractYear(propCurrentYear)
    return extracted ?? quarterUtils.getCurrentYear()
  }, [propCurrentYear])

  const yearConstraints = useMemo(
    () => ({
      min: quarterUtils.extractYear(minYear),
      max: quarterUtils.extractYear(maxYear),
      disabled: disabledQuarters,
    }),
    [minYear, maxYear, disabledQuarters],
  )

  // Internal state: displayed year
  const [internalYear, setInternalYear] = useState<number>(() => {
    const propStart = quarterUtils.extractYear(propStartYear)
    return propStart ?? currentYearNum
  })

  const displayYear = quarterUtils.extractYear(propStartYear) ?? internalYear

  // Get the actual current quarter (for highlighting the current quarter)
  const actualCurrentQuarter = useMemo(() => {
    // No year parameter, use the actual current date
    return getCurrentQuarter(undefined, safeLocale)
  }, [safeLocale])

  // Generate quarter data
  const quarters = useMemo((): QuarterItem[] => {
    const yearQuarters = getYearQuarters(displayYear, safeLocale)

    return yearQuarters.map((quarter) => {
      const isSelected = selectedQuarter ? isQuarterEqual(selectedQuarter, quarter) : false
      // Only when the year of the quarter and the actual current year are the same, it may be the current quarter
      const isCurrent = isQuarterEqual(actualCurrentQuarter, quarter)
      const isInRange = quarterUtils.isYearInRange(
        quarter.year,
        yearConstraints.min,
        yearConstraints.max,
      )
      const isDisabled =
        disabled ||
        yearConstraints.disabled.some(
          (dq) => dq.quarter === quarter.quarter && dq.year === quarter.year,
        ) ||
        !isInRange

      return {
        quarter,
        isSelected,
        isCurrent,
        isDisabled,
        isInRange,
      }
    })
  }, [displayYear, safeLocale, selectedQuarter, actualCurrentQuarter, disabled, yearConstraints])

  // Event handler
  const handleQuarterSelect = useEventCallback((quarter: Quarter) => {
    if (disabled || readOnly) return

    const quarterItem = quarters.find((q) => isQuarterEqual(q.quarter, quarter))
    if (quarterItem?.isDisabled) return

    setSelectedQuarter(quarter)
  })

  const navigateYear = useCallback(
    (direction: "prev" | "next") => {
      if (disabled) return

      const offset = direction === "prev" ? -1 : 1
      const newYear = displayYear + offset

      // Boundary check
      if (direction === "prev" && yearConstraints.min !== undefined) {
        if (newYear < yearConstraints.min) return
      }
      if (direction === "next" && yearConstraints.max !== undefined) {
        if (newYear > yearConstraints.max) return
      }

      onNavigate?.(direction, newYear)

      // If there is no external control, update the internal state
      if (propStartYear === undefined) {
        setInternalYear(newYear)
      }
    },
    [disabled, displayYear, yearConstraints, onNavigate, propStartYear],
  )

  const handlePrevious = useEventCallback(() => navigateYear("prev"))
  const handleNext = useEventCallback(() => navigateYear("next"))

  const handleToday = useEventCallback(() => {
    if (disabled || readOnly) return

    const todayYear = quarterUtils.getCurrentYear()
    const todayQuarter = getCurrentQuarter(undefined, safeLocale)

    setInternalYear(todayYear)
    setSelectedQuarter(todayQuarter)
  })

  // Navigation button state
  const navigationState = useMemo(() => {
    if (disabled) return { isPrevDisabled: true, isNextDisabled: true }

    const isPrevDisabled = yearConstraints.min !== undefined && displayYear <= yearConstraints.min
    const isNextDisabled = yearConstraints.max !== undefined && displayYear >= yearConstraints.max

    return { isPrevDisabled, isNextDisabled }
  }, [disabled, yearConstraints, displayYear])

  // Display information
  const displayInfo = useMemo(() => {
    const todayYear = quarterUtils.getCurrentYear()
    const currentYearContainsToday = displayYear === todayYear

    return {
      currentYearContainsToday,
    }
  }, [displayYear])

  const tv = QuarterCalendarTv({ variant })

  return (
    <div
      ref={ref}
      className={tcx(tv.container(), className)}
      data-testid="quarter-calendar"
    >
      <QuarterCalendarHeader
        currentYear={displayYear}
        currentYearContainsToday={displayInfo.currentYearContainsToday}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleToday={handleToday}
        isNextDisabled={navigationState.isNextDisabled}
        isPrevDisabled={navigationState.isPrevDisabled}
        locale={safeLocale}
        variant={variant}
      />

      <div
        className={tv.quartersGrid()}
        data-testid="quarters-grid"
      >
        {quarters.map((quarterItem) => (
          <QuarterCalendarCell
            key={`${quarterItem.quarter.year}-${quarterItem.quarter.quarter}`}
            className={tv.quarterCell({
              selected: quarterItem.isSelected,
              current: quarterItem.isCurrent,
              disabled: quarterItem.isDisabled,
              inRange: quarterItem.isInRange,
            })}
            quarterItem={quarterItem}
            onClick={handleQuarterSelect}
            variant={variant}
          />
        ))}
      </div>

      {children}
    </div>
  )
})

QuarterCalendar.displayName = "QuarterCalendar"
