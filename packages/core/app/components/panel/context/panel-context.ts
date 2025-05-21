import { createContext, useContext } from "react"

interface PanelContextType {
  alwaysShowCollapsible?: boolean
  collapsible?: boolean
  isCollapsed?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  showLabels?: boolean
}

const defaultPanelContext: PanelContextType = {
  collapsible: false,
  isCollapsed: false,
  alwaysShowCollapsible: false,
  onCollapsedChange: () => {},
  showLabels: true,
}

export const PanelContext = createContext<PanelContextType>(defaultPanelContext)

export const usePanelContext = (): PanelContextType => {
  const context = useContext(PanelContext)
  return context
}
