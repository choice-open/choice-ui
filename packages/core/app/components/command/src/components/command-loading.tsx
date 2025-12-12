import { tcx } from "@choice-ui/shared"
import React, { forwardRef } from "react"
import { commandLoadingTv } from "../tv"

export interface CommandLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The label of the loading.
   * @default "Loading..."
   */
  label?: string
  /**
   * The progress of the loading.
   * @default undefined
   */
  progress?: number
}

export const CommandLoading = forwardRef<HTMLDivElement, CommandLoadingProps>((props, ref) => {
  const { className, children, label = "Loading...", progress, ...rest } = props
  const tv = commandLoadingTv()

  return (
    <div
      ref={ref}
      {...rest}
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
