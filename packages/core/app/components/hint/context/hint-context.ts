import { Placement, UseFloatingReturn } from "@floating-ui/react"
import { createContext, useContext } from "react"

// 拆分 Context 定义以解决循环依赖
export interface HintContextValue {
  context: UseFloatingReturn["context"]
  disabled?: boolean
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined,
  ) => Record<string, unknown>
  open: boolean
  placement: Placement
  refs: UseFloatingReturn["refs"]
}

export const HintContext = createContext<HintContextValue | undefined>(undefined)

export function useHintState() {
  const context = useContext(HintContext)

  if (!context) {
    throw new Error("useHintState must be used within a Hint component")
  }

  return context
}
