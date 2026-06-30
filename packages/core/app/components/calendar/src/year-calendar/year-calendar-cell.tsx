import React, { memo } from "react"
import { useEventCallback } from "usehooks-ts"
import type { YearItem } from "../types"
import { YearCalendarTv } from "./tv"

interface Props {
  className: string
  onClick?: (year: Date) => void
  yearItem: YearItem
}

export const YearCalendarCell = memo(function YearCalendarCell(props: Props) {
  const tv = YearCalendarTv()

  const { className, yearItem, onClick } = props

  const handleClick = useEventCallback(() => {
    if (!yearItem.isDisabled && onClick) {
      onClick(yearItem.year)
    }
  })
  const yearNumber = yearItem.year.getFullYear()

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    if (!yearItem.isDisabled && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      onClick(yearItem.year)
    }
  })

  return (
    <div
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={yearItem.isDisabled ? -1 : 0}
      data-testid={yearNumber}
      data-selected={yearItem.isSelected}
      data-current={yearItem.isCurrent}
      data-disabled={yearItem.isDisabled}
      data-in-range={yearItem.isInRange}
    >
      <span className={tv.yearText()}>{yearNumber}</span>
    </div>
  )
})

YearCalendarCell.displayName = "YearCalendarCell"
