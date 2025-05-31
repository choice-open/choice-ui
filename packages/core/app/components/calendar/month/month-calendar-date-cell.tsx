import { memo, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { MonthCalendarTv } from "./tv"

interface Props {
  className: string
  date: Date
  disabled: boolean
  inHoverRange: boolean
  inRange: boolean
  onDateClick?: (date: Date) => void
  onMouseEnter: (date: Date) => void
  onMouseLeave: () => void
}

export const MonthCalendarDateCell = memo(function MonthCalendarDateCell(props: Props) {
  const { date, className, disabled, onDateClick, onMouseEnter, onMouseLeave } = props

  const tv = MonthCalendarTv()

  const handleClick = useEventCallback(() => {
    if (!disabled && onDateClick) {
      onDateClick(date)
    }
  })

  const handleMouseEnter = useEventCallback(() => {
    onMouseEnter(date)
  })

  const dateNumber = useMemo(() => date.getDate(), [date])

  return (
    <div
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={tv.dayNumber()}>{dateNumber}</span>
    </div>
  )
})

MonthCalendarDateCell.displayName = "MonthCalendarDateCell"
