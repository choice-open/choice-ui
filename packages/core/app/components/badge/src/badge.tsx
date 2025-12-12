import { tcx } from "@choice-ui/shared"
import { ElementType, forwardRef, HTMLProps, isValidElement, memo } from "react"
import { BadgeTV } from "./tv"

export interface BadgeProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "as"> {
  as?: ElementType
  strong?: boolean
  variant?: "default" | "brand" | "inverted" | "component" | "success" | "warning" | "error"
}

export const Badge = memo(
  forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
    const { className, variant = "default", strong, children, as, ...rest } = props

    const isMultiElement =
      (isValidElement(children) &&
        Array.isArray((children as React.ReactElement).props.children)) ||
      (Array.isArray(children) && children.length > 1)

    const tv = BadgeTV({ variant, strong, multiElement: isMultiElement })

    const Component = as ?? "div"

    return (
      <Component
        ref={ref}
        {...rest}
        className={tcx(tv.root(), className)}
      >
        {children}
      </Component>
    )
  }),
)

Badge.displayName = "Badge"
