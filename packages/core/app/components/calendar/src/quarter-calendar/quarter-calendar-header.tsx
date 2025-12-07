import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { ChevronLeftSmall, ChevronRightSmall, Undo } from "@choiceform/icons-react"
import { format } from "date-fns"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { QuarterCalendarTv } from "./tv"

export interface QuarterCalendarHeaderProps {
  className?: string
  currentYear: number
  currentYearContainsToday: boolean
  handleNext: () => void
  handlePrevious: () => void
  handleToday: () => void
  isNextDisabled: boolean
  isPrevDisabled: boolean
  variant?: "default" | "dark"
}

export const QuarterCalendarHeader = forwardRef<HTMLDivElement, QuarterCalendarHeaderProps>(
  (props, ref) => {
    const {
      className,
      currentYear,
      currentYearContainsToday,
      handleNext,
      handlePrevious,
      handleToday,
      isNextDisabled,
      isPrevDisabled,
      variant = "default",
    } = props

    const tv = QuarterCalendarTv({ variant })

    const handleTodayClick = useEventCallback(() => {
      handleToday()
    })

    return (
      <div
        ref={ref}
        className={tcx(tv.header(), className)}
        data-testid="quarter-calendar-header"
      >
        <h3
          className={tv.title()}
          data-testid="year-title"
        >
          {format(currentYear, "yyyy")}
        </h3>

        <div
          className={tv.navigation()}
          data-testid="quarter-navigation"
        >
          {currentYearContainsToday ? null : (
            <IconButton
              variant={variant}
              onClick={handleTodayClick}
              aria-label="Back to current year"
              data-testid="today-button"
            >
              <Undo />
            </IconButton>
          )}

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
  },
)

QuarterCalendarHeader.displayName = "QuarterCalendarHeader"
