import { DropPosition, TreeNodeType, TreeNodeData } from "../types"

/**
 * 将扁平化的数据转换为树形结构
 */
export function buildTree(data: TreeNodeData[], parentId: string | null = null): TreeNodeData[] {
  return data
    .filter((item) => (parentId === null && !item.parentId) || item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(data, item.id),
    }))
}

/**
 * 将树形结构扁平化为数组，用于虚拟列表
 */
export function flattenTree(
  nodes: TreeNodeData[],
  level = 0,
  parent: TreeNodeData | null = null,
  result: TreeNodeType[] = [],
  expandedIds: Set<string> = new Set(),
  selectedIds: Set<string> = new Set(),
  hasSelectedAncestor = false, // 是否有选中的祖先节点
): TreeNodeType[] {
  nodes.forEach((node, _index) => {
    const isExpanded = expandedIds.has(node.id)
    const isSelected = selectedIds.has(node.id)

    // 判断是否有被选中的祖先节点
    // 如果当前节点的父节点或者任何更上层的祖先节点被选中，则hasSelectedAncestor为true
    const isParentSelected = hasSelectedAncestor || (parent ? selectedIds.has(parent.id) : false)

    // 确保设置parentId
    if (parent) {
      node.parentId = parent.id
    }

    // 创建带有状态的节点
    const treeNode: TreeNodeType = {
      ...node,
      parentId: parent?.id, // 显式设置parentId
      state: {
        isExpanded,
        isSelected,
        isVisible: !parent || (parent && expandedIds.has(parent.id)),
        isDragging: false,
        isDropTarget: false,
        isParentSelected,
        level,
        indexKey: node.indexKey as string,
      },
    }

    result.push(treeNode)

    // 如果节点展开且有子节点，则递归处理子节点
    if (isExpanded && node.children && node.children.length > 0) {
      // 如果当前节点被选中或者有选中的祖先节点，则其所有子节点的hasSelectedAncestor为true
      // 这确保了嵌套的子项也会知道其父文件夹被选中
      const nextHasSelectedAncestor = isSelected || hasSelectedAncestor
      flattenTree(
        node.children,
        level + 1,
        node,
        result,
        expandedIds,
        selectedIds,
        nextHasSelectedAncestor,
      )
    }
  })

  return result
}

/**
 * 获取节点的所有可见子节点
 */
export function getVisibleChildren(
  node: TreeNodeType,
  flattenedNodes: TreeNodeType[],
): TreeNodeType[] {
  if (!node.state.isExpanded || !node.children || node.children.length === 0) {
    return []
  }

  const startIndex = flattenedNodes.findIndex((n) => n.id === node.id) + 1
  const result: TreeNodeType[] = []

  for (let i = startIndex; i < flattenedNodes.length; i++) {
    const currentNode = flattenedNodes[i]

    if (currentNode.state.level <= node.state.level) {
      break
    }

    if (currentNode.state.level === node.state.level + 1) {
      result.push(currentNode)
    }
  }

  return result
}

/**
 * 获取所有可见节点
 */
export function getVisibleNodes(flattenedNodes: TreeNodeType[]): TreeNodeType[] {
  return flattenedNodes.filter((node) => node.state.isVisible)
}

/**
 * 深度遍历查找节点
 */
export function findNodeById(nodes: TreeNodeData[], id: string): TreeNodeData | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id)
      if (found) {
        return found
      }
    }
  }

  return undefined
}

/**
 * 获取当前节点的所有祖先节点ID
 */
export function getAncestorIds(flattenedNodes: TreeNodeType[], nodeId: string): string[] {
  const node = flattenedNodes.find((n) => n.id === nodeId)
  if (!node) return []

  const ancestors: string[] = []
  const level = node.state.level

  if (level === 0) return []

  // 从当前节点往上找，直到找到level小于当前节点的节点
  let index = flattenedNodes.findIndex((n) => n.id === nodeId) - 1

  while (index >= 0) {
    const current = flattenedNodes[index]
    if (current.state.level < level) {
      ancestors.push(current.id)
      if (current.state.level === 0) break
    }
    index--
  }

  return ancestors.reverse()
}

/**
 * 获取节点的完整路径名称数组（从根到当前节点）
 */
export function getNodePathNames(flattenedNodes: TreeNodeType[], nodeId: string): string[] {
  const nodeIndex = flattenedNodes.findIndex((n) => n.id === nodeId)
  if (nodeIndex === -1) return []

  const node = flattenedNodes[nodeIndex]
  const pathNames: string[] = [node.name]
  let currentLevel = node.state.level

  // 从当前节点向上遍历，收集所有祖先节点
  for (let i = nodeIndex - 1; i >= 0; i--) {
    const ancestor = flattenedNodes[i]
    // 只有当祖先节点的 level 小于当前 level 时，才是直接父节点
    if (ancestor.state.level < currentLevel) {
      pathNames.unshift(ancestor.name)
      currentLevel = ancestor.state.level
      // 如果到达根节点（level 0），停止查找
      if (currentLevel === 0) break
    }
  }

  return pathNames
}

/**
 * 获取当前节点的所有子孙节点
 */
export function getDescendantIds(flattenedNodes: TreeNodeType[], nodeId: string): string[] {
  const startIndex = flattenedNodes.findIndex((node) => node.id === nodeId)
  if (startIndex === -1) return []

  const node = flattenedNodes[startIndex]
  const result: string[] = []

  for (let i = startIndex + 1; i < flattenedNodes.length; i++) {
    const current = flattenedNodes[i]
    if (current.state.level <= node.state.level) break
    result.push(current.id)
  }

  return result
}

/**
 * 查找指定节点的完整路径（返回节点ID数组）
 */
export function findNodePathById(
  nodes: TreeNodeData[],
  targetId: string,
  path: string[] = [],
): string[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node.id]
    if (node.id === targetId) {
      return currentPath
    }

    if (node.children && node.children.length > 0) {
      const result = findNodePathById(node.children, targetId, currentPath)
      if (result) {
        return result
      }
    }
  }

  return null
}

/**
 * 修改节点显示名称
 */
export function renameNode(nodes: TreeNodeData[], nodeId: string, newName: string): TreeNodeData[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        name: newName,
      }
    }

    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: renameNode(node.children, nodeId, newName),
      }
    }

    return node
  })
}

/**
 * 处理多选逻辑 (Shift + Click)
 */
export function getNodesInRange(
  flattenedNodes: TreeNodeType[],
  startId: string,
  endId: string,
): string[] {
  const visibleNodes = flattenedNodes.filter((node) => node.state.isVisible)

  const startIndex = visibleNodes.findIndex((node) => node.id === startId)
  const endIndex = visibleNodes.findIndex((node) => node.id === endId)

  if (startIndex === -1 || endIndex === -1) return []

  const start = Math.min(startIndex, endIndex)
  const end = Math.max(startIndex, endIndex)

  return visibleNodes.slice(start, end + 1).map((node) => node.id)
}

/**
 * 计算拖放位置
 */
export function calculateDropPosition(event: React.DragEvent, element: HTMLElement): DropPosition {
  const rect = element.getBoundingClientRect()
  const y = event.clientY - rect.top
  const height = rect.height

  // 上 1/4 是 "before"
  if (y < height * 0.25) {
    return "before"
  }

  // 下 1/4 是 "after"
  if (y > height * 0.75) {
    return "after"
  }

  // 中间是 "inside"
  return "inside"
}

/**
 * 处理键盘导航
 */
export function getNextNodeId(
  currentNodeId: string,
  flattenedNodes: TreeNodeType[],
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
): string | null {
  const currentIndex = flattenedNodes.findIndex((node) => node.id === currentNodeId)
  if (currentIndex === -1) return null

  const currentNode = flattenedNodes[currentIndex]

  switch (key) {
    case "ArrowUp": {
      // 寻找上一个可见节点
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (flattenedNodes[i].state.isVisible) {
          return flattenedNodes[i].id
        }
      }
      return null
    }

    case "ArrowDown": {
      // 寻找下一个可见节点
      for (let i = currentIndex + 1; i < flattenedNodes.length; i++) {
        if (flattenedNodes[i].state.isVisible) {
          return flattenedNodes[i].id
        }
      }
      return null
    }

    case "ArrowLeft": {
      // 如果节点已展开，则折叠
      if (currentNode.state.isExpanded && currentNode.children && currentNode.children.length > 0) {
        return currentNodeId // 仍然选中当前节点，但状态会更新
      }

      // 如果节点已折叠或没有子节点，则选择父节点
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (flattenedNodes[i].state.level < currentNode.state.level) {
          return flattenedNodes[i].id
        }
      }
      return null
    }

    case "ArrowRight": {
      // 如果节点有子节点但未展开，则展开
      if (
        !currentNode.state.isExpanded &&
        currentNode.children &&
        currentNode.children.length > 0
      ) {
        return currentNodeId // 仍然选中当前节点，但状态会更新
      }

      // 如果节点已展开且有子节点，则选择第一个子节点
      if (currentNode.state.isExpanded && currentNode.children && currentNode.children.length > 0) {
        return flattenedNodes[currentIndex + 1]?.id || null
      }

      return null
    }

    default:
      return null
  }
}
