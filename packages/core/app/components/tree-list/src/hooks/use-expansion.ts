import { useCallback, useState } from "react"
import { TreeNodeType } from "../types"

export interface UseExpansionProps {
  expandedNodeIds?: Set<string>
  onNodeExpand?: (node: TreeNodeType, isExpanded: boolean) => void
}

export function useExpansion({
  expandedNodeIds: controlledExpandedNodeIds,
  onNodeExpand,
}: UseExpansionProps) {
  // 展开状态（受控或非受控）
  const [internalExpandedNodeIds, setInternalExpandedNodeIds] = useState<Set<string>>(new Set())

  // 使用受控的 expandedNodeIds 或内部状态
  const expandedNodeIds = controlledExpandedNodeIds ?? internalExpandedNodeIds
  const setExpandedNodeIds = controlledExpandedNodeIds ? undefined : setInternalExpandedNodeIds

  // 处理节点展开/折叠
  const expandNode = useCallback(
    (node: TreeNodeType, forceExpanded?: boolean) => {
      // 判断当前节点是否已展开（基于实际的 expandedNodeIds）
      const isCurrentlyExpanded = expandedNodeIds.has(node.id)
      const newExpanded = forceExpanded !== undefined ? forceExpanded : !isCurrentlyExpanded

      // 如果是受控模式，只调用回调，不更新内部状态
      if (controlledExpandedNodeIds) {
        onNodeExpand?.(node, newExpanded)
        return
      }

      // 非受控模式：更新内部状态
      setInternalExpandedNodeIds((prev) => {
        const newSet = new Set(prev)

        if (newExpanded) {
          newSet.add(node.id)
        } else {
          newSet.delete(node.id)
        }

        onNodeExpand?.(node, newExpanded)
        return newSet
      })
    },
    [onNodeExpand, controlledExpandedNodeIds, expandedNodeIds],
  )

  return {
    expandedNodeIds,
    setExpandedNodeIds,
    expandNode,
  }
}
