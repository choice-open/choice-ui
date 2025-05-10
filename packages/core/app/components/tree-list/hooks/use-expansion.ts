import { useCallback, useState } from "react"
import { TreeNodeType } from "../types"

export interface UseExpansionProps {
  onNodeExpand?: (node: TreeNodeType, isExpanded: boolean) => void
}

export function useExpansion({ onNodeExpand }: UseExpansionProps) {
  // 展开状态
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set())

  // 处理节点展开/折叠
  const expandNode = useCallback(
    (node: TreeNodeType, forceExpanded?: boolean) => {
      const newExpanded = forceExpanded !== undefined ? forceExpanded : !node.state.isExpanded

      setExpandedNodeIds((prev) => {
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
    [onNodeExpand],
  )

  return {
    expandedNodeIds,
    setExpandedNodeIds,
    expandNode,
  }
}
