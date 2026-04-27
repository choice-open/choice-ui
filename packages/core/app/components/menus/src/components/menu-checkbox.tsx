import { HTMLProps, memo } from "react"
import { Check } from "@choiceform/icons-react"
import { MenuCheckboxTv } from "../tv"

export interface MenuCheckboxProps extends HTMLProps<HTMLDivElement> {
  active?: boolean
  disabled?: boolean
  indeterminate?: boolean
  selected?: boolean
}

export const MenuCheckbox = memo(function MenuCheckbox(props: MenuCheckboxProps) {
  const { active, selected, disabled, indeterminate, ...rest } = props
  const tv = MenuCheckboxTv({ active, selected })

  return (
    <div className={tv.root()}>
      {selected && !indeterminate && (
        <div className={tv.checkbox()}>
          <Check />
        </div>
      )}
      {indeterminate && (
        <div
          className={tv.checkbox()}
          data-indeterminate
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          >
            <line
              x1="6"
              y1="12"
              x2="18"
              y2="12"
            />
          </svg>
        </div>
      )}
    </div>
  )
})
