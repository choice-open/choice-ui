import { tcx } from "@choiceform/design-shared"
import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import type { Quarter, QuarterItem } from "../types"
import { formatQuarter } from "../utils"
import { QuarterCalendarTv } from "./tv"

export interface QuarterCalendarCellProps {
  className?: string
  onClick: (quarter: Quarter) => void
  quarterItem: QuarterItem
  variant?: "default" | "dark"
}

export const QuarterCalendarCell = forwardRef<HTMLButtonElement, QuarterCalendarCellProps>(
  (props, ref) => {
    const { className, onClick, quarterItem, variant = "default" } = props

    const tv = QuarterCalendarTv({ variant })

    const handleClick = useEventCallback(() => {
      if (quarterItem.isDisabled) return
      onClick(quarterItem.quarter)
    })

    return (
      <button
        ref={ref}
        type="button"
        className={tcx(className)}
        disabled={quarterItem.isDisabled}
        onClick={handleClick}
        aria-label={formatQuarter(quarterItem.quarter)}
        aria-pressed={quarterItem.isSelected}
        data-testid={`${quarterItem.quarter.year}-Q${quarterItem.quarter.quarter}`}
        data-selected={quarterItem.isSelected}
        data-current={quarterItem.isCurrent}
        data-disabled={quarterItem.isDisabled}
        data-in-range={quarterItem.isInRange}
      >
        <div className={tv.quarterTitle()}>{quarterItem.quarter.label}</div>

        <div className={tv.monthsList()}>
          {quarterItem.quarter.months.map((month, index) => (
            <div
              key={index}
              className={tv.monthItem()}
            >
              {month}
            </div>
          ))}
        </div>
      </button>
    )
  },
)

QuarterCalendarCell.displayName = "QuarterCalendarCell"
