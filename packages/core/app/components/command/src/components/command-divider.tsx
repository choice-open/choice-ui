import { tcx } from "@choiceform/design-shared"
import { forwardRef, HTMLProps } from "react"
import { useCommand, useCommandState } from "../hooks"
import { commandTv } from "../tv"

export interface CommandDividerProps extends HTMLProps<HTMLDivElement> {
  /** 是否始终渲染此分隔符。当禁用自动过滤功能时特别有用。 */
  alwaysRender?: boolean
}

export const CommandDivider = forwardRef<HTMLDivElement, CommandDividerProps>(
  ({ className, alwaysRender, ...props }, forwardedRef) => {
    const context = useCommand()
    const render = useCommandState((state) => !state.search)
    const tv = commandTv({ variant: context.variant })

    if (!alwaysRender && !render) return null

    return (
      <div
        ref={forwardedRef}
        {...props}
        className={tcx(tv.divider({ className }))}
        role="separator"
      />
    )
  },
)

CommandDivider.displayName = "CommandDivider"
