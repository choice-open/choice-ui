import React, { memo } from "react"
import { descriptionTv } from "./tv"

export interface DescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  disabled?: boolean
}

export const Description = memo(function Description(props: DescriptionProps) {
  const { children, className, disabled, ...rest } = props

  return (
    <p
      className={descriptionTv({ disabled, className })}
      slot="description"
      {...rest}
    >
      {children}
    </p>
  )
})
