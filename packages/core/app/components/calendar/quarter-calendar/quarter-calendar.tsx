import { enUS } from "date-fns/locale"
import { forwardRef, useCallback, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { useMergedValue } from "~/hooks"
import { tcx } from "~/utils"
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
  extends BaseQuarterProps,
    QuarterNavigationProps,
    QuarterLayoutProps {}

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
    readonly = false,
    startYear: propStartYear,
    locale = enUS,
    variant = "default",
    defaultValue,
  } = props

  // 创建 onChange 适配器来处理类型兼容性
  const handleQuarterChange = useCallback(
    (quarter: Quarter | null | undefined) => {
      onChange?.(quarter ?? null)
    },
    [onChange],
  )

  // 使用简化的状态管理
  const [selectedQuarter, setSelectedQuarter] = useMergedValue<Quarter | null | undefined>({
    value,
    defaultValue,
    onChange: handleQuarterChange,
  })

  // 解析和验证输入参数
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

  // 内部状态：显示的年份
  const [internalYear, setInternalYear] = useState<number>(() => {
    const propStart = quarterUtils.extractYear(propStartYear)
    return propStart ?? currentYearNum
  })

  const displayYear = quarterUtils.extractYear(propStartYear) ?? internalYear

  // 获取真实的当前季度（用于高亮今天所在的季度）
  const actualCurrentQuarter = useMemo(() => {
    // 不传年份参数，使用真实的当前日期
    return getCurrentQuarter(undefined, safeLocale)
  }, [safeLocale])

  // 生成季度数据
  const quarters = useMemo((): QuarterItem[] => {
    const yearQuarters = getYearQuarters(displayYear, safeLocale)

    return yearQuarters.map((quarter) => {
      const isSelected = selectedQuarter ? isQuarterEqual(selectedQuarter, quarter) : false
      // 只有当季度的年份和当前真实年份相同时，才可能是当前季度
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

  // 事件处理器
  const handleQuarterSelect = useEventCallback((quarter: Quarter) => {
    if (readonly) return
    if (disabled) return

    const quarterItem = quarters.find((q) => isQuarterEqual(q.quarter, quarter))
    if (quarterItem?.isDisabled) return

    setSelectedQuarter(quarter)
  })

  const navigateYear = useCallback(
    (direction: "prev" | "next") => {
      if (disabled) return

      const offset = direction === "prev" ? -1 : 1
      const newYear = displayYear + offset

      // 边界检查
      if (direction === "prev" && yearConstraints.min !== undefined) {
        if (newYear < yearConstraints.min) return
      }
      if (direction === "next" && yearConstraints.max !== undefined) {
        if (newYear > yearConstraints.max) return
      }

      onNavigate?.(direction, newYear)

      // 如果没有外部控制，更新内部状态
      if (propStartYear === undefined) {
        setInternalYear(newYear)
      }
    },
    [disabled, displayYear, yearConstraints, onNavigate, propStartYear],
  )

  const handlePrevious = useEventCallback(() => navigateYear("prev"))
  const handleNext = useEventCallback(() => navigateYear("next"))

  const handleToday = useEventCallback(() => {
    const todayYear = quarterUtils.getCurrentYear()
    const todayQuarter = getCurrentQuarter(undefined, safeLocale)

    setInternalYear(todayYear)
    setSelectedQuarter(todayQuarter)
  })

  // 导航按钮状态
  const navigationState = useMemo(() => {
    if (disabled) return { isPrevDisabled: true, isNextDisabled: true }

    const isPrevDisabled = yearConstraints.min !== undefined && displayYear <= yearConstraints.min
    const isNextDisabled = yearConstraints.max !== undefined && displayYear >= yearConstraints.max

    return { isPrevDisabled, isNextDisabled }
  }, [disabled, yearConstraints, displayYear])

  // 显示信息
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
