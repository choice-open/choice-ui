import { IconButton } from "@choiceform/icon-button"
import { ChevronLeftSmall, ChevronRightSmall, Undo } from "@choiceform/icons-react"
import { memo } from "react"
import { YearCalendarTv } from "./tv"

interface Props {
  currentYearContainsToday: boolean
  endDisplayYear: number
  handleNext: () => void
  handlePrevious: () => void
  handleToday: () => void
  isNextDisabled: boolean
  isPrevDisabled: boolean
  startDisplayYear: number
  variant: "default" | "dark"
}

export const YearCalendarHeader = memo(function YearCalendarHeader(props: Props) {
  const {
    endDisplayYear,
    handleNext,
    handlePrevious,
    handleToday,
    isNextDisabled,
    isPrevDisabled,
    startDisplayYear,
    currentYearContainsToday,
    variant,
  } = props

  const tv = YearCalendarTv()

  return (
    <div className={tv.header()}>
      <h3
        className={tv.title()}
        data-testid="year-range-title"
      >
        {startDisplayYear} - {endDisplayYear}
      </h3>

      {currentYearContainsToday ? null : (
        <IconButton
          variant={variant}
          onClick={handleToday}
          aria-label="Back to current year"
          data-testid="today-button"
        >
          <Undo />
        </IconButton>
      )}
      <div
        className={tv.navigation()}
        data-testid="year-navigation"
      >
        <IconButton
          variant={variant}
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          aria-label="Previous year"
          data-testid="prev-button"
        >
          <ChevronLeftSmall />
        </IconButton>
        <IconButton
          variant={variant}
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="Next year"
          data-testid="next-button"
        >
          <ChevronRightSmall />
        </IconButton>
      </div>
    </div>
  )
})

YearCalendarHeader.displayName = "YearCalendarHeader"
