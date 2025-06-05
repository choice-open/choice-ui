import { forwardRef, HTMLProps, ReactNode } from "react"
import { tcx } from "~/utils"
import { stackflowTv } from "../tv"

export interface StackflowPrefixProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode
  className?: string
}

export const StackflowPrefix = forwardRef<HTMLDivElement, StackflowPrefixProps>(
  function StackflowPrefix(props, ref) {
    const { children, className, ...rest } = props
    const tv = stackflowTv()

    return (
      <div
        ref={ref}
        className={tcx(tv.prefix(), className)}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
