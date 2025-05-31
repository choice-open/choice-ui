import { forwardRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { tcx } from "~/utils"
import { Quarter, formatQuarter } from "../utils"
import { QuarterCalendarTv } from "./tv"
import type { QuarterItem } from "./types"

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
