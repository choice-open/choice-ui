import { forwardRef, HTMLProps, memo, ReactNode } from "react"

export interface MenuValueProps extends HTMLProps<HTMLSpanElement> {
  children?: ReactNode
}

export const MenuValue = memo(
  forwardRef<HTMLSpanElement, MenuValueProps>(({ children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className="flex-1 cursor-default truncate select-none"
        {...rest}
      >
        {children}
      </span>
    )
  }),
)

MenuValue.displayName = "MenuValue"
