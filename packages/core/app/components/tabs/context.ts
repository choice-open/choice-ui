import { createContext, useContext } from "react"

export interface TabsContextValue {
  id: string
  onChange: (value: string) => void
  value: string
  variant: "default" | "dark"
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs.Item must be used within a Tabs component")
  }
  return context
}
