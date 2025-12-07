import { TreeNodeType } from "../types"

/**
 * 判断节点是否是父文件夹的最后一个子项
 */
export function isLastInParent(node: TreeNodeType, flattenedNodes: TreeNodeType[]): boolean {
  if (!node.parentId) return false

  // 查找同级节点
  const siblings = flattenedNodes.filter(
    (n) => n.parentId === node.parentId && n.state.level === node.state.level,
  )

  // 如果是同级节点中索引最大的，则为最后一个
  return siblings.length > 0 && siblings[siblings.length - 1].id === node.id
}

/**
 * 计算节点在选择组中的位置状态
 */
export interface SelectionPosition {
  isFirstSelected: boolean
  isLastSelected: boolean
  isMiddleSelected: boolean
}

/**
 * 获取节点在选择组中的位置状态
 */
export function getSelectionPosition(
  node: TreeNodeType,
  visibleNodes: TreeNodeType[],
  selectedNodesCount: number,
): SelectionPosition {
  // 如果没有选择，或者当前节点没有选择，不需要计算
  if (selectedNodesCount <= 1 || !node.state.isSelected) {
    return {
      isFirstSelected: false,
      isMiddleSelected: false,
      isLastSelected: false,
    }
  }

  // 获取所有可见的已选择节点的索引，并按索引排序
  const selectedIndices = visibleNodes
    .map((n, index) => (n.state.isSelected ? index : -1))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)

  // 当前节点在visibleNodes中的索引
  const currentNodeIndex = visibleNodes.findIndex((n) => n.id === node.id)

  // 查找当前节点在selectedIndices中的位置
  const positionInSelection = selectedIndices.indexOf(currentNodeIndex)

  // 检查当前选择是否是连续的组
  // 寻找当前节点所在的连续组
  let startOfGroup = positionInSelection
  let endOfGroup = positionInSelection

  // 向前查找连续索引
  while (
    startOfGroup > 0 &&
    selectedIndices[startOfGroup - 1] === selectedIndices[startOfGroup] - 1
  ) {
    startOfGroup--
  }

  // 向后查找连续索引
  while (
    endOfGroup < selectedIndices.length - 1 &&
    selectedIndices[endOfGroup + 1] === selectedIndices[endOfGroup] + 1
  ) {
    endOfGroup++
  }

  // 如果连续组的长度大于1，并且当前节点在这个组内
  const inConsecutiveGroup = endOfGroup - startOfGroup >= 1

  // 判断节点在连续组中的位置
  const isFirstInGroup = inConsecutiveGroup && positionInSelection === startOfGroup
  const isLastInGroup = inConsecutiveGroup && positionInSelection === endOfGroup

  return {
    isFirstSelected: isFirstInGroup,
    isMiddleSelected: inConsecutiveGroup && !isFirstInGroup && !isLastInGroup,
    isLastSelected: isLastInGroup,
  }
}

/**
 * 检查目标节点是否是拖拽节点的子孙
 */
export function isInvalidDropTarget(
  targetNode: TreeNodeType,
  dragNodes: TreeNodeType[],
  flattenedNodes: TreeNodeType[],
): boolean {
  return dragNodes.some((dragNode) => {
    const dragNodeIsFolder =
      Boolean(dragNode.children && dragNode.children.length > 0) || Boolean(dragNode.isFolder)

    if (dragNodeIsFolder) {
      // 检查是否存在祖先-后代关系
      let current: TreeNodeType | undefined = targetNode

      // 如果节点本身是拖拽节点，不是无效目标
      if (current.id === dragNode.id) return false

      // 检查父节点链
      while (current && current.parentId) {
        if (current.parentId === dragNode.id) {
          return true // 找到了祖先关系，是无效目标
        }
        // 获取父节点
        current = flattenedNodes.find((n) => n.id === current?.parentId)
        if (!current) break
      }
    }
    return false
  })
}
