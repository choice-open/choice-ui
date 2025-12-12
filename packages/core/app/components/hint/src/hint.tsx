import { InfoCircle } from "@choiceform/icons-react"
import { Children, isValidElement, ReactElement, ReactNode, useMemo } from "react"
import { HintContent, HintTrigger } from "./components"
import { HintContext } from "./context/hint-context"
import { useHint } from "./hooks"

type HintPlacement = "left-start" | "right-start" | "left-end" | "right-end"

// Re-export useHintState for backward compatibility if needed, or just let components import from context
export { useHintState } from "./context/hint-context"

export interface HintProps {
  children?: ReactNode
  delay?: number
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: HintPlacement
}

function HintRoot({
  children,
  delay = 0,
  disabled = false,
  onOpenChange,
  open,
  placement = "right-start",
}: HintProps) {
  const hint = useHint({
    delay,
    disabled,
    onOpenChange,
    open,
    placement,
  })

  // Detect Trigger and extract icon
  const childrenArray = Children.toArray(children)
  const triggerElement = childrenArray.find((child) => {
    if (!isValidElement(child)) return false
    const type = child.type as { displayName?: string }
    return type === HintTrigger || type.displayName === "HintTrigger"
  }) as ReactElement | undefined

  // Get icon from Trigger's children, default using InfoCircle
  const icon = triggerElement?.props?.children || <InfoCircle />

  const contextValue = useMemo(() => ({ ...hint, icon }), [hint, icon])

  return (
    <HintContext.Provider value={contextValue}>
      {!triggerElement && <HintTrigger />}
      {children}
    </HintContext.Provider>
  )
}

export const Hint = Object.assign(HintRoot, {
  Trigger: HintTrigger,
  Content: HintContent,
})
