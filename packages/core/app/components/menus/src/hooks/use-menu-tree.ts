import { useEffect } from "react"
import {
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useListItem,
} from "@floating-ui/react"
import { useEventCallback } from "usehooks-ts"

/**
 * Menu FloatingTree integration Hook
 *
 * Specialized for FloatingTree support for Dropdown component:
 * - Manage nodeId and parentId
 * - Handle event communication for tree structure
 * - Support opening/closing coordination for nested menus
 * - Handle focus management for parent and child menus
 */

export interface MenuTreeConfig {
  /** Whether to disable nested functionality */
  disabledNested?: boolean
  /** Open state change handling function */
  handleOpenChange: (open: boolean) => void
  /** Current open state */
  isControlledOpen: boolean
}

export interface MenuTreeResult {
  /** Clean up tree event listening */
  cleanupTreeEvents: () => void
  /** Whether to be nested mode */
  isNested: boolean
  /** List item instance */
  item: ReturnType<typeof useListItem>
  /** Current node ID */
  nodeId: string | undefined
  /** Parent node ID */
  parentId: string | null
  /** FloatingTree instance */
  tree: ReturnType<typeof useFloatingTree>
}

export function useMenuTree(config: MenuTreeConfig): MenuTreeResult {
  const { disabledNested = false, handleOpenChange, isControlledOpen } = config

  // FloatingTree related hooks
  const tree = useFloatingTree()
  const nodeId = useFloatingNodeId()
  const parentId = useFloatingParentNodeId()
  const item = useListItem()

  // Determine whether to be nested mode
  const isNested = !disabledNested && parentId != null

  // Handle tree click event
  const handleTreeClick = useEventCallback(() => {
    handleOpenChange(false)
  })

  // Handle submenu open event
  const handleSubMenuOpen = useEventCallback((event: { nodeId: string; parentId: string }) => {
    // If it is not the current node and has the same parent node, close yourself
    if (event.nodeId !== nodeId && event.parentId === parentId) {
      handleOpenChange(false)
    }
  })

  // Clean up event listening
  const cleanupTreeEvents = useEventCallback(() => {
    if (tree) {
      tree.events.off("click", handleTreeClick)
      tree.events.off("menuopen", handleSubMenuOpen)
    }
  })

  // Listen to tree events
  useEffect(() => {
    if (!tree) return

    tree.events.on("click", handleTreeClick)
    tree.events.on("menuopen", handleSubMenuOpen)

    return cleanupTreeEvents
  }, [tree, nodeId, parentId, handleTreeClick, handleSubMenuOpen, cleanupTreeEvents])

  // When the menu is opened, send the menuopen event
  useEffect(() => {
    if (isControlledOpen && tree) {
      tree.events.emit("menuopen", { parentId, nodeId })
    }
  }, [tree, isControlledOpen, nodeId, parentId])

  return {
    tree,
    nodeId,
    parentId,
    item,
    isNested,
    cleanupTreeEvents,
  }
}
