import { IconButton } from "@choiceform/design-system"
import { ChevronDownSmall, ChevronUpSmall, Undo } from "@choiceform/icons-react"
import { memo } from "react"
import { MonthCalendarTv } from "./tv"

interface Props {
  currentMonthContainsToday: boolean
  formattedMonthTitle: string
  handleNextMonth: () => void
  handlePrevMonth: () => void
  handleToday: () => void
  showWeekNumbers: boolean
}

export const MonthCalendarHeader = memo(function MonthCalendarHeader(props: Props) {
  const {
    formattedMonthTitle,
    currentMonthContainsToday,
    handleToday,
    handlePrevMonth,
    handleNextMonth,
    showWeekNumbers,
  } = props

  const tv = MonthCalendarTv({
    showWeekNumbers,
  })

  return (
    <div className={tv.header()}>
      {showWeekNumbers && <div />}

      <div className={tv.headerWrapper()}>
        <div className={tv.title()}>{formattedMonthTitle}</div>

        {currentMonthContainsToday ? null : (
          <IconButton
            onClick={handleToday}
            aria-label="Today"
          >
            <Undo />
          </IconButton>
        )}

        <IconButton
          onClick={handlePrevMonth}
          aria-label="上个月"
        >
          <ChevronUpSmall />
        </IconButton>

        <IconButton
          onClick={handleNextMonth}
          aria-label="下个月"
        >
          <ChevronDownSmall />
        </IconButton>
      </div>
    </div>
  )
})
