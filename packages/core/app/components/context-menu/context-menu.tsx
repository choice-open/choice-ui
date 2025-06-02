import * as CM from "@radix-ui/react-context-menu"
import { ReactNode } from "react"
import { MenuValue } from "../menus"
import {
  ContextMenuContent,
  ContextMenuDivider,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
  ContextSubmenu,
} from "./components"
import { ContextMenuContext } from "./context-menu-context"
import { processMenuChildren } from "./utils"

export interface ContextMenuProps extends CM.ContextMenuProps {
  children: ReactNode
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  selection?: boolean
}

// Main ContextMenu component
const ContextMenuComponent = ({
  children,
  open,
  onOpenChange,
  modal = false,
  selection = false,
}: ContextMenuProps) => {
  const contextValue = {
    open,
    onOpenChange,
    selection,
  }

  // 使用公共函数处理子元素
  const { triggerElement, contentElement } = processMenuChildren(
    children,
    ContextMenuTrigger,
    ContextMenuContent,
  )

  if (!triggerElement || !contentElement) {
    console.warn(
      "ContextMenu requires both Trigger and Content elements. Please use ContextMenu.Trigger and ContextMenu.Content.",
    )
  }

  return (
    <ContextMenuContext.Provider value={contextValue}>
      <CM.Root
        modal={modal}
        dir="ltr"
        onOpenChange={onOpenChange}
      >
        {triggerElement}
        {contentElement}
      </CM.Root>
    </ContextMenuContext.Provider>
  )
}

// Assemble the compound component
export const ContextMenu = Object.assign(ContextMenuComponent, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Divider: ContextMenuDivider,
  Submenu: ContextSubmenu,
  Label: ContextMenuLabel,
  Value: MenuValue,
})
