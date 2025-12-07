import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { MenuDividerTv } from "../tv"

export const MenuDivider = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props
  const styles = MenuDividerTv()

  return (
    <div
      ref={ref}
      className={tcx(styles.root(), className)}
      aria-hidden="true"
      {...rest}
    >
      <div className={styles.divider()} />
    </div>
  )
})

MenuDivider.displayName = "MenuDivider"
