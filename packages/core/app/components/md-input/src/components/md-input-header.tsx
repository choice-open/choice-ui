import { tcx } from "@choiceform/design-shared"
import { forwardRef, memo } from "react"
import { useMdInputContext } from "../context"
import { mdInputTv } from "../tv"

export interface MdInputHeaderProps {
  children?: React.ReactNode
  className?: string
}

export const MdInputHeader = memo(
  forwardRef<HTMLDivElement, MdInputHeaderProps>((props, ref) => {
    const { children, className } = props
    const { disabled, readOnly } = useMdInputContext()
    const tv = mdInputTv({ disabled, readOnly })

    return (
      <div
        ref={ref}
        className={tcx(tv.header(), className)}
      >
        {children}
      </div>
    )
  }),
)

MdInputHeader.displayName = "MdInputHeader"
