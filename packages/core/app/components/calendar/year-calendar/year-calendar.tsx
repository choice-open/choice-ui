import { isDate, isValid } from "date-fns"
import { enUS } from "date-fns/locale"
import { forwardRef, useCallback, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"
import { tcx } from "~/utils"
import type { BaseYearProps, YearItem, YearLayoutProps, YearNavigationProps } from "../types"
import { yearUtils } from "../utils"
import { resolveLocale } from "../utils/locale"
import { YearCalendarTv } from "./tv"
import { YearCalendarCell } from "./year-calendar-cell"
import { YearCalendarHeader } from "./year-calendar-header"

export interface YearCalendarProps extends BaseYearProps, YearNavigationProps, YearLayoutProps {}

export const YearCalendar = forwardRef<HTMLDivElement, YearCalendarProps>((props, ref) => {
  const {
    value,
    currentYear: propCurrentYear,
    onChange,
    onNavigate,
    className,
    minYear,
    maxYear,
    disabledYears = [],
    disabled = false,
    startYear: propStartYear,
    yearCount = 12,
    locale = enUS,
    variant = "default",
    defaultValue,
  } = props

  // 创建 onChange 适配器来处理类型兼容性
  const handleYearChange = useCallback(
    (year: Date | null | undefined) => {
      // 将 undefined 转换为 null，因为 onChange 不接受 undefined
      onChange?.(year ?? null)
    },
    [onChange],
  )

  // 使用简化的状态管理
  const [selectedYear, setSelectedYear] = useMergedValue<Date | null | undefined>({
    value,
    defaultValue,
    onChange: handleYearChange,
  })

  // 解析和验证输入参数
  const safeLocale = resolveLocale(locale)

  const currentYearNum = useMemo(() => {
    const extracted = yearUtils.extractYear(propCurrentYear)
    return extracted ?? yearUtils.getCurrentYear()
  }, [propCurrentYear])

  const yearConstraints = useMemo(
    () => ({
      min: yearUtils.extractYear(minYear),
      max: yearUtils.extractYear(maxYear),
      disabled: disabledYears
        .map(yearUtils.extractYear)
        .filter((year): year is number => year !== undefined),
    }),
    [minYear, maxYear, disabledYears],
  )

  // 内部状态：显示的年份范围起始年
  const [internalStartYear, setInternalStartYear] = useState<number>(() => {
    const propStart = yearUtils.extractYear(propStartYear)
    return propStart ?? currentYearNum - Math.floor(yearCount / 2)
  })

  const startYear = yearUtils.extractYear(propStartYear) ?? internalStartYear

  // 生成年份数据
  const years = useMemo((): YearItem[] => {
    const yearsList: YearItem[] = []
    const selectedYearNum =
      selectedYear && isDate(selectedYear) && isValid(selectedYear)
        ? selectedYear.getFullYear()
        : undefined

    for (let i = 0; i < yearCount; i++) {
      const yearNum = startYear + i
      const yearDate = yearUtils.createYearDate(yearNum)

      const isSelected = selectedYearNum === yearNum
      const isCurrent = currentYearNum === yearNum
      const isInRange = yearUtils.isYearInRange(yearNum, yearConstraints.min, yearConstraints.max)
      const isDisabled = disabled || yearConstraints.disabled.includes(yearNum) || !isInRange

      yearsList.push({
        year: yearDate,
        isSelected,
        isCurrent,
        isDisabled,
        isInRange,
      })
    }

    return yearsList
  }, [startYear, yearCount, selectedYear, currentYearNum, disabled, yearConstraints])

  // 事件处理器
  const handleYearSelect = useEventCallback((year: Date) => {
    if (disabled) return

    const yearNum = year.getFullYear()
    const yearItem = years.find((y) => y.year.getFullYear() === yearNum)

    if (yearItem?.isDisabled) return

    setSelectedYear(year)
  })

  const navigateYears = useCallback(
    (direction: "prev" | "next") => {
      if (disabled) return

      const offset = direction === "prev" ? -yearCount : yearCount
      const newStartYear = startYear + offset

      // 边界检查
      if (direction === "prev" && yearConstraints.min !== undefined) {
        if (newStartYear + yearCount - 1 < yearConstraints.min) return
      }
      if (direction === "next" && yearConstraints.max !== undefined) {
        if (newStartYear > yearConstraints.max) return
      }

      const newStartDate = yearUtils.createYearDate(newStartYear)
      onNavigate?.(direction, newStartDate)

      // 如果没有外部控制，更新内部状态
      if (propStartYear === undefined) {
        setInternalStartYear(newStartYear)
      }
    },
    [disabled, startYear, yearCount, yearConstraints, onNavigate, propStartYear],
  )

  const handlePrevious = useEventCallback(() => navigateYears("prev"))
  const handleNext = useEventCallback(() => navigateYears("next"))

  const handleToday = useEventCallback(() => {
    const todayYear = yearUtils.getCurrentYear()
    const todayYearDate = yearUtils.createYearDate(todayYear)

    setInternalStartYear(todayYear - Math.floor(yearCount / 2))
    setSelectedYear(todayYearDate)
  })

  // 导航按钮状态
  const navigationState = useMemo(() => {
    if (disabled) return { isPrevDisabled: true, isNextDisabled: true }

    const isPrevDisabled =
      yearConstraints.min !== undefined &&
      startYear - yearCount + yearCount - 1 < yearConstraints.min

    const isNextDisabled =
      yearConstraints.max !== undefined && startYear + yearCount > yearConstraints.max

    return { isPrevDisabled, isNextDisabled }
  }, [disabled, yearConstraints, startYear, yearCount])

  // 显示信息
  const displayInfo = useMemo(() => {
    const startDisplayYear = years[0]?.year.getFullYear() ?? yearUtils.getCurrentYear()
    const endDisplayYear = years[years.length - 1]?.year.getFullYear() ?? yearUtils.getCurrentYear()
    const todayYear = yearUtils.getCurrentYear()
    const currentYearContainsToday =
      startYear <= todayYear && todayYear <= startYear + yearCount - 1

    return {
      startDisplayYear,
      endDisplayYear,
      currentYearContainsToday,
    }
  }, [years, startYear, yearCount])

  const tv = YearCalendarTv({ variant })

  return (
    <div
      ref={ref}
      className={tcx(tv.container(), className)}
      data-testid="year-calendar"
    >
      <YearCalendarHeader
        currentYearContainsToday={displayInfo.currentYearContainsToday}
        endDisplayYear={displayInfo.endDisplayYear}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleToday={handleToday}
        isNextDisabled={navigationState.isNextDisabled}
        isPrevDisabled={navigationState.isPrevDisabled}
        locale={locale}
        startDisplayYear={displayInfo.startDisplayYear}
        variant={variant}
      />

      <div
        className={tv.yearsGrid()}
        data-testid="years-grid"
      >
        {years.map((yearItem) => {
          const yearNumber = yearItem.year.getFullYear()

          return (
            <YearCalendarCell
              key={yearNumber}
              className={tv.yearCell({
                selected: yearItem.isSelected,
                current: yearItem.isCurrent,
                disabled: yearItem.isDisabled,
                inRange: yearItem.isInRange,
              })}
              yearItem={yearItem}
              onClick={handleYearSelect}
            />
          )
        })}
      </div>
    </div>
  )
})

YearCalendar.displayName = "YearCalendar"
