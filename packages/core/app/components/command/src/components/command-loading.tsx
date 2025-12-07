import { tcx } from "@choiceform/design-shared"
import React, { forwardRef } from "react"
import { commandLoadingTv } from "../tv"

export interface CommandLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  progress?: number
}

export const CommandLoading = forwardRef<HTMLDivElement, CommandLoadingProps>((props, ref) => {
  const { className, children, label = "Loading...", progress, ...rest } = props
  const tv = commandLoadingTv()

  return (
    <div
      ref={ref}
      {...props}
      className={tcx(tv.root({ className }))}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div aria-hidden>{children}</div>
    </div>
  )
})

CommandLoading.displayName = "CommandLoading"
