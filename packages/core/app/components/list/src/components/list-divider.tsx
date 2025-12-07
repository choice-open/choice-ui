import { tcx } from "@choiceform/design-shared"
import { forwardRef } from "react"
import { ListDividerTv } from "../tv"

export const ListDivider = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { className, ...rest } = props

    const styles = ListDividerTv()

    return (
      <div
        ref={ref}
        role="separator"
        {...rest}
        className={tcx(styles.root(), className)}
      >
        <div className={styles.divider()} />
      </div>
    )
  },
)

ListDivider.displayName = "ListDivider"
