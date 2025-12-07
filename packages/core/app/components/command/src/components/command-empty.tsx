import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { useCommand, useCommandState } from "../hooks"
import { commandEmptyTv } from "../tv"

export interface CommandEmptyProps extends HTMLProps<HTMLDivElement> {
  className?: string
}

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, forwardedRef) => {
    const context = useCommand()
    const render = useCommandState((state) => state.filtered.count === 0)

    const tv = commandEmptyTv({ variant: context.variant })

    if (!render) return null

    return (
      <div
        ref={forwardedRef}
        {...props}
        className={tcx(tv.root({ className }))}
        role="presentation"
      />
    )
  },
)

CommandEmpty.displayName = "CommandEmpty"
