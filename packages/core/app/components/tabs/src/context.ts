import { createContext, useContext } from "react"

export interface TabsContextValue {
  disabled?: boolean
  id: string
  onChange: (value: string) => void
  readOnly?: boolean
  value: string
  variant: "default" | "light" | "dark" | "reset"
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs.Item must be used within a Tabs component")
  }
  return context
}
