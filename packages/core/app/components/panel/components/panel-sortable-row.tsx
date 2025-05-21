import { GripVerticalSmall } from "@choiceform/icons-react"
import { forwardRef, memo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { mergeRefs, tcx } from "~/utils"
import { panelSortableRowTv } from "../tv"
import { PanelRow, PanelRowProps } from "./panel-row"
import { useSortablePane, useSortableRowItem, SortableItem } from "../context"

interface PanelSortableRowProps extends Omit<PanelRowProps, "id"> {
  children: React.ReactNode
}

export const PanelSortableRow = memo(
  forwardRef<HTMLFieldSetElement, PanelSortableRowProps>(function PanelSortableRow(props, ref) {
    const { children, className, ...rest } = props

    const item = useSortableRowItem<SortableItem>()
    const { id } = item

    const { selectedId, isDragging, isNodeBeingDragged, handleMouseDown } = useSortablePane()
    const rowRef = useRef<HTMLFieldSetElement>(null)

    const isBeingDragged = isNodeBeingDragged(id)

    const handleOnMouseDown = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      handleMouseDown(id, e)
    })

    const styles = panelSortableRowTv({
      selected: selectedId === id,
      dragging: isDragging,
      beingDragged: isBeingDragged,
    })

    return (
      <PanelRow
        ref={mergeRefs(ref, rowRef)}
        className={tcx(styles.root(), className)}
        {...rest}
      >
        <div
          className={styles.handle()}
          onMouseDown={handleOnMouseDown}
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
