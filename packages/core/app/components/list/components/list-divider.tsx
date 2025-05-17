import { forwardRef } from "react"
import { tcx } from "~/utils"
import { ListDividerTv } from "../tv"

interface ListDividerProps extends React.HTMLProps<HTMLDivElement> {}

export const ListDivider = forwardRef<HTMLDivElement, ListDividerProps>((props, ref) => {
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
})

ListDivider.displayName = "ListDivider"
