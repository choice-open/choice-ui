import { memo } from "react"
import { MonthCalendarTv } from "./tv"

interface Props {
  day: string
}

export const MonthCalendarWeekDay = memo(function MonthCalendarWeekDay(props: Props) {
  const { day } = props
  const tv = MonthCalendarTv()

  return <div className={tv.weekday()}>{day}</div>
})

MonthCalendarWeekDay.displayName = "MonthCalendarWeekDay"
