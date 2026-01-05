import { tcx } from "@choice-ui/shared"
import { GripVerticalSmall } from "@choiceform/icons-react"
import { forwardRef, memo, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { SortableItem, useSortablePane, useSortableRowItem } from "../context"
import { panelSortableRowTv } from "../tv"
import { PanelRow, PanelRowProps } from "./panel-row"

interface PanelSortableRowProps extends Omit<PanelRowProps, "id"> {
  children: React.ReactNode
}

export const PanelSortableRow = memo(
  forwardRef<HTMLFieldSetElement, PanelSortableRowProps>(function PanelSortableRow(props, ref) {
    const { children, className, ...rest } = props

    const item = useSortableRowItem<SortableItem>()
    const { id } = item

    const { selectedId, isDragging, isNodeBeingDragged, handleMouseDown, itemCount } =
      useSortablePane()

    const isBeingDragged = isNodeBeingDragged(id)
    const isSingleItem = itemCount <= 1

    const handleOnMouseDown = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      // 如果只有一个item，不启动拖拽
      if (isSingleItem) return
      handleMouseDown(id, e)
    })

    const tv = useMemo(
      () =>
        panelSortableRowTv({
          selected: selectedId === id,
          dragging: isDragging,
          beingDragged: isBeingDragged,
          singleItem: isSingleItem,
        }),
      [selectedId, id, isDragging, isBeingDragged, isSingleItem],
    )

    return (
      <PanelRow
        ref={ref}
        className={tcx(tv.root(), className)}
        onMouseDown={handleOnMouseDown}
        {...rest}
      >
        <div
          className={tv.handle()}
          aria-label="Drag handle"
        >
          <GripVerticalSmall />
        </div>

        {children}
      </PanelRow>
    )
  }),
)

PanelSortableRow.displayName = "PanelSortableRow"
