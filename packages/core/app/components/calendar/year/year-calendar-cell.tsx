import { memo } from "react"
import { YearCalendarTv } from "./tv"
import { YearItem } from "./types"
import { useEventCallback } from "usehooks-ts"

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
    >
      <span className={tv.yearText()}>{yearNumber}</span>
    </div>
  )
})

YearCalendarCell.displayName = "YearCalendarCell"
