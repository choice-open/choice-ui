import * as CM from "@radix-ui/react-context-menu"
import { ReactNode, forwardRef } from "react"

export interface ContextMenuTriggerProps {
  asChild?: boolean
  children: ReactNode
  disabled?: boolean
}

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ children, disabled, asChild = false }, ref) => {
    return (
      <CM.Trigger
        ref={ref}
        disabled={disabled}
        asChild={asChild}
      >
        {children}
      </CM.Trigger>
    )
  },
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"
