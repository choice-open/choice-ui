import React, { memo } from "react"
import { labelTv } from "./tv"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement | HTMLLegendElement> {
  action?: React.ReactNode
  as?: "label" | "legend"
  children: React.ReactNode
  description?: string
  disabled?: boolean
  required?: boolean
  variant?: "default" | "light" | "dark" | "reset"
}

export const Label = memo(function Label(props: LabelProps) {
  const {
    children,
    className,
    description,
    disabled,
    required,
    action,
    variant,
    as = "label",
    ...rest
  } = props

  const tv = labelTv({
    disabled,
    variant,
  })

  const Component = as || "label"

  return (
    <Component
      className={tv.root({ className })}
      {...rest}
    >
      {children && <span className={tv.content()}>{children}</span>}
      {required && <span className={tv.required()}>*</span>}
      {description && <span className={tv.description()}>{description}</span>}
      {action && <span className={tv.action()}>{action}</span>}
    </Component>
  )
})
