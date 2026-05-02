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

function findTriggerElement(children: ReactNode): ReactElement | undefined {
  const childrenArray = Children.toArray(children)
  for (const child of childrenArray) {
    if (!isValidElement(child)) continue
    const type = child.type as { displayName?: string }
    if (type === HintTrigger || type.displayName === "HintTrigger") {
      return child as ReactElement
    }
    const found = findTriggerElement(child.props?.children)
    if (found) return found
  }
  return undefined
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

  const triggerElement = findTriggerElement(children)

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
