import { forwardRef, useRef } from "react"
import { mergeRefs, tcx } from "~/utils"
import { PanelRow, PanelRowProps } from "./panel-row"
import { useSortablePane } from "./panel-sortable"
import { GripVerticalSmall } from "@choiceform/icons-react"

interface PanelSortableRowProps extends PanelRowProps {
  id: string
  index: number
  children: React.ReactNode
}

export const PanelSortableRow = forwardRef<HTMLFieldSetElement, PanelSortableRowProps>(
  function PanelSortableRow(props, ref) {
    const { id, children, ...rest } = props

    const { selectedId, dragState, handleDragStart } = useSortablePane()
    const rowRef = useRef<HTMLFieldSetElement>(null)

    // 获取上下文中的拖拽状态
    const isDragging = dragState.isDragging
    const isBeingDragged = dragState.dragNodeId === id

    // Setup drag handlers
    const handleOnDragStart = (e: React.DragEvent) => {
      e.stopPropagation()

      // Set basic drag properties
      e.dataTransfer.effectAllowed = "move"

      // Use custom drag image if available
      if (rowRef.current) {
        e.dataTransfer.setDragImage(rowRef.current, 10, 10)
      }

      // Call the parent component's drag start handler
      handleDragStart(id, e)
    }

    return (
      <PanelRow
        ref={mergeRefs(ref, rowRef)}
        className={tcx(
          "panel-sortable-row",
          selectedId === id && "bg-selected-background",
          isDragging && "pointer-events-none",
        )}
        {...rest}
      >
        <div
          draggable={true}
          onDragStart={handleOnDragStart}
          className={tcx(
            "absolute inset-y-0 left-0 w-6 cursor-grab",
            "text-secondary-foreground flex items-center justify-center",
            "transition-opacity duration-150",
            "pointer-events-auto",
            isBeingDragged ? "cursor-grabbing opacity-100" : "opacity-0 hover:opacity-100",
          )}
        >
          <GripVerticalSmall />
        </div>

        {children}
      </PanelRow>
    )
  },
)

PanelSortableRow.displayName = "PanelSortableRow"
