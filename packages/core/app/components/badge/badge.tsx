import { forwardRef, HTMLProps, isValidElement, memo } from "react"
import { tcx } from "~/utils"
import { BadgeTV } from "./tv"

export interface BadgeProps extends Omit<HTMLProps<HTMLDivElement>, "size"> {
  strong?: boolean
  variant?: "default" | "brand" | "inverted" | "component" | "success" | "warning" | "error"
}

export const Badge = memo(
  forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
    const { className, variant = "default", strong, children, ...rest } = props

    const isMultiElement =
      (isValidElement(children) &&
        Array.isArray((children as React.ReactElement).props.children)) ||
      (Array.isArray(children) && children.length > 1)

    const style = BadgeTV({ variant, strong, multiElement: isMultiElement })

    return (
      <div
        ref={ref}
        {...rest}
        className={tcx(style.root(), className)}
      >
        {children}
      </div>
    )
  }),
)

Badge.displayName = "Badge"
