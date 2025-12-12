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
      {selected && (
        <div className={tv.checkbox()}>
          <Check />
        </div>
      )}
    </div>
  )
})
