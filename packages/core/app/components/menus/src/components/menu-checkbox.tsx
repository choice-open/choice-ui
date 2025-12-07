import { HTMLProps, memo } from "react"
import { Check } from "@choiceform/icons-react"
import { MenuCheckboxTv } from "../tv"

interface MenuCheckboxProps extends HTMLProps<HTMLDivElement> {
  active?: boolean
  disabled?: boolean
  indeterminate?: boolean
  selected?: boolean
}

export const MenuCheckbox = memo(function MenuCheckbox(props: MenuCheckboxProps) {
  const { active, selected, disabled, indeterminate, ...rest } = props
  const styles = MenuCheckboxTv({ active, selected })

  return (
    <div className={styles.root()}>
      {selected && (
        <div className={styles.checkbox()}>
          <Check />
        </div>
      )}
    </div>
  )
})
