import { IndexGenerator } from "fractional-indexing-jittered"
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from "react"
import { mergeRefs, tcx } from "~/utils"
import {
  SortableItem,
  SortablePaneContext,
  SortablePaneContextValue,
  SortableRowDataContext,
  useSortablePane,
  useSortableRowItem,
} from "../context"
import { usePanelDragDrop } from "../hooks/use-panel-drag-drop"
import { setupIndexGenerator } from "../utils"

interface PanelSortableProps<T extends SortableItem> {
  children: React.ReactNode
  className?: string
  data: T[]
  indexGenerator?: IndexGenerator
  onDataChange: (data: T[]) => void
  onSelectedIdChange: (id: string | null) => void
  selectedId: string | null
}

export const PanelSortable = forwardRef(function PanelSortable<T extends SortableItem>(
  props: PanelSortableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    data,
    children,
    className,
    selectedId,
    onSelectedIdChange,
    onDataChange,
    indexGenerator,
  } = props

  // 使用外部传入的indexGenerator，如果没有则创建一个新的
  const indexGeneratorRef = useRef<IndexGenerator>(setupIndexGenerator(data, indexGenerator))

  const containerRef = useRef<HTMLDivElement>(null)

  // 处理拖放完成后的数据更新
  const handleDrop = useCallback(
    (dragId: string, dropId: string, position: "top" | "bottom" | null) => {
      try {
        // 获取源和目标索引
        const items = [...data]
        const dragIndex = items.findIndex((item) => item.id === dragId)
        const dropIndex = items.findIndex((item) => item.id === dropId)

        if (dragIndex === -1 || dropIndex === -1) {
          // 无法找到拖拽或放置元素
          return
        }

        // 检测是否拖拽到原位置
        const isDraggingToSamePosition =
          dragId === dropId || // 同一个项目
          (position === "top" && dragIndex === dropIndex - 1) || // 放在前一个项目的底部
          (position === "bottom" && dragIndex === dropIndex + 1) // 放在后一个项目的顶部

        if (isDraggingToSamePosition) {
          return // 位置未变
        }

        // 创建一个新的数组，排除拖拽的项目
        const newItems = items.filter((_, idx) => idx !== dragIndex)
        const draggedItem = items[dragIndex]

        // 更新 IndexGenerator 的当前列表
        indexGeneratorRef.current.updateList(newItems.map((item) => item.indexKey))

        // 根据位置情况确定相邻项目，用于生成新的索引键
        const beforeItemForKey =
          position === "top" ? (dropIndex > 0 ? items[dropIndex - 1] : null) : items[dropIndex]

        const afterItemForKey =
          position === "top"
            ? items[dropIndex]
            : dropIndex < items.length - 1
              ? items[dropIndex + 1]
              : null

        // 生成新的索引键
        let newIndexKey: string
        if (!beforeItemForKey) {
          if (afterItemForKey) {
            newIndexKey = indexGeneratorRef.current.keyBefore(afterItemForKey.indexKey)
          } else {
            newIndexKey = indexGeneratorRef.current.keyStart()
          }
        } else if (!afterItemForKey) {
          newIndexKey = indexGeneratorRef.current.keyEnd()
        } else {
          newIndexKey = indexGeneratorRef.current.keyAfter(beforeItemForKey.indexKey)
        }

        // 使用新索引键更新拖拽项
        const updatedDraggedItem = {
          ...draggedItem,
          indexKey: newIndexKey,
        }

        // 计算正确的插入位置并重建数组
        const adjustedDropIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex
        const insertIndex = position === "top" ? adjustedDropIndex : adjustedDropIndex + 1
        newItems.splice(insertIndex, 0, updatedDraggedItem)

        onDataChange(newItems as T[])
      } catch (error) {
        console.error(error, "PanelSortable onDrop error")
      }
    },
    [data, onDataChange],
  )

  // 使用抽取的回调函数
  const {
    containerRef: dragContainerRef,
    isDragging,
    isItemBeingDragged,
    isDropTarget,
    getDropPosition,
    handleDragStart,
  } = usePanelDragDrop({
    onDrop: handleDrop,
  })

  const paneRef = useRef<HTMLDivElement>(null)

  // 处理鼠标按下事件，开始拖拽
  const handleMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()

      // 选中被拖拽的项目
      if (selectedId !== id) {
        onSelectedIdChange(id)
      }

      // 找到对应元素
      const element = document.querySelector(`[data-row-id="${id}"]`) as HTMLElement
      if (!element) return

      // 使用自定义拖拽钩子处理拖拽开始
      handleDragStart({ id, element }, e)
    },
    [handleDragStart, selectedId, onSelectedIdChange],
  )

  // 处理键盘和文档点击事件
  useEffect(() => {
    // 文档点击事件：当点击面板外部时，取消选择
    const handleDocumentClick = (e: MouseEvent) => {
      if (isDragging) return

      const clickTarget = e.target as HTMLElement
      const sortableContainer = containerRef.current

      if (sortableContainer && !sortableContainer.contains(clickTarget)) {
        onSelectedIdChange(null)
      }
    }

    // 键盘事件：按Delete或Backspace删除选中项
    const handleKeyDown = (e: KeyboardEvent) => {
      const id = selectedId
      if ((e.key === "Delete" || e.key === "Backspace") && id) {
        const items = data
        const index = items.findIndex((item) => item.id === id)
        if (index !== -1) {
          const newItems = items.filter((_, i) => i !== index) as T[]

          // 更新索引生成器
          indexGeneratorRef.current.updateList(newItems.map((item) => item.indexKey))

          onDataChange(newItems)
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
  }, [data, onDataChange, onSelectedIdChange, selectedId, isDragging, containerRef])

  const contextValue: SortablePaneContextValue = useMemo(
    () => ({
      selectedId,
      onSelectedIdChange,
      handleMouseDown,
      isDragging,
      isNodeBeingDragged: isItemBeingDragged,
      isDropTarget,
      getDropPosition,
    }),
    [
      selectedId,
      onSelectedIdChange,
      handleMouseDown,
      isDragging,
      isItemBeingDragged,
      isDropTarget,
      getDropPosition,
    ],
  )

  return (
    <div
      ref={mergeRefs(ref, paneRef, dragContainerRef, containerRef)}
      className={tcx("relative flex flex-col", className)}
    >
      <SortablePaneContext.Provider value={contextValue}>
        {data.map((item) => (
          <SortableRowDataContext.Provider
            key={item.id}
            value={{ item }}
          >
            <RowContainer>
              {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                  return child
                }
                return null
              })}
            </RowContainer>
          </SortableRowDataContext.Provider>
        ))}
      </SortablePaneContext.Provider>
    </div>
  )
})

PanelSortable.displayName = "PanelSortable"

interface RowContainerProps {
  children: React.ReactNode
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const { children } = props
  const item = useSortableRowItem()
  const { selectedId } = useSortablePane()

  return (
    <div
      className="panel-sortable-row group/sortable-row relative"
      data-row-id={item.id}
      data-row-index={item.indexKey}
      data-drop-target="false"
      data-drop-position=""
      data-selected={selectedId === item.id}
    >
      {children}
    </div>
  )
})
