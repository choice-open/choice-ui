import type { DropdownProps } from "@choice-ui/dropdown"
import { createContext, useContext } from "react"

export interface MenubarItemInfo {
  id: string
  disabled: boolean
  triggerRef: React.RefObject<HTMLElement | null>
}

/** Props inherited from Dropdown that can be set at Menubar level */
export type MenubarDropdownProps = Pick<
  DropdownProps,
  "variant" | "offset" | "openSubmenuOnArrowNavigation" | "portalId" | "root"
>

export interface MenubarContextType {
  /** Currently active menu ID */
  activeMenuId: string | null
  /** Whether any menu is open */
  hasAnyMenuOpen: boolean
  /** Open specified menu */
  openMenu: (id: string) => void
  /** Close all menus */
  closeAllMenus: () => void
  /** Whether to loop focus */
  loopFocus: boolean
  /** Register menu item */
  registerItem: (info: MenubarItemInfo) => void
  /** Unregister menu item */
  unregisterItem: (id: string) => void
  /** Navigate to next menu item */
  navigateNext: () => void
  /** Navigate to previous menu item */
  navigatePrev: () => void
  /** Whether Menubar is disabled */
  rootDisabled: boolean
  /** Dropdown props inherited from Menubar */
  dropdownProps: MenubarDropdownProps
}

export const MenubarContext = createContext<MenubarContextType | null>(null)

export function useMenubarContext() {
  const context = useContext(MenubarContext)
  if (!context) {
    throw new Error("Menubar.Item must be used within a Menubar")
  }
  return context
}
