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
  selected: boolean
}

export const MonthCalendarDateCell = memo(function MonthCalendarDateCell(props: Props) {
  const { date, className, disabled, selected, onDateClick, onMouseEnter, onMouseLeave } = props

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

  // 生成唯一的testid，包含年月日信息
  const testId = useMemo(() => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月份从0开始，需要+1
    const day = date.getDate()
    return `${year}-${month}-${day}`
  }, [date])

  return (
    <div
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={testId}
      data-selected={selected}
      data-disabled={disabled}
    >
      <span className={tv.dayNumber()}>{dateNumber}</span>
    </div>
  )
})

MonthCalendarDateCell.displayName = "MonthCalendarDateCell"
