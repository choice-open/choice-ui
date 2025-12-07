import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { useCommand } from "../hooks"
import { commandItemTv } from "../tv"

export const CommandValue = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  const { className, children, ...rest } = props
  const context = useCommand()

  const tv = commandItemTv({ size: context.size })

  return (
    <div
      ref={ref}
      {...rest}
      className={tcx(tv.value({ className }))}
    >
      {children}
    </div>
  )
})

CommandValue.displayName = "CommandValue"
