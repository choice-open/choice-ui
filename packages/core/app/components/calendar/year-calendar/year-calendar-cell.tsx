import { memo } from "react"
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

  return (
    <div
      className={className}
      onClick={handleClick}
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
