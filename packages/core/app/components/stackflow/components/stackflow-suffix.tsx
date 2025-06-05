import { forwardRef, HTMLProps, ReactNode } from "react"
import { tcx } from "~/utils"
import { stackflowTv } from "../tv"

export interface StackflowSuffixProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  className?: string
}

export const StackflowSuffix = forwardRef<HTMLDivElement, StackflowSuffixProps>(
  function StackflowSuffix(props, ref) {
    const { children, className, ...rest } = props
    const tv = stackflowTv()

    return (
      <div
        ref={ref}
        className={tcx(tv.suffix(), className)}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
