import { Tabs, type TabsProps } from "@choiceform/tabs"
import { forwardRef } from "react"
import { useCommand } from "../hooks/use-command"
import { commandTabsTv } from "../tv"

export const CommandTabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const context = useCommand()
  const tv = commandTabsTv()

  return (
    <Tabs
      ref={ref}
      variant={props.variant || context.variant}
      className={tv.tabs()}
      {...props}
    />
  )
})

CommandTabs.displayName = "CommandTabs"
