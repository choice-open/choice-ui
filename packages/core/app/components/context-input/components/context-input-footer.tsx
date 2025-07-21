import React, { forwardRef, memo } from "react"
import { tcx } from "~/utils"
import { contextInputFooterTv } from "./tv"

interface ContextInputFooterProps {
  children: React.ReactNode
  className?: string
  handleClick?: () => void
  size?: "default" | "large"
}

export const ContextInputFooter = memo(
  forwardRef<HTMLDivElement, ContextInputFooterProps>(function ContextInputFooter(props, ref) {
    const { children, className, size = "default", handleClick, ...rest } = props

    const tv = contextInputFooterTv({ size })

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
