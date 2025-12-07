import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { useCommand } from "../hooks/use-command"
import { commandFooterTv } from "../tv"

export const CommandFooter = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const context = useCommand()

    const tv = commandFooterTv({ variant: context.variant })

    return (
      <div
        ref={ref}
        className={tcx(tv.root({ className }))}
        {...props}
      />
    )
  },
)

CommandFooter.displayName = "CommandFooter"
