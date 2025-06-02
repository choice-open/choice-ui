import { createContext, useContext } from "react"

interface ContextMenuContextValue {
  onOpenChange?: (open: boolean) => void
  open?: boolean
  selection?: boolean
}

export const ContextMenuContext = createContext<ContextMenuContextValue>({})

export const useContextMenu = () => useContext(ContextMenuContext)
