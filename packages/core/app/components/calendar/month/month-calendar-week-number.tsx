import { memo } from "react"
import { tcx } from "~/utils"
import { MonthCalendarTv } from "./tv"

interface MonthCalendarWeekNumberProps {
  className?: string
  weekNumber: number
}

export const MonthCalendarWeekNumber = memo(function MonthCalendarWeekNumber(
  props: MonthCalendarWeekNumberProps,
) {
  const { className, weekNumber } = props

  const tv = MonthCalendarTv()

  return <div className={tcx(tv.weekNumber(), className)}>{weekNumber}</div>
})
