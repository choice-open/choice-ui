import { ReactNode } from "react"

// 核心树节点数据结构
export interface TreeNodeData {
  id: string
  name: string
  parentId?: string // 父节点ID，用于判断节点的父子关系
  children?: TreeNodeData[]
  [key: string]: string | number | boolean | TreeNodeData[] | undefined | TreeNodeState // 允许额外属性，但使用更明确的类型
}

// 树节点UI状态
export interface TreeNodeState {
  isExpanded: boolean
  isSelected: boolean
  isVisible: boolean
  isDragging: boolean
  isDropTarget: boolean
  isParentSelected?: boolean // 父级节点是否被选中，用于浅色高亮效果
  dropPosition?: DropPosition
  level: number
  index: number
}

// 组合树节点数据和状态
export interface TreeNodeType extends TreeNodeData {
  state: TreeNodeState
}

// 主树列表组件的属性
export interface TreeListProps {
  containerWidth?: number

  // 数据
  data: TreeNodeData[]
  selectedNodeIds: Set<string>
  className?: string
  style?: React.CSSProperties

  // 功能标志
  virtualScroll?: boolean
  nodeHeight?: number
  selectionMode?: "single" | "multiple"
  allowDrag?: boolean
  allowDrop?: boolean
  keyboardNavigation?: boolean

  onMouseDown?: () => void

  // 自定义渲染
  renderNode?: (node: TreeNodeType) => ReactNode
  renderIcon?: (node: TreeNodeType) => ReactNode
  renderActions?: (node: TreeNodeType) => ReactNode

  // 事件处理
  onNodeSelect?: (nodes: TreeNodeType[], event?: React.MouseEvent | React.KeyboardEvent) => void
  onNodeExpand?: (node: TreeNodeType, expanded: boolean) => void
  onNodeDrop?: (
    sourceNodes: TreeNodeType[],
    targetNode: TreeNodeType,
    position: DropPosition,
  ) => void
  onNodeContextMenu?: (node: TreeNodeType, event: React.MouseEvent) => void
  onNodeRename?: (node: TreeNodeType, newName: string) => void
  onNodeCreate?: (
    parentNode: TreeNodeType | null,
    nodeType: "folder" | "component" | "layer",
  ) => void
}

// 单个树节点组件的属性
export interface TreeNodeProps {
  size?: number
  start?: number
  containerWidth?: number
  node: TreeNodeType
  style?: React.CSSProperties
  renderIcon?: (node: TreeNodeType) => ReactNode
  renderActions?: (node: TreeNodeType) => ReactNode
  className?: string
  isLastInParent?: boolean // 表示此节点是否是父文件夹中的最后一个子项
  isFirstSelected?: boolean // 表示此节点是否是连续选择中的第一个
  isLastSelected?: boolean // 表示此节点是否是连续选择中的最后一个
  isMiddleSelected?: boolean // 表示此节点是否是连续选择中的中间项
  hasHorizontalScroll?: boolean // 表示此节点是否具有水平滚动条
  isMultiSelectionActive?: boolean // 表示是否处于多选状态（选中的节点数 > 1）
  isCommandKeyPressed?: boolean // 表示是否按下了Command/Control键
  // 事件处理
  onSelect?: (node: TreeNodeType, event: React.MouseEvent | React.KeyboardEvent) => void
  onExpand?: (node: TreeNodeType) => void
  onDragStart?: (node: TreeNodeType, event: React.DragEvent) => void
  onDragOver?: (node: TreeNodeType, event: React.DragEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
  onDrop?: (node: TreeNodeType, event: React.DragEvent) => void
  onRename?: (node: TreeNodeType, newName: string) => void
  onContextMenu?: (node: TreeNodeType, event: React.MouseEvent) => void
  onMeasure?: (width: number) => void // 用于测量节点宽度
}

// 虚拟列表相关类型
export interface VirtualItem {
  index: number
  size: number
  start: number
  end: number
  node: TreeNodeType
}

// 拖拽相关类型
export interface DragState {
  isDragging: boolean
  dragNodes: TreeNodeType[]
  dropTargetNode: TreeNodeType | null
  dropPosition: DropPosition | null
}

export type DropPosition = "before" | "after" | "inside"

// 键盘导航相关类型
export interface KeyboardNavigationState {
  focusedNodeId: string | null
  lastSelectedNodeId: string | null
}

// 树列表上下文
export interface TreeListContext {
  // 状态
  flattenedNodes: TreeNodeType[]
  selectedNodes: TreeNodeType[]
  expandedNodeIds: Set<string>
  dragState: DragState
  keyboardState: KeyboardNavigationState

  // 方法
  selectNode: (node: TreeNodeType, multiple?: boolean, range?: boolean) => void
  expandNode: (node: TreeNodeType, expanded?: boolean) => void
  startDrag: (nodes: TreeNodeType[], event: React.DragEvent) => void
  handleDrop: (targetNode: TreeNodeType, position: DropPosition) => void
  handleContextMenu: (node: TreeNodeType, event: React.MouseEvent) => void
  startRename: (node: TreeNodeType) => void
  endRename: (node: TreeNodeType, newName: string) => void
  handleKeyDown: (event: React.KeyboardEvent) => void
}
