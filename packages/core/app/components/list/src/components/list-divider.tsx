import { tcx } from "@choice-ui/shared"
import { forwardRef } from "react"
import { ListDividerTv } from "../tv"

export const ListDivider = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { className, ...rest } = props

    const tv = ListDividerTv()

    return (
      <div
        ref={ref}
        role="separator"
        {...rest}
        className={tcx(tv.root(), className)}
      >
        <div className={tv.divider()} />
      </div>
    )
  },
)

ListDivider.displayName = "ListDivider"
