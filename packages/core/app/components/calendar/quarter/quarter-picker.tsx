import { tcx } from "@choiceform/design-system"
import React, { useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "@choiceform/icons-react"
import type { QuarterPickerProps, QuarterItem, Quarter } from "./types"
import { QuarterPickerTv } from "./tv"
import { getYearQuarters, getCurrentQuarter, isQuarterEqual, formatQuarter } from "./utils"

export const QuarterPicker: React.FC<QuarterPickerProps> = (props) => {
  const {
    selectedQuarter,
    currentYear = new Date().getFullYear(),
    onQuarterSelect,
    onYearChange,
    className,
    minYear,
    maxYear,
    disabledQuarters = [],
    disabled = false,
    locale = "zh-CN",
  } = props

  const tv = QuarterPickerTv()

  // 获取当前季度（用于高亮）
  const currentQuarter = useMemo(() => {
    return getCurrentQuarter(currentYear, locale)
  }, [currentYear, locale])

  // 生成当前年份的季度列表
  const quarters = useMemo((): QuarterItem[] => {
    const yearQuarters = getYearQuarters(currentYear, locale)

    return yearQuarters.map((quarter) => {
      const isSelected = selectedQuarter ? isQuarterEqual(selectedQuarter, quarter) : false
      const isCurrent = isQuarterEqual(currentQuarter, quarter)
      const isDisabled =
        disabled ||
        disabledQuarters.some((dq) => dq.quarter === quarter.quarter && dq.year === quarter.year) ||
        (minYear !== undefined && quarter.year < minYear) ||
        (maxYear !== undefined && quarter.year > maxYear)

      return {
        quarter,
        isSelected,
        isCurrent,
        isDisabled,
      }
    })
  }, [
    currentYear,
    locale,
    selectedQuarter,
    currentQuarter,
    disabled,
    disabledQuarters,
    minYear,
    maxYear,
  ])

  // 处理季度选择
  const handleQuarterSelect = useCallback(
    (quarter: Quarter) => {
      if (disabled) return

      const quarterItem = quarters.find((q) => isQuarterEqual(q.quarter, quarter))
      if (quarterItem?.isDisabled) return

      onQuarterSelect?.(quarter)
    },
    [disabled, quarters, onQuarterSelect],
  )

  // 处理年份切换
  const handlePreviousYear = useCallback(() => {
    if (disabled) return
    if (minYear !== undefined && currentYear <= minYear) return

    const newYear = currentYear - 1
    onYearChange?.(newYear)
  }, [disabled, currentYear, minYear, onYearChange])

  const handleNextYear = useCallback(() => {
    if (disabled) return
    if (maxYear !== undefined && currentYear >= maxYear) return

    const newYear = currentYear + 1
    onYearChange?.(newYear)
  }, [disabled, currentYear, maxYear, onYearChange])

  // 检查导航按钮是否禁用
  const isPrevDisabled = disabled || (minYear !== undefined && currentYear <= minYear)
  const isNextDisabled = disabled || (maxYear !== undefined && currentYear >= maxYear)

  return (
    <div className={tcx(tv.container(), className)}>
      {/* 头部 */}
      <div className={tv.header()}>
        <h3 className={tv.title()}>{currentYear}年</h3>
        <div className={tv.navigation()}>
          <button
            type="button"
            className={tv.navButton()}
            onClick={handlePreviousYear}
            disabled={isPrevDisabled}
            aria-label="上一年"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={tv.navButton()}
            onClick={handleNextYear}
            disabled={isNextDisabled}
            aria-label="下一年"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* 季度网格 */}
      <div className={tv.quartersGrid()}>
        {quarters.map((quarterItem) => (
          <button
            key={`${quarterItem.quarter.year}-${quarterItem.quarter.quarter}`}
            type="button"
            className={tv.quarterCell({
              selected: quarterItem.isSelected,
              current: quarterItem.isCurrent,
              disabled: quarterItem.isDisabled,
            })}
            disabled={quarterItem.isDisabled}
            onClick={() => handleQuarterSelect(quarterItem.quarter)}
            aria-label={formatQuarter(quarterItem.quarter)}
            aria-pressed={quarterItem.isSelected}
          >
            <div className={tv.quarterTitle()}>{quarterItem.quarter.label}</div>
            <div className={tv.monthsList()}>
              {quarterItem.quarter.months.map((month, index) => (
                <div
                  key={index}
                  className={tv.monthItem()}
                >
                  {month}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

QuarterPicker.displayName = "QuarterPicker"
