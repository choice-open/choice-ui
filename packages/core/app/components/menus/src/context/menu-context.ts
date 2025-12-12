import { createContext, useContext } from "react"

/**
 * Generic menu context interface
 *
 * Used for unified context of Select and Dropdown components
 */
export interface MenuContextType {
  activeIndex: number | null
  close: () => void
  getItemProps: <T extends React.HTMLProps<HTMLElement>>(userProps?: T) => Record<string, unknown>
  isOpen: boolean
  readOnly?: boolean
  selection: boolean
  setActiveIndex: (index: number | null) => void
  setHasFocusInside: (value: boolean) => void
  variant?: "default" | "light" | "reset"
}

export const MenuContext = createContext<MenuContextType | null>(null)

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenu must be used within a Menu component (Select or Dropdown)")
  }
  return context
}
