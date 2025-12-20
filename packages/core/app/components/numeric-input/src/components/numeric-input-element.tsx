import { tcx } from "@choice-ui/shared"
import { forwardRef, memo, ReactNode, useMemo } from "react"
import { useNumericInputContext } from "../context"
import { NumericInputElementTv } from "../tv"

export type ElementType = "action" | "handler" | "menu"

export interface NumericInputElementProps {
  children?: ReactNode
  className?: string
  position?: "prefix" | "suffix"
  type?: ElementType
}

export const NumericInputElement = memo(
  forwardRef<HTMLDivElement, NumericInputElementProps>(function NumericInputElement(props, ref) {
    const { type = "handler", className, position, children } = props

    const context = useNumericInputContext()
    const handlerProps = context.handlerProps

    const tv = NumericInputElementTv({
      type,
      position,
      size: context.size,
      disabled: context.disabled,
      variant: context.variant,
    })

    const elementProps = useMemo(
      () => (type === "handler" ? handlerProps : {}),
      [type, handlerProps],
    )

    return (
      <div
        ref={ref}
        className={tcx(tv, className)}
        data-element-position={position}
        data-element-type={type}
        {...elementProps}
      >
        {children}
      </div>
    )
  }),
)

NumericInputElement.displayName = "NumericInputElement"
