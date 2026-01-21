import { tcx } from "@choice-ui/shared"
import { forwardRef } from "react"
import { ListDividerTv } from "../tv"
import { useStructureContext } from "../context"

export const ListDivider = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { className, ...rest } = props
    const { variant = "default" } = useStructureContext()

    const tv = ListDividerTv({ variant })

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
