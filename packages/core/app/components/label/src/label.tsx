import React, { forwardRef, memo } from "react"
import { labelTv } from "./tv"

export interface LabelProps extends React.LabelHTMLAttributes<
  HTMLLabelElement | HTMLLegendElement
> {
  action?: React.ReactNode
  as?: "label" | "legend"
  children: React.ReactNode
  description?: string
  disabled?: boolean
  required?: boolean
  variant?: "default" | "light" | "dark" | "reset"
}

export const Label = memo(
  forwardRef<HTMLLabelElement | HTMLLegendElement, LabelProps>((props, ref) => {
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

    const { htmlFor, ...restFiltered } = rest as typeof rest & { htmlFor?: string }
    const finalProps = as === "legend" ? restFiltered : rest

    return (
      <Component
        ref={ref as React.Ref<HTMLLabelElement & HTMLLegendElement>}
        className={tv.root({ className })}
        {...finalProps}
      >
        {children && <span className={tv.content()}>{children}</span>}
        {required && (
          <span
            aria-label="required"
            className={tv.required()}
          >
            *
          </span>
        )}
        {description && <span className={tv.description()}>{description}</span>}
        {action && <span className={tv.action()}>{action}</span>}
      </Component>
    )
  }),
)

Label.displayName = "Label"
