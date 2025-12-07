import { tcx } from "@choiceform/design-shared"
import { forwardRef, memo } from "react"

export interface MdInputFooterProps {
  children?: React.ReactNode
  className?: string
}

export const MdInputFooter = memo(
  forwardRef<HTMLDivElement, MdInputFooterProps>((props, ref) => {
    const { children, className } = props

    return (
      <div
        ref={ref}
        className={tcx("border-t p-2", className)}
      >
        {children}
      </div>
    )
  }),
)

MdInputFooter.displayName = "MdInputFooter"
