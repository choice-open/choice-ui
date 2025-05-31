import {
  ChevronDownSmall,
  ChevronLeftSmall,
  ChevronRightSmall,
  ChevronUpSmall,
  Undo,
} from "@choiceform/icons-react"
import { memo } from "react"
import { IconButton } from "~/components"
import { MonthCalendarTv } from "./tv"

interface Props {
  currentMonthContainsToday: boolean
  direction?: "horizontal" | "vertical"
  formattedMonthTitle: string
  handleNextMonth: () => void
  handlePrevMonth: () => void
  handleToday: () => void
  showWeekNumbers: boolean
  variant: "default" | "dark"
}

export const MonthCalendarHeader = memo(function MonthCalendarHeader(props: Props) {
  const {
    direction = "horizontal",
    formattedMonthTitle,
    currentMonthContainsToday,
    handleToday,
    handlePrevMonth,
    handleNextMonth,
    showWeekNumbers,
    variant,
  } = props

  const tv = MonthCalendarTv({
    showWeekNumbers,
    variant,
  })

  return (
    <div className={tv.header()}>
      {showWeekNumbers && <div />}

      <div className={tv.headerWrapper()}>
        <div className={tv.title()}>{formattedMonthTitle}</div>

        {currentMonthContainsToday ? null : (
          <IconButton
            variant={variant}
            onClick={handleToday}
            aria-label="Today"
          >
            <Undo />
          </IconButton>
        )}

        <IconButton
          variant={variant}
          onClick={handlePrevMonth}
          aria-label="上个月"
        >
          {direction === "vertical" ? <ChevronUpSmall /> : <ChevronLeftSmall />}
        </IconButton>

        <IconButton
          variant={variant}
          onClick={handleNextMonth}
          aria-label="下个月"
        >
          {direction === "vertical" ? <ChevronDownSmall /> : <ChevronRightSmall />}
        </IconButton>
      </div>
    </div>
  )
})
