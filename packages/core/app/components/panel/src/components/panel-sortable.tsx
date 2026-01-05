import { mergeRefs, tcx } from "@choice-ui/shared"
import React, { forwardRef, memo, useEffect, useMemo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import {
  SortableItem,
  SortablePaneContext,
  SortablePaneContextValue,
  SortableRowDataContext,
  useSortablePane,
  useSortableRowItem,
} from "../context"
import { usePanelDragDrop } from "../hooks"
import { panelSortableContainerTv } from "../tv"

interface PanelSortableProps<T extends SortableItem> {
  className?: string
  children: React.ReactNode
  data: T[]
  onDrop: (position: "top" | "bottom" | null, id: string, newIndex: number) => void
  onSelectedIdChange: (id: string | null) => void
  selectedId: string | null
}

export const PanelSortable = forwardRef(function PanelSortable<T extends SortableItem>(
  props: PanelSortableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { data, className, children, selectedId, onSelectedIdChange, onDrop } = props

  const containerRef = useRef<HTMLDivElement>(null)

  // 处理拖放完成后的数据更新
  const handleDrop = useEventCallback(
    (dragId: string, dropId: string, position: "top" | "bottom" | null) => {
      // 获取源和目标索引
      const items = [...data]
      const dragIndex = items.findIndex((item) => item.id === dragId)
      const dropIndex = items.findIndex((item) => item.id === dropId)

      if (dragIndex === -1 || dropIndex === -1) {
        // 无法找到拖拽或放置元素
        return
      }

      // 检测是否拖拽到原位置
      // dragIndex === dropIndex - 1 表示拖拽项在目标项的正上方
      // dragIndex === dropIndex + 1 表示拖拽项在目标项的正下方
      const isDraggingToSamePosition =
        dragId === dropId || // 同一个项目
        (position === "top" && dragIndex === dropIndex - 1) || // 拖拽项在目标项上方，放到目标项顶部 = 位置不变
        (position === "bottom" && dragIndex === dropIndex + 1) // 拖拽项在目标项下方，放到目标项底部 = 位置不变

      if (isDraggingToSamePosition) {
        // 位置未变
        return
      }

      onDrop(position, dragId, dropIndex)
    },
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
  const handleMouseDown = useEventCallback((id: string, e: React.MouseEvent) => {
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
  })

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

    document.addEventListener("click", handleDocumentClick)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [isDragging, onSelectedIdChange, containerRef])

  const tv = useMemo(() => panelSortableContainerTv(), [])

  const contextValue: SortablePaneContextValue = useMemo(
    () => ({
      selectedId,
      onSelectedIdChange,
      handleMouseDown,
      isDragging,
      isNodeBeingDragged: isItemBeingDragged,
      isDropTarget,
      getDropPosition,
      itemCount: data.length,
    }),
    [
      selectedId,
      onSelectedIdChange,
      handleMouseDown,
      isDragging,
      isItemBeingDragged,
      isDropTarget,
      getDropPosition,
      data.length,
    ],
  )

  return (
    <div
      ref={mergeRefs(ref, paneRef, dragContainerRef, containerRef)}
      className={tcx(tv.container(), className)}
    >
      <SortablePaneContext.Provider value={contextValue}>
        {data.map((item) => (
          <SortableRowDataContext.Provider
            key={item.id}
            value={{ item }}
          >
            <RowContainer>
              {React.Children.map(children, (child) => {
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

const tv = panelSortableContainerTv()

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const { children } = props
  const item = useSortableRowItem()
  const { selectedId } = useSortablePane()

  return (
    <div
      className={tv.rowContainer()}
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
