import { useEffect } from "react"
import {
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useListItem,
} from "@floating-ui/react"
import { useEventCallback } from "usehooks-ts"

/**
 * 菜单 FloatingTree 集成 Hook
 *
 * 专用于 Dropdown 组件的 FloatingTree 支持：
 * - 管理 nodeId 和 parentId
 * - 处理树形结构的事件通信
 * - 支持嵌套菜单的打开/关闭协调
 * - 处理父子菜单的焦点管理
 */

export interface MenuTreeConfig {
  /** 是否禁用嵌套功能 */
  disabledNested?: boolean
  /** 打开状态变化处理函数 */
  handleOpenChange: (open: boolean) => void
  /** 当前打开状态 */
  isControlledOpen: boolean
}

export interface MenuTreeResult {
  /** 清理 tree 事件监听 */
  cleanupTreeEvents: () => void
  /** 是否为嵌套模式 */
  isNested: boolean
  /** 列表项实例 */
  item: ReturnType<typeof useListItem>
  /** 当前节点 ID */
  nodeId: string | undefined
  /** 父节点 ID */
  parentId: string | null
  /** FloatingTree 实例 */
  tree: ReturnType<typeof useFloatingTree>
}

export function useMenuTree(config: MenuTreeConfig): MenuTreeResult {
  const { disabledNested = false, handleOpenChange, isControlledOpen } = config

  // FloatingTree 相关 hooks
  const tree = useFloatingTree()
  const nodeId = useFloatingNodeId()
  const parentId = useFloatingParentNodeId()
  const item = useListItem()

  // 确定是否为嵌套模式
  const isNested = !disabledNested && parentId != null

  // 处理 tree 点击事件
  const handleTreeClick = useEventCallback(() => {
    handleOpenChange(false)
  })

  // 处理子菜单打开事件
  const handleSubMenuOpen = useEventCallback((event: { nodeId: string; parentId: string }) => {
    // 如果不是当前节点且有相同父节点，则关闭自己
    if (event.nodeId !== nodeId && event.parentId === parentId) {
      handleOpenChange(false)
    }
  })

  // 清理事件监听
  const cleanupTreeEvents = useEventCallback(() => {
    if (tree) {
      tree.events.off("click", handleTreeClick)
      tree.events.off("menuopen", handleSubMenuOpen)
    }
  })

  // 监听 tree 事件
  useEffect(() => {
    if (!tree) return

    tree.events.on("click", handleTreeClick)
    tree.events.on("menuopen", handleSubMenuOpen)

    return cleanupTreeEvents
  }, [tree, nodeId, parentId, handleTreeClick, handleSubMenuOpen, cleanupTreeEvents])

  // 当菜单打开时，发送 menuopen 事件
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
