import { useCallback } from "react"
import { TreeNodeType } from "../types"
import { getNodesInRange } from "../utils/tree"

export interface UseSelectionProps {
  allowMultiSelect: boolean
  flattenedNodes: TreeNodeType[]
  onNodeSelect?: (
    selectedNodes: TreeNodeType[],
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => void
  selectedNodeIds: Set<string>
}

export function useSelection({
  allowMultiSelect,
  flattenedNodes,
  selectedNodeIds,
  onNodeSelect,
}: UseSelectionProps) {
  const lastSelectedNodeId = selectedNodeIds.size > 0 ? Array.from(selectedNodeIds)[0] : null

  const selectNode = useCallback(
    (
      node: TreeNodeType,
      multiple = false,
      range = false,
      _event?: React.MouseEvent | React.KeyboardEvent,
    ) => {
      let newSelection = new Set(selectedNodeIds)

      const checkParentChildConstraint = (nodeId: string, selection: Set<string>) => {
        const currentNode = flattenedNodes.find((n) => n.id === nodeId)
        if (!currentNode) return false

        let parent = currentNode.parentId
        while (parent) {
          if (selection.has(parent)) {
            return false
          }
          const parentNode = flattenedNodes.find((n) => n.id === parent)
          parent = parentNode?.parentId
        }

        if (currentNode.children && currentNode.children.length > 0) {
          const hasSelectedChild = (childrenIds: string[]) => {
            for (const childId of childrenIds) {
              if (selection.has(childId)) return true

              const fullChild = flattenedNodes.find((n) => n.id === childId)
              if (
                fullChild?.children &&
                Array.isArray(fullChild.children) &&
                fullChild.children.length > 0
              ) {
                const subChildrenIds = fullChild.children.map((c) =>
                  typeof c === "string" ? c : c.id,
                )
                if (hasSelectedChild(subChildrenIds)) return true
              }
            }
            return false
          }

          const childrenIds = currentNode.children.map((child) =>
            typeof child === "string" ? child : child.id,
          )

          if (hasSelectedChild(childrenIds)) {
            return false
          }
        }

        return true // 没有约束冲突，允许选择
      }

      // 处理范围选择时的特殊逻辑
      const processRangeSelection = (rangeIds: string[]) => {
        // 在处理之前，先保存现有选择
        const initialSelection = new Set(newSelection)

        // 1. 标记范围中的所有文件夹节点
        const folderNodes = new Map<string, TreeNodeType>() // 使用Map存储节点ID到节点的映射
        rangeIds.forEach((id) => {
          const node = flattenedNodes.find((n) => n.id === id)
          if (node && ((node.children && node.children.length > 0) || node?.isFolder)) {
            folderNodes.set(id, node)
          }
        })

        // 2. 构建父子关系图
        // 存储每个节点的所有子孙节点
        const descendantsMap = new Map<string, Set<string>>()

        // 构建每个文件夹的所有子孙节点集合
        folderNodes.forEach((_, folderId) => {
          const descendants = new Set<string>()

          // 查找所有子孙节点
          const findDescendants = (nodeId: string) => {
            const node = flattenedNodes.find((n) => n.id === nodeId)
            if (!node || !node.children) return

            const childIds = node.children.map((child) =>
              typeof child === "string" ? child : child.id,
            )

            childIds.forEach((childId) => {
              descendants.add(childId)
              findDescendants(childId)
            })
          }

          findDescendants(folderId)
          descendantsMap.set(folderId, descendants)
        })

        // 3. 从现有选择中找出哪些节点是子文件夹
        // 记录哪些已选节点是其他节点的子项
        const nodesToRemove = new Set<string>()

        // 对于每个范围内的文件夹，检查其子孙是否被选中
        folderNodes.forEach((_, folderId) => {
          const descendants = descendantsMap.get(folderId) || new Set<string>()

          // 检查当前选择中是否有这个文件夹的子孙
          descendants.forEach((descId) => {
            if (newSelection.has(descId)) {
              // 标记所有已选中的子孙节点将被移除
              nodesToRemove.add(descId)
            }
          })
        })

        // 4. 处理最终选择
        // 首先添加所有非范围内节点（保留原有选择中不在范围内的）
        const finalSelection = new Set<string>()
        initialSelection.forEach((id) => {
          if (!rangeIds.includes(id) && !nodesToRemove.has(id)) {
            finalSelection.add(id)
          }
        })

        // 然后基于父子关系处理范围内的节点
        // 优先处理父文件夹
        const orderedRangeIds = [...rangeIds].sort((a, b) => {
          const nodeA = flattenedNodes.find((n) => n.id === a)
          const nodeB = flattenedNodes.find((n) => n.id === b)
          return (nodeA?.state.level || 0) - (nodeB?.state.level || 0) // 父优先
        })

        // 处理每个范围内的节点
        orderedRangeIds.forEach((id) => {
          // 如果这个节点被标记为移除（作为子项），跳过它
          if (nodesToRemove.has(id)) return

          // 检查添加这个节点是否会与目前选择冲突
          const node = flattenedNodes.find((n) => n.id === id)

          // 进行节点冲突检查
          if (node) {
            let canAdd = true

            // 检查父冲突
            let parent = node.parentId
            while (parent && canAdd) {
              if (finalSelection.has(parent)) {
                canAdd = false
              }
              const parentNode = flattenedNodes.find((n) => n.id === parent)
              parent = parentNode?.parentId
            }

            // 检查子冲突（如果是文件夹）
            if (canAdd && ((node.children && node.children.length > 0) || node.isFolder)) {
              const descendants = descendantsMap.get(id) || new Set<string>()
              descendants.forEach((descId) => {
                if (finalSelection.has(descId)) {
                  canAdd = false
                }
              })
            }

            // 如果通过所有检查，添加到最终选择
            if (canAdd) {
              finalSelection.add(id)
            }
          }
        })

        return finalSelection
      }

      if (!allowMultiSelect || (!multiple && !range)) {
        newSelection.clear()
        newSelection.add(node.id)
      } else if (range && lastSelectedNodeId) {
        // 范围选择
        const rangeIds = getNodesInRange(flattenedNodes, lastSelectedNodeId, node.id)

        // 使用专门为范围选择设计的处理函数
        newSelection = processRangeSelection(rangeIds)
      } else if (multiple) {
        // 多选模式
        if (newSelection.has(node.id)) {
          newSelection.delete(node.id)
        } else {
          // 检查添加此节点是否会导致父子冲突
          if (checkParentChildConstraint(node.id, newSelection)) {
            newSelection.add(node.id)
          }
        }
      } else {
        // 默认选择行为
        newSelection.clear()
        newSelection.add(node.id)
      }

      const newSelectionNodes = flattenedNodes.filter((node) => newSelection.has(node.id))
      onNodeSelect?.(newSelectionNodes)
    },
    [allowMultiSelect, flattenedNodes, lastSelectedNodeId, onNodeSelect, selectedNodeIds],
  )

  return {
    selectedNodeIds,
    selectNode,
  }
}
