import React, { memo } from "react"
import { errorMessageTv } from "./tv"

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  disabled?: boolean
}

export const ErrorMessage = memo(function ErrorMessage(props: ErrorMessageProps) {
  const { children, className, disabled, ...rest } = props

  return (
    <em
      className={errorMessageTv({ disabled, className })}
      slot="errorMessage"
      role="alert"
      {...rest}
    >
      {children}
    </em>
  )
})
