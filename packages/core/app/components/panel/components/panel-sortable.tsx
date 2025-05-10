import { mergeRefs, tcx } from "~/utils"
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
// 直接导入tree-list的use-drag-drop钩子
import { useDragDrop } from "~/components/tree-list/hooks/use-drag-drop"
import { DropPosition, TreeNodeType } from "~/components/tree-list/types"

// Base interface for sortable items
interface SortableItem {
  id: string
  index: number
}

// 拖拽状态类型
interface DragState {
  isDragging: boolean
  dragNodeId: string | null
  dropTargetId: string | null
  dropPosition: "top" | "bottom" | null
}

interface SortablePaneContext {
  selectedId: string | null
  onSelectedIdChange: (id: string | null) => void
  dragState: DragState
  handleDragStart: (id: string, e: React.DragEvent) => void
}

const SortablePaneContext = createContext<SortablePaneContext | null>(null)

export const useSortablePane = () => {
  const context = useContext(SortablePaneContext)
  if (!context) {
    throw new Error("useSortablePane must be used within PanelSortable")
  }
  return context
}

interface PanelSortableProps<T extends SortableItem> {
  className?: string
  data: T[]
  onDataChange: (data: T[]) => void
  selectedId: string | null
  onSelectedIdChange: (id: string | null) => void
  children: (id: string, index: number) => React.ReactNode
}

// 将SortableItem适配为TreeNodeType
const adaptItemToTreeNode = (item: SortableItem, isSelected: boolean): TreeNodeType => {
  return {
    id: item.id,
    name: `Item ${item.index}`,
    state: {
      level: 0,
      index: item.index,
      isExpanded: false,
      isSelected,
      isVisible: true,
      isDragging: false,
      isDropTarget: false,
    },
    children: [],
  } as TreeNodeType
}

export const PanelSortable = forwardRef(function PanelSortable<T extends SortableItem>(
  props: PanelSortableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { data, children, className, selectedId, onSelectedIdChange, onDataChange } = props

  // 将数据适配为TreeNodeType供useDragDrop使用
  const treeNodes = useMemo(() => {
    console.log("Creating tree nodes from data:", data)
    return data.map((item) => adaptItemToTreeNode(item, item.id === selectedId))
  }, [data, selectedId])

  // 自定义拖拽状态，用于React上下文
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragNodeId: null,
    dropTargetId: null,
    dropPosition: null,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // 使用tree-list的useDragDrop钩子
  const {
    dragState: treeDragState,
    listRef,
    startDrag,
    handleDragOver: treeDragOver,
    handleDrop: treeDrop,
    handleDragEnd,
  } = useDragDrop({
    allowDrag: true,
    allowDrop: true,
    nodeHeight: 40, // 面板行的标准高度
    onNodeDrop: (dragNodes, targetNode, position) => {
      if (!dragNodes.length) {
        console.warn("No drag nodes provided")
        return
      }

      // 获取源和目标ID
      const dragId = dragNodes[0].id
      const dropId = targetNode.id

      // 映射tree-list的位置到panel-sortable的位置
      const dropPosition = position === "before" ? "top" : "bottom"

      const items = [...data]
      const dragIndex = items.findIndex((item) => item.id === dragId)
      const dropIndex = items.findIndex((item) => item.id === dropId)

      if (dragIndex === -1 || dropIndex === -1) {
        console.warn("Cannot find drag or drop elements:", { dragId, dropId, dragIndex, dropIndex })
        return
      }

      // 计算新位置
      let newIndex = dropPosition === "bottom" ? dropIndex + 1 : dropIndex
      if (dragIndex < newIndex) {
        newIndex--
      }

      // 只有位置真的改变时才更新
      if (dragIndex !== newIndex) {
        const newItems = [...items]
        const [movedItem] = newItems.splice(dragIndex, 1)
        newItems.splice(newIndex, 0, movedItem)

        // 更新索引
        const updatedItems = newItems.map((item, idx) => ({
          ...item,
          index: idx,
        })) as T[]

        onDataChange(updatedItems)
      }
    },
  })

  // 从tree-list状态映射到我们自己的dragState
  useEffect(() => {
    if (!treeDragState) return

    // 映射tree-list的dragState到panel的dragState
    setDragState({
      isDragging: treeDragState.isDragging,
      dragNodeId: treeDragState.dragNodes[0]?.id || null,
      dropTargetId: treeDragState.dropTargetNode?.id || null,
      dropPosition:
        treeDragState.dropPosition === "before"
          ? "top"
          : treeDragState.dropPosition === "after"
            ? "bottom"
            : null,
    })
  }, [treeDragState])

  const paneRef = useRef<HTMLDivElement>(null)

  // 处理拖拽开始
  const handleItemDragStart = useCallback(
    (id: string, e: React.DragEvent) => {
      e.stopPropagation()

      // 找到对应的树节点
      const node = treeNodes.find((node) => node.id === id)
      if (!node) {
        console.warn("Cannot find node for drag start:", id)
        return
      }

      // 选中被拖拽的项目
      if (selectedId !== id) {
        onSelectedIdChange(id)
      }

      // 调用tree-list的startDrag函数
      startDrag([node], e)
    },
    [treeNodes, startDrag, selectedId, onSelectedIdChange],
  )

  // 处理拖拽悬停
  const handleItemDragOver = useCallback(
    (id: string, e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // 找到对应的树节点
      const node = treeNodes.find((node) => node.id === id)
      if (!node) {
        console.warn("Cannot find node for drag over:", id)
        return
      }

      // 调用tree-list的handleDragOver函数
      treeDragOver(node, e)
    },
    [treeNodes, treeDragOver],
  )

  // 处理放置
  const handleItemDrop = useCallback(
    (id: string, e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // 找到对应的树节点
      const node = treeNodes.find((node) => node.id === id)
      if (!node) {
        console.warn("Cannot find node for drop:", id)
        return
      }

      // 确保有正确的放置位置
      if (treeDragState.dropPosition) {
        // 调用tree-list的handleDrop函数，将放置位置转换为tree-list的格式
        treeDrop(node, treeDragState.dropPosition as DropPosition)
      } else {
        console.warn("No drop position found during drop")
      }
    },
    [treeNodes, treeDrop, treeDragState],
  )

  // 键盘和点击事件处理
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickOnItem = target.closest(".panel-sortable-row")
      if (!isClickOnItem) {
        onSelectedIdChange(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const id = selectedId
      if ((e.key === "Delete" || e.key === "Backspace") && id) {
        const items = data
        const index = items.findIndex((item) => item.id === id)
        if (index !== -1) {
          const newItems = items.filter((_, i) => i !== index) as T[]
          const updatedItems = newItems.map((item, idx) => ({
            ...item,
            index: idx,
          })) as T[]
          onDataChange(updatedItems)
          onSelectedIdChange(null)
        }
      }
    }

    document.addEventListener("click", handleDocumentClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [data, onDataChange, onSelectedIdChange, selectedId])

  const contextValue = useMemo(
    () => ({
      selectedId,
      onSelectedIdChange,
      dragState,
      handleDragStart: handleItemDragStart,
    }),
    [selectedId, onSelectedIdChange, dragState, handleItemDragStart],
  )

  return (
    <div
      ref={mergeRefs(ref, paneRef, listRef, containerRef)}
      className={tcx("relative flex flex-col", className)}
      onDragEnd={(e) => {
        e.preventDefault()
        console.log("Container drag end")
        handleDragEnd()
      }}
    >
      <SortablePaneContext.Provider value={contextValue}>
        {data.map((item) => {
          const id = item.id
          const isDropTarget = dragState.dropTargetId === id
          const dropPosition = isDropTarget ? dragState.dropPosition : null
          const isSelected = selectedId === id
          const isDragging = dragState.dragNodeId === id && dragState.isDragging

          return (
            <RowContainer
              key={id}
              id={id}
              index={item.index}
              isDropTarget={isDropTarget}
              dropPosition={dropPosition}
              isSelected={isSelected}
              isDragging={isDragging}
              onDragStart={(e) => handleItemDragStart(id, e)}
              onDragOver={(e) => handleItemDragOver(id, e)}
              onDrop={(e) => handleItemDrop(id, e)}
              onDragEnd={handleDragEnd}
            >
              {children(id, item.index)}
            </RowContainer>
          )
        })}
      </SortablePaneContext.Provider>
    </div>
  )
})

PanelSortable.displayName = "PanelSortable"

interface RowContainerProps {
  id: string
  index: number
  isDropTarget: boolean
  dropPosition: "top" | "bottom" | null
  isSelected?: boolean
  isDragging?: boolean
  children: React.ReactNode
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const {
    id,
    index,
    isDropTarget,
    dropPosition,
    isSelected,
    isDragging,
    children,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
  } = props

  return (
    <div
      className={tcx("panel-sortable-row group/sortable-row relative", isDropTarget && "z-10")}
      data-row-id={id}
      data-row-index={index}
      draggable={false}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      data-selected={isSelected}
    >
      {/* 顶部放置指示器 */}
      {isDropTarget && dropPosition === "top" && (
        <div className="pointer-events-none absolute -top-px right-0 left-0 z-20">
          <div className="bg-default-foreground h-0.5 w-full rounded-full" />
        </div>
      )}

      {children}

      {/* 底部放置指示器 */}
      {isDropTarget && dropPosition === "bottom" && (
        <div className="pointer-events-none absolute right-0 -bottom-px left-0 z-20">
          <div className="bg-default-foreground h-0.5 w-full rounded-full" />
        </div>
      )}
    </div>
  )
})
