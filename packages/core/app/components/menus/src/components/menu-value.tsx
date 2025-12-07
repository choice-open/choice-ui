import { HTMLProps, memo, ReactNode } from "react"

export interface MenuValueProps extends HTMLProps<HTMLSpanElement> {
  children: ReactNode
}

export const MenuValue = memo(({ children, ...rest }: MenuValueProps) => {
  return (
    <span
      className="flex-1 cursor-default truncate select-none"
      {...rest}
    >
      {children}
    </span>
  )
})

MenuValue.displayName = "MenuValue"
