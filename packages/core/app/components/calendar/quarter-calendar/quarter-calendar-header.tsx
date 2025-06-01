import { ChevronLeftSmall, ChevronRightSmall, Undo } from "@choiceform/icons-react"
import type { Locale } from "date-fns"
import { forwardRef, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { IconButton } from "../../icon-button"
import { isChineseLocale, resolveLocale } from "../utils/locale"
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
  locale?: Locale | string
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
      locale,
      variant = "default",
    } = props

    const safeLocale = resolveLocale(locale)
    const tv = QuarterCalendarTv({ variant })

    // 本地化文本
    const labels = useMemo(() => {
      if (isChineseLocale(safeLocale)) {
        return {
          prevLabel: "上一年",
          nextLabel: "下一年",
          todayLabel: "今年",
          yearTitle: `${currentYear}年`,
        }
      }
      return {
        prevLabel: "Previous year",
        nextLabel: "Next year",
        todayLabel: "This year",
        yearTitle: currentYear.toString(),
      }
    }, [safeLocale, currentYear])

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
          {labels.yearTitle}
        </h3>

        <div
          className={tv.navigation()}
          data-testid="quarter-navigation"
        >
          {currentYearContainsToday ? null : (
            <IconButton
              variant={variant}
              onClick={handleTodayClick}
              aria-label={labels.todayLabel}
              data-testid="today-button"
            >
              <Undo />
            </IconButton>
          )}

          <IconButton
            variant={variant}
            onClick={handlePrevious}
            disabled={isPrevDisabled}
            aria-label={labels.prevLabel}
            data-testid="prev-button"
          >
            <ChevronLeftSmall />
          </IconButton>
          <IconButton
            variant={variant}
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label={labels.nextLabel}
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
