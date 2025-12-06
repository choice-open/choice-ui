import { InfoCircle } from "@choiceform/icons-react"
import { createContext, ReactNode, useContext } from "react"
import { HintContent, HintTrigger } from "./components"

type HintPlacement = "left-start" | "right-start"

import { HintContext } from "./context/hint-context"
import { useHint } from "./hooks"

const PORTAL_ROOT_ID = "floating-tooltip-root"

// Re-export useHintState for backward compatibility if needed, or just let components import from context
export { useHintState } from "./context/hint-context"

export interface HintProps {
  children?: ReactNode
  className?: string
  content: ReactNode
  disabled?: boolean
  icon?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
  portalId?: string
  variant?: "default" | "dark"
}

export function Hint({
  children,
  content,
  disabled = false,
  onOpenChange,
  open,
  placement = "right-start",
  className,
  icon = <InfoCircle />,
  portalId = PORTAL_ROOT_ID,
  variant = "default",
}: HintProps) {
  const hint = useHint({
    disabled,
    onOpenChange,
    open,
    placement,
  })

  return (
    <HintContext.Provider value={hint}>
      <HintTrigger
        className={className}
        icon={icon}
      >
        {children}
      </HintTrigger>
      <HintContent
        icon={icon}
        portalId={portalId}
        variant={variant}
      >
        {content}
      </HintContent>
    </HintContext.Provider>
  )
}
