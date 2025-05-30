import { tcx } from "@choiceform/design-system"
import React, { useMemo, useCallback, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { YearPickerProps, YearItem } from "./types"
import { YearPickerTv } from "./tv"

export const YearPicker: React.FC<YearPickerProps> = (props) => {
  const {
    selectedYear,
    currentYear = new Date().getFullYear(),
    onYearSelect,
    onNavigate,
    className,
    minYear,
    maxYear,
    disabledYears = [],
    disabled = false,
    startYear: propStartYear,
    yearCount = 12,
  } = props

  const tv = YearPickerTv()

  // 内部状态管理显示的年份范围起始年
  const [internalStartYear, setInternalStartYear] = useState<number>(() => {
    return propStartYear ?? currentYear - Math.floor(yearCount / 2)
  })

  // 计算显示的年份范围起始年（优先使用 prop，否则使用内部状态）
  const startYear = propStartYear ?? internalStartYear

  // 生成年份列表
  const years = useMemo((): YearItem[] => {
    const yearsList: YearItem[] = []

    for (let i = 0; i < yearCount; i++) {
      const year = startYear + i
      const isSelected = selectedYear === year
      const isCurrent = currentYear === year
      const isDisabled =
        disabled ||
        disabledYears.includes(year) ||
        (minYear !== undefined && year < minYear) ||
        (maxYear !== undefined && year > maxYear)
      const isInRange =
        (minYear === undefined || year >= minYear) && (maxYear === undefined || year <= maxYear)

      yearsList.push({
        year,
        isSelected,
        isCurrent,
        isDisabled,
        isInRange,
      })
    }

    return yearsList
  }, [startYear, yearCount, selectedYear, currentYear, disabled, disabledYears, minYear, maxYear])

  // 处理年份选择
  const handleYearSelect = useCallback(
    (year: number) => {
      if (disabled) return

      const yearItem = years.find((y) => y.year === year)
      if (yearItem?.isDisabled) return

      onYearSelect?.(year)
    },
    [disabled, years, onYearSelect],
  )

  // 处理上一组年份
  const handlePrevious = useCallback(() => {
    if (disabled) return

    // 计算新的起始年份
    const newStartYear = startYear - yearCount

    // 检查是否超出最小年份限制
    if (minYear !== undefined && newStartYear + yearCount - 1 < minYear) {
      return
    }

    // 通知父组件导航变化
    onNavigate?.("prev", newStartYear)

    // 如果没有传入 propStartYear，则更新内部状态
    if (propStartYear === undefined) {
      setInternalStartYear(newStartYear)
    }
  }, [disabled, startYear, yearCount, minYear, propStartYear, onNavigate])

  // 处理下一组年份
  const handleNext = useCallback(() => {
    if (disabled) return

    // 计算新的起始年份
    const newStartYear = startYear + yearCount

    // 检查是否超出最大年份限制
    if (maxYear !== undefined && newStartYear > maxYear) {
      return
    }

    // 通知父组件导航变化
    onNavigate?.("next", newStartYear)

    // 如果没有传入 propStartYear，则更新内部状态
    if (propStartYear === undefined) {
      setInternalStartYear(newStartYear)
    }
  }, [disabled, startYear, yearCount, maxYear, propStartYear, onNavigate])

  const startDisplayYear = years[0]?.year
  const endDisplayYear = years[years.length - 1]?.year

  // 检查导航按钮是否禁用
  const isPrevDisabled = useMemo(() => {
    if (disabled) return true
    if (minYear === undefined) return false

    const prevStartYear = startYear - yearCount
    return prevStartYear + yearCount - 1 < minYear
  }, [disabled, minYear, startYear, yearCount])

  const isNextDisabled = useMemo(() => {
    if (disabled) return true
    if (maxYear === undefined) return false

    const nextStartYear = startYear + yearCount
    return nextStartYear > maxYear
  }, [disabled, maxYear, startYear, yearCount])

  return (
    <div className={tcx(tv.container(), className)}>
      {/* 头部 */}
      <div className={tv.header()}>
        <h3 className={tv.title()}>
          {startDisplayYear} - {endDisplayYear}
        </h3>
        <div className={tv.navigation()}>
          <button
            type="button"
            className={tv.navButton()}
            onClick={handlePrevious}
            disabled={isPrevDisabled}
            aria-label="上一组年份"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className={tv.navButton()}
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="下一组年份"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 年份网格 */}
      <div className={tv.yearsGrid()}>
        {years.map((yearItem) => (
          <button
            key={yearItem.year}
            type="button"
            className={tv.yearCell({
              selected: yearItem.isSelected,
              current: yearItem.isCurrent,
              disabled: yearItem.isDisabled,
              inRange: yearItem.isInRange,
            })}
            disabled={yearItem.isDisabled}
            onClick={() => handleYearSelect(yearItem.year)}
            aria-label={`选择年份 ${yearItem.year}`}
            aria-pressed={yearItem.isSelected}
          >
            <span className={tv.yearText()}>{yearItem.year}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

YearPicker.displayName = "YearPicker"
