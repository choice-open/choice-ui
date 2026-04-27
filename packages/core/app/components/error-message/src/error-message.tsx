import React, { forwardRef, memo } from "react"
import { errorMessageTv } from "./tv"

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  disabled?: boolean
}

export const ErrorMessage = memo(
  forwardRef<HTMLParagraphElement, ErrorMessageProps>((props, ref) => {
    const { children, className, disabled, ...rest } = props

    return (
      <p
        ref={ref}
        className={errorMessageTv({ disabled, className })}
        slot="errorMessage"
        {...rest}
        role="alert"
      >
        {children}
      </p>
    )
  }),
)

ErrorMessage.displayName = "ErrorMessage"
