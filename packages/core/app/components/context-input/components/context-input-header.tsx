import { forwardRef, memo } from "react"
import { tcx } from "~/utils"
import { contextInputHeaderTv } from "./tv"

interface ContextInputHeaderProps {
  children?: React.ReactNode
  className?: string
  handleClick?: () => void
  size?: "default" | "large"
}

export const ContextInputHeader = memo(
  forwardRef<HTMLDivElement, ContextInputHeaderProps>(function ContextInputHeader(props, ref) {
    const { children, size = "default", className, handleClick, ...rest } = props

    const tv = contextInputHeaderTv({ size })

    return (
      <div
        ref={ref}
        className={tcx(tv, className)}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </div>
    )
  }),
)
