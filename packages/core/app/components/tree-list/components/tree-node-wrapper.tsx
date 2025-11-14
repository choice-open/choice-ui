import React, { memo, useCallback, useMemo } from "react"
import { DropPosition, TreeNodeType } from "../types"
import { getSelectionPosition, isInvalidDropTarget, isLastInParent } from "../utils/node"
import { TreeNode } from "./tree-node"

interface TreeNodeWrapperProps {
  containerWidth: number
  dragNodes: TreeNodeType[]
  flattenedNodes: TreeNodeType[]
  hasHorizontalScroll: boolean
  isCommandKeyPressed: boolean
  isDragging: boolean
  listRef: React.RefObject<HTMLDivElement>
  node: TreeNodeType
  onContextMenu: (node: TreeNodeType, event: React.MouseEvent) => void
  onDragEnd: () => void
  onDragOver: (node: TreeNodeType, event: React.DragEvent) => void
  onDragStart: (nodes: TreeNodeType[], event: React.DragEvent) => void
  onDrop: (node: TreeNodeType, position: DropPosition) => void
  onExpand: (node: TreeNodeType, expanded: boolean) => void
  onHover?: (node: TreeNodeType, isHovered: boolean, event: React.MouseEvent) => void
  onIconDoubleClick?: (node: TreeNodeType, event: React.MouseEvent) => void
  onMeasure: (width: number) => void
  onRename: (node: TreeNodeType, newName: string) => void
  onSelect: (node: TreeNodeType, event?: React.MouseEvent | React.KeyboardEvent) => void
  renderActions?: (node: TreeNodeType) => React.ReactNode
  renderIcon?: (node: TreeNodeType) => React.ReactNode
  renderNode?: (node: TreeNodeType) => React.ReactNode
  selectedNodes: TreeNodeType[]
  visibleNodes: TreeNodeType[]
}

/**
 * TreeNodeWrapper - 包装每个树节点的组件，处理节点的渲染逻辑
 * 将复杂的计算逻辑从父组件中抽离出来
 */
const TreeNodeWrapperComponent = (props: TreeNodeWrapperProps) => {
  const {
    containerWidth,
    dragNodes,
    flattenedNodes,
    hasHorizontalScroll,
    isCommandKeyPressed,
    isDragging,
    listRef,
    node,
    onContextMenu,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDrop,
    onExpand,
    onHover,
    onMeasure,
    onRename,
    onSelect,
    onIconDoubleClick,
    renderNode,
    renderIcon,
    renderActions,
    selectedNodes,
    visibleNodes,
  } = props

  // 判断是否是父文件夹的最后一个子项
  const isLastChild = useMemo(() => isLastInParent(node, flattenedNodes), [node, flattenedNodes])

  // 计算节点在选择组中的位置状态
  const selectionPosition = useMemo(
    () => getSelectionPosition(node, visibleNodes, selectedNodes.length),
    [node, visibleNodes, selectedNodes.length],
  )

  // 判断是否处于多选模式（选中的节点数大于1）
  const isMultiSelectionActive = selectedNodes.length > 1

  // 检查目标节点是否是拖拽节点的子孙
  const isInvalidTarget = useMemo(
    () => isDragging && isInvalidDropTarget(node, dragNodes, flattenedNodes),
    [isDragging, node, dragNodes, flattenedNodes],
  )

  // 处理选择事件
  const handleSelect = useCallback(
    (selectedNode: TreeNodeType, event?: React.MouseEvent | React.KeyboardEvent) => {
      onSelect(selectedNode, event)
    },
    [onSelect],
  )

  // 处理拖拽开始事件
  const handleDragStart = useCallback(
    (_node: TreeNodeType, event: React.DragEvent) => {
      const nodesToDrag = selectedNodes.length > 0 && node.state.isSelected ? selectedNodes : [node]
      onDragStart(nodesToDrag, event)
    },
    [node, selectedNodes, onDragStart],
  )

  // 处理拖拽悬停事件
  const handleDragOver = useCallback(
    (node: TreeNodeType, event: React.DragEvent) => {
      // 如果目标节点是拖拽文件夹的子节点，完全阻止操作
      if (isInvalidTarget) {
        event.stopPropagation()
        event.preventDefault()
        return
      }
      onDragOver(node, event)
    },
    [isInvalidTarget, onDragOver],
  )

  // 处理放置事件
  const handleDrop = useCallback(
    (node: TreeNodeType, event: React.DragEvent) => {
      // 如果目标节点是拖拽文件夹的子节点，完全阻止操作
      if (isInvalidTarget) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      // 使用与handleDragOver相同的逻辑计算放置位置
      const targetElement = event.currentTarget as HTMLElement
      const rect = targetElement.getBoundingClientRect()
      const relY = event.clientY - rect.top
      const height = rect.height

      // 严格判断是否是文件夹（必须有子项）
      const isFolderWithChildren =
        Boolean(node.children && Array.isArray(node.children) && node.children.length > 0) ||
        Boolean(node.isFolder)

      // 判断文件夹是否已展开
      const isFolderExpanded = isFolderWithChildren && node.state.isExpanded

      // 默认放置位置
      let position: DropPosition = "after"

      // 放置位置逻辑
      if (isFolderExpanded) {
        // 对于已展开的文件夹：
        // - 上部区域允许before放置
        // - 中部和下部区域强制为inside
        if (relY < height * 0.25) {
          position = "before" // 在文件夹上方放置仍然允许
        } else {
          position = "inside" // 中部和下部区域强制为inside
          // 确保文件夹在放置时已展开
          if (!node.state.isExpanded) {
            onExpand(node, true)
          }
        }
      } else if (isFolderWithChildren) {
        // 未展开的文件夹根据鼠标位置决定放置位置
        if (relY < height * 0.25) {
          position = "before"
        } else if (relY > height * 0.75) {
          position = "after"
        } else {
          position = "inside"
          // 确保文件夹在放置时已展开
          if (!node.state.isExpanded) {
            onExpand(node, true)
          }
        }
      } else {
        // 普通项目只能放在前面或后面
        if (relY < height * 0.5) {
          position = "before"
        } else {
          position = "after"
        }
      }

      onDrop(node, position)
    },
    [isInvalidTarget, onExpand, onDrop],
  )

  const handleExpand = useCallback(
    (expandedNode: TreeNodeType) => {
      onExpand(expandedNode, !expandedNode.state.isExpanded)
    },
    [onExpand],
  )

  const handleHover = useCallback(
    (hoveredNode: TreeNodeType, isHovered: boolean, event: React.MouseEvent) => {
      onHover?.(hoveredNode, isHovered, event)
    },
    [onHover],
  )

  // 如果提供了自定义渲染函数，使用它
  if (renderNode) {
    return <>{renderNode(node)}</>
  }

  // 否则使用默认的 TreeNode 组件
  return (
    <TreeNode
      node={node}
      containerWidth={containerWidth}
      renderIcon={renderIcon}
      renderActions={renderActions}
      onIconDoubleClick={onIconDoubleClick}
      isLastInParent={isLastChild}
      isFirstSelected={selectionPosition.isFirstSelected}
      isMiddleSelected={selectionPosition.isMiddleSelected}
      isLastSelected={selectionPosition.isLastSelected}
      hasHorizontalScroll={hasHorizontalScroll}
      isMultiSelectionActive={isMultiSelectionActive}
      isCommandKeyPressed={isCommandKeyPressed}
      onSelect={handleSelect}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
      onDrop={handleDrop}
      onExpand={handleExpand}
      onRename={onRename}
      onContextMenu={onContextMenu}
      onMeasure={onMeasure}
      onHover={handleHover}
    />
  )
}

/**
 * 使用 memo 优化性能，只有当相关属性变化时才重新渲染
 */
export const TreeNodeWrapper = memo(TreeNodeWrapperComponent, (prevProps, nextProps) => {
  return (
    prevProps.node === nextProps.node &&
    prevProps.containerWidth === nextProps.containerWidth &&
    prevProps.isCommandKeyPressed === nextProps.isCommandKeyPressed &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.hasHorizontalScroll === nextProps.hasHorizontalScroll &&
    prevProps.selectedNodes.length === nextProps.selectedNodes.length &&
    prevProps.dragNodes === nextProps.dragNodes &&
    prevProps.renderNode === nextProps.renderNode &&
    prevProps.renderIcon === nextProps.renderIcon &&
    prevProps.renderActions === nextProps.renderActions &&
    prevProps.onHover === nextProps.onHover &&
    prevProps.onIconDoubleClick === nextProps.onIconDoubleClick
  )
})

TreeNodeWrapper.displayName = "TreeNodeWrapper"
