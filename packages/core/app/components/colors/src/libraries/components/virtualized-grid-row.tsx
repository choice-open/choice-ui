import { tcx } from "@choice-ui/shared"
import { memo } from "react"
import type { LibrariesDisplayType, LibrariesType, RGB, Style, Variable } from "../../types"
import { LibraryItem } from "../library-item/library-item"
import { colorLibrariesPaneTv } from "../tv"

type VirtualizedItem =
  | { headerType: "category" | "subcategory"; isFirst?: boolean; title: string; type: "header" }
  | { index: number; item: Variable | Style; itemType: "VARIABLE" | "STYLE"; type: "item" }

interface VirtualizedGridRowProps {
  columns?: number
  displayType: LibrariesDisplayType
  duplicateIndex?: number | null
  offset?: number
  onLibraryChange?: (value: { item: Variable | Style; type: LibrariesType }) => void
  onSwatchChange?: (value: { alpha: number; color: RGB }) => void
  padding?: string
  row: VirtualizedItem[]
  selectedItem?: { item: Variable | Style; type: LibrariesType } | null
  size: number
  start: number
}

export const VirtualizedGridRow = memo(function VirtualizedGridRow({
  row,
  size,
  start,
  duplicateIndex,
  onSwatchChange,
  onLibraryChange,
  displayType,
  columns = 6,
  padding = "px-3",
  offset = 0,
  selectedItem,
}: VirtualizedGridRowProps) {
  const styles = colorLibrariesPaneTv({
    displayType: displayType,
  })

  return (
    <div
      style={{
        height: `${size}px`,
        transform: `translateY(${start + offset}px)`,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
      className={tcx(styles.container(), padding)}
    >
      {row.map((item: VirtualizedItem) => {
        if (item.type !== "item") return null
        return (
          <LibraryItem
            key={item.item.id || `color-${item.itemType}-${item.index}`}
            item={item.item}
            libraryType={item.itemType}
            isSelected={
              selectedItem?.type === item.itemType && selectedItem?.item.id === item.item.id
            }
            isDuplicate={duplicateIndex === item.index}
            onSwatchChange={onSwatchChange}
            onLibraryChange={onLibraryChange}
            displayType={displayType}
          />
        )
      })}
    </div>
  )
})

VirtualizedGridRow.displayName = "VirtualizedGridRow"
