import { useCallback, useState } from "react"
import { TreeNodeType } from "../types"
import { getNodesInRange } from "../utilities/tree-utils"

export interface UseSelectionProps {
  selectedNodeIds: Set<string>
  flattenedNodes: TreeNodeType[]
  selectionMode: "single" | "multiple"
  onNodeSelect?: (
    selectedNodes: TreeNodeType[],
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => void
}

export function useSelection({
  flattenedNodes,
  selectedNodeIds,
  selectionMode,
  onNodeSelect,
}: UseSelectionProps) {
  // 选择状态

  const [keyboardState, setKeyboardState] = useState({
    focusedNodeId: null as string | null,
    lastSelectedNodeId: null as string | null,
  })

  // 辅助函数：选择所有可见项目
  const selectAllVisibleItems = useCallback(() => {
    const allVisibleItems = new Set<string>()

    // 递归函数，收集所有可见的子项（但跳过已展开的文件夹）
    const collectVisibleItems = (node: TreeNodeType) => {
      // 跳过根节点
      if (node.state.level === 0) return

      const isFolder = node.children && node.children.length > 0
      const isExpanded = node.state.isExpanded

      // 如果是文件夹且已展开，不选择文件夹本身，但要处理其子项
      if (isFolder && isExpanded) {
        // 不添加已展开的文件夹，但要递归处理其子项
        if (node.children) {
          node.children.forEach((child) => {
            // 查找子项在扁平化列表中的完整节点引用
            const childNode = flattenedNodes.find((n) => n.id === child.id)
            if (childNode && childNode.state.isVisible) {
              collectVisibleItems(childNode)
            }
          })
        }
      } else if (node.state.isVisible) {
        // 如果是普通项目或未展开的文件夹，直接添加
        allVisibleItems.add(node.id)
      }
    }

    // 遍历所有一级节点开始收集
    flattenedNodes.forEach((node) => {
      if (node.state.level === 1 && node.state.isVisible) {
        collectVisibleItems(node)
      }
    })

    // 更新选择状态
    if (allVisibleItems.size > 0) {
      const newSelectionNodes = flattenedNodes.filter((node) => allVisibleItems.has(node.id))
      onNodeSelect?.(newSelectionNodes)
    }
  }, [flattenedNodes, onNodeSelect])

  // 处理节点选择
  const selectNode = useCallback(
    (
      node: TreeNodeType,
      multiple = false,
      range = false,
      _event?: React.MouseEvent | React.KeyboardEvent,
    ) => {
      const newSelection = new Set(selectedNodeIds)

      // 检查是否有父子冲突的约束条件
      const checkParentChildConstraint = (nodeId: string, selection: Set<string>) => {
        // 查找当前节点
        const currentNode = flattenedNodes.find((n) => n.id === nodeId)
        if (!currentNode) return false

        // 1. 检查父级是否已选中 - 如果选中了当前节点的任何父级，则不允许选择
        let parent = currentNode.parentId
        while (parent) {
          if (selection.has(parent)) {
            return false // 父节点已选中，不允许再选择子节点
          }
          // 向上寻找更高级的父节点
          const parentNode = flattenedNodes.find((n) => n.id === parent)
          parent = parentNode?.parentId
        }

        // 2. 检查子级 - 如果当前节点有子项且子项已经选中，则不允许选择当前节点
        if (currentNode.children && currentNode.children.length > 0) {
          // 递归检查所有子项
          const hasSelectedChild = (childrenIds: string[]) => {
            for (const childId of childrenIds) {
              if (selection.has(childId)) return true

              // 递归检查更深层的子项
              const fullChild = flattenedNodes.find((n) => n.id === childId)
              if (
                fullChild?.children &&
                Array.isArray(fullChild.children) &&
                fullChild.children.length > 0
              ) {
                // 创建子ID数组
                const subChildrenIds = fullChild.children.map((c) =>
                  typeof c === "string" ? c : c.id,
                )
                if (hasSelectedChild(subChildrenIds)) return true
              }
            }
            return false
          }

          // 获取子节点ID
          const childrenIds = currentNode.children.map((child) =>
            typeof child === "string" ? child : child.id,
          )

          if (hasSelectedChild(childrenIds)) {
            return false // 子节点已选中，不允许再选择父节点
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
          if (node && node.children && node.children.length > 0) {
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
            if (canAdd && node.children && node.children.length > 0) {
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

      if (selectionMode === "single" || (!multiple && !range)) {
        // 单选模式
        newSelection.clear()
        newSelection.add(node.id)
      } else if (range && keyboardState.lastSelectedNodeId) {
        // 范围选择 (Shift+Click)
        const rangeIds = getNodesInRange(flattenedNodes, keyboardState.lastSelectedNodeId, node.id)

        // 使用专门为范围选择设计的处理函数
        return processRangeSelection(rangeIds)
      } else if (multiple) {
        // 多选模式 (Ctrl/Cmd+Click)
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

      setKeyboardState((prev) => ({
        ...prev,
        focusedNodeId: node.id,
        lastSelectedNodeId: node.id,
      }))

      const newSelectionNodes = flattenedNodes.filter((node) => newSelection.has(node.id))
      onNodeSelect?.(newSelectionNodes)
    },
    [
      flattenedNodes,
      keyboardState.lastSelectedNodeId,
      onNodeSelect,
      selectedNodeIds,
      selectionMode,
    ],
  )

  return {
    selectedNodeIds,
    keyboardState,
    setKeyboardState,
    selectNode,
    selectAllVisibleItems,
  }
}
