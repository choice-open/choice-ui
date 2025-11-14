import type { MouseEvent as ReactMouseEvent, ReactNode } from "react"

// 核心树节点数据结构
export interface TreeNodeData {
  [key: string]: string | number | boolean | TreeNodeData[] | undefined | TreeNodeState
  // 父节点ID，用于判断节点的父子关系
  children?: TreeNodeData[]
  id: string
  isFolder?: boolean
  name: string
  parentId?: string // 允许额外属性，但使用更明确的类型
}

// 树节点UI状态
export interface TreeNodeState {
  // 父级节点是否被选中，用于浅色高亮效果
  dropPosition?: DropPosition
  indexKey: string
  isDragging: boolean
  isDropTarget: boolean
  isExpanded: boolean
  isParentSelected?: boolean
  isSelected: boolean
  isVisible: boolean
  level: number
}

// 组合树节点数据和状态
export interface TreeNodeType extends TreeNodeData {
  state: TreeNodeState
}

// 主树列表组件的属性
export interface TreeListProps {
  allowDrag?: boolean

  allowDrop?: boolean
  allowMultiSelect?: boolean
  className?: string
  containerWidth?: number
  // 数据
  data: TreeNodeData[]

  keyboardNavigation?: boolean
  nodeHeight?: number
  onMouseDown?: () => void
  onNodeContextMenu?: (node: TreeNodeType, event: React.MouseEvent) => void
  onNodeCreate?: (
    parentNode: TreeNodeType | null,
    nodeType: "folder" | "component" | "layer",
  ) => void
  onNodeDrop?: (
    sourceNodes: TreeNodeType[],
    targetNode: TreeNodeType,
    position: DropPosition,
  ) => void

  onNodeExpand?: (node: TreeNodeType, expanded: boolean) => void
  onNodeHover?: (node: TreeNodeType, isHovered: boolean, event: React.MouseEvent) => void
  onNodeRename?: (node: TreeNodeType, newName: string) => void
  onNodeSelect?: (nodes: TreeNodeType[], event?: React.MouseEvent | React.KeyboardEvent) => void

  renderActions?: (node: TreeNodeType) => ReactNode
  renderIcon?: (node: TreeNodeType) => ReactNode
  renderNode?: (node: TreeNodeType) => ReactNode

  onNodeIconDoubleClick?: (node: TreeNodeType, event: ReactMouseEvent) => void
  selectedNodeIds: Set<string>
  style?: React.CSSProperties
  virtualScroll?: boolean
}

// 单个树节点组件的属性
export interface TreeNodeProps {
  className?: string
  containerWidth?: number
  // 表示此节点是否是连续选择中的中间项
  hasHorizontalScroll?: boolean
  // 表示是否处于多选状态（选中的节点数 > 1）
  isCommandKeyPressed?: boolean
  // 表示此节点是否是父文件夹中的最后一个子项
  isFirstSelected?: boolean
  isLastInParent?: boolean
  // 表示此节点是否是连续选择中的第一个
  isLastSelected?: boolean
  // 表示此节点是否是连续选择中的最后一个
  isMiddleSelected?: boolean
  // 表示此节点是否具有水平滚动条
  isMultiSelectionActive?: boolean
  node: TreeNodeType
  onContextMenu?: (node: TreeNodeType, event: React.MouseEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
  onDragOver?: (node: TreeNodeType, event: React.DragEvent) => void
  onDragStart?: (node: TreeNodeType, event: React.DragEvent) => void
  onDrop?: (node: TreeNodeType, event: React.DragEvent) => void
  onExpand?: (node: TreeNodeType) => void
  onHover?: (node: TreeNodeType, isHovered: boolean, event: React.MouseEvent) => void
  onMeasure?: (width: number) => void
  onRename?: (node: TreeNodeType, newName: string) => void
  onSelect?: (node: TreeNodeType, event: React.MouseEvent | React.KeyboardEvent) => void
  onIconDoubleClick?: (node: TreeNodeType, event: ReactMouseEvent) => void
  renderActions?: (node: TreeNodeType) => ReactNode
  renderIcon?: (node: TreeNodeType) => ReactNode
  size?: number
  start?: number
  style?: React.CSSProperties // 用于测量节点宽度
}

// 虚拟列表相关类型
export interface VirtualItem {
  end: number
  index: number
  node: TreeNodeType
  size: number
  start: number
}

// 拖拽相关类型
export interface DragState {
  dragNodes: TreeNodeType[]
  dropPosition: DropPosition | null
  dropTargetNode: TreeNodeType | null
  isDragging: boolean
}

export type DropPosition = "before" | "after" | "inside"

// 键盘导航相关类型
export interface KeyboardNavigationState {
  focusedNodeId: string | null
  lastSelectedNodeId: string | null
}

// 树列表上下文
export interface TreeListContext {
  dragState: DragState
  endRename: (node: TreeNodeType, newName: string) => void
  expandNode: (node: TreeNodeType, expanded?: boolean) => void
  expandedNodeIds: Set<string>
  // 状态
  flattenedNodes: TreeNodeType[]

  handleContextMenu: (node: TreeNodeType, event: React.MouseEvent) => void
  handleDrop: (targetNode: TreeNodeType, position: DropPosition) => void
  // 方法
  selectNode: (node: TreeNodeType, multiple?: boolean, range?: boolean) => void
  selectedNodes: TreeNodeType[]
  startDrag: (nodes: TreeNodeType[], event: React.DragEvent) => void
  startRename: (node: TreeNodeType) => void
}
