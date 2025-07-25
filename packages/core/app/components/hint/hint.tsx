import { InfoCircle } from "@choiceform/icons-react"
import { createContext, ReactNode, useContext } from "react"
import { HintContent, HintTrigger } from "./components"
import { useHint } from "./hooks"

type HintPlacement = "left-start" | "right-start"

const HintContext = createContext<ReturnType<typeof useHint> | null>(null)

const PORTAL_ROOT_ID = "floating-tooltip-root"

export function useHintState() {
  const context = useContext(HintContext)
  if (context == null) {
    throw new Error("Hint components must be wrapped in <Hint />")
  }
  return context
}

interface HintProps {
  children?: ReactNode
  className?: string
  content: ReactNode
  disabled?: boolean
  icon?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
  portalId?: string
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
      >
        {content}
      </HintContent>
    </HintContext.Provider>
  )
}
