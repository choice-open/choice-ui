import { forwardRef } from "react"
import { tcx } from "~/utils"
import { ListLabelTv } from "../tv"
import { useSelectionContext } from "../context"

interface ListLabelProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
}

export const ListLabel = forwardRef<HTMLDivElement, ListLabelProps>((props, ref) => {
  const { children, className, ...rest } = props
  const { selection } = useSelectionContext()

  const styles = ListLabelTv({ selection })

  return (
    <div
      ref={ref}
      {...rest}
      className={tcx(styles, className)}
    >
      {children}
    </div>
  )
})

ListLabel.displayName = "ListLabel"
