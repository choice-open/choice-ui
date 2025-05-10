import { createContext, useContext } from "react"

interface PanelContextType {
  collapsible?: boolean
  isCollapsed?: boolean
  alwaysShowCollapsible?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  showLabels?: boolean
}

export const PanelContext = createContext<PanelContextType>({})

export const usePanelContext = () => {
  const context = useContext(PanelContext)
  if (!context) {
    throw new Error("usePanelContext must be used within a Panel")
  }
  return context
}
