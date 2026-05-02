import React, { forwardRef, memo } from "react"
import { descriptionTv } from "./tv"

export interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  disabled?: boolean
}

export const Description = memo(
  forwardRef<HTMLParagraphElement, DescriptionProps>((props, ref) => {
    const { children, className, disabled, ...rest } = props

    return (
      <p
        ref={ref}
        className={descriptionTv({ disabled, className })}
        slot="description"
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </p>
    )
  }),
)

Description.displayName = "Description"
