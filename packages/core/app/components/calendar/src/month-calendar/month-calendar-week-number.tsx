import { tcx } from "@choiceform/design-shared"
import { memo } from "react"
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

  return (
    <div
      className={tcx(tv.weekNumber(), className)}
      data-testid={`week-number-${weekNumber}`}
    >
      {weekNumber}
    </div>
  )
})
